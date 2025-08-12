generate_secret () {
    openssl rand -hex 24
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

make_absolute_path() {
    local path="$1"
    if [[ "$path" != /* ]]; then
        # It's relative → prepend current working directory
        path="$(pwd)/$path"
    fi
    echo "$path"
}

ask_for_target_dir () {
    if [ -z "$TARGET_DIRECTORY" ]; then
        printf "Enter the target directory for the Tunnl.app quickstart (default tunnl-quickstart): "
        read -r dir < /dev/tty
        if [ -z "$dir" ]; then dir="tunnl-quickstart" ; fi
        TARGET_DIRECTORY=$dir
        TARGET_DIRECTORY=$(make_absolute_path "$TARGET_DIRECTORY")
    fi
    echo "[INFO] Using directory: $TARGET_DIRECTORY"
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

ask_for_admin_email () {
    if [ -z "$ADMIN_EMAIL" ]; then 
        printf "Enter your email (to create admin account): "
        read -r email < /dev/tty
        if [ -z "$email" ]; then
            echo "[ERROR] Must specify email for admin user."
            exit 1
        fi
        ADMIN_EMAIL=$email
    fi
    echo "[INFO] Using admin email: $ADMIN_EMAIL"
}

extract_and_move_to_target_dir () {
    if [ -z "$TARGET_DIRECTORY" ]; then
        echo "[ERROR] Must specify target directory."
        exit 1
    fi
    mkdir -p "$TARGET_DIRECTORY"
    echo "[INFO] Extracting quickstart.tar.xz into $TARGET_DIRECTORY"
    # curl -sL tunnl.app/quickstart.tar.xz -O quickstart.tar.xz
    # tar -xJf quickstart.tar.xz -C "$TARGET_DIRECTORY"
    cp -r tarball/* "$TARGET_DIRECTORY"
    STARTING_DIRECTORY=$(pwd)
    cd "$TARGET_DIRECTORY" || exit 1
}

create_files_and_directories () {
    if [ -z "$TARGET_DIRECTORY" ]; then
        echo "[ERROR] Must specify target directory."
        exit 1
    fi

    if [ -z "$ADMIN_EMAIL" ]; then
        echo "[ERROR] Must specify admin email."
        exit 1
    fi

    if [ -z "$ROOT_DOMAIN" ]; then
        echo "[ERROR] Must specify root domain."
        exit 1
    fi

    if [ ! -f "publisher.log" ]; then touch publisher.log ; fi 
    if [ ! -d "data" ]; then mkdir data ; fi 

    tunnl_postgres_password=$(generate_secret)
    ziti_pwd=$(generate_secret)
    base_dns="ziti.$ROOT_DOMAIN"
    controller_port=443
    router_port=443

    ZITI_CTRL_ADVERTISED_ADDRESS="ctrl.${base_dns}"
    ZITI_CTRL_EDGE_ADVERTISED_ADDRESS="ctrl.${base_dns}"
    ZITI_ROUTER_ADVERTISED_ADDRESS="er1.${base_dns}"
    ZITI_CTRL_ADVERTISED_PORT=${controller_port}
    ZITI_CTRL_EDGE_ADVERTISED_PORT="${controller_port}"
    ZITI_ROUTER_PORT=${router_port}
    ZITI_ROUTER_LISTENER_BIND_PORT=${router_port}
    ZITI_PWD=${ziti_pwd}


    tunnl_env=$(cat <<EOF > .env
# ZITI CONTROLLER & ROUTER VARS
ZITI_CTRL_ADVERTISED_ADDRESS="ctrl.${base_dns}"
ZITI_CTRL_EDGE_ADVERTISED_ADDRESS="ctrl.${base_dns}"
ZITI_ROUTER_ADVERTISED_ADDRESS="er1.${base_dns}"
ZITI_CTRL_ADVERTISED_PORT=${controller_port}
ZITI_CTRL_EDGE_ADVERTISED_PORT="${controller_port}"
ZITI_ROUTER_PORT=${router_port}
ZITI_ROUTER_LISTENER_BIND_PORT=${router_port}
ZITI_PWD=${ziti_pwd}

# TUNNL.APP VARS
NODE_ENV=production
PUBLISHER_PORT=3444
PUBLISHER_JWT_SECRET=$(generate_secret)
DATABASE_URL=postgres://app:$tunnl_postgres_password@postgres:5432/appdb?sslmode=disable
ADMIN_EMAILS=$ADMIN_EMAIL
CONTACT_EMAIL=$ADMIN_EMAIL
PUBLISHER_URL=publisher.$ROOT_DOMAIN
NEXTAUTH_SECRET=$(generate_secret)
NEXTAUTH_URL=$ROOT_DOMAIN

POSTGRES_DB=appdb
POSTGRES_USER=app
POSTGRES_PASSWORD=$tunnl_postgres_password

ZITI_CONTROLLER_URL=https://ziti.$ROOT_DOMAIN
ZITI_WEBSOCKET_CONTROLLER_URL=wss://ctrl.ziti.$ROOT_DOMAIN
ZITI_ADMIN_USERNAME=admin
ZITI_ADMIN_PASSWORD=${ziti_pwd}

KEYCLOAK_ISSUER=
KEYCLOAK_CLIENT_SECRET=
KEYCLOAK_CLIENT_ID=
EOF
)

    keycloak_postgres_password=$(generate_secret)

    keycloak_env=$(cat <<EOF
POSTGRES_DB=keycloak
POSTGRES_USER=keycloak
POSTGRES_PASSWORD=$keycloak_postgres_password
KC_DB=postgres
KC_DB_URL=jdbc:postgresql://keycloak-postgres:5432/keycloak
KC_DB_PASSWORD=$keycloak_postgres_password
KC_DB_USERNAME=keycloak
KC_DB_SCHEMA=public
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=$(generate_secret)
PROXY_ADDRESS_FORWARDING=true
KC_METRICS_ENABLE=true
KC_PROXY=edge
KC_HOSTNAME_STRICT=false
KC_HOSTNAME_STRICT_HTTPS=false
KC_HTTP_ENABLED=true
KC_PROXY_HEADERS=xforwarded
EOF
)

    if [ ! -f ".keycloak.env" ]; then printf "%s\n" "$keycloak_env" > .keycloak.env ; fi
    
    if [ ! -f ".traefik.env" ]; then touch .traefik.env ; fi

    sed -i "s/ADMIN_EMAIL/$ADMIN_EMAIL/g" configs/traefik.yml
    sed -i "s/ROOT_DOMAIN/$ROOT_DOMAIN/g" configs/dynamic.yml
}

install_ziti_cli () {
    echo "[INFO] Installing OpenZiti CLI."
    if command -v ziti >/dev/null 2>&1; then
      return 0
    fi

    curl -sS https://get.openziti.io/install.bash | sudo bash -s openziti
}

ziti_login () {
    local advertised_host_port="${ZITI_CTRL_EDGE_ADVERTISED_ADDRESS}:${ZITI_CTRL_EDGE_ADVERTISED_PORT}"
    ziti edge login "${advertised_host_port}" -u "admin" -p "${ZITI_PWD}" -y 2>&1
}

install_ziti () {
    echo "[INFO] Installing OpenZiti."

    docker compose up -d
    sleep 15 # TODO Make this wait until controller is online

    echo "[INFO] Using these environment variables for the OpenZiti install."

    cat <<EOF
[INFO] ZITI_CTRL_ADVERTISED_ADDRESS=$ZITI_CTRL_ADVERTISED_ADDRESS
[INFO] ZITI_CTRL_ADVERTISED_PORT=$ZITI_CTRL_ADVERTISED_PORT
[INFO] ZITI_CTRL_EDGE_ADVERTISED_ADDRESS=$ZITI_CTRL_EDGE_ADVERTISED_ADDRESS
[INFO] ZITI_CTRL_EDGE_ADVERTISED_PORT=$ZITI_CTRL_EDGE_ADVERTISED_PORT
[INFO] ZITI_ROUTER_ADVERTISED_ADDRESS=$ZITI_ROUTER_ADVERTISED_ADDRESS
[INFO] ZITI_ROUTER_PORT=$ZITI_ROUTER_PORT
[INFO] ZITI_PWD=$ZITI_PWD
EOF

    ziti_login

    echo ""
    echo -e "----------  Creating an edge router policy allowing all identities to connect to routers with a #public attribute"
    ziti edge delete edge-router-policy allEdgeRouters > /dev/null
    ziti edge create edge-router-policy allEdgeRouters --edge-router-roles '#public' --identity-roles '#all' > /dev/null

    echo -e "----------  Creating a service edge router policy allowing all services to use #public edge routers"
    ziti edge delete service-edge-router-policy allSvcAllRouters > /dev/null
    ziti edge create service-edge-router-policy allSvcAllRouters --edge-router-roles '#all' --service-roles '#all' > /dev/null
    echo ""

    ziti edge delete edge-router "er1"
    ziti edge create edge-router "er1" -o "er1.jwt" -t -a "public"
    ROUTER_TOKEN=$(cat ./er1.jwt) 
    rm er1.jwt
    echo "ZITI_ENROLL_TOKEN=$ROUTER_TOKEN" >> .env

    docker compose down && docker compose up -d

    sleep 15
}

tunnl_install () {
    echo "[INFO] Running tunnl_install."
    sudo echo "[INFO] Got super user permissions."
    docker_check
    jq_check
    ask_for_target_dir
    ask_for_root_domain
    ask_for_admin_email
    extract_and_move_to_target_dir
    create_files_and_directories
    install_ziti_cli
    install_ziti
    cd "$STARTING_DIRECTORY"
    cat <<EOF



✅ Setup complete!

🔧 Next steps:

1. Make sure your Traefik configuration is working:
   It should be able to request certificates via the
   certificate resolver. The recommended method is
   to use an API key supported by Traefik (see the
   Traefik documentation for more details). Put your
   API key environment variable in: $TARGET_DIRECTORY/.traefik.env

2. Start the following containers:
   - keycloak
   - keycloak-postgres

   Then, log into Keycloak at https://auth.$ROOT_DOMAIN 
   and create a new realm with a client configured for OIDC.

3. Configure your Keycloak OIDC environment variables in:
   $TARGET_DIRECTORY/.tunnl.env

4. Start the whole stack and login to $ROOT_DOMAIN to 
   start creating & sharing services!



EOF
}

tunnl_install
