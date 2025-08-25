#pragma once

#include "poll-handle.hpp"
#include "service.hpp"
#include "ziti/zitilib.h"
#include <openssl/crypto.h>

class ZitiServer : public PollHandle<ZitiServer>
{
  private:
    const Service &service;
    const ziti_handle_t &zitiContext;
    SSL_CTX *sslContext; 

  public:
    ~ZitiServer();
    ZitiServer(const ziti_handle_t &ztx, const Service &service);
    void onPollEvent(int status, int events);
    void onClose();

    const SSL_CTX *getSSLContext() const;
    const ziti_handle_t getZitiContext() const;
    const Service& getService() const;
};
