#pragma once

#include <string>
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
    HTTPRequest &setHeader(const std::string &header);
    HTTPRequest &setUrl(const std::string &url);

    HTTPRequest &get();
    HTTPRequest &post();

    const std::string &getUrl() const;
    const std::string &getBody() const;
    const std::vector<std::string> &getHeaders() const;
    const Method &getMethod() const;

  private:
    enum Method method;

    std::string body;
    std::vector<std::string> headers;
    std::string url;
};
