#include "client-handle.hpp"
#include "utils.hpp"
#include <openssl/ssl.h>
#include <unistd.h>
#include <unordered_map>

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
    while (true)
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

        if (!state->headersParsed())
        {
            if (tryParseHeaders(n))
            {
                state->toggleHeadersParsed();
            }
        }
        else
        {
            state->getServerWriteQueue().enqueue(buf.data(), n);
        }
    }
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

    state->getClientWriteQueue().commit(n);
}

void ClientHandle::handleTLSConnect()
{
    int rc = SSL_accept(state->getClientSSL());

    if (rc <= 0)
    {
        int err = SSL_get_error(state->getClientSSL(), rc);
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

    state->setTLSState(ZitiServerState::TLS_STATE::CONNECTED);
}

bool ClientHandle::tryParseHeaders(int n)
{
    headersBuf += std::string{ buf.begin(), buf.begin() + n };

    int pos = headersBuf.find("\r\n\r\n");

    if (pos == std::string::npos)
    {
        return false;
    }

    std::unordered_map<std::string, std::string> headerMap;

    std::string_view unparsedHeaders{ headersBuf.begin(),
                                      headersBuf.begin() + pos + 4 };

    std::string_view body{ headersBuf.begin() + pos + 4, headersBuf.end() };

    auto lines = split(unparsedHeaders, "\r\n");

    for (const auto &line : lines)
    {
        if (line == "")
        {
            break;
        }

        auto header = split(line, ": ");

        if (header.size() == 2)
        {
            headerMap[header[0]] = header[1];
        }
    }

    // headers are parsed and ready to be appended to and altered

    headerMap["X-Forwarded-Host"] =
        state->getService().getInterceptV1().value().getAddresses()[0];

    headerMap["X-Forwarded-Proto"] = "https";

    // reconstruct headers
    std::string headers{ lines[0] + "\r\n" };

    for (auto &[k, v] : headerMap)
    {
        headers += std::string{ k + ": " + v + "\r\n" };
    }

    std::cout << headers << std::endl;

    headers += "\r\n";

    state->getServerWriteQueue().enqueue(headers.data(), headers.size());
    state->getServerWriteQueue().enqueue(body.data(), body.size());

    // headersBuf = "";
    // headersBuf.shrink_to_fit();

    return true;
}
