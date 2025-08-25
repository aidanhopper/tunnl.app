#pragma once

#include "uv-handle.hpp"
#include <iostream>
#include <uv.h>

template <typename Derived> class PollHandle : public UVHandle<Derived>
{
  private:
    int fd;
    uv_poll_t pollHandle;
    uv_loop_t *loop;
    bool isPolling;

  public:
    PollHandle(int fd, uv_loop_t *_loop = uv_default_loop())
        : fd(fd), isPolling(false)
    {
        loop = _loop;
    }

    ~PollHandle()
    {
        stop(); // Clean shutdown
    }

    bool start()
    {
        if (isPolling)
            return false; // Already started

        int result = uv_poll_init(loop, &pollHandle, fd);
        if (result != 0)
        {
            std::cerr << "Poll init failed: " << uv_strerror(result)
                      << std::endl;
            return false;
        }

        this->attachToHandle(&pollHandle);
        result = uv_poll_start(&pollHandle, UV_READABLE,
                               UVHandle<Derived>::pollCallback);

        if (result == 0)
        {
            isPolling = true;
        }
        return result == 0;
    }

    void stop()
    {
        if (isPolling)
        {
            uv_poll_stop(&pollHandle);
            uv_close((uv_handle_t *)&pollHandle,
                     UVHandle<Derived>::closeCallback);
            isPolling = false;
        }
    }

  protected:
    const int &getFd() const
    {
        return this->fd;
    }

    const uv_loop_t *getLoop() const
    {
        return this->loop;
    }
};
