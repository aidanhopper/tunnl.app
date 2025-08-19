#include "app.h"
#include "ziti/ziti.h"
#include <iostream>
#include <stdexcept>
#include <string>
#include <ziti/zitilib.h> // TODO: Wrap all ziti stuff up into a class

App::App()
{
}

App::~App()
{
}

App &App::getInstance()
{
    static App instance;
    return instance;
}

void App::run()
{
    int rc;

    Ziti_lib_init();

    std::string identityFile{"./id.json"};

    ziti_handle_t ztx;
    rc = Ziti_load_context(&ztx, identityFile.c_str());

    std::cout << "ZTX: " << ztx << std::endl;

    if (rc != 0)
    {
        throw std::runtime_error(
            "Could not load ziti context from identity file");
    }

    std::cout << "[INFO] Loaded identity into ziti context" << std::endl;

    // can bind to a service but still need to query services to bind to
    ziti_socket_t sock = Ziti_socket(SOCK_STREAM);
    rc = Ziti_bind(sock, ztx, "private-https-dial-dotchosat3uu-C5GaubCdh70g", NULL);

    Ziti_listen(sock, 10);
    std::cout << "[INFO] Listening to Ziti service" << std::endl;

    do
    {
        char caller[128];
        ziti_socket_t clt = Ziti_accept(sock, caller, (int)sizeof(caller));

        std::cout << caller << std::endl;
    } while (true);

    Ziti_close(sock);
}
