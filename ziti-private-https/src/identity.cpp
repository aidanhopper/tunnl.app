#include "identity.hpp"
#include "http-request.hpp"
#include <chrono>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <nlohmann/json.hpp>
#include <sstream>
#include <string>

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

Identity::Identity() = default;

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
    this->http.setCa(this->getCa())
        .setCert(this->getCert())
        .setKey(this->getKey())
        .setFollowRedirects(true)
        .setBaseUrl(this->getEdgeClientEndpoint())
        .setIgnoreSSL(true);
}

void Identity::getDataFromEnrolledIdentity(json &data)
{
    this->cert = std::string{data["id"]["cert"]};
    this->ca = std::string{data["id"]["ca"]};
    this->key = std::string{data["id"]["key"]};
    this->controllerUrl = std::string{data["ztAPI"]};
}

const std::string Identity::getCa() const
{
    return this->ca;
}

const std::string Identity::getCert() const
{
    return this->cert;
}

const std::string Identity::getKey() const
{
    return this->key;
}

const std::string Identity::getControllerUrl() const
{
    return this->controllerUrl;
}

const std::string Identity::getEdgeClientEndpoint() const
{
    return this->controllerUrl + "/edge/client/v1";
}

const std::string Identity::getEdgeManagementEndpoint() const
{
    return this->controllerUrl + "/edge/management/v1";
}

const bool Identity::isTokenValid() const
{
    if (this->token.empty())
    {
        return false;
    }

    // Remove the timezone for simplicity, or parse it separately if needed
    std::string ts = this->expiresAt.substr(0, 19); // "2025-08-23 17:00:46"

    std::tm tm = {};
    std::istringstream ss(ts);
    ss >> std::get_time(&tm, "%Y-%m-%d %H:%M:%S"); // parse to tm
    if (ss.fail())
        return false;

    auto tp = std::chrono::system_clock::from_time_t(std::mktime(&tm));
    auto now = std::chrono::system_clock::now();

    return now < tp;
}

const std::string &Identity::getToken()
{
    if (this->isTokenValid())
    {
        return this->token;
    }

    HTTPRequest req;
    req.post().setUrl("/authenticate?method=cert");

    http.setUseSSLContext(true);
    auto res = http.perform(req);
    http.setUseSSLContext(false);

    if (!res.transportOk())
    {
        throw std::runtime_error(res.getTransportError());
    }

    if (!res.ok())
    {
        throw std::runtime_error(
            "Could not get token from Ziti Edge Client API");
    }

    this->token = res.getHeaders().at("Zt-Session");

    return this->token;
}

const bool Identity::sessionHasChanged()
{
    HTTPRequest req;
    req.get()
        .setHeader("zt-session", this->getToken())
        .setUrl("/current-api-session/service-updates");

    auto sessionLastChangedAt =
        std::string{json::parse(this->http.perform(req).getBody())
                        .at("data")
                        .at("lastChangeAt")};

    // Parse the timestamp into a std::tm
    std::tm tm = {};
    std::istringstream ss(sessionLastChangedAt);
    ss >> std::get_time(&tm, "%Y-%m-%dT%H:%M:%S");
    if (ss.fail())
    {
        std::cerr << "Failed to parse timestamp\n";
        return false;
    }

    // Extract milliseconds
    size_t dotPos = sessionLastChangedAt.find('.');
    int milliseconds = 0;
    if (dotPos != std::string::npos)
    {
        milliseconds = std::stoi(sessionLastChangedAt.substr(dotPos + 1, 3));
    }

    // Convert tm to time_point
    auto tp = std::chrono::system_clock::from_time_t(timegm(&tm)) +
              std::chrono::milliseconds(milliseconds);

    // Get current UTC time
    auto now = std::chrono::system_clock::now();

    return now > tp;
}

const std::unordered_map<std::string, Service> &Identity::getServices()
{
    if (services == std::nullopt || this->sessionHasChanged())
    {
        this->getServicesHelper();
    }

    return this->services.value();
}

const std::unordered_map<std::string, Service> &Identity::getBindServices()
{
    if (services == std::nullopt || this->sessionHasChanged())
    {
        this->getServicesHelper();
    }

    return this->bindServices.value();
}

const std::unordered_map<std::string, Service> &Identity::getDialServices()
{
    if (services == std::nullopt || this->sessionHasChanged())
    {
        this->getServicesHelper();
    }

    return this->dialServices.value();
}

const void Identity::getServicesHelper()
{
    HTTPRequest req;
    req.get()
        .setHeader("zt-session", this->getToken())
        .setUrl("/services?configTypes=all");

    auto res = this->http.perform(req);

    if (!res.ok())
    {
        throw std::runtime_error(
            "Could not get services from Ziti Edge Client API");
    }

    auto servicesJson = json::parse(res.getBody());
    std::unordered_map<std::string, Service> services;
    std::unordered_map<std::string, Service> bindServices;
    std::unordered_map<std::string, Service> dialServices;

    for (const auto &s : servicesJson.at("data"))
    {
        try
        {
            Service srv{s};
            services[srv.getName()] = srv;
            if (srv.canBind())
                bindServices[srv.getName()] = srv;
            if (srv.canDial())
                dialServices[srv.getName()] = srv;
        }
        catch (int code)
        {
            continue;
        }
    }

    this->services = services;
    this->bindServices = bindServices;
    this->dialServices = dialServices;
}
