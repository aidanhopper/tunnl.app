#include "ziti-client.hpp"
#include "ziti/zitilib.h"
#include <openssl/err.h>
#include <openssl/ssl.h>
#include <unistd.h>

ZitiClient::~ZitiClient()
{
}

ZitiClient::ZitiClient(
    const int fd, const ziti_handle_t &zitiContext, SSL_CTX *sslContext,
    const Service &service, const std::string caller) :
    PollHandle<ZitiClient>(fd),
    service(service),
    caller(caller),
    zitiContext(zitiContext),
    sslContext(sslContext)
{
    serverFd = Ziti_socket(SOCK_STREAM);

    int error = Ziti_connect(
        getServerFd(),
        getZitiContext(),
        getService().getPrivateHTTPSV1().value().getTargetService().c_str(),
        NULL);

    clientSSL = SSL_new(sslContext);

    SSL_set_fd(clientSSL, getClientFd());

    // For server-side TLS termination
    if (SSL_accept(clientSSL) <= 0)
    {
        ERR_print_errors_fp(stderr);
        stop();
    }
}

void ZitiClient::onPollEvent(int status, int events)
{
    if (!(events & UV_READABLE))
    {
        return;
    }

    char buf[1024];
    int n;

    n = SSL_read(clientSSL, buf, sizeof(buf));
    if (n <= 0)
    {
        int err = SSL_get_error(clientSSL, n);
        switch (err)
        {
        case SSL_ERROR_WANT_READ:
            // will need to write to buffer inside class if this is the case
            return;

        case SSL_ERROR_WANT_WRITE:
            // SSL wants to write some data (handshake, renegotiation, or
            // record buffering) Wait for the socket to be writable
            // (UV_WRITABLE event) and retry.
            return;
        default:
            // Other errors: SSL_ERROR_ZERO_RETURN (connection closed),
            // SSL_ERROR_SYSCALL, SSL_ERROR_SSL
            stop();
            return;
        }
    }

    std::cout << buf << std::endl;

    write(getServerFd(), buf, n);

    n = read(getServerFd(), buf, sizeof(buf));
    if (n <= 0)
    {
        stop();
        return;
    }

    n = SSL_write(clientSSL, buf, n);
}

void ZitiClient::onClose()
{
    close(getClientFd());
    close(getServerFd());

    if (clientSSL)
    {
        SSL_shutdown(clientSSL);
        SSL_free(clientSSL);
    }
}

const int ZitiClient::getClientFd() const
{
    return getFd();
}

const int ZitiClient::getServerFd() const
{
    return serverFd;
}

const int ZitiClient::getZitiContext() const
{
    return zitiContext;
}

const SSL_CTX *ZitiClient::getSSLContext() const
{
    return sslContext;
}

const Service &ZitiClient::getService() const
{
    return service;
}
