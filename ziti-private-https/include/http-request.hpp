#pragma once

#include <string>
#include <unordered_map>
#include <vector>

class HTTPRequest
{
  public:
    enum class Method
    {
        GET,
        POST
    };

    HTTPRequest() = default;

    HTTPRequest &setMethod(const Method &method);
    HTTPRequest &setBody(const std::string &body);
    HTTPRequest &setHeader(const std::string &key, const std::string &value);
    HTTPRequest &setUrl(const std::string &url);

    HTTPRequest &get();
    HTTPRequest &post();

    const std::string &getUrl() const;
    const std::string &getBody() const;
    const std::unordered_map<std::string, std::string> &getHeaders() const;
    const Method &getMethod() const;

  private:
    enum Method method;

    std::string body;
    std::unordered_map<std::string, std::string> headers;
    std::string url;
};
