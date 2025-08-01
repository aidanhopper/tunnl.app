import dotenv from 'dotenv';
import yaml from 'js-yaml';
import fs from 'fs/promises';

dotenv.config();

fetch('https://traefik.api.tunnl.app:8443/traefik/dynamic-config', {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${process.env.MANAGEMENT_API_TOKEN}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        http: {
            middlewares: {
                oauth: {
                    chain: {
                        middlewares: ['oauthSignIn', 'oauthVerify']
                    }
                },
                oauthVerify: {
                    forwardAuth: {
                        address: "http://oauth2-proxy:4180/oauth2/auth"
                    }
                },
                oauthPortfolio: {
                    chain: {
                        middlewares: ['oauthSignIn', 'oauthVerifyPortfolio']
                    }
                },
                oauthVerifyPortfolio: {
                    forwardAuth: {
                        address: "http://oauth2-proxy:4180/oauth2/auth?allowed_emails=aidanhop1@gmail.com,snekisgood@gmail.com"
                    }
                },
                oauthSignIn: {
                    errors: {
                        service: 'authProxyService',
                        status: '401',
                        query: '/oauth2/sign_in'
                    }
                }
            },
            routers: {
                authTunnlProxyRouter: {
                    rule: '(Host(`auth.tunnl.app`) && PathPrefix(`/oauth2/`)) || (PathPrefix(`/oauth2/`))',
                    service: 'authProxyService',
                    entryPoints: ['websecure'],
                    tls: {
                        certResolver: 'letsencrypt',
                        domains: [
                            {
                                main: "*.tunnl.app",
                            },
                        ]
                    }
                },
                whoamiRouter: {
                    rule: 'HOST(`whoami.srv.ahop.dev`)',
                    service: 'whoamiService',
                    entryPoints: ['websecure'],
                    middlewares: ['oauth'],
                    tls: {
                        certResolver: 'letsencrypt',
                        domains: [
                            {
                                main: "*.tunnl.app",
                            },
                        ]
                    }
                },
                authTunnlRouter: {
                    rule: 'HOST(`auth.tunnl.app`)',
                    service: 'authService',
                    entryPoints: ['websecure'],
                    tls: {
                        certResolver: 'letsencrypt',
                        domains: [
                            {
                                main: "*.tunnl.app",
                            },
                        ]
                    }
                },
                portfolioRouter: {
                    rule: 'HOST(`portfolio.tunnl.app`)',
                    service: 'portfolioService',
                    entryPoints: ['websecure'],
                    middlewares: ['oauthPortfolio'],
                    tls: {
                        certResolver: 'letsencrypt',
                        domains: [
                            {
                                main: "*.tunnl.app",
                            },
                        ]
                    }
                },
                jellyseerrLoginRouter: {
                    rule: "Host(`jellyseerr.tunnl.app`) && PathRegexp(`/api/v1/auth*`)",
                    service: "jellyseerrService",
                    entryPoints: ['websecure'],
                    tls: {
                        certResolver: 'letsencrypt',
                        domains: [
                            {
                                main: "*.tunnl.app",
                            },
                        ]
                    }
                },
                jellyseerrRouter: {
                    rule: 'HOST(`jellyseerr.tunnl.app`) && !PathRegexp(`/api/v1/auth*`)',
                    service: 'jellyseerrService',
                    entryPoints: ['websecure'],
                    middlewares: ['oauth'],
                    tls: {
                        certResolver: 'letsencrypt',
                        domains: [
                            {
                                main: "*.tunnl.app",
                            },
                        ]
                    }
                },
                jellyfinRouter: {
                    rule: 'HOST(`jellyfin.tunnl.app`)',
                    service: 'jellyfinService',
                    entryPoints: ['websecure'],
                    middlewares: ['oauth'],
                    tls: {
                        certResolver: 'letsencrypt',
                        domains: [
                            {
                                main: "*.tunnl.app",
                            },
                        ]
                    }
                },
                portfolioAhopRouter: {
                    rule: 'HOST(`portfolio.srv.ahop.dev`)',
                    service: 'portfolioService',
                    entryPoints: ['websecure'],
                    middlewares: ['oauth'],
                    tls: {
                        certResolver: 'letsencrypt',
                        domains: [
                            {
                                main: "*.srv.ahop.dev",
                            },
                        ]
                    }
                },
                delugeRouter: {
                    rule: 'HOST(`deluge.tunnl.app`)',
                    service: 'delugeService',
                    entryPoints: ['websecure'],
                    middlewares: ['oauth'],
                    tls: {
                        certResolver: 'letsencrypt',
                        domains: [
                            {
                                main: "*.tunnl.app",
                            },
                        ]
                    }
                },
            },
            services: {
                delugeService: {
                    loadBalancer: {
                        servers: [
                            {
                                url: 'http://deluge.service:80'
                            }
                        ]
                    }
                },
                authProxyService: {
                    loadBalancer: {
                        servers: [
                            {
                                url: 'http://oauth2-proxy:4180'
                            }
                        ]
                    }
                },
                whoamiService: {
                    loadBalancer: {
                        servers: [
                            {
                                url: 'http://whoami:80'
                            }
                        ]
                    }
                },
                portfolioService: {
                    loadBalancer: {
                        servers: [
                            {
                                url: 'http://my.portfolio:80'
                            }
                        ]
                    }
                },
                authService: {
                    loadBalancer: {
                        servers: [
                            {
                                url: 'http://keycloak-server:8080'
                            }
                        ]
                    }
                },
                jellyseerrService: {
                    loadBalancer: {
                        servers: [
                            {
                                url: 'http://jellyseerr.service:80'
                            }
                        ]
                    }
                },
                jellyfinService: {
                    loadBalancer: {
                        servers: [
                            {
                                url: 'http://jellyfin.service:80'
                            }
                        ]
                    }
                }
            },
        },
        tcp: {
            routers: {
                minecraftRouter: {
                    entryPoints: ['minecraft'],
                    rule: 'HostSNI(`*`)',
                    service: 'minecraftService',
                },
                vanillaMinecraftRouter: {
                    entryPoints: ['vanillaMinecraft'],
                    rule: 'HostSNI(`*`)',
                    service: 'vanillaMinecraftService',
                },
                minecraftAgainRouter: {
                    entryPoints: ['minecraftAgain'],
                    rule: 'HostSNI(`*`)',
                    service: 'minecraftAgainService',
                },
            },
            services: {
                minecraftService: {
                    loadBalancer: {
                        servers: [
                            {
                                address: 'my.minecraft.server:25565'
                            }
                        ]
                    }
                },
                vanillaMinecraftService: {
                    loadBalancer: {
                        servers: [
                            {
                                address: 'vanilla.minecraft.server:25565'
                            }
                        ]
                    }
                },
                minecraftAgainService: {
                    loadBalancer: {
                        servers: [
                            {
                                address: 'minecraft.again:25565'
                            }
                        ]
                    }
                },
            }
        },
    })
});

await fetch('https://traefik.api.tunnl.app:8443/traefik/dynamic-config', {
    headers: {
        Authorization: `Bearer ${process.env.MANAGEMENT_API_TOKEN}`,
    }
}).then(r => r.json()).then(d => console.log(JSON.stringify(d)));

await fetch('https://traefik.api.tunnl.app:8443/traefik/static-config', {
    headers: {
        Authorization: `Bearer ${process.env.MANAGEMENT_API_TOKEN}`,
    }
}).then(r => r.json()).then(d => console.log(JSON.stringify(d)));

fetch('https://traefik.api.tunnl.app:8443/traefik/static-config', {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${process.env.MANAGEMENT_API_TOKEN}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(yaml.load(await fs.readFile('traefik.yml')))
});
