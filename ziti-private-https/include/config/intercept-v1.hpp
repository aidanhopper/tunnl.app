#pragma once

#include <nlohmann/json.hpp>
#include <optional>
#include <string>
#include <vector>

namespace Config
{
class InterceptV1
{
  private:
    struct PortRange
    {
        int high;
        int low;
    };

    struct AddressTranslation
    {
        std::string from;
        std::string to;
        std::optional<int> prefixLength;
        bool isIPv6 = false;
    };

    struct ProxyConfiguration
    {
        std::string type;    // Currently only "http" supported
        std::string address; // host:port format
    };

    struct DialOptions
    {
        std::optional<int> connectTimeoutSeconds;
        std::optional<std::string> identity;
    };

    // Required fields
    std::vector<std::string> addresses;
    std::vector<PortRange> portRanges;
    std::vector<std::string> protocols; // "tcp", "udp"

    // Optional fields
    std::optional<std::vector<std::string>> allowedSourceAddresses;
    std::optional<std::vector<AddressTranslation>> addressTranslations;
    std::optional<DialOptions> dialOptions;
    std::optional<std::string> sourceIp;
    std::optional<ProxyConfiguration> proxy;

  public:
    // Constructor
    InterceptV1();

    // Parse from JSON
    explicit InterceptV1(const std::string &jsonBlob);
    explicit InterceptV1(const nlohmann::json &json);

    // Getters for required fields
    const std::vector<std::string> &getAddresses() const;
    const std::vector<PortRange> &getPortRanges() const;
    const std::vector<std::string> &getProtocols() const;

    // Getters for optional fields
    const std::optional<std::vector<std::string>> &getAllowedSourceAddresses()
        const;
    const std::optional<std::vector<AddressTranslation>> &
    getAddressTranslations() const;
    const std::optional<DialOptions> &getDialOptions() const;
    const std::optional<std::string> &getSourceIp() const;
    const std::optional<ProxyConfiguration> &getProxy() const;

    friend std::ostream &operator<<(std::ostream &os,
                                    const InterceptV1 &config);

  private:
    void parseFromJson(const nlohmann::json &json);
};

} // namespace Config
