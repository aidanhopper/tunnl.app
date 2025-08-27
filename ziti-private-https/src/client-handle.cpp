#include "client-handle.hpp"
#include <openssl/ssl.h>
#include <unistd.h>

ClientHandle::~ClientHandle()
{
    stop();
}

ClientHandle::ClientHandle(ZitiServerState *state) :
    PollHandle<ClientHandle>(state->getClientFd(), UV_READABLE | UV_WRITABLE),
    state(state)
{
    buf = std::vector<char>(1024);
}

void ClientHandle::onPollEvent(int status, int events)
{
    switch (state->getTLSState())
    {
    case ZitiServerState::TLS_STATE::HANDSHAKE: {
        handleTLSConnect();
        return;
    }
    case ZitiServerState::TLS_STATE::CONNECTED: {
        if (events & UV_READABLE)
        {
            handleReadEvent();
        }
        if (events & UV_WRITABLE)
        {
            handleWriteEvent();
        }
        return;
    }
    }
}

void ClientHandle::handleReadEvent()
{
    int n = SSL_read(state->getClientSSL(), buf.data(), buf.size());

    if (n == 0)
    {
        state->shutdown();
        return;
    }
    else if (n < 0)
    {
        int err = SSL_get_error(state->getClientSSL(), n);
        switch (err)
        {
        case SSL_ERROR_WANT_READ:
        case SSL_ERROR_WANT_WRITE:
            return;
        default:
            state->shutdown();
            return;
        }
    }
    state->getServerWriteQueue().enqueue(buf.data(), n);
}

void ClientHandle::handleWriteEvent()
{
    auto w = state->getClientWriteQueue().frontBuffer();

    if (w.empty())
    {
        return;
    }

    int n = SSL_write(state->getClientSSL(), w.data(), w.size());

    if (n == 0)
    {
        state->shutdown();
        return;
    }
    else if (n < 0)
    {
        int err = SSL_get_error(state->getClientSSL(), n);
        switch (err)
        {
        case SSL_ERROR_WANT_READ:
        case SSL_ERROR_WANT_WRITE:
            return;
        default:
            state->shutdown();
            return;
        }
    }

    state->getServerWriteQueue().commit(n);
}

void ClientHandle::handleTLSConnect()
{
    int rc = SSL_accept(state->getClientSSL());

    if (rc <= 0)
    {
        int err = SSL_get_error(state->getClientSSL(), rc);
        if (err == SSL_ERROR_WANT_READ)
        {
            return;
        }
        else if (err == SSL_ERROR_WANT_WRITE)
        {
            return;
        }
        else
        {
            state->shutdown();
            return;
        }
    }

    state->setTLSState(ZitiServerState::TLS_STATE::CONNECTED);
}
