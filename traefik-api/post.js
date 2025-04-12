import dotenv from 'dotenv';
import { stringify } from 'querystring';

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
                authProxyRouter: {
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
                    rule: 'HOST(`whoami.tunnl.app`)',
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
                authRouter: {
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
            },
            services: {
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
