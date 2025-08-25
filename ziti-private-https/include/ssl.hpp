#pragma once

#include <openssl/crypto.h>
#include <string>

namespace MySSL
{
void globalInit();
SSL_CTX *create_server_ctx(const std::string &cert_file,
                           const std::string &key_file);
} // namespace MySSL
