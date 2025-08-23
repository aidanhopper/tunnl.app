#include "config/private-https-v1.hpp"

namespace Config
{
PrivateHTTPSV1::PrivateHTTPSV1() = default;

PrivateHTTPSV1::PrivateHTTPSV1(const std::string &jsonBlob)
{
    auto json = nlohmann::json::parse(jsonBlob);
    parseFromJson(json);
}

PrivateHTTPSV1::PrivateHTTPSV1(const nlohmann::json &json)
{
    parseFromJson(json);
}

void PrivateHTTPSV1::parseFromJson(const nlohmann::json &json)
{
    if (json.contains("targetService") && json["targetService"].is_string())
    {
        targetService = json["targetService"].get<std::string>();
    }
}

const std::string &PrivateHTTPSV1::getTargetService() const
{
    return targetService;
}

std::ostream &operator<<(std::ostream &os, const PrivateHTTPSV1 &config)
{
    os << "PrivateHTTPSV1 Configuration:\n";
    os << "  Target Service: \"" << config.getTargetService() << "\"";
    return os;
}
} // namespace Config
