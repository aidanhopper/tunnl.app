#pragma once

#include "http.hpp"
#include "service.hpp"
#include "ziti/zitilib.h"
#include <nlohmann/json.hpp>
#include <openssl/pem.h>
#include <openssl/ssl.h>
#include <string>
#include <unordered_map>

using json = nlohmann::json;

class Identity
{
  private:
    HTTP http;

    std::string identityPath;
    std::string ca;
    std::string cert;
    std::string key;
    std::string controllerUrl;
    std::string token;
    std::string expiresAt;

    std::optional<std::unordered_map<std::string, Service>> services;
    std::optional<std::unordered_map<std::string, Service>> bindServices;
    std::optional<std::unordered_map<std::string, Service>> dialServices;

    void getDataFromEnrolledIdentity(json &data);
    const std::string &getToken();
    const bool isTokenValid() const;

    ziti_handle_t ztx;

  public:
    Identity();
    Identity(const std::string &identityPath);
    ~Identity();

    const std::string getCa() const;
    const std::string getCert() const;
    const std::string getKey() const;
    const std::string getControllerUrl() const;
    const std::string getEdgeClientEndpoint() const;
    const std::string getEdgeManagementEndpoint() const;

    const ziti_handle_t &getZtx() const;

    const std::unordered_map<std::string, Service> &getServices();
    const std::unordered_map<std::string, Service> &getBindServices();
    const std::unordered_map<std::string, Service> &getDialServices();

    const void getServicesHelper();
    const bool sessionHasChanged();

    static void globalInit();
    static void globalCleanup();
};
