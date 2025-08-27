#pragma once

#include <cstddef>
#include <deque>
#include <span>
#include <vector>

class WriteQueue
{
    std::deque<std::vector<char>> buffers;
    size_t offset = 0;

  public:
    WriteQueue();

    void enqueue(const char *data, size_t len);
    std::span<const char> frontBuffer() const;
    void commit(size_t n);
    bool empty() const;
};
