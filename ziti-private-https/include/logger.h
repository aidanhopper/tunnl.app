#pragma once

#include <string>

class Logger
{

  private:
  public:
    Logger();
    ~Logger();
    void info(std::string &msg);
    void error(std::string &msg);
};
