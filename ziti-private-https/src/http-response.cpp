#include "http-response.hpp"

HTTPResponse::HTTPResponse(long &status, std::string &body, CURLcode c)
{
    this->status = status;
    this->body = body;

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
