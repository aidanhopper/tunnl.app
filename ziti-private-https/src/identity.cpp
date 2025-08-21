#include "identity.hpp"
#include <fstream>
#include <nlohmann/json.hpp>

std::vector<std::string> split(const std::string &s, char delimiter)
{
    std::vector<std::string> tokens;
    size_t start = 0;
    size_t end;

    while ((end = s.find(delimiter, start)) != std::string::npos)
    {
        tokens.push_back(s.substr(start, end - start));
        start = end + 1;
    }
    tokens.push_back(s.substr(start));
    return tokens;
}

Identity::~Identity()
{
    SSL_CTX_free(this->apictx);
}

Identity::Identity(const std::string &identityPath)
{
    json data = json::parse(std::ifstream{identityPath});
    this->getDataFromEnrolledIdentity(data);
    this->init();
}

Identity::Identity(const char *identityPath)
{
    json data = json::parse(std::ifstream{identityPath});
    this->getDataFromEnrolledIdentity(data);
    this->init();
}

void Identity::init()
{
    this->apictx = SSL_CTX_new(TLS_client_method());
    this->loadCerts();

    auto tokens = split(this->controllerUrl, ':');

    auto domain = tokens[1].substr(2);
    auto port = std::stoi(tokens[2]);

}

void Identity::getDataFromEnrolledIdentity(json &data)
{
    this->cert = std::string{data["id"]["cert"]};
    this->ca = std::string{data["id"]["ca"]};
    this->key = std::string{data["id"]["key"]};
    this->controllerUrl = std::string{data["ztAPI"]};
}

bool Identity::loadCerts()
{
    BIO *bio_cert = BIO_new_mem_buf(this->cert.data(), (int)this->cert.size());
    X509 *cert = PEM_read_bio_X509(bio_cert, nullptr, nullptr, nullptr);
    BIO_free(bio_cert);

    BIO *bio_key = BIO_new_mem_buf(this->key.data(), (int)this->key.size());
    EVP_PKEY *key =
        PEM_read_bio_PrivateKey(bio_key, nullptr, nullptr, nullptr);
    BIO_free(bio_key);

    if (!cert || !key)
    {
        return false;
    }

    if (SSL_CTX_use_certificate(apictx, cert) != 1 ||
        SSL_CTX_use_PrivateKey(apictx, key) != 1)
    {
        return false;
    }

    if (!this->ca.empty())
    {
        BIO *bio_ca = BIO_new_mem_buf(this->ca.data(), (int)this->ca.size());
        X509 *ca_cert = PEM_read_bio_X509(bio_ca, nullptr, nullptr, nullptr);
        if (ca_cert)
        {
            X509_STORE *store = SSL_CTX_get_cert_store(apictx);
            X509_STORE_add_cert(store, ca_cert);
            X509_free(ca_cert);
        }
        BIO_free(bio_ca);
    }

    X509_free(cert);
    EVP_PKEY_free(key);

    return true;
}
