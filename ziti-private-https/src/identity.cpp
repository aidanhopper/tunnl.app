#include "identity.hpp"
#include <fstream>
#include <nlohmann/json.hpp>

std::vector<std::string> split(const std::string &s, char delimiter)
{
    std::vector<std::string> tokens;
    size_t start = 0;
    size_t end;

    while ((end = s.find(delimiter, start)) != std::string::npos)
    {
        tokens.push_back(s.substr(start, end - start));
        start = end + 1;
    }
    tokens.push_back(s.substr(start));
    return tokens;
}

Identity::~Identity()
{
}

Identity::Identity(const std::string &identityPath)
{
    json data = json::parse(std::ifstream{identityPath});
    this->getDataFromEnrolledIdentity(data);
    this->init();
}

Identity::Identity(const char *identityPath)
{
    json data = json::parse(std::ifstream{identityPath});
    this->getDataFromEnrolledIdentity(data);
    this->init();
}

void Identity::init()
{
    auto tokens = split(this->controllerUrl, ':');
    auto domain = tokens[1].substr(2);
    auto port = std::stoi(tokens[2]);
}

void Identity::getDataFromEnrolledIdentity(json &data)
{
    this->cert = std::string{data["id"]["cert"]};
    this->ca = std::string{data["id"]["ca"]};
    this->key = std::string{data["id"]["key"]};
    this->controllerUrl = std::string{data["ztAPI"]};
}

std::string Identity::getCa()
{
    return this->ca;
}

std::string Identity::getCert()
{
    return this->cert;
}

std::string Identity::getKey()
{
    return this->key;
}

std::string Identity::getControllerUrl()
{
    return this->controllerUrl;
}

std::string Identity::getEdgeClientEndpoint()
{
    return this->controllerUrl + "/edge/client/v1";
}

std::string Identity::getEdgeManagementEndpoint()
{
    return this->controllerUrl + "/edge/management/v1";
}
