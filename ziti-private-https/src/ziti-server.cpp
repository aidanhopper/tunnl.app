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
    close(getFd());
    SSL_CTX_free(sslContext);
}

ZitiServer::ZitiServer(const ziti_handle_t &ztx, const Service &service) :
    PollHandle<ZitiServer>(Ziti_socket(SOCK_STREAM), UV_READABLE),
    service(service),
    zitiContext(ztx)
{
    fcntl(getFd(), F_SETFL, O_NONBLOCK);
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

    Ziti_listen(getFd(), 1000);

    sslContext =
        MySSL::create_server_ctx("certs/server.crt", "certs/server.key");
}

// TODO: Instead of creating a new connection to the backend everytime a new
// http request comes in maintain a persitent connection to the backend and
// route every http request through it. Then when a websocket consumes the fd
// map the clientFd to the serverFd to maintain the conneciton. This will
// prevent opening and closing the connection so much, but then I will need
// specialized handling of the the Connection: Upgrade header. Should start
// by creating a connection manager within the Ziti Server that contains
// a backend fd. Ziti Server can ask the connection manager for the backend
// socket, and it will create a new one if it's been consumed. The client
// can then ask Ziti State to consume the backend socket for websocket
// requests.

void ZitiServer::onPollEvent(int status, int events)
{
    ziti_socket_t proxyFd = getFd();
    auto bindServiceName = getService().getName();

    ziti_socket_t clientFd = Ziti_accept(proxyFd, caller, sizeof(caller));
    fcntl(clientFd, F_SETFL, O_NONBLOCK);

    if (clientFd < 0)
    {
        if (errno == EAGAIN || errno == EWOULDBLOCK || errno == 9)
        {
            return;
        }
        else
        {
            std::cerr << "Error in Ziti Server for " << getService().getName()
                      << ": errno=" << errno << " (" << ziti_errorstr(clientFd)
                      << ")\n";
            return;
        }
    }

    ziti_socket_t serverFd = Ziti_socket(SOCK_STREAM);
    fcntl(serverFd, F_SETFL, O_NONBLOCK);

    connectBackend(clientFd, serverFd);
}

void ZitiServer::onClose()
{
}

void ZitiServer::connectBackend(int clientFd, int serverFd)
{
    struct ConnectBackendData
    {
        const Service &service;
        const int clientFd;
        const int serverFd;
        SSL_CTX *sslContext;
        const ziti_handle_t &zitiContext;
        long rc;
    };

    auto data = new ConnectBackendData{
        .service = getService(),
        .clientFd = clientFd,
        .serverFd = serverFd,
        .sslContext = sslContext,
        .zitiContext = zitiContext,
    };

    uv_work_t *work = new uv_work_t;
    work->data = data;

    uv_queue_work(
        uv_default_loop(),
        work,
        [](uv_work_t *req) {
            auto *data = static_cast<ConnectBackendData *>(req->data);

            auto targetServiceName =
                data->service.getPrivateHTTPSV1().value().getTargetService();

            data->rc = Ziti_connect(
                data->serverFd,
                data->zitiContext,
                targetServiceName.c_str(),
                NULL);
        },
        [](uv_work_t *req, int status) {
            auto *data = static_cast<ConnectBackendData *>(req->data);

            if (data->rc != 0)
            {
                auto targetServiceName = data->service.getPrivateHTTPSV1()
                                             .value()
                                             .getTargetService();
                close(data->clientFd);
                close(data->serverFd);
                std::cerr << "Could not connect to " + targetServiceName
                          << std::endl;
            }
            else
            {
                new ZitiServerState{ data->service,
                                     data->sslContext,
                                     data->clientFd,
                                     data->serverFd };
            }

            delete data;
            req->data = nullptr;
            delete req;
        });
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
