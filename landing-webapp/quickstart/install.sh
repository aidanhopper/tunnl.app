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

ask_for_tunnl_subdomain () {
    if [ -z "$TUNNL_SUBDOMAIN" ]; then 
        printf "Enter the subdomain for the tunnl webapp (default none): "
        read -r email < /dev/tty
        TUNNL_SUBDOMAIN=$email
    fi
    echo "[INFO] Using tunnl subdomain: $TUNNL_SUBDOMAIN"
}

extract_and_move_to_target_dir () {
    if [ -z "$TARGET_DIRECTORY" ]; then
        echo "[ERROR] Must specify target directory."
        exit 1
    fi
    mkdir -p "$TARGET_DIRECTORY"
    echo "[INFO] Extracting quickstart.tar.xz into $TARGET_DIRECTORY"
    curl -ksL tunnl.app/quickstart.tar.xz -O quickstart.tar.xz
    tar -xJf quickstart.tar.xz -C "$TARGET_DIRECTORY"
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

    keycloak_postgres_password=$(generate_secret)
    tunnl_postgres_password=$(generate_secret)
    KEYCLOAK_ADMIN_PASSWORD=$(generate_secret)

    NEXTAUTH_URL="$ROOT_DOMAIN"
    if [ -n "$TUNNL_SUBDOMAIN" ]; then
        NEXTAUTH_URL="$TUNNL_SUBDOMAIN.$ROOT_DOMAIN"
    fi

    tunnl_env=$(cat <<EOF > .env
# KEYCLOAK VARIABLES
KC_DB=postgres
KC_DB_URL=jdbc:postgresql://keycloak-postgres:5432/keycloak
KC_DB_PASSWORD=$keycloak_postgres_password
KC_DB_USERNAME=keycloak
KC_DB_SCHEMA=public
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=$KEYCLOAK_ADMIN_PASSWORD
PROXY_ADDRESS_FORWARDING=true
KC_METRICS_ENABLE=true
KC_PROXY=edge
KC_HOSTNAME_STRICT=false
KC_HOSTNAME_STRICT_HTTPS=false
KC_HTTP_ENABLED=true
KC_PROXY_HEADERS=xforwarded

# TUNNL VARIABLES
NODE_ENV=production
PUBLISHER_PORT=3444
PUBLISHER_JWT_SECRET=$(generate_secret)
DATABASE_URL=postgres://app:$tunnl_postgres_password@postgres:5432/appdb?sslmode=disable
ADMIN_EMAILS=$ADMIN_EMAIL
CONTACT_EMAIL=$ADMIN_EMAIL
PUBLISHER_URL=publisher.$ROOT_DOMAIN
NEXTAUTH_SECRET=$(generate_secret)
NEXTAUTH_URL=$NEXTAUTH_URL

POSTGRES_DB=appdb
POSTGRES_USER=app
POSTGRES_PASSWORD=$tunnl_postgres_password

ZITI_CONTROLLER_URL=https://ziti.$ROOT_DOMAIN
ZITI_WEBSOCKET_CONTROLLER_URL=wss://ctrl.ziti.$ROOT_DOMAIN
ZITI_ADMIN_USERNAME=admin
ZITI_ADMIN_PASSWORD=$ZITI_ADMIN_PASSWORD
EOF
)
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
    ziti edge login "ctrl.ziti.$ROOT_DOMAIN:443" -u "admin" -p "${ZITI_ADMIN_PASSWORD}" -y 2>&1
}

install_ziti () {
    echo "[INFO] Installing OpenZiti."

    echo "[INFO] Using these environment variables for the OpenZiti install."

    ziti_pwd=$(generate_secret)
    base_dns="ziti.$ROOT_DOMAIN"
    controller_port=443
    router_port=443

    export ZITI_ADMIN_PASSWORD=${ziti_pwd}

    sed -i "s/ROOT_DOMAIN/$ROOT_DOMAIN/g" compose.yml
    sed -i "s/ROOT_DOMAIN/$ROOT_DOMAIN/g" ziti.compose.yml
    sed -i "s/ADMIN_EMAIL/$ADMIN_EMAIL/g" configs/traefik.yml
    sed -i "s/ROOT_DOMAIN/$ROOT_DOMAIN/g" configs/dynamic.yml

    if [ -z "$TUNNL_SUBDOMAIN" ]; then
        sed -i "s/TUNNL_DOMAIN/$ROOT_DOMAIN/g" configs/dynamic.yml
    else
        sed -i "s/TUNNL_DOMAIN/$TUNNL_SUBDOMAIN.$ROOT_DOMAIN/g" configs/dynamic.yml
    fi

    cat <<EOF
[INFO] ZITI_ADMIN_PASSWORD=$ZITI_ADMIN_PASSWORD
EOF
    
    cat <<EOF > .env
COMPOSE_FILE=ziti.compose.yml
ZITI_ADMIN_PASSWORD=$ZITI_ADMIN_PASSWORD
EOF

    docker compose up -d
    echo "[INFO] Waiting 20s for ziti controller to start..."
    sleep 20 # TODO Make this wait until controller is online


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

    echo "[INFO] Waiting 20s for ziti router to start..."
    sleep 20
    docker compose down

    rm ziti.compose.yml
}

setup_keycloak () {
    docker compose up -d
    echo "[INFO] Waiting 60s for keycloak to be ready..."
    sleep 60
    echo "[INFO] Setting up Keycloak OIDC."

    KEYCLOAK_URL="https://auth.$ROOT_DOMAIN"
    REALM="master"
    USERNAME="admin"
    PASSWORD="$KEYCLOAK_ADMIN_PASSWORD"
    CLIENT_ID="admin-cli"
    NEW_REALM="$ROOT_DOMAIN"
    if [ -n "$TUNNL_SUBDOMAIN" ]; then
        NEW_REALM="$TUNNL_SUBDOMAIN.$ROOT_DOMAIN"
    fi

    cat << EOF
[INFO] KEYCLOAK_URL=$KEYCLOAK_URL
[INFO] REALM=$REALM
[INFO] USERNAME=$USERNAME
[INFO] PASSWORD=$PASSWORD
[INFO] CLIENT_ID=$CLIENT_ID
[INFO] NEW_REALM=$NEW_REALM
EOF

    echo "[INFO] Getting admin access token..."

    ACCESS_TOKEN=$(curl -sk \
        -d "client_id=${CLIENT_ID}" \
        -d "username=${USERNAME}" \
        -d "password=${PASSWORD}" \
        -d "grant_type=password" \
        "${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token" \
        | jq -r '.access_token')

    echo "[INFO] Got token: $ACCESS_TOKEN"

    echo "[INFO] Creating realm '${NEW_REALM}'..."
    CREATE_REALM_RESP=$(curl -ksL -w "%{http_code}" -o /tmp/realm_create_resp.json \
        -X POST \
        "${KEYCLOAK_URL}/admin/realms" \
        -H "Authorization: Bearer ${ACCESS_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{
            \"realm\": \"${NEW_REALM}\",
            \"enabled\": true
        }")

    if [ "${CREATE_REALM_RESP}" -ge 400 ]; then
        if grep -q "already exists" /tmp/realm_create_resp.json; then
            echo "[INFO] Realm '${NEW_REALM}' already exists, skipping creation."
        else
            echo "[ERROR] Failed to create realm '${NEW_REALM}'."
            cat /tmp/realm_create_resp.json
            return 1
        fi
    else
        echo "[INFO] Realm '${NEW_REALM}' created successfully."
    fi

    NEW_CLIENT_ID="$ROOT_DOMAIN"
    REDIRECT_URI="https://$ROOT_DOMAIN/*"
    if [ -n "$TUNNL_SUBDOMAIN" ]; then
        REDIRECT_URI="https://$TUNNL_SUBDOMAIN.$ROOT_DOMAIN/*"
        NEW_CLIENT_ID="$TUNNL_SUBDOMAIN.$ROOT_DOMAIN"
    fi

    cat << EOF
[INFO] NEW_CLIENT_ID=$NEW_CLIENT_ID
[INFO] REDIRECT_URI=$REDIRECT_URI
EOF

    echo "[INFO] Creating OIDC client '${NEW_CLIENT_ID}' in realm '${NEW_REALM}'..."
    curl -ksLf -X POST \
        "${KEYCLOAK_URL}/admin/realms/${NEW_REALM}/clients" \
        -H "Authorization: Bearer ${ACCESS_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{
            \"clientId\": \"${NEW_CLIENT_ID}\",
            \"enabled\": true,
            \"publicClient\": false,
            \"redirectUris\": [\"${REDIRECT_URI}\"],
            \"protocol\": \"openid-connect\"
          }" || {
            echo "[ERROR] Failed to create OIDC client '${NEW_CLIENT_ID}' in realm '${NEW_REALM}'."
            return 1
          }

    echo "[INFO] Retrieving client UUID..."
    CLIENT_UUID=$(curl -ksL \
      "${KEYCLOAK_URL}/admin/realms/${NEW_REALM}/clients?clientId=${NEW_CLIENT_ID}" \
      -H "Authorization: Bearer ${ACCESS_TOKEN}" \
      | jq -er '.[0].id') || {
        echo "[ERROR] Failed to retrieve client UUID for '${NEW_CLIENT_ID}'."
        return 1
      }

    echo "[INFO] Fetching client secret..."
    CLIENT_SECRET=$(curl -ksL \
      "${KEYCLOAK_URL}/admin/realms/${NEW_REALM}/clients/${CLIENT_UUID}/client-secret" \
      -H "Authorization: Bearer ${ACCESS_TOKEN}" \
      | jq -er '.value') || {
        echo "[ERROR] Failed to retrieve client secret for '${NEW_CLIENT_ID}'."
        return 1
      }

    echo "[INFO] OIDC client '${NEW_CLIENT_ID}' created with secret: ${CLIENT_SECRET}"

    echo "[INFO] Updating realm '${NEW_REALM}' to enable registration and use email as username..."

    curl -ksL -X PUT \
      "${KEYCLOAK_URL}/admin/realms/${NEW_REALM}" \
      -H "Authorization: Bearer ${ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{
        \"registrationAllowed\": true,
        \"registrationEmailAsUsername\": true,
        \"loginWithEmailAllowed\": true
      }" || {
        echo "[ERROR] Failed to update realm settings for '${NEW_REALM}'."
        return 1
      }

    echo "[INFO] Realm '${NEW_REALM}' updated: registration enabled, email as username."

    KEYCLOAK_ISSUER="https://auth.$ROOT_DOMAIN/realms/$NEW_REALM"
    KEYCLOAK_CLIENT_SECRET="$CLIENT_SECRET"
    KEYCLOAK_CLIENT_ID="$NEW_CLIENT_ID"

    cat << EOF >> .env

KEYCLOAK_ISSUER=$KEYCLOAK_ISSUER
KEYCLOAK_CLIENT_SECRET=$KEYCLOAK_CLIENT_SECRET
KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID
EOF
    docker compose down
}

tunnl_install () {
    echo "[INFO] Running tunnl_install."
    sudo echo "[INFO] Got super user permissions."
    docker_check
    jq_check
    ask_for_target_dir
    ask_for_root_domain
    ask_for_admin_email
    ask_for_tunnl_subdomain
    extract_and_move_to_target_dir
    install_ziti_cli
    install_ziti
    create_files_and_directories
    setup_keycloak
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

2. Start the whole stack and login to $ROOT_DOMAIN to 
   start creating & sharing services!



EOF
}

tunnl_install
