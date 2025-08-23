#include "config/intercept-v1.hpp"

namespace Config
{

InterceptV1::InterceptV1() = default;

InterceptV1::InterceptV1(const std::string &jsonBlob)
{
    auto json = nlohmann::json::parse(jsonBlob);
    parseFromJson(json);
}

InterceptV1::InterceptV1(const nlohmann::json &json)
{
    parseFromJson(json);
}

const std::vector<std::string> &InterceptV1::getAddresses() const
{
    return addresses;
}

const std::vector<InterceptV1::PortRange> &InterceptV1::getPortRanges() const
{
    return portRanges;
}

const std::vector<std::string> &InterceptV1::getProtocols() const
{
    return protocols;
}

const std::optional<std::vector<std::string>> &InterceptV1::
    getAllowedSourceAddresses() const
{
    return allowedSourceAddresses;
}

const std::optional<std::vector<InterceptV1::AddressTranslation>> &
InterceptV1::getAddressTranslations() const
{
    return addressTranslations;
}

const std::optional<InterceptV1::DialOptions> &InterceptV1::getDialOptions()
    const
{
    return dialOptions;
}

const std::optional<std::string> &InterceptV1::getSourceIp() const
{
    return sourceIp;
}

const std::optional<InterceptV1::ProxyConfiguration> &InterceptV1::getProxy()
    const
{
    return proxy;
}

void InterceptV1::parseFromJson(const nlohmann::json &json)
{
    // Parse required fields
    if (json.contains("addresses") && json["addresses"].is_array())
    {
        for (const auto &addr : json["addresses"])
        {
            addresses.push_back(addr.get<std::string>());
        }
    }

    if (json.contains("portRanges") && json["portRanges"].is_array())
    {
        for (const auto &range : json["portRanges"])
        {
            PortRange pr;
            pr.low = range["low"].get<int>();
            pr.high = range["high"].get<int>();
            portRanges.push_back(pr);
        }
    }

    if (json.contains("protocols") && json["protocols"].is_array())
    {
        for (const auto &protocol : json["protocols"])
        {
            protocols.push_back(protocol.get<std::string>());
        }
    }

    // Parse optional fields
    if (json.contains("allowedSourceAddresses") &&
        json["allowedSourceAddresses"].is_array())
    {
        std::vector<std::string> srcAddrs;
        for (const auto &addr : json["allowedSourceAddresses"])
        {
            srcAddrs.push_back(addr.get<std::string>());
        }
        allowedSourceAddresses = srcAddrs;
    }

    if (json.contains("dialOptions") && json["dialOptions"].is_object())
    {
        DialOptions opts;
        const auto &dialOpts = json["dialOptions"];

        if (dialOpts.contains("connectTimeoutSeconds"))
        {
            opts.connectTimeoutSeconds =
                dialOpts["connectTimeoutSeconds"].get<int>();
        }
        if (dialOpts.contains("identity"))
        {
            opts.identity = dialOpts["identity"].get<std::string>();
        }

        dialOptions = opts;
    }

    if (json.contains("sourceIp"))
    {
        sourceIp = json["sourceIp"].get<std::string>();
    }

    // Parse address translations if present
    if (json.contains("addressTranslations") &&
        json["addressTranslations"].is_array())
    {
        std::vector<AddressTranslation> translations;
        for (const auto &trans : json["addressTranslations"])
        {
            AddressTranslation at;
            at.from = trans["from"].get<std::string>();
            at.to = trans["to"].get<std::string>();

            if (trans.contains("prefixLength"))
            {
                at.prefixLength = trans["prefixLength"].get<int>();
            }

            // Simple check for IPv6 format (contains colons)
            at.isIPv6 = at.from.find(':') != std::string::npos;

            translations.push_back(at);
        }
        addressTranslations = translations;
    }

    // Parse proxy configuration if present
    if (json.contains("proxyConfiguration") &&
        json["proxyConfiguration"].is_object())
    {
        ProxyConfiguration proxyConfig;
        const auto &proxy = json["proxyConfiguration"];

        proxyConfig.type = proxy["type"].get<std::string>();
        proxyConfig.address = proxy["address"].get<std::string>();

        this->proxy = proxyConfig;
    }
}

std::ostream &operator<<(std::ostream &os, const InterceptV1 &config)
{
    os << "InterceptV1 Configuration:\n";

    // Required fields
    os << "  Addresses: [";
    for (size_t i = 0; i < config.getAddresses().size(); ++i)
    {
        if (i > 0)
            os << ", ";
        os << "\"" << config.getAddresses()[i] << "\"";
    }
    os << "]\n";

    os << "  Protocols: [";
    for (size_t i = 0; i < config.getProtocols().size(); ++i)
    {
        if (i > 0)
            os << ", ";
        os << "\"" << config.getProtocols()[i] << "\"";
    }
    os << "]\n";

    os << "  Port Ranges: [";
    for (size_t i = 0; i < config.getPortRanges().size(); ++i)
    {
        if (i > 0)
            os << ", ";
        os << "{" << config.getPortRanges()[i].low << "-"
           << config.getPortRanges()[i].high << "}";
    }
    os << "]\n";

    // Optional fields
    if (config.getAllowedSourceAddresses().has_value())
    {
        os << "  Allowed Source Addresses: [";
        const auto &addrs = config.getAllowedSourceAddresses().value();
        for (size_t i = 0; i < addrs.size(); ++i)
        {
            if (i > 0)
                os << ", ";
            os << "\"" << addrs[i] << "\"";
        }
        os << "]\n";
    }

    if (config.getDialOptions().has_value())
    {
        const auto &dialOpts = config.getDialOptions().value();
        os << "  Dial Options:\n";
        if (dialOpts.connectTimeoutSeconds.has_value())
        {
            os << "    Connect Timeout: "
               << dialOpts.connectTimeoutSeconds.value() << "s\n";
        }
        if (dialOpts.identity.has_value())
        {
            os << "    Identity: \"" << dialOpts.identity.value() << "\"\n";
        }
    }

    if (config.getSourceIp().has_value())
    {
        os << "  Source IP: \"" << config.getSourceIp().value() << "\"\n";
    }

    if (config.getAddressTranslations().has_value())
    {
        os << "  Address Translations:\n";
        for (const auto &trans : config.getAddressTranslations().value())
        {
            os << "    " << trans.from << " -> " << trans.to;
            if (trans.prefixLength.has_value())
            {
                os << "/" << trans.prefixLength.value();
            }
            os << " (" << (trans.isIPv6 ? "IPv6" : "IPv4") << ")\n";
        }
    }

    if (config.getProxy().has_value())
    {
        const auto &proxy = config.getProxy().value();
        os << "  Proxy: " << proxy.type << " @ " << proxy.address << "\n";
    }

    return os;
}
} // namespace Config
