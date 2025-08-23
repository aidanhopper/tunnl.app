#include "http.hpp"
#include <iostream>
#include <openssl/ssl.h>

HTTP::~HTTP()
{
    curl_easy_cleanup(curl);
}

void HTTP::globalInit()
{
    CURLcode globalRes = curl_global_init(CURL_GLOBAL_DEFAULT);
    if (globalRes != CURLE_OK)
    {
        throw std::runtime_error("curl_global_init failed");
    }
}

void HTTP::globalCleanup()
{
    curl_global_cleanup();
}

HTTP::HTTP()
{
    this->curl = curl_easy_init();
    if (!this->curl)
    {
        curl_global_cleanup();
        throw std::runtime_error("curl_easy_init failed");
    }
}

const HTTPResponse HTTP::perform(const HTTPRequest &req)
{
    std::string responseBody;
    std::unordered_map<std::string, std::string> responseHeaders;

    curl_easy_setopt(curl, CURLOPT_URL,
                     (this->baseUrl + req.getUrl()).c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, HTTP::curlWriteCallback);
    curl_easy_setopt(curl, CURLOPT_HEADERFUNCTION, HTTP::curlHeaderCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &responseBody);
    curl_easy_setopt(curl, CURLOPT_HEADERDATA, &responseHeaders);

    if (req.getMethod() == HTTPRequest::Method::GET)
    {
        curl_easy_setopt(curl, CURLOPT_HTTPGET, 1L);
    }
    else if (req.getMethod() == HTTPRequest::Method::POST)
    {
        curl_easy_setopt(curl, CURLOPT_POST, 1L);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, req.getBody().c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, req.getBody().size());
    }

    struct curl_slist *chunk = nullptr;
    for (const auto &[key, value] : req.getHeaders())
    {
        const auto header = key + ": " + value;
        chunk = curl_slist_append(chunk, header.c_str());
    }
    if (chunk)
    {
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, chunk);
    }

    CURLcode res = curl_easy_perform(this->curl);

    long code = 0;

    if (res == CURLE_OK)
    {
        curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &code);
    }

    return HTTPResponse(code, responseBody, responseHeaders, res);
}

size_t HTTP::curlHeaderCallback(char *buffer, size_t size, size_t nitems,
                                void *userdata)
{
    size_t totalSize = size * nitems;
    std::string headerLine(buffer, totalSize);

    // userdata will be a pointer to your headers map
    auto *headers =
        static_cast<std::unordered_map<std::string, std::string> *>(userdata);

    // Header lines look like "Key: Value\r\n"
    auto pos = headerLine.find(':');
    if (pos != std::string::npos)
    {
        std::string key = headerLine.substr(0, pos);
        std::string value = headerLine.substr(pos + 1);

        // trim spaces and CRLF
        auto trim = [](std::string &s) {
            while (!s.empty() &&
                   (s.back() == '\r' || s.back() == '\n' || isspace(s.back())))
                s.pop_back();
            size_t start = 0;
            while (start < s.size() && isspace(s[start]))
                start++;
            if (start > 0)
                s = s.substr(start);
        };

        trim(key);
        trim(value);

        (*headers)[key] = value;
    }

    return totalSize;
}

size_t HTTP::curlWriteCallback(void *contents, size_t size, size_t nmemb,
                               void *userp)
{
    size_t totalSize = size * nmemb;
    std::string *response = (std::string *)userp;
    response->append((char *)contents, totalSize);
    return totalSize;
}

CURLcode HTTP::sslctx_function(CURL *curl, void *sslctx, void *userptr)
{
    HTTP *self = static_cast<HTTP *>(userptr);
    SSL_CTX *ctx = static_cast<SSL_CTX *>(sslctx);

    if (!self->cert || self->cert->empty())
    {
        return CURLE_SSL_CERTPROBLEM;
    }
    else if (!self->key || self->key->empty())
    {
        return CURLE_SSL_CERTPROBLEM;
    }
    else if (!self->ca || self->ca->empty())
    {
        return CURLE_SSL_CACERT_BADFILE;
    }

    // Load client certificate from memory
    BIO *cert_bio = BIO_new_mem_buf(self->cert->data(), self->cert->size());
    X509 *x509 = PEM_read_bio_X509(cert_bio, NULL, 0, NULL);
    BIO_free(cert_bio);
    if (!x509)
    {
        std::cerr << "[ERROR] Failed to parse certificate from memory."
                  << std::endl;
        return CURLE_SSL_CERTPROBLEM;
    }
    if (SSL_CTX_use_certificate(ctx, x509) != 1)
    {
        std::cerr << "[ERROR] SSL_CTX_use_certificate failed." << std::endl;
        X509_free(x509);
        return CURLE_SSL_CERTPROBLEM;
    }
    X509_free(x509);

    // Load private key from memory
    BIO *key_bio = BIO_new_mem_buf(self->key->data(), self->key->size());
    EVP_PKEY *pkey = PEM_read_bio_PrivateKey(key_bio, NULL, 0, NULL);
    BIO_free(key_bio);
    if (!pkey)
    {
        std::cerr << "[ERROR] Failed to parse private key from memory."
                  << std::endl;
        return CURLE_SSL_CERTPROBLEM;
    }
    if (SSL_CTX_use_PrivateKey(ctx, pkey) != 1)
    {
        std::cerr << "[ERROR] SSL_CTX_use_PrivateKey failed." << std::endl;
        EVP_PKEY_free(pkey);
        return CURLE_SSL_CERTPROBLEM;
    }
    EVP_PKEY_free(pkey);

    // Load CA chain from memory
    BIO *ca_bio = BIO_new_mem_buf(self->ca->data(), self->ca->size());
    X509_STORE *store = SSL_CTX_get_cert_store(ctx);
    if (!store)
    {
        BIO_free(ca_bio);
        std::cerr << "[ERROR] Failed to get X509_STORE from SSL_CTX."
                  << std::endl;
        return CURLE_SSL_CACERT_BADFILE;
    }
    while (true)
    {
        X509 *ca_cert = PEM_read_bio_X509(ca_bio, NULL, 0, NULL);
        if (!ca_cert)
            break;
        if (X509_STORE_add_cert(store, ca_cert) != 1)
        {
            std::cerr << "[ERROR] Failed to add CA cert to store."
                      << std::endl;
            X509_free(ca_cert);
            BIO_free(ca_bio);
            return CURLE_SSL_CACERT_BADFILE;
        }
        X509_free(ca_cert);
    }
    BIO_free(ca_bio);

    return CURLE_OK;
}

HTTP &HTTP::setCert(const std::string &cert)
{
    this->cert = cert;
    return *this;
}

HTTP &HTTP::setKey(const std::string &key)
{
    this->key = key;
    return *this;
}

HTTP &HTTP::setCa(const std::string &ca)
{
    this->ca = ca;
    return *this;
}

HTTP &HTTP::setUseSSLContext(bool enable)
{
    if (enable)
    {
        if (this->cert->empty())
        {
            std::cerr << "[ERROR] Please set the cert before using mTLS"
                      << std::endl;
            return *this;
        }
        else if (this->key->empty())
        {
            std::cerr << "[ERROR] Please set the key before using mTLS"
                      << std::endl;
            return *this;
        }
        else if (this->ca->empty())
        {
            std::cerr << "[ERROR] Please set the ca before using mTLS"
                      << std::endl;
            return *this;
        }

        curl_easy_setopt(curl, CURLOPT_SSL_CTX_FUNCTION,
                         &HTTP::sslctx_function);
        curl_easy_setopt(curl, CURLOPT_SSL_CTX_DATA, this);
    }
    else
    {
        curl_easy_setopt(curl, CURLOPT_SSL_CTX_FUNCTION, nullptr);
        curl_easy_setopt(curl, CURLOPT_SSL_CTX_DATA, nullptr);
    }

    return *this;
}

HTTP &HTTP::setBaseUrl(const std::string &url)
{
    this->baseUrl = url;
    return *this;
}

HTTP &HTTP::setVerbose(bool enable)
{
    if (enable)
    {
        curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);
    }
    else
    {
        curl_easy_setopt(curl, CURLOPT_VERBOSE, 0);
    }

    return *this;
}

HTTP &HTTP::setIgnoreSSL(bool enable)
{
    if (enable)
    {
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, 0L);
    }
    else
    {
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 1L);
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, 1L);
    }

    return *this;
}

HTTP &HTTP::setFollowRedirects(bool enable)
{
    if (enable)
    {
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
    }
    else
    {
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 0L);
    }

    return *this;
}
