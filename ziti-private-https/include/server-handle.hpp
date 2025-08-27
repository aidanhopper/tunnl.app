#pragma once

#include "poll-handle.hpp"
#include "ziti-server-state.hpp"

class ServerHandle : public PollHandle<ServerHandle>
{
  private:
    ZitiServerState *state;
    std::vector<char> buf;

  public:
    ~ServerHandle();
    ServerHandle(ZitiServerState *state);
    void onPollEvent(int status, int events);
    void handleReadEvent();
    void handleWriteEvent();
};
