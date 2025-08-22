#include "query.hpp"
#include <iostream>
#include <openssl/ssl.h>

Query::~Query()
{
    curl_easy_cleanup(curl);
}

Query::Query()
{
    curl_global_init(CURL_GLOBAL_DEFAULT);
    this->curl = curl_easy_init();
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, Query::curlWriteCallback);
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
}

std::string Query::get(const std::string &url)
{
    std::string response;
    curl_easy_setopt(curl, CURLOPT_HTTPGET, 1L);
    curl_easy_setopt(curl, CURLOPT_URL, (this->url + url).c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
    CURLcode res = curl_easy_perform(curl);
    return response;
}

std::string Query::post(const std::string &url)
{
    std::string response;
    curl_easy_setopt(curl, CURLOPT_POST, 1L);
    curl_easy_setopt(curl, CURLOPT_URL, (this->url + url).c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, 0);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, 0);
    CURLcode res = curl_easy_perform(curl);
    return response;
}

size_t Query::curlWriteCallback(void *contents, size_t size, size_t nmemb,
                                void *userp)
{
    size_t totalSize = size * nmemb;
    std::string *response = (std::string *)userp;
    response->append((char *)contents, totalSize);
    return totalSize;
}

CURLcode Query::sslctx_function(CURL *curl, void *sslctx, void *userptr)
{
    Query *self = static_cast<Query *>(userptr);
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

void Query::setCert(const std::string &cert)
{
    this->cert = cert;
}

void Query::setKey(const std::string &key)
{
    this->key = key;
}

void Query::setCa(const std::string &ca)
{
    this->ca = ca;
}

void Query::setUseSSLContext(bool enable)
{
    if (enable)
    {
        if (this->cert->empty())
        {
            std::cerr << "[ERROR] Please set the cert before using mTLS"
                      << std::endl;
            return;
        }
        else if (this->key->empty())
        {
            std::cerr << "[ERROR] Please set the key before using mTLS"
                      << std::endl;
            return;
        }
        else if (this->ca->empty())
        {
            std::cerr << "[ERROR] Please set the ca before using mTLS"
                      << std::endl;
            return;
        }

        curl_easy_setopt(curl, CURLOPT_SSL_CTX_FUNCTION,
                         &Query::sslctx_function);
        curl_easy_setopt(curl, CURLOPT_SSL_CTX_DATA, this);
    }
    else
    {
        curl_easy_setopt(curl, CURLOPT_SSL_CTX_FUNCTION, nullptr);
        curl_easy_setopt(curl, CURLOPT_SSL_CTX_DATA, nullptr);
    }
}

void Query::setUrl(const std::string &url)
{
    this->url = url;
}

void Query::setVerbose(bool enable)
{
    if (enable)
    {
        curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);
    }
    else
    {
        curl_easy_setopt(curl, CURLOPT_VERBOSE, 0);
    }
}
