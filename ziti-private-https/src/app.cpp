#include "app.hpp"
#include "config/intercept-v1.hpp"
#include "config/private-https-v1.hpp"
#include "http.hpp"
#include "identity.hpp"
#include <curl/curl.h>
#include <iostream>
#include <ranges>
#include <string>
#include <ziti/zitilib.h> // TODO: Wrap all ziti stuff up into a class

App::App()
{
    HTTP::globalInit();
}

App::~App()
{
    HTTP::globalCleanup();
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
    auto bindServices = id.getBindServices();
    auto dialServices = id.getDialServices();

    for (const auto &s : bindServices | std::views::values)
    {
        if (s.hasInterceptV1())
        {
            auto intercept = s.getInterceptV1().value();
            std::cout << intercept << std::endl;
        }

        if (s.hasPrivateHTTPSV1())
        {
            auto privateHttps = s.getPrivateHTTPSV1().value();
            std::cout << privateHttps << std::endl;

            if (dialServices.contains(privateHttps.getTargetService()))
            {
                std::cout << "\n" << dialServices.at(privateHttps.getTargetService()) << std::endl;
            }
        }
    }
}
