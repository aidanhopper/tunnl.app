# 🚂 Secure Service Sharing Over OpenZiti (Alpha)

This is a self-hostable tool for privately sharing internal services without exposing ports, using VPNs, or relying on third-party infrastructure.

It creates an encrypted mesh network using [OpenZiti](https://openziti.io), where you can:

- Register services (like HTTP, SSH, or RDP)
- Grant access to those services using identity-based policies
- Tunnel everything over TCP/443, so it works through most firewalls
- Run the whole thing yourself

This is an alpha release focused on private service sharing.  
Reverse proxy and custom domain support will be added later.

---

## What's Included

- Service registration and access control
- Ziti fabric deployment and edge client integration
- Backend and frontend for managing services
- Everything is self-hostable

---

## What's Not Included Yet

- Reverse proxy / domain routing
- Multi-user UI or permission editor
- Hosted control plane
- Setup docs

---

## Hosted Version (Coming Soon)

There will be a hosted version available for people who want something easier to get started with.

**➡ [Sign up to try it](https://tunnl.app)**

---

## Self-Hosting

You can host this yourself right now if you're comfortable reading code and wiring things together.  
Docs are coming, but for now it assumes you're familiar with OpenZiti, Keycloak, and container-based setups.

---

## Why I Built This

I wanted something like Tailscale or Cloudflare Tunnel, but fully open and programmable.  
Tailscale’s control plane isn’t self-hostable, and most tools like it share entire devices instead of services.  
This gives you full control — your network, your rules, no external dependencies.

