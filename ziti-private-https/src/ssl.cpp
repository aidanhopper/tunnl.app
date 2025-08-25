#include "ssl.hpp"
#include <openssl/err.h>
#include <openssl/ssl.h>

namespace MySSL
{
void globalInit()
{
    SSL_library_init();
    SSL_load_error_strings();
    OpenSSL_add_all_algorithms();
}

SSL_CTX *create_server_ctx(const std::string &cert_file,
                           const std::string &key_file)
{
    // Create a TLS server method context
    const SSL_METHOD *method = TLS_server_method();
    SSL_CTX *ctx = SSL_CTX_new(method);
    if (!ctx)
    {
        ERR_print_errors_fp(stderr);
        throw std::runtime_error("Unable to create SSL_CTX");
    }

    // Load server certificate
    if (SSL_CTX_use_certificate_file(ctx, cert_file.c_str(),
                                     SSL_FILETYPE_PEM) <= 0)
    {
        ERR_print_errors_fp(stderr);
        throw std::runtime_error("Unable to load certificate");
    }

    // Load private key
    if (SSL_CTX_use_PrivateKey_file(ctx, key_file.c_str(), SSL_FILETYPE_PEM) <=
        0)
    {
        ERR_print_errors_fp(stderr);
        throw std::runtime_error("Unable to load private key");
    }

    // Verify private key matches cert
    if (!SSL_CTX_check_private_key(ctx))
    {
        throw std::runtime_error(
            "Private key does not match the certificate public key");
    }

    return ctx;
}
} // namespace MySSL
