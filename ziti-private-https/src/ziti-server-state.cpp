#include "ziti-server-state.hpp"
#include "client-handle.hpp"
#include "server-handle.hpp"
#include "ziti/zitilib.h"
#include <openssl/ssl.h>
#include <unistd.h>

ZitiServerState::~ZitiServerState()
{
    uv_timer_stop(&timer);

    if (clientSSL)
    {
        int rc = SSL_shutdown(clientSSL);
        if (rc == 0)
        {
            SSL_shutdown(clientSSL);
        }
        SSL_free(clientSSL);
        clientSSL = nullptr;
    }

    close(serverFd);
    close(clientFd);
}

ZitiServerState::ZitiServerState(
    const Service &service, SSL_CTX *sslContext, const int clientFd,
    const int serverFd) :
    clientFd(clientFd),
    serverFd(serverFd),
    service(service)
{
    clientSSL = SSL_new(sslContext);
    SSL_set_fd(clientSSL, clientFd);

    client = std::make_unique<ClientHandle>(this);
    server = std::make_unique<ServerHandle>(this);

    uv_timer_init(uv_default_loop(), &timer);
    timer.data = this;

    client->start();
    server->start();

    kick();
}

void ZitiServerState::kick()
{
    uv_timer_stop(&timer);
    uv_timer_start(
        &timer,
        [](uv_timer_t *handle) {
            ZitiServerState *state =
                static_cast<ZitiServerState *>(handle->data);
            std::cerr << "Idle timeout, closing connection\n";
            state->shutdown();
            uv_timer_stop(handle);
        },
        60000, // Timeout in ms
        0      // 0 = single-shot
    );
}

WriteQueue &ZitiServerState::getServerWriteQueue()
{
    return serverWriteQueue;
}

WriteQueue &ZitiServerState::getClientWriteQueue()
{
    return clientWriteQueue;
}

const int &ZitiServerState::getServerFd() const
{
    return serverFd;
}

const int &ZitiServerState::getClientFd() const
{
    return clientFd;
}

SSL *&ZitiServerState::getClientSSL()
{
    return clientSSL;
}

const ZitiServerState::TLS_STATE &ZitiServerState::getTLSState() const
{
    return tlsState;
}

void ZitiServerState::setTLSState(ZitiServerState::TLS_STATE state)
{
    tlsState = state;
}

void ZitiServerState::shutdown()
{
    delete this;
}

const bool &ZitiServerState::headersParsed() const
{
    return _headersParsed;
}

void ZitiServerState::toggleHeadersParsed()
{
    _headersParsed = true;
}

const Service &ZitiServerState::getService() const
{
    return service;
}
