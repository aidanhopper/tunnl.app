#pragma once

#include <stdexcept>
#include <uv.h>

template <typename Derived> class UVHandle
{
  public:
    // Get the derived class instance
    Derived &derived()
    {
        return static_cast<Derived &>(*this);
    }
    const Derived &derived() const
    {
        return static_cast<const Derived &>(*this);
    }

  protected:
    // Helper to attach this instance to any UV handle
    template <typename UVHandleType> void attachToHandle(UVHandleType *handle)
    {
        handle->data = this;
    }

    // Helper to get the derived instance from any UV handle
    template <typename UVHandleType>
    static Derived *fromHandle(UVHandleType *handle)
    {
        return &static_cast<UVHandle *>(handle->data)->derived();
    }

    static void pollCallback(uv_poll_t *handle, int status, int events)
    {
        auto *self = fromHandle(handle);
        self->onPollEvent(status, events);
    }

    static void closeCallback(uv_handle_t *handle)
    {
        auto *self = fromHandle(handle);
        self->onClose();
    }

    void onPollEvent(int status, int events)
    {
        throw new std::runtime_error("onPollEvent must be implemented.");
    }

    void onClose()
    {
    }
};
