# Ziti Deployment with Traefik TLS Passthrough

## Overview

This guide covers setting up Ziti using the quickstart installation with a single-port configuration. All traffic will be routed through port 443 using TLS passthrough for Ziti domains.

## Traefik Configuration

### traefik.yml

```yaml
entryPoints:
  tcp_tls:
    address: ":443"
providers:
  file:
    filename: "dynamic.yml"
    watch: true
log:
  level: DEBUG
```

### dynamic.yml

```yaml
tcp:
  routers:
    controller-router:
      entryPoints:
        - tcp_tls
      rule: "HostSNI(`ctrl.ziti.tunnl.app`)"
      service: controller-service
      tls:
        passthrough: true
    edge-router:
      entryPoints:
        - tcp_tls
      rule: "HostSNI(`er1.ziti.tunnl.app`)"
      service: edge-service
      tls:
        passthrough: true
  services:
    controller-service:
      loadBalancer:
        servers:
          - address: 127.0.0.1:10443 # may be different port
    edge-service:
      loadBalancer:
        servers:
          - address: 127.0.0.1:11443 # may be different port
```

## Setup Instructions

Configure the edge router and controller using the OpenZiti quickstart, then run the service with systemd for easy management and automatic startup.

Use the host anywhere quick start & watch this video for help deploying ziti https://www.youtube.com/watch?v=eQIgxaQ0gfU

Instructions on installing the ZAC https://openziti.io/docs/learn/quickstarts/zac/

For advertising 443 in ziti you must go into the controller config and edge router config and change all advertised ports to 443. Leave the bind ports.

Will need an email provider to verify email.

## Notes on TLS for Ziti intercepts
When browsers query a FQDN it may force the protocol to be HTTPS, so don't be
surprised when you can't query a FQDN using unencrypted HTTP. As long as you
can curl the endpoint it should work for HTTPS. To get HTTPS grab a cert for a
domain without a public DNS record (can be wildcard). The domain on
the cert should not successfully resolve to any IP through an A or CNAME
record. This way Ziti can intercept the domain and route the request through
the fabric. Here Ziti is acting as a private DNS provider, so the record
doesn't exist publically but can be resolved when the Ziti intercept is
available for that identity.
