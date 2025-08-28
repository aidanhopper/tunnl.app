#include "ziti-server.hpp"
#include "client-handle.hpp"
#include "server-handle.hpp"
#include "ssl.hpp"
#include "ziti-server-state.hpp"
#include "ziti/zitilib.h"
#include <openssl/ssl.h>
#include <unistd.h>

ZitiServer::~ZitiServer()
{
    SSL_CTX_free(sslContext);
}

ZitiServer::ZitiServer(const ziti_handle_t &ztx, const Service &service) :
    PollHandle<ZitiServer>(Ziti_socket(SOCK_STREAM), UV_READABLE),
    service(service),
    zitiContext(ztx)
{
    int error = Ziti_bind(
        getFd(),
        getZitiContext(),
        getService().getName().c_str(),
        NULL);

    if (error != 0)
    {
        throw std::runtime_error(
            "Could not bind to " + getService().getName());
    }

    Ziti_listen(getFd(), 100);
    fcntl(getFd(), F_SETFL, O_NONBLOCK);

    sslContext =
        MySSL::create_server_ctx("certs/server.crt", "certs/server.key");
}

void ZitiServer::onPollEvent(int status, int events)
{
    ziti_socket_t proxyFd = getFd();

    char caller[128];

    ziti_socket_t clientFd = Ziti_accept(proxyFd, caller, sizeof(caller));
    if (clientFd < 0)
    {
        if (errno == EAGAIN || errno == EWOULDBLOCK)
        {
            return;
        }
        else
        {
            std::cerr << "An error occured on in the Ziti Server for " +
                             getService().getName()
                      << std::endl;
            return;
        }
    }

    fcntl(clientFd, F_SETFL, O_NONBLOCK);

    std::cout << "OPENING ZITI CONNECTION" << std::endl;
    ziti_socket_t serverFd = Ziti_socket(SOCK_STREAM);
    fcntl(serverFd, F_SETFL, O_NONBLOCK);
    long rc = Ziti_connect(
        serverFd,
        zitiContext,
        (getService().getPrivateHTTPSV1().value().getTargetService()).c_str(),
        NULL);
    fcntl(serverFd, F_SETFL, O_NONBLOCK);
    if (rc != 0)
    {
        close(clientFd); // should send http code 500 or something when server
                         // isn't available
        std::cerr
            << "Could not connect to " +
                   getService().getPrivateHTTPSV1().value().getTargetService()
            << std::endl;
    }
    std::cout << "DONE ZITI CONNECTION" << std::endl;

    // will clean itself up when the connection is done
    new ZitiServerState{ service, sslContext, clientFd, serverFd };
}

void ZitiServer::onClose()
{
    Ziti_close(getFd());
}

const ziti_handle_t ZitiServer::getZitiContext() const
{
    return zitiContext;
}

const Service &ZitiServer::getService() const
{
    return service;
}

const SSL_CTX *ZitiServer::getSSLContext() const
{
    return sslContext;
}
