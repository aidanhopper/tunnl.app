#include "app.hpp"

/*
 * Idea behind this program
 * This program is meant to be a reverse proxy for https ziti services.
 * It does the TLS handshake, and routes to the corresponding backend service.
 * The reason to do this is so the domain owner can control the certficates
 * used to encrypt traffic, while allowing other users to use the certs. 
*/

int main(int argc, char **argv)
{
    App &app = App::getInstance();
    app.run();
}
