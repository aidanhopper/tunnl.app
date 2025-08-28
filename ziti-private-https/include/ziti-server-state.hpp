#pragma once

#include "service.hpp"
#include "write-queue.hpp"
#include <openssl/crypto.h>

class ClientHandle;
class ServerHandle;

class ZitiServerState
{
  public:
    enum TLS_STATE
    {
        HANDSHAKE,
        CONNECTED,
        // ERROR
    };

    ~ZitiServerState();
    ZitiServerState(
        const Service &service, SSL_CTX *sslContext, const int clientFd,
        const int serverFd);

    WriteQueue &getClientWriteQueue();
    WriteQueue &getServerWriteQueue();

    const int &getServerFd() const;
    const int &getClientFd() const;

    const Service &getService() const;

    SSL *&getClientSSL();

    const TLS_STATE &getTLSState() const;
    void setTLSState(ZitiServerState::TLS_STATE state);
    void shutdown();

    void toggleHeadersParsed();
    const bool &headersParsed() const;

  private:
    WriteQueue clientWriteQueue;
    WriteQueue serverWriteQueue;

    std::unique_ptr<ClientHandle> client;
    std::unique_ptr<ServerHandle> server;

    TLS_STATE tlsState = HANDSHAKE;

    const int serverFd;
    const int clientFd;

    const Service &service;

    SSL *clientSSL;

    bool _headersParsed = false;
};
