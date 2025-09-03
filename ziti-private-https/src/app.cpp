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
#include <openssl/pkcs7.h>
#include <ranges>
#include <string>
#include <sys/wait.h>
#include <unistd.h>
#include <unordered_map>
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

    std::unordered_map<std::string, std::unique_ptr<ZitiServer>> listeners;

    uv_timer_t timer;

    uv_timer_init(uv_default_loop(), &timer);

    struct Data
    {
        Identity &id;
        std::unordered_map<std::string, std::unique_ptr<ZitiServer>>
            &listeners;
    };

    timer.data = new Data{
        .id = id,
        .listeners = listeners,
    };

    uv_timer_start(
        &timer,
        [](uv_timer_t *handle) {
            auto data = static_cast<Data *>(handle->data);

            auto bindServices = data->id.getBindServices();
            auto dialServices = data->id.getDialServices();

            std::vector<std::string> listenersToErase;

            // make sure every service currently in listeners is still valid
            for (auto name : data->listeners | std::views::keys)
            {
                if (!bindServices.contains(name) ||
                    !bindServices.at(name).getPrivateHTTPSV1().has_value() ||
                    !dialServices.contains(bindServices.at(name)
                                               .getPrivateHTTPSV1()
                                               .value()
                                               .getTargetService()))
                {
                    std::cout << "[INFO] Removing " << name << " service"
                              << std::endl;
                    listenersToErase.push_back(name);
                }
            }

            for (auto &name : listenersToErase)
            {
                data->listeners.erase(name);
            }

            for (auto &bindService : bindServices | std::views::values)
            {
                // if its a new service
                if (!data->listeners.contains(bindService.getName()))
                {
                    if (bindService.getPrivateHTTPSV1().has_value() &&
                        dialServices.contains(bindService.getPrivateHTTPSV1()
                                                  .value()
                                                  .getTargetService()))
                    {
                        std::cout << "[INFO] Adding " << bindService.getName()
                                  << " service" << std::endl;
                        data->listeners[bindService.getName()] =
                            std::make_unique<ZitiServer>(
                                data->id.getZtx(),
                                bindService);
                    }
                }

                // if the service configuration has changed
                else
                {
                    auto currentBindService =
                        data->listeners[bindService.getName()]->getService();

                    auto newBindService = bindService;

                    if (currentBindService.getPrivateHTTPSV1()
                            .value()
                            .getTargetService() !=
                        newBindService.getPrivateHTTPSV1()
                            .value()
                            .getTargetService())
                    {
                        std::cout
                            << "[INFO] " << bindService.getName()
                            << " service has changed, updating configuration"
                            << std::endl;
                        data->listeners.erase(currentBindService.getName());
                        data->listeners[currentBindService.getName()] =
                            std::make_unique<ZitiServer>(
                                data->id.getZtx(),
                                bindService);
                    }
                }
            }

            for (auto &listener : data->listeners | std::views::values)
            {
                listener->start();
            }
        },
        0,
        15000);

    // auto bindServices = id.getBindServices();
    // auto dialServices = id.getDialServices();

    // for (auto &bindService : bindServices | std::views::values)
    // {
    //     if (bindService.getPrivateHTTPSV1().has_value() &&
    //         dialServices.contains(
    //             bindService.getPrivateHTTPSV1().value().getTargetService()))
    //     {
    //         listeners[bindService.getName()] =
    //             std::make_unique<ZitiServer>(id.getZtx(), bindService);
    //     }
    // }
    //
    // for (auto &listener : listeners | std::views::values)
    // {
    //     listener->start();
    // }

    uv_run(uv_default_loop(), UV_RUN_DEFAULT);
}
