#pragma once

#include <iostream>

class App
{
  private:
    App();
    ~App();
    App(const App &) = delete;
    App &operator=(const App &) = delete;

  public:
    static App &getInstance();
    void run();
};
