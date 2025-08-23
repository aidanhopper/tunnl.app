#include "http-request.hpp"

HTTPRequest &HTTPRequest::setMethod(const HTTPRequest::Method &method)
{
    this->method = method;
    return *this;
}

HTTPRequest &HTTPRequest::get()
{
    return this->setMethod(HTTPRequest::Method::GET);
}

HTTPRequest &HTTPRequest::post()
{
    return this->setMethod(HTTPRequest::Method::POST);
}

HTTPRequest &HTTPRequest::setBody(const std::string &body)
{
    this->body = body;
    return *this;
}

HTTPRequest &HTTPRequest::setHeader(const std::string &key,
                                    const std::string &value)
{
    this->headers[key] = value;
    return *this;
}

HTTPRequest &HTTPRequest::setUrl(const std::string &url)
{
    this->url = url;
    return *this;
}

const std::string &HTTPRequest::getUrl() const
{
    return this->url;
}

const std::string &HTTPRequest::getBody() const
{
    return this->body;
}

const std::unordered_map<std::string, std::string> &HTTPRequest::getHeaders()
    const
{
    return this->headers;
}

const HTTPRequest::Method &HTTPRequest::getMethod() const
{
    return this->method;
}
