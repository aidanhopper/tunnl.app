#include "utils.hpp"

std::string getHTTPStatusText(long status)
{
    // If you want a human-readable message:
    switch (status)
    {
    case 200:
        return std::string{"OK"};
    case 201:
        return std::string{"Created"};
    case 204:
        return std::string{"No Content"};

    // Redirection
    case 301:
        return std::string{"Moved Permanently"};
    case 302:
        return std::string{"Found"};
    case 303:
        return std::string{"See Other"};
    case 304:
        return std::string{"Not Modified"};
    case 307:
        return std::string{"Temporary Redirect"};
    case 308:
        return std::string{"Permanent Redirect"};

    // Client errors
    case 400:
        return std::string{"Bad Request"};
    case 401:
        return std::string{"Unauthorized"};
    case 403:
        return std::string{"Forbidden"};
    case 404:
        return std::string{"Not Found"};
    case 429:
        return std::string{"Too Many Requests"};

    // Server errors
    case 500:
        return std::string{"Internal Server Error"};
    case 502:
        return std::string{"Bad Gateway"};
    case 503:
        return std::string{"Service Unavailable"};
    case 504:
        return std::string{"Gateway Timeout"};

    default:
        return std::string{"Unknown"};
    }
}
