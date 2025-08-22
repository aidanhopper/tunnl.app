#!/usr/bin/env sh

TRAEFIK_DYNAMIC_FILE='tcp:
  routers:
    controller-router:
      entryPoints:
        - websecure
      rule: "HostSNI(`ctrl.ROOT_DOMAIN`)"
      service: controller-service
      tls:
        passthrough: true
    edge-router:
      entryPoints:
        - websecure
      rule: "HostSNI(`er1.ROOT_DOMAIN`)"
      service: edge-service
      tls:
        passthrough: true
  services:
    controller-service:
      loadBalancer:
        servers:
          - address: ctrl.ROOT_DOMAIN:443
    edge-service:
      loadBalancer:
        servers:
          - address: er1.ROOT_DOMAIN:443'

TRAEFIK_STATIC_FILE='entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https

  websecure:
    address: ":443"

providers:
  file:
    filename: "/etc/traefik/dynamic.yml"
    watch: true

log:
  level: DEBUG'

COMPOSE_FILE='networks:
  ziti:
    driver: bridge

services:
  traefik:
    image: traefik:latest
    container_name: traefik
    ports:
      - 443:443
      - 80:80
    volumes:
      - ./configs/traefik.yml:/etc/traefik/traefik.yml:ro
      - ./configs/dynamic.yml:/etc/traefik/dynamic.yml:ro
      - ./data/letsencrypt:/letsencrypt
    restart: unless-stopped
    networks:
      ziti:
    env_file:
      - .env

  chown-controller:
    image: busybox
    command: chown -R ${ZIGGY_UID:-2171} /ziti-controller
    volumes:
      - ./data/ziti-controller:/ziti-controller

  ziti-controller:
    image: openziti/ziti-controller:latest
    depends_on:
      chown-controller:
        condition: service_completed_successfully
    user: ${ZIGGY_UID:-2171}
    volumes:
      - ./data/ziti-controller:/ziti-controller
    networks:
      ziti:
        aliases:
          - ctrl.ROOT_DOMAIN
    environment:
      ZITI_CTRL_ADVERTISED_ADDRESS: ctrl.ROOT_DOMAIN
      ZITI_CTRL_ADVERTISED_PORT: 443
      ZITI_PWD: ${ZITI_ADMIN_PASSWORD}

      ZITI_BOOTSTRAP: true
      ZITI_BOOTSTRAP_PKI: true
      ZITI_BOOTSTRAP_CONFIG: true
      ZITI_BOOTSTRAP_DATABASE: true
      ZITI_AUTO_RENEW_CERTS: true
      ZITI_BOOTSTRAP_CONFIG_ARGS:

    command: run config.yml
    expose:
      - 443
    restart: unless-stopped
    healthcheck:
      test:
        - CMD
        - ziti
        - agent
        - stats
      interval: 3s
      timeout: 3s
      retries: 5
      start_period: 15s

  chown-router:
    image: busybox
    command: chown -R ${ZIGGY_UID:-2171} /ziti-router
    volumes:
      - ./data/ziti-router:/ziti-router

  ziti-router:
    image: openziti/ziti-router:latest
    depends_on:
      chown-router:
        condition: service_completed_successfully
    user: ${ZIGGY_UID:-2171}
    volumes:
      - ./data/ziti-router:/ziti-router
    environment:
      ZITI_CTRL_ADVERTISED_ADDRESS: ctrl.ROOT_DOMAIN
      ZITI_CTRL_ADVERTISED_PORT: 443
      ZITI_ENROLL_TOKEN: ${ZITI_ENROLL_TOKEN:-}
      ZITI_ROUTER_ADVERTISED_ADDRESS: er1.ROOT_DOMAIN
      ZITI_ROUTER_PORT: 443
      ZITI_ROUTER_MODE: host

      ZITI_BOOTSTRAP: true
      ZITI_BOOTSTRAP_CONFIG: true
      ZITI_BOOTSTRAP_ENROLLMENT: true
      ZITI_AUTO_RENEW_CERTS: true
      ZITI_ROUTER_TYPE: edge
      ZITI_BOOTSTRAP_CONFIG_ARGS:

    command: run config.yml
    expose:
      - 443
    restart: unless-stopped
    networks:
      ziti:
        aliases:
          - er1.ROOT_DOMAIN
    healthcheck:
      test:
        - CMD
        - ziti
        - agent
        - stats
      interval: 3s
      timeout: 3s
      retries: 5
      start_period: 15s'

generate_secret () {
    openssl rand -hex 32
}

docker_check () {
    if ! docker -v >/dev/null 2>&1; then
        echo "[ERROR] Failed to run 'docker -v'. Is Docker installed?"
        exit 1
    else
        echo "[INFO] Docker is installed."
    fi

    if ! docker image inspect hello-world:latest >/dev/null 2>&1; then
        echo "Pulling hello-world:latest image..."
        docker pull hello-world:latest >/dev/null 2>&1 || {
            echo "[ERROR] Failed to pull hello-world image." >&2
            exit 1
        }
    fi

    # Then run the container
    if docker run --rm hello-world:latest >/dev/null 2>&1; then
        echo "[INFO] Docker is working without root."
    else
        echo "[ERROR] Cannot run Docker containers without sudo or proper group permissions." >&2
        exit 1
    fi
}

jq_check() {
    if ! command -v jq >/dev/null 2>&1; then
        echo "[Error] 'jq' is not installed. Please install it before continuing."
        exit 1
    fi
}

dig_check() {
    if ! command -v dig >/dev/null 2>&1; then
        echo "[Error] 'dig' is not installed. Please install it before continuing."
        exit 1
    fi
}

openssl_check() {
    if ! command -v openssl >/dev/null 2>&1; then
        echo "[Error] 'openssl' is not installed. Please install it before continuing."
        exit 1
    fi
}

make_absolute_path() {
    local path="$1"

    if [ "${path%/*}" = "$path" ]; then
        # It's relative → prepend current working directory
        path="$(pwd)/$path"
    fi
    echo "$path"
}

ask_for_target_dir () {
    if [ -z "$TARGET_DIRECTORY" ]; then
        printf "Enter the target directory for the OpenZiti Docker quickstart (default ziti-quickstart): "
        read -r dir < /dev/tty
        if [ -z "$dir" ]; then dir="ziti-quickstart" ; fi
        TARGET_DIRECTORY=$dir
        TARGET_DIRECTORY=$(make_absolute_path "$TARGET_DIRECTORY")
    fi
    echo "[INFO] Using directory: $TARGET_DIRECTORY"
}

check_if_target_dir_exists () {
    if [ -d "$TARGET_DIRECTORY" ]; then
        echo "[ERROR] Please remove $TARGET_DIRECTORY and try again."
        exit 1
    fi
}

ask_for_root_domain () {
    if [ -z "$ROOT_DOMAIN" ]; then 
        printf "Enter the root domain (ex: tunnl.app): "
        read -r domain < /dev/tty
        if [ -z "$domain" ]; then
            echo "[ERROR] Must specify root domain."
            exit 1
        fi
        ROOT_DOMAIN=$domain
    fi
    echo "[INFO] Using root domain: $ROOT_DOMAIN"
}

domain_check () {
    ip6=$(curl -6s ifconfig.io)
    ip4=$(curl -4s ifconfig.io)

    ctrl_answer=$(dig +noall +answer "er1.$ROOT_DOMAIN" | tail -n 1 | awk '{print$5}')
    er1_answer=$(dig +noall +answer "er1.$ROOT_DOMAIN" | tail -n 1 | awk '{print$5}')

    good="true"

    if [ "$ctrl_answer" = "$ip6" ]; then
        echo "[INFO] ctrl.$ROOT_DOMAIN configured correctly."
    elif [ "$ctrl_answer" = "$ip4" ]; then
        echo "[INFO] ctrl.$ROOT_DOMAIN configured correctly."
    else
        echo "[ERROR] ctrl.$ROOT_DOMAIN is not configured correctly. Please point this domain at $ip6 or $ip4."
        good="false"
    fi

    if [ "$er1_answer" = "$ip6" ]; then
        echo "[INFO] er1.$ROOT_DOMAIN configured correctly."
    elif [ "$er1_answer" = "$ip4" ]; then
        echo "[INFO] er1.$ROOT_DOMAIN configured correctly."
    else
        echo "[ERROR] er1.$ROOT_DOMAIN is not configured correctly. Please point this domain at $ip6 or $ip4."
        good="false"
    fi

    if [ "$good" = "false" ]; then exit 1 ; fi
}

make_target_directory () {
    if [ -z "$TARGET_DIRECTORY" ]; then
        echo "[ERROR] Must specify target directory."
        exit 1
    fi

    mkdir -p "$TARGET_DIRECTORY"
    STARTING_DIRECTORY=$(pwd)
    cd "$TARGET_DIRECTORY" || exit 1
}

create_files_and_directories () {
    if [ -z "$TARGET_DIRECTORY" ]; then
        echo "[ERROR] Must specify target directory."
        exit 1
    fi

    if [ -z "$ROOT_DOMAIN" ]; then
        echo "[ERROR] Must specify root domain."
        exit 1
    fi

    echo "$COMPOSE_FILE" | sed "s/ROOT_DOMAIN/$ROOT_DOMAIN/g" > compose.yml

    mkdir configs 2>/dev/null

    echo "$TRAEFIK_DYNAMIC_FILE" | sed "s/ROOT_DOMAIN/$ROOT_DOMAIN/g" > configs/dynamic.yml
    echo "$TRAEFIK_STATIC_FILE" > configs/traefik.yml

    mkdir data 2>/dev/null
}

install_ziti_cli () {
    echo "[INFO] Installing OpenZiti CLI."
    if command -v ziti >/dev/null 2>&1; then
      return 0
    fi

    curl -sS https://get.openziti.io/install.bash | sudo bash -s openziti
}

ziti_login () {
    if [ -z "$ROOT_DOMAIN" ]; then 
        echo "[ERROR] Root domain is not specified."
        return 1
    fi
    ziti edge login "ctrl.$ROOT_DOMAIN:443" -u "admin" -p "${ZITI_ADMIN_PASSWORD}" -y 2>&1
}

install_ziti () {
    echo "[INFO] Installing OpenZiti."

    ziti_pwd=$(generate_secret)

    export ZITI_ADMIN_PASSWORD=${ziti_pwd}

    cat <<EOF > .env
ZITI_ADMIN_PASSWORD=$ZITI_ADMIN_PASSWORD
EOF

    docker compose up -d
    echo "[INFO] Waiting 20s for ziti controller to start..."
    sleep 20 # TODO Make this wait until controller is online

    ziti_login

    echo ""
    echo  "[INFO] Creating an edge router policy allowing all identities to connect to routers with a #public attribute."
    ziti edge delete edge-router-policy allEdgeRouters > /dev/null
    ziti edge create edge-router-policy allEdgeRouters --edge-router-roles '#public' --identity-roles '#all' > /dev/null
    if [ $? -ne 0 ]; then
        docker compose down
        echo "[ERROR] Failed to create edge router policy. Something went wrong."
        exit 1
    fi

    echo "[INFO] Creating a service edge router policy allowing all services to use #public edge routers"
    ziti edge delete service-edge-router-policy allSvcAllRouters > /dev/null
    ziti edge create service-edge-router-policy allSvcAllRouters --edge-router-roles '#all' --service-roles '#all' > /dev/null
    if [ $? -ne 0 ]; then
        docker compose down
        echo "[ERROR] Failed to create service edge router policy. Something went wrong."
        exit 1
    fi
    echo ""

    ziti edge delete edge-router "er1"
    ziti edge create edge-router "er1" -o "er1.jwt" -t -a "public"
    if [ $? -ne 0 ]; then
        docker compose down
        echo "[ERROR] Failed create edge router. Something went wrong."
        exit 1
    fi
    ROUTER_TOKEN=$(cat ./er1.jwt) 
    rm er1.jwt
    echo "ZITI_ENROLL_TOKEN=$ROUTER_TOKEN" >> .env

    docker compose down && docker compose up -d
}

link() {
  echo "\e]8;;$1\e\\$2\e]8;;\e\\"
}

ziti_install () {
    echo "[INFO] Running ziti_install."

    if ! sudo -v >/dev/null 2>&1; then
        echo "[ERROR] Could not get super user permissions."
        exit 1
    fi 

    echo "[INFO] Got super user permissions." 

    docker_check
    jq_check
    dig_check
    openssl_check
    ask_for_target_dir
    check_if_target_dir_exists
    ask_for_root_domain
    domain_check
    make_target_directory
    create_files_and_directories
    install_ziti_cli
    install_ziti

    cat <<EOF > .env
ZITI_ADMIN_PASSWORD=$ZITI_ADMIN_PASSWORD
EOF

    cd "$STARTING_DIRECTORY" || exit 1

    cat <<EOF

    ✅ Setup complete!

    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    🎉 Your OpenZiti Network is installed and ready to use!

    👉 Open your Ziti Admin Console at:
       $(link "https://ctrl.$ROOT_DOMAIN/zac" "https://ctrl.$ROOT_DOMAIN/zac")
       (Don't worry if this tell you its untrusted, it's using it's own certs).

    🔑 Use credentials:
         Username: admin
         Password: $ZITI_ADMIN_PASSWORD

       (You can also find the password in:
        $TARGET_DIRECTORY/.env )

    🚀 This script installed OpenZiti with Docker and enrolled
        an edge router, so you can now create and access services.

    💡 Pro tip: Check out
       $(link "https://tunnl.app" "https://tunnl.app")
       for a multi-tenant service sharing dashboard powered by OpenZiti.
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF
}

ziti_install
