#include "ziti-server.hpp"
#include "ssl.hpp"
#include "ziti-client.hpp"
#include "ziti/zitilib.h"
#include <openssl/ssl.h>

ZitiServer::~ZitiServer()
{
    SSL_CTX_free(this->sslContext);
}

ZitiServer::ZitiServer(const ziti_handle_t &ztx, const Service &service) :
    PollHandle<ZitiServer>(Ziti_socket(SOCK_STREAM)),
    service(service),
    zitiContext(ztx)
{
    int error = Ziti_bind(
        this->getFd(),
        this->getZitiContext(),
        this->getService().getName().c_str(),
        NULL);

    Ziti_listen(this->getFd(), 100);

    this->sslContext =
        MySSL::create_server_ctx("certs/server.crt", "certs/server.key");
}

void ZitiServer::onPollEvent(int status, int events)
{
    ziti_socket_t serverfd = this->getFd();

    char caller[128];

    ziti_socket_t clientfd = Ziti_accept(serverfd, caller, sizeof(caller));

    if (clientfd <= 0)
        return;

    std::cout << caller << std::endl;

    // should make this a smart pointer and put in
    // vector
    auto client = new ZitiClient{ clientfd,
                                  this->getZitiContext(),
                                  this->sslContext,
                                  this->getService(),
                                  std::string{ caller } };

    client->start();
}

void ZitiServer::onClose()
{
    Ziti_close(this->getFd());
}

const ziti_handle_t ZitiServer::getZitiContext() const
{
    return this->zitiContext;
}

const Service &ZitiServer::getService() const
{
    return this->service;
}

const SSL_CTX *ZitiServer::getSSLContext() const
{
    return this->sslContext;
}
