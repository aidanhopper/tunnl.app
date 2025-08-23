#include "http-response.hpp"
#include "utils.hpp"
#include <iostream>

HTTPResponse::HTTPResponse(
    long &status, std::string &body,
    std::unordered_map<std::string, std::string> headers, CURLcode c)
{
    this->status = status;
    this->body = body;
    this->headers = headers;

    if (c != CURLE_OK)
    {
        this->curlError = curl_easy_strerror(c);
    }

    this->curlCode = c;
}

const long &HTTPResponse::getStatus() const
{
    return this->status;
}

const std::string &HTTPResponse::getBody() const
{
    return this->body;
}

const bool HTTPResponse::transportOk() const
{
    return this->curlCode == CURLE_OK;
}

const std::string &HTTPResponse::getTransportError() const
{
    return this->curlError;
}

const bool HTTPResponse::ok() const
{
    return curlCode == CURLE_OK && this->status >= 200 && this->status < 300;
}

const std::unordered_map<std::string, std::string> &HTTPResponse::getHeaders()
    const
{
    return this->headers;
}

std::ostream &operator<<(std::ostream &os, const HTTPResponse &res)
{
    os << "HTTP/1.1 " << res.getStatus() << " "
       << getHTTPStatusText(res.getStatus());

    // Print headers
    for (const auto &[key, value] : res.getHeaders())
    {
        os << "\n";
        os << key << ": " << value;
    }

    // Print body if present
    if (!res.getBody().empty())
    {
        os << "\n" << res.getBody();
    }

    return os;
}
