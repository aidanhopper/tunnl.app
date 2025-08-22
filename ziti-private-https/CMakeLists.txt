cmake_minimum_required(VERSION 3.20)  # Require a modern CMake
project(MySecureApp LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 23)            # Use C++17 (or 20 if you prefer)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Export compile_commands.json for linters/autocomplete
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include(FetchContent)
include_directories(include)

FetchContent_Declare(ziti-sdk-c
    GIT_REPOSITORY https://github.com/openziti/ziti-sdk-c.git
    GIT_TAG 1.8.1 # Pick a release tag; replace with latest from GitHub
)

FetchContent_MakeAvailable(ziti-sdk-c)

add_executable(my_secure_app
    src/main.cpp
    src/app.cpp
    src/identity.cpp
    src/query.cpp
)

target_include_directories(my_secure_app
    PRIVATE
        ${CMAKE_SOURCE_DIR}/include
)

target_link_libraries(my_secure_app PRIVATE ziti)

find_package(CURL REQUIRED)
target_link_libraries(my_secure_app PRIVATE CURL::libcurl)
