#include "app.h"

int main(int argc, char **argv)
{
    App &app = App::getInstance();
    app.run();
}
