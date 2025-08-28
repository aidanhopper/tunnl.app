#pragma once

#include <string>
#include <vector>

std::string getHTTPStatusText(long status);
std::vector<std::string> split(
    const std::string &s, const std::string &delimiter,
    const int &maxTokens = INT_MAX);
std::vector<std::string> split(
    const std::string_view &s, const std::string &delimiter,
    const int &maxTokens = INT_MAX);
