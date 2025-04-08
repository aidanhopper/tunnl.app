import express, { Request, Response } from 'express';

const app = express();

const port = process.env.PORT || 4000;

app.get('/', (req: Request, res: Response) => {
    res.json({
        http: {
            routers: {
                whoamiRouter: {
                    rule: 'HOST(`who.am.i`)',
                    service: 'whoamiService',
                    entryPoints: ['websecure'],
                    // tls: true
                }
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
                }
            }
        }
    });
});

app.listen(port, () => {
    console.log(`traefik-api running on port ${port}`);
});
