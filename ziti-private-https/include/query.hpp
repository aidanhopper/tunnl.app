#pragma once

#include <curl/curl.h>
#include <optional>
#include <string>

class Query
{
  private:
    std::optional<std::string> cert;
    std::optional<std::string> key;
    std::optional<std::string> ca;
    std::string url;
    CURL *curl;
    static size_t curlWriteCallback(void *contents, size_t size, size_t nmemb,
                                    void *userp);
    static CURLcode sslctx_function(CURL *curl, void *sslctx, void *userptr);

  public:
    Query();
    ~Query();

    std::string get(const std::string &url);
    std::string post(const std::string &url);

    void setCert(const std::string &cert);
    void setKey(const std::string &key);
    void setCa(const std::string &ca);
    void setUrl(const std::string &url);

    void setUseSSLContext(bool enable);
    void setVerbose(bool enable);
};
