import fs from 'fs/promises';
import { Client } from 'pg';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import createZitiEventWebSocket from './ziti-ws';
import http from 'http'
import express, { Request, Response, NextFunction } from 'express';

dotenv.config();

if (!process.env.PUBLISHER_PORT) throw new Error("Must specify port");
if (!process.env.PUBLISHER_JWT_SECRET) throw new Error("Must specify jwt secret");

const app = express();

app.use(express.json());

app.get('/api/v1/intercept/:identity/:host', async (req: Request, res: Response) => {
    try {
        res.json({ message: req.params.identity })
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

interface Payload {
    topics: string[],
    iat: string,
    exp: string
}

interface ServiceEvent {
    namespace: 'service',
    timestamp: Date,
    serviceId: string,
    count: number,
    intervalLength: number
}

interface EntityChangeEvent {
    namespace: 'entityChange',
    eventType: 'deleted' | 'updated' | 'created',
    entityType: string,
    timestamp: Date,
    id: string
}

interface SdkEvent {
    namespace: 'sdk'
    id: string,
    eventType: string
}

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: "*",
    },
});

const updateIdentityStatus = async (ziti_id: string, is_online: boolean) => {
    try {
        await client.query(`
        UPDATE identities
        SET is_online = $1,
            last_seen = NOW()
        WHERE ziti_id = $2
    `, [is_online, ziti_id]);
    } catch (err) {
        console.error(err);
    }
}

const logEvent = async (e: any) => {
    try {
        if (e.eventType === 'committed') return;
        if (e.metadata && e.metadata.source && e.metadata.source.type === 'heartbeat.flush') return;
        const out = JSON.stringify(e);
        fs.appendFile('publisher.log', out + '\n');
    } catch { }
}

const insertEvent = async (e: any) => {
    if (!e.timestamp || !e.namespace) return;
    if (e.eventType === 'committed') return;
    if (e.metadata && e.metadata.source && e.metadata.source.type === 'heartbeat.flush') return;
    const eventType = `ziti.${e.namespace}.${e.eventType ? e.eventType : e.event_type ? e.event_type : ''}`;
    await client.query(`
        INSERT INTO events (
            event_type,
            data,
            created_at
        ) VALUES (
            $1,
            $2,
            $3
        )
    `, [eventType, e, new Date(e.timestamp)]);
}

// to be inserted into the events table the event needs
// namespace
// eventType
// id

const transformEvent = async (e: any): Promise<SdkEvent | ServiceEvent | EntityChangeEvent | null> => {
    switch (e.namespace) {
        case 'entityChange':
            switch (e.eventType) {
                case 'committed':
                    return null
                case 'updated':
                    return {
                        namespace: 'entityChange',
                        eventType: 'updated',
                        entityType: e.entityType,
                        timestamp: e.timestamp,
                        id: e.initialState.id
                    }
                case 'created':
                    return {
                        namespace: 'entityChange',
                        eventType: 'created',
                        entityType: e.entityType,
                        timestamp: e.timestamp,
                        id: e.finalState.id
                    }
                case 'deleted':
                    return {
                        namespace: 'entityChange',
                        eventType: 'deleted',
                        entityType: e.entityType,
                        timestamp: e.timestamp,
                        id: e.initialState.id
                    }
            }
        case 'sdk':
            return {
                namespace: 'sdk',
                id: e.identity_id,
                eventType: e.event_type,
            };
        case 'service':
            return e.event_type !== 'service.dial.success' ? null : {
                namespace: e.namespace,
                timestamp: new Date(e.timestamp),
                serviceId: e.service_id,
                count: e.count,
                intervalLength: e.interval_length
            }
        case 'circuit':
            return null;
        default: return null;
    }
}

const subscribers = new Map<string, RegExp[]>();

const publishEvent = async (topic: string, payload: object) => {
    try {
        subscribers.forEach((topics, socketId) => {
            topics.forEach(topicRegex => {
                if (topicRegex.test(topic))
                    io.to(socketId).emit('event', payload);
            });
        });
    } catch (err) {
        console.error(err);
    }
}

const main = async () => {
    await client.connect();

    try {
        createZitiEventWebSocket({
            subscriptions: [
                { type: "entityChange", options: null },
                { type: "service", options: null },
                { type: "sdk", options: null },
                { type: "circuit", options: null },
            ],
            onMessage: async (msg) => {
                await insertEvent(msg);
                await logEvent(msg);
                const payload = await transformEvent(msg);

                if (!payload || !payload.namespace) return;

                switch (payload.namespace) {
                    case 'entityChange':
                        const topic1 = `${payload.namespace}:${payload.entityType}:${payload.id}`;
                        publishEvent(topic1, payload);
                        break;
                    case 'sdk':
                        const topic2 = `${payload.namespace}:identities:${payload.id}`;
                        publishEvent(topic2, payload);
                        updateIdentityStatus(payload.id, payload.eventType === 'sdk-online')
                        break;
                    default: break;
                }
            }
        });

        io.on("connection", (socket) => {
            const { token } = socket.handshake.auth;

            if (!process.env.PUBLISHER_JWT_SECRET) throw new Error('No jwt secret defined')

            try {
                const payload = jwt.verify(token, process.env.PUBLISHER_JWT_SECRET) as {} as Payload;

                subscribers.set(socket.id, payload.topics.map(s => RegExp(s)));

                socket.on("disconnect", () => {
                    subscribers.delete(socket.id);
                });
            } catch (err) {
                console.error(err)
                socket.disconnect();
                return;
            }
        });

        httpServer.listen(process.env.PUBLISHER_PORT, () => {
            console.log(`Server listening on ${process.env.PUBLISHER_PORT}`);
        });
    } catch (err) {
        console.error(err);
    }
}


export default main();
