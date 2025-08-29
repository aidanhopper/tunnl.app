#include "app.hpp"
#include "config/intercept-v1.hpp"
#include "config/private-https-v1.hpp"
#include "http.hpp"
#include "identity.hpp"
#include "ssl.hpp"
#include "ziti-server.hpp"
#include <curl/curl.h>
#include <fcntl.h>
#include <iostream>
#include <ranges>
#include <string>
#include <sys/wait.h>
#include <unistd.h>
#include <uv.h>

App::App()
{
    HTTP::globalInit();
    Identity::globalInit();
    MySSL::globalInit();
    signal(SIGPIPE, SIG_IGN);
}

App::~App()
{
    HTTP::globalCleanup();
    Identity::globalCleanup();
}

App &App::getInstance()
{
    static App instance;
    return instance;
}

/*  NOTE:
 *
 * Looked into grabbing bind & dial services with Zitilib
 * and couldn't find solution. Next option is to query the
 * Ziti API preferably using the identity certs.
 *
 * The Ziti identity JSON contains all the certificates
 * needed to authenticate with the client API, so I just
 * need to read that and make my requests. Then I can query
 * services in the context of the identity I've
 * authenticated without going through the Ziti C SDK.
 *
 * Then I can wrap the Ziti client API functionality and
 * Zitilib functionality up into a nice Ziti class.
 *
 * May want to handle enrollment as well since its made easy
 * with Zitilib.
 *
 */

void App::run()
{
    Identity id{ "id.json" };

    auto bindServices = id.getBindServices();
    auto dialServices = id.getDialServices();

    // Two things
    // In order to avoid redirect loops I need to inject some headers
    // X-Forwarded-Proto ...
    //
    // Change from server and client to TLSHandle and regular SocketHandle
    // Then make it so I can freely swap between SSL and not for client.
    // (good for testing).
   
    auto server1 =
        ZitiServer{ id.getZtx(), bindServices.at("private-https-service") };

    auto server2 =
        ZitiServer{ id.getZtx(), bindServices.at("private-https-service-2") };

    server1.start();
    server2.start();

    uv_run(uv_default_loop(), UV_RUN_DEFAULT);
}
