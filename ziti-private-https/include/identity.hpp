#pragma once

#include "http.hpp"
#include "service.hpp"
#include <nlohmann/json.hpp>
#include <openssl/pem.h>
#include <openssl/ssl.h>
#include <string>
#include <unordered_map>

using json = nlohmann::json;

class Identity
{
  private:
    std::string ca;
    std::string cert;
    std::string key;
    std::string controllerUrl;
    std::string token;
    std::string expiresAt;
    HTTP http;
    std::optional<std::unordered_map<std::string, Service>> services;
    std::optional<std::unordered_map<std::string, Service>> bindServices;
    std::optional<std::unordered_map<std::string, Service>> dialServices;

    void getDataFromEnrolledIdentity(json &data);
    void init();
    const std::string &getToken();
    const bool isTokenValid() const;

  public:
    Identity();
    Identity(const std::string &identityPath);
    Identity(const char *identityPath);
    ~Identity();

    const std::string getCa() const;
    const std::string getCert() const;
    const std::string getKey() const;
    const std::string getControllerUrl() const;
    const std::string getEdgeClientEndpoint() const;
    const std::string getEdgeManagementEndpoint() const;
    const std::unordered_map<std::string, Service> &getServices();
    const std::unordered_map<std::string, Service> &getBindServices();
    const std::unordered_map<std::string, Service> &getDialServices();
    const void getServicesHelper();
    const bool sessionHasChanged();
};
