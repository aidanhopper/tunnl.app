import dotenv from 'dotenv';

dotenv.config();

fetch('https://traefik.api.tunnl.app:8443', {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${process.env.TRAEFIK_API_TOKEN}`,
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
                leethootRouter: {
                    rule: 'HOST(`leethoot.tunnl.app`)',
                    service: 'leethootService',
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
                    middlewares: ['oauthPortfolio'],
                    tls: {
                        certResolver: 'letsencrypt',
                        domains: [
                            {
                                main: "*.srv.ahop.dev",
                            },
                        ]
                    }
                },
            },
            services: {
                leethootService: {
                    loadBalancer: {
                        servers: [
                            {
                                url: 'http://leethoot.service:80'
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
                jellyfinService: {
                    loadBalancer: {
                        servers: [
                            {
                                url: 'http://jellyfin.service:80'
                            }
                        ]
                    }
                }
            }
        }
    })
});

fetch('https://traefik.api.tunnl.app:8443', {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${process.env.TRAEFIK_API_TOKEN}`,
    },
})
    .then(r => r.json())
    .then(d => console.log(d));


// await fetch('http://127.0.0.1:4000', {
//     method: 'POST',
//     headers: {
//         Authorization: `Bearer ${process.env.TRAEFIK_API_TOKEN}`,
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         http: {
//             routers: {
//                 portfolioRouter: {
//                     rule: 'HOST(`web.ziti`)',
//                     service: 'portfolioService',
//                     entryPoints: ['web'],
//                 }
//             },
//             services: {
//                 portfolioService: {
//                     loadBalancer: {
//                         servers: [
//                             {
//                                 url: 'http://my.portfolio:80'
//                             }
//                         ]
//                     }
//                 }
//             }
//         }
//     })
// })
