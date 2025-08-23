#pragma once

#include <string>
#include <iostream>
#include <nlohmann/json.hpp>

namespace Config
{
class PrivateHTTPSV1
{
  private:
    // Required fields
    std::string targetService;

  public:
    // Constructor
    PrivateHTTPSV1();
    
    // Parse from JSON
    explicit PrivateHTTPSV1(const std::string& jsonBlob);
    explicit PrivateHTTPSV1(const nlohmann::json& json);
    
    // Getter for required field
    const std::string& getTargetService() const;

    // Friend function for output stream
    friend std::ostream& operator<<(std::ostream& os, const PrivateHTTPSV1& config);

  private:
    void parseFromJson(const nlohmann::json& json);
};

} // namespace Config
