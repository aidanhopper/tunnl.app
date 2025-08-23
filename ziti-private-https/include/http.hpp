#pragma once

#include "http-response.hpp"
#include "http-request.hpp"
#include <curl/curl.h>
#include <optional>
#include <string>

class HTTP
{
  private:
    std::optional<std::string> cert;
    std::optional<std::string> key;
    std::optional<std::string> ca;
    std::string baseUrl;
    CURL *curl;
    static size_t curlWriteCallback(void *contents, size_t size, size_t nmemb,
                                    void *userp);
    static CURLcode sslctx_function(CURL *curl, void *sslctx, void *userptr);

  public:
    HTTP();
    ~HTTP();

    const HTTPResponse perform(const HTTPRequest &req);

    HTTP &setCert(const std::string &cert);
    HTTP &setKey(const std::string &key);
    HTTP &setCa(const std::string &ca);
    HTTP &setBaseUrl(const std::string &url);
    HTTP &setUseSSLContext(bool enable);
    HTTP &setVerbose(bool enable);
    HTTP &setIgnoreSSL(bool enable);
};
