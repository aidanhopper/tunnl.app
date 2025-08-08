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

ask_for_target_dir () {
    if [ -z "$TARGET_DIRECTORY" ]; then
        printf "Enter the target directory for the Tunnl.app quickstart (default tunnl-quickstart): "
        read -r dir < /dev/tty
        if [ -z "$dir" ]; then dir="tunnl-quickstart" ; fi
        TARGET_DIRECTORY=$dir
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

ask_to_install_ziti () {
    if [ -z "$INSTALL_ZITI" ]; then 
        printf "Would you like to install the OpenZiti Controller & Edge Router with the OpenZiti quickstart? (y/N) "
        read -r install_ziti < /dev/tty
    else
        install_ziti=$INSTALL_ZITI
    fi

    if [ -z "$install_ziti" ]; then
        INSTALL_ZITI="no"
    elif [ "y" = "$install_ziti" ]; then
        INSTALL_ZITI="yes"
    elif [ "Y" = "$install_ziti" ]; then
        INSTALL_ZITI="yes"
    else
        INSTALL_ZITI="no"
    fi

    echo "[INFO] Installing Ziti: $INSTALL_ZITI"
}

extract_and_move_to_target_dir () {
    if [ -z "$TARGET_DIRECTORY" ]; then
        echo "[ERROR] Must specify target directory."
        exit 1
    fi
    mkdir -p $TARGET_DIRECTORY
    echo "[INFO] Extracting quickstart.tar.xz into $TARGET_DIRECTORY"
    curl -sL tunnl.app/quickstart.tar.xz -O quickstart.tar.xz
    tar -xJf quickstart.tar.xz -C $TARGET_DIRECTORY
    STARTING_DIRECTORY=$(PWD)
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

    tunnl_env=$(cat <<EOF > .tunnl.env
NODE_ENV=production
PUBLISHER_PORT=3444
PUBLISHER_JWT_SECRET=$(generate_secret)
DATABASE_URL=postgres://app:$tunnl_postgres_password@postgres:5432/appdb?sslmode=disable
ADMIN_EMAILS=$ADMIN_EMAIL
CONTACT_EMAIL=$ADMIN_EMAIL
PUBLISHER_URL=publisher.$ROOT_DOMAIN
NEXTAUTH_SECRET=$(generate_secret)
NEXTAUTH_URL=$ROOT_DOMAIN
POSTGRES_USER=app
POSTGRES_PASSWORD=$tunnl_postgres_password
POSTGRES_DB=appdb
ZITI_CONTROLLER_URL=https://ziti.$ROOT_DOMAIN
ZITI_WEBSOCKET_CONTROLLER_URL=wss://ctrl.ziti.$ROOT_DOMAIN
ZITI_ADMIN_USERNAME=admin
ZITI_ADMIN_PASSWORD=$ZITI_PWD

KEYCLOAK_ISSUER=
KEYCLOAK_CLIENT_SECRET=
KEYCLOAK_CLIENT_ID=
EOF
)

    if [ ! -f ".tunnl.env" ]; then printf "%s\n" $tunnl_env > .tunnl.env ; fi

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

    if [ ! -f ".keycloak.env" ]; then printf "%s\n" $keycloak_env > .keycloak.env ; fi
    
    if [ ! -f ".traefik.env" ]; then touch .traefik.env ; fi

    echo "[INFO] Getting database schema..."
    if [ ! -d "db-init" ]; then mkdir db-init ; fi
    curl -s https://raw.githubusercontent.com/aidanhopper/tunnl.app/refs/heads/main/webapp/db/schema.sql > db-init/schema.sql

    sed -i "s/ADMIN_EMAIL/$ADMIN_EMAIL/g" configs/traefik.yml
    sed -i "s/ROOT_DOMAIN/$ROOT_DOMAIN/g" configs/dynamic.yml
}

install_ziti_if_yes () {
    if [ "$INSTALL_ZITI" = "no" ]; then
        return 0;
    fi

    echo "[INFO] Installing OpenZiti."

    base_dns="ziti.$ROOT_DOMAIN"
    controller_port=10443
    router_port=11443
    export EXTERNAL_IP="$(curl -s eth0.me)"
    export ZITI_CTRL_EDGE_IP_OVERRIDE="${EXTERNAL_IP}"
    export ZITI_ROUTER_IP_OVERRIDE="${EXTERNAL_IP}"
    export ZITI_CTRL_ADVERTISED_ADDRESS="ctrl.${base_dns}"
    export ZITI_CTRL_EDGE_ADVERTISED_ADDRESS="ctrl."${base_dns}
    export ZITI_ROUTER_ADVERTISED_ADDRESS="er1.${base_dns}"
    export ZITI_CTRL_ADVERTISED_PORT=${controller_port}
    export ZITI_CTRL_EDGE_ADVERTISED_PORT=${controller_port}
    export ZITI_ROUTER_PORT=${router_port}
    export ZITI_ROUTER_LISTENER_BIND_PORT=${router_port}
    export ZITI_PWD=$(generate_secret)



    echo "[INFO] Using these environment variables for the OpenZiti install."

    cat <<EOF
[INFO] EXTERNAL_DNS=$EXTERNAL_DNS
[INFO] EXTERNAL_IP=$EXTERNAL_IP
[INFO] ZITI_CTRL_EDGE_IP_OVERRIDE=$ZITI_CTRL_EDGE_IP_OVERRIDE
[INFO] ZITI_CTRL_ADVERTISED_ADDRESS=$ZITI_CTRL_ADVERTISED_ADDRESS
[INFO] ZITI_CTRL_ADVERTISED_PORT=$ZITI_CTRL_ADVERTISED_PORT
[INFO] ZITI_CTRL_EDGE_ADVERTISED_ADDRESS=$ZITI_CTRL_EDGE_ADVERTISED_ADDRESS
[INFO] ZITI_CTRL_EDGE_ADVERTISED_PORT=$ZITI_CTRL_EDGE_ADVERTISED_PORT
[INFO] ZITI_ROUTER_ADVERTISED_ADDRESS=$ZITI_ROUTER_ADVERTISED_ADDRESS
[INFO] ZITI_ROUTER_IP_OVERRIDE="$ZITI_ROUTER_IP_OVERRIDE"
[INFO] ZITI_ROUTER_PORT=$ZITI_ROUTER_PORT
[INFO] ZITI_PWD=$ZITI_PWD
EOF

    source <(wget -qO- https://get.openziti.io/ziti-cli-functions.sh)
    
    if declare -f expressInstall > /dev/null; then
        expressInstall
    else
        echo "[ERROR] Failed to source ziti-cli-functions.sh"
        exit 1
    fi

    sed -i "s/advertiseAddress: tls:$ZITI_CTRL_ADVERTISED_ADDRESS:$ZITI_CTRL_ADVERTISED_PORT/advertiseAddress: tls:$ZITI_CTRL_ADVERTISED_ADDRESS:443/g" $ZITI_HOME/$(hostname).yaml

    sed -i "s/$ZITI_CTRL_EDGE_ADVERTISED_ADDRESS:$ZITI_CTRL_EDGE_ADVERTISED_PORT/$ZITI_CTRL_EDGE_ADVERTISED_ADDRESS:443/g" $ZITI_HOME/$(hostname).yaml

    sed -i "s/tls:$ZITI_CTRL_ADVERTISED_ADDRESS:$ZITI_CTRL_ADVERTISED_PORT/tls:$ZITI_CTRL_ADVERTISED_ADDRESS:443/g" $ZITI_HOME/$(hostname)-edge-router.yaml

    sed -i "s/$ZITI_ROUTER_ADVERTISED_ADDRESS:$ZITI_ROUTER_PORT/$ZITI_ROUTER_ADVERTISED_ADDRESS:443/g" $ZITI_HOME/$(hostname)-edge-router.yaml

    createControllerSystemdFile
    createRouterSystemdFile "${ZITI_ROUTER_NAME}"

    sudo cp "${ZITI_HOME}/${ZITI_CTRL_NAME}.service" /etc/systemd/system/ziti-controller.service
    sudo cp "${ZITI_HOME}/${ZITI_ROUTER_NAME}.service" /etc/systemd/system/ziti-router.service
    sudo systemctl daemon-reload
    sudo systemctl enable --now ziti-controller
    sudo systemctl enable --now ziti-router
}

tunnl_install () {
    sudo echo "[INFO] Got super user permissions."
    docker_check
    jq_check
    ask_for_target_dir
    ask_for_root_domain
    ask_for_admin_email
    ask_to_install_ziti
    install_ziti_if_yes
    extract_and_move_to_target_dir
    create_files_and_directories
    cd $STARTING_DIRECTORY
    cat <<EOF

✅ Setup complete!

🔧 Next steps:

1. Make sure your Traefik configuration is working:
   It should be able to request certificates via the certificate resolver. The recommended method is to use an API key supported by Traefik (see the Traefik documentation for more details). Put your API key environment variable in: $TARGET_DIRECTORY/.traefik.env

2. Start the following containers:
   - keycloak
   - keycloak-postgres

   Then, log into Keycloak at https://auth.$ROOT_DOMAIN and create a new realm with a client configured for OIDC.

3. Configure your Keycloak OIDC environment variables in:
   $TARGET_DIRECTORY/.tunnl.env

4. Start the whole stack and login to $ROOT_DOMAIN to start creating & sharing services!
EOF
}

tunnl_uninstall () {
    if [ -z $ZITI_HOME ]; then 
        echo "[Error] Please specify a ZITI_HOME environment variable."
        exit 1
    fi

    if [ -z $TARGET_DIRECTORY ]; then 
        echo "[Error] Please specify a TARGET_DIRECTORY environment variable."
        exit 1
    fi

    sudo systemctl disable --now ziti-controller.service
    sudo systemctl disable --now ziti-router.service

    rm -rf $ZITI_HOME
    sudo rm -rf $TARGET_DIRECTORY
    rm ./quickstart.tar.xz
}
