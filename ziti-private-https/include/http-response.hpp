#pragma once

#include <curl/curl.h>
#include <string>

class HTTPResponse
{
  private:
    long status;
    std::string body;
    CURLcode curlCode;
    std::string curlError;

  public:
    HTTPResponse(long &status, std::string &body, CURLcode c);

    const long &getStatus() const;
    const std::string &getBody() const;
    const std::string &getTransportError() const;

    const bool transportOk() const;
    const bool ok() const;
};
