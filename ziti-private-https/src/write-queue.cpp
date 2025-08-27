#include "write-queue.hpp"

WriteQueue::WriteQueue() = default;

void WriteQueue::enqueue(const char *data, size_t len)
{
    buffers.emplace_back(data, data + len);
}

std::span<const char> WriteQueue::frontBuffer() const
{
    if (buffers.empty())
        return {};
    const auto &buf = buffers.front();
    return { buf.data() + offset, buf.size() - offset };
}

void WriteQueue::commit(size_t n)
{
    if (n <= 0)
    {
        return;
    }

    if (buffers.empty())
    {
        return;
    }

    offset += n;

    while (!buffers.empty() && offset >= buffers.front().size())
    {
        offset -= buffers.front().size();
        buffers.pop_front();
    }
}

bool WriteQueue::empty() const
{
    return buffers.empty();
}
