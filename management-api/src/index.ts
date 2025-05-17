import express, { Request, Response, NextFunction } from 'express';
import http, { IncomingMessage } from 'http'
import fs from 'fs/promises';
import yaml from 'js-yaml';
import Docker from 'dockerode';
import { WebSocketServer } from "ws";
import { configureWsEvents } from './ws-events';
import dotenv from 'dotenv'

dotenv.config();

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());

const verifyWs = (
    info: { req: IncomingMessage },
    done: (res: boolean, code?: number, msg?: string) => void
) => {
    try {
        const url = new URL(info.req.url ?? '', 'http://asdf');
        const token = url.searchParams.get('token');
        console.log(process.env.MANAGEMENT_API_TOKEN)
        console.log(token)

        if (token !== process.env.MANAGEMENT_API_TOKEN) throw new Error('Invalid auth token');
        else done(true);
    } catch (err) {
        console.error(err);
        done(false, 401, 'Unauthorized');
    }
}

const server = http.createServer(app);
const wsEvents = new WebSocketServer({ server, path: '/ws/events', verifyClient: verifyWs });

configureWsEvents(wsEvents);

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const loadDynamicConfigData = async () => {
    return JSON.parse(await fs.readFile('dynamic.json', { encoding: 'utf-8' }));
}

const writeDynamicConfigData = async (data: object) => {
    await fs.writeFile('dynamic.json', JSON.stringify(data));
}

const loadStaticConfigData = async () => {
    return yaml.load(await fs.readFile('traefik.yml', { encoding: 'utf-8' }));
}

const writeStaticConfigData = async (data: object) => {
    await fs.writeFile('traefik.yml', yaml.dump(data));
}

let dynamicConfigData = await loadDynamicConfigData();

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new Error('Unauthorized');
        if (token !== process.env.MANAGEMENT_API_TOKEN) throw new Error('Unauthorized');
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Unauthorized' });
    }
}

app.post('/traefik/dynamic-config', authenticate, async (req: Request, res: Response) => {
    try {
        console.log('POST /traefik/dynamic-config');
        if (!req.body) throw new Error('Request requires body');
        writeDynamicConfigData(req.body);
        dynamicConfigData = req.body;
        console.log(dynamicConfigData)
        res.status(201).json({ message: 'Success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

let restartInProgress = false

app.post('/traefik/static-config', authenticate, async (req: Request, res: Response) => {
    try {
        console.log('POST /traefik/static-config');

        if (!req.body) throw new Error('Request requires body');

        if (restartInProgress) {
            res.status(500).json({ message: 'Try again later' });
            return;
        }

        restartInProgress = true;

        writeStaticConfigData(req.body);

        console.log('restarting traefik1');
        const traefik1 = docker.getContainer('traefik1');
        traefik1.restart();
        await sleep(50000);

        console.log('restarting traefik2');
        const traefik2 = docker.getContainer('traefik2');
        traefik2.restart();
        await sleep(50000);

        restartInProgress = false;
        res.status(200).json({ message: 'Successfully restart traefik containers' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

app.get('/traefik/dynamic-config', authenticate, async (req: Request, res: Response) => {
    try {
        console.log('GET /traefik/dynamic-config');
        res.json(dynamicConfigData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

app.get('/traefik/static-config', authenticate, async (req: Request, res: Response) => {
    try {
        console.log('GET /traefik/static-config');
        res.json(await loadStaticConfigData());
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

server.listen(port, () => {
    console.log(`management-api running on port ${port}`);
});
