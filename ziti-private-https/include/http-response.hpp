#pragma once

#include <curl/curl.h>
#include <string>
#include <unordered_map>

class HTTPResponse
{
  private:
    long status;
    std::string body;
    CURLcode curlCode;
    std::string curlError;
    std::unordered_map<std::string, std::string> headers;

  public:
    HTTPResponse(long &status, std::string &body,
                 std::unordered_map<std::string, std::string> headers,
                 CURLcode c);

    const long &getStatus() const;
    const std::string &getBody() const;
    const std::string &getTransportError() const;
    const std::unordered_map<std::string, std::string> &getHeaders() const;

    const bool transportOk() const;
    const bool ok() const;

    friend std::ostream &operator<<(std::ostream &os, const HTTPResponse &res);
};
