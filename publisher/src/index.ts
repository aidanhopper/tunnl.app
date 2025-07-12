import fs from 'fs/promises';
import { Client } from 'pg';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import createZitiEventWebSocket from './ziti-ws';

dotenv.config({
    path: './../.env',
});

type Payload = {
    topics: string[],
    iat: string,
    exp: string
}

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

const io = new Server(Number(process.env.PUBLISHER_PORT || 1234), {
    cors: {
        origin: "*",
    },
});

const readDataFile = async (path: string) => {
    const data = await fs.readFile(path);
    const jsonLines = data
        .toString()
        .split('\n')
        .map(s => {
            try {
                return JSON.parse(s);
            } catch (err) {
                return null;
            }
        })
        .filter(e => e != null);
    return jsonLines;
}

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

// to be inserted into the events table the event needs
// namespace
// eventType
// id

interface ServiceEvent {
    namespace: 'service',
    timestamp: Date,
    serviceId: string,
    count: number
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

const transformEvent = (e: any): SdkEvent | ServiceEvent | EntityChangeEvent | null => {
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
                eventType: e.event_type
            };
        case 'service':
            const ret = {
                namespace: e.namespace,
                timestamp: new Date(e.timestamp),
                serviceId: e.service_id,
                count: e.count
            }
            return ret;
        default: return null;
    }
}

const subscribers = new Map<string, RegExp[]>();

const publishEvent = async (topic: string, payload: object) => {
    try {
        subscribers.forEach((topics, socketId) => {
            topics.forEach(topicRegex => {
                if (topicRegex.test(topic)) {
                    io.to(socketId).emit('event', payload);
                    // console.log('sending', payload, 'to', socketId);
                }
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
            ],
            onMessage: (msg) => {
                // console.log(msg.namespace);
                const payload = transformEvent(msg);

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
                    case 'service':
                        console.log(payload);
                    default: break;
                }
            }
        });

        io.on("connection", (socket) => {
            const { token } = socket.handshake.auth;

            try {
                const payload = jwt.verify(token, process.env.PUBLISHER_JWT_SECRET || 'no') as {} as Payload;
                // console.log('connect');

                subscribers.set(socket.id, payload.topics.map(s => RegExp(s)));

                socket.on("disconnect", () => {
                    subscribers.delete(socket.id);
                    // console.log('disconnect');
                });
            } catch (err) {
                console.error(err)
                socket.disconnect();
                return;
            }
        });
    } catch (err) {
        console.error(err);
    }
}

export default main();
