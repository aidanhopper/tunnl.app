#pragma once

#include <nlohmann/json.hpp>
#include <openssl/pem.h>
#include <openssl/ssl.h>
#include <optional>
#include <string>

using json = nlohmann::json;

class Identity
{
  private:
    std::string ca;
    std::string cert;
    std::string key;
    std::string controllerUrl;
    std::optional<std::string> token;

    void getDataFromEnrolledIdentity(json &data);
    void init();
    std::string getToken();

  public:
    Identity(const std::string &identityPath);
    Identity(const char *identityPath);
    ~Identity();

    std::string getCa();
    std::string getCert();
    std::string getKey();
    std::string getControllerUrl();
    std::string getEdgeClientEndpoint();
    std::string getEdgeManagementEndpoint();
};
