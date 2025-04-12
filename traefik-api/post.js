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
            routers: {
                whoamiRouter: {
                    rule: 'HOST(`whoami.tunnl.app`)',
                    service: 'whoamiService',
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
