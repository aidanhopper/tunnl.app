#include "service.hpp"

Service::Service() = default;

Service::Service(const json &blob)
{
    blob.at("id").get_to(id);
    blob.at("createdAt").get_to(createdAt);
    blob.at("updatedAt").get_to(updatedAt);
    blob.at("config").get_to(config); // raw JSON
    blob.at("configs").get_to(configs);
    blob.at("encryptionRequired").get_to(encryptionRequired);
    blob.at("maxIdleTimeMillis").get_to(maxIdleTimeMillis);
    blob.at("name").get_to(name);
    blob.at("permissions").get_to(permissions);
    blob.at("terminatorStrategy").get_to(terminatorStrategy);
}

// Getters implementations
const std::string &Service::getId() const
{
    return id;
}

const std::string &Service::getCreatedAt() const
{
    return createdAt;
}

const std::string &Service::getUpdatedAt() const
{
    return updatedAt;
}

const json &Service::getConfig() const
{
    return config;
}

const std::vector<std::string> &Service::getConfigs() const
{
    return configs;
}

const bool Service::isEncryptionRequired() const
{
    return encryptionRequired;
}

const int Service::getMaxIdleTimeMillis() const
{
    return maxIdleTimeMillis;
}

const std::string &Service::getName() const
{
    return name;
}

const std::vector<std::string> &Service::getPermissions() const
{
    return permissions;
}

const std::string &Service::getTerminatorStrategy() const
{
    return terminatorStrategy;
}

const bool Service::canBind() const
{
    bool hasBindPermission{ false };

    for (const auto &p : getPermissions())
    {
        if (p == "Bind")
        {
            hasBindPermission = true;
        }
    }

    return hasBindPermission;
}
const bool Service::canDial() const
{
    bool hasDialPermission{ false };

    for (const auto &p : getPermissions())
    {
        if (p == "Dial")
        {
            hasDialPermission = true;
        }
    }

    return hasDialPermission;
}

const bool Service::hasInterceptV1() const
{
    return config.contains("intercept.v1");
}

const bool Service::hasPrivateHTTPSV1() const
{
    return config.contains("private-https.v1");
}

const std::optional<Config::InterceptV1> Service::getInterceptV1() const
{
    if (!config.contains("intercept.v1"))
    {
        return std::nullopt;
    }

    return Config::InterceptV1(config.at("intercept.v1"));
}

const std::optional<Config::PrivateHTTPSV1> Service::getPrivateHTTPSV1() const
{
    if (!config.contains("private-https.v1"))
    {
        return std::nullopt;
    }

    return Config::PrivateHTTPSV1(config.at("private-https.v1"));
}

std::ostream &operator<<(std::ostream &os, const Service &service)
{
    os << "id: " << service.id << "\n";
    os << "createdAt: " << service.createdAt << "\n";
    os << "updatedAt: " << service.updatedAt << "\n";
    os << "name: " << service.name << "\n";
    os << "encryptionRequired: "
       << (service.encryptionRequired ? "true" : "false") << "\n";
    os << "maxIdleTimeMillis: " << service.maxIdleTimeMillis << "\n";
    os << "terminatorStrategy: " << service.terminatorStrategy << "\n";

    os << "configs: ";
    for (const auto &c : service.configs)
    {
        os << c << " ";
    }
    os << "\n";

    os << "permissions: ";
    for (const auto &p : service.permissions)
    {
        os << p << " ";
    }
    os << "\n";

    os << "config JSON:\n"
       << service.config.dump(2) << "\n"; // pretty print JSON

    return os;
}
