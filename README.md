# 🔒 Secure Service Sharing Over OpenZiti (Alpha)

A self-hostable platform for securely exposing and sharing internal services — without VPNs, port forwarding, or public IPs.

Built on [OpenZiti](https://openziti.io), this project creates a private, encrypted mesh network where you can:

- 🧱 Register services (HTTP, SSH, RDP, etc.)
- 🔐 Share access securely using identity-based controls
- 💡 Run everything yourself, or use the hosted version
- 🌍 Tunnel over TCP/443 — bypassing firewalls and NAT

This is the **alpha release** and currently focuses on private mesh networking and service sharing.  
Reverse proxy support (e.g., custom domain routing) will come in a future version.

---

## ✅ What’s Included

- Create a Ziti-based mesh network
- Register users/devices (edge identities)
- Define services and access policies
- Share services securely with others
- Self-hostable control plane

---

## 🔜 Coming Soon

- Reverse proxy / custom domain integration
- Role-based permissions and multi-user UI
- Optional SaaS version for easier onboarding

---

## 📦 Hosted Version

A hosted version of this platform will be available soon for those who want a faster way to get started.

> 🌐 **[Sign up to try the hosted version](https://tunnl.app)**

---

## 🧪 Self-Hosting

This alpha is designed to be fully self-hostable.  
Setup scripts and configuration guides are in progress. For now, you’ll need to be comfortable reading the code and wiring things together.

If you're experienced with OpenZiti, Keycloak, and Traefik, you’ll be able to get it running.  
Full documentation will follow shortly.

---

## 💬 Why This Exists

Cloudflare Tunnel, Tailscale, and similar tools are powerful — but they come with tradeoffs:

- Their control planes are not fully open-source
- Most expose entire devices, not services
- Custom setups are limited by closed ecosystems

This project was built to provide a **completely open, programmable alternative** — with the privacy, flexibility, and self-ownership serious users need.

---
