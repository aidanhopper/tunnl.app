#pragma once

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
        SSL_CTX *sslContext, const int clientFd, const int serverFd);

    WriteQueue &getClientWriteQueue();
    WriteQueue &getServerWriteQueue();

    const int &getServerFd() const;
    const int &getClientFd() const;

    SSL *&getClientSSL();

    const TLS_STATE &getTLSState() const;
    void setTLSState(ZitiServerState::TLS_STATE state);
    void shutdown();

  private:
    WriteQueue clientWriteQueue;
    WriteQueue serverWriteQueue;

    std::unique_ptr<ClientHandle> client;
    std::unique_ptr<ServerHandle> server;

    TLS_STATE tlsState = HANDSHAKE;

    const int serverFd;
    const int clientFd;

    SSL *clientSSL;
};
