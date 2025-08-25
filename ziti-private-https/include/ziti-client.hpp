#pragma once

#include "poll-handle.hpp"
#include "service.hpp"
#include "ziti/zitilib.h"
#include <openssl/crypto.h>

class ZitiClient : public PollHandle<ZitiClient>
{
  private:
    const Service &service;
    const std::string caller;
    const ziti_handle_t &zitiContext;
    SSL_CTX *sslContext;
    SSL *clientSSL;
    int serverFd;

    const Service &getService() const;
    const SSL_CTX *getSSLContext() const;
    const int getZitiContext() const;
    const int getClientFd() const;
    const int getServerFd() const;
    void openServerSocket();

  public:
    ~ZitiClient();
    ZitiClient(
        const int fd, const ziti_handle_t &zitiContext, SSL_CTX *sslContext,
        const Service &service, const std::string caller);
    void onPollEvent(int status, int events);
    void onClose();
};
