#pragma once

#include "config/intercept-v1.hpp"
#include "config/private-https-v1.hpp"
#include <nlohmann/json.hpp> // full JSON library

using json = nlohmann::json;

class Service
{
  private:
    std::string id;
    std::string createdAt;
    std::string updatedAt;
    json config;
    std::vector<std::string> configs;
    bool encryptionRequired;
    int maxIdleTimeMillis;
    std::string name;
    std::vector<std::string> permissions;
    std::string terminatorStrategy;

  public:
    Service();
    Service(const json &blob);

    const std::string &getId() const;
    const std::string &getCreatedAt() const;
    const std::string &getUpdatedAt() const;
    const json &getConfig() const;
    const std::vector<std::string> &getConfigs() const;
    const bool isEncryptionRequired() const;
    const int getMaxIdleTimeMillis() const;
    const std::string &getName() const;
    const std::vector<std::string> &getPermissions() const;
    const std::string &getTerminatorStrategy() const;
    const bool canBind() const;
    const bool canDial() const;

    const bool hasInterceptV1() const;
    const bool hasPrivateHTTPSV1() const;

    const std::optional<Config::InterceptV1> getInterceptV1() const;
    const std::optional<Config::PrivateHTTPSV1> getPrivateHTTPSV1() const;

    friend std::ostream &operator<<(std::ostream &os, const Service &service);
};
