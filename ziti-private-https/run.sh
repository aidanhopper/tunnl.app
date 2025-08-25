#!/usr/bin/env sh
set -e  # exit on first error

# Configure with Debug build type so ASan is enabled
cmake -B build -S . -DCMAKE_BUILD_TYPE=Debug

# Build
cmake --build build

export MallocNanoZone=0
export ASAN_OPTIONS=detect_leaks=0

# Run
./build/my_secure_app
