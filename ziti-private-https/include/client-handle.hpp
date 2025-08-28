#pragma once

#include "poll-handle.hpp"
#include "ziti-server-state.hpp"
#include <openssl/crypto.h>
#include <vector>

class ClientHandle : public PollHandle<ClientHandle>
{
  private:
    std::vector<char> buf;
    std::string headersBuf;
    ZitiServerState *state;

  public:
    ~ClientHandle();
    ClientHandle(ZitiServerState *state);
    void onPollEvent(int status, int events);
    void handleReadEvent();
    void handleWriteEvent();
    void handleTLSConnect();
    bool tryParseHeaders(int n);
};
