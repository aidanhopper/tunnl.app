#include "server-handle.hpp"
#include <unistd.h>

ServerHandle::~ServerHandle()
{
    stop();
}

ServerHandle::ServerHandle(ZitiServerState *state) :
    PollHandle<ServerHandle>(state->getServerFd(), UV_READABLE | UV_WRITABLE),
    state(state)
{
    buf = std::vector<char>(1024);
}

void ServerHandle::onPollEvent(int status, int events)
{
    if (events & UV_READABLE)
    {
        handleReadEvent();
    }
    if (events & UV_WRITABLE)
    {
        handleWriteEvent();
    }
}

void ServerHandle::handleReadEvent()
{
    while (true)
    {
        int n = read(state->getServerFd(), buf.data(), buf.size());

        if (n == 0)
        {
            state->shutdown();
            return;
        }
        else if (n < 0)
        {
            return;
        }

        state->getClientWriteQueue().enqueue(buf.data(), n);
    }
}

void ServerHandle::handleWriteEvent()
{
    auto w = state->getServerWriteQueue().frontBuffer();

    if (w.empty())
    {
        return;
    }

    int n = send(state->getServerFd(), w.data(), w.size(), MSG_NOSIGNAL);

    if (n == -1)
    {
        state->shutdown();
        return;
    }

    state->getServerWriteQueue().commit(n);
}
