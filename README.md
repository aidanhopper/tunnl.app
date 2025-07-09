# 🚂 Secure Service Sharing Over OpenZiti (Alpha)

This is a self-hostable tool for privately sharing internal services without exposing ports, using VPNs, or relying on third-party infrastructure.

It creates an encrypted mesh network using [OpenZiti](https://openziti.io), where you can:

- Register services (like HTTP, SSH, or RDP)
- Share access to those services with other users, individually
- Control access at the **service level**, not device level
- Tunnel traffic over TCP/443, which works through most firewalls
- Run the whole system yourself

This is an alpha release focused on the core: secure service sharing between multiple users over a private mesh network.  
Reverse proxy and custom domain support will come in later releases.

---

## What's Included

- Identity-based mesh network using OpenZiti
- Multi-user system with per-service access control
- Ziti fabric setup and edge client support
- Self-hostable backend and frontend for managing users and services

---

## What's Not Included Yet

- Reverse proxy or public domain integration
- Graphical user permissions editor
- Hosted control plane or SaaS UI
- Full setup documentation

---

## Hosted Version (Coming Soon)

A hosted version will be available soon for users who want a simpler way to get started.

**➡ [Sign up to try the hosted version](https://tunnl.app)**

---

## Self-Hosting

The project is fully self-hostable.  
Setup docs are still in progress, so self-hosting currently assumes you're comfortable with OpenZiti, Keycloak, and containerized deployments.

---

## Why I Built This

Tools like Tailscale and Cloudflare Tunnel are useful, but limited:
- Their control planes aren’t fully open
- They focus on sharing access to devices, not specific services
- You can’t fully self-host or customize them

This project gives you full control — private infrastructure, multi-user support, fine-grained service access, and no third-party dependencies.
