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
