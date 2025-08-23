#include "app.hpp"
#include "http.hpp"
#include "identity.hpp"
#include <curl/curl.h>
#include <fstream>
#include <iostream>
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

/*
 *  Looked into grabbing bind & dial services with Zitilib and couldn't find
 * solution. Next option is to query the Ziti API preferably using the identity
 * certs.
 *
 *  The Ziti identity JSON contains all the certificates needed to authenticate
 *  with the client API, so I just need to read that and make my requests.
 *  Then I can query services in the context of the identity I've authenticated
 *  without going through the Ziti C SDK.
 *
 *  Then I can wrap the Ziti client API functionality and Zitilib functionality
 *  up into a nice Ziti class.
 *
 *  May want to handle enrollment as well since its made easy with Zitilib.
 *
 */

void App::run()
{
    Identity id{"id.json"};

    HTTP http;
    http.setCa(id.getCa())
        .setCert(id.getCert())
        .setKey(id.getKey())
        .setBaseUrl(id.getEdgeClientEndpoint())
        .setUseSSLContext(true)
        .setIgnoreSSL(true)
        .setVerbose(true);

    HTTPRequest req;
    req.get().setHeader("").setUrl("/protocols");

    // 

    const auto res = http.perform(req);

    if (!res.transportOk())
    {
        std::cout << res.getTransportError() << std::endl;
    }
    else
    {
        std::cout << res.getBody() << std::endl;
    }
}
