#!/usr/bin/env sh
cmake -B build -S .
cmake --build build
./build/my_secure_app
