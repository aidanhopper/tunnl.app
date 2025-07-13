import fs from 'fs/promises';
import { Client } from 'pg';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import createZitiEventWebSocket from './ziti-ws';

dotenv.config({
    path: './../.env',
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

const io = new Server(Number(process.env.PUBLISHER_PORT || 1234), {
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

const insertServiceDial = async (e: ServiceEvent) => {
    try {
        await client.query(`
        INSERT INTO service_dials (
            timestamp,
            dials,
            service_id
        ) VALUES (
            $1,
            $2,
            (
                SELECT id
                FROM services
                WHERE ziti_id = $3
            )
        )
        ON CONFLICT (service_id, timestamp)
        DO UPDATE SET dials = service_dials.dials + EXCLUDED.dials;
        `, [e.timestamp, e.count, e.serviceId]);
    } catch (err) {
        console.error(err);
    }
}

// to be inserted into the events table the event needs
// namespace
// eventType
// id

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
                eventType: e.event_type,
            };
        case 'service':
            return {
                namespace: e.namespace,
                timestamp: new Date(e.timestamp),
                serviceId: e.service_id,
                count: e.count,
                intervalLength: e.interval_length
            }
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
            ],
            onMessage: (msg) => {
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
                        insertServiceDial(payload);
                    default: break;
                }
            }
        });

        io.on("connection", (socket) => {
            const { token } = socket.handshake.auth;

            if (!process.env.PUBLISHER_JWT_SECRET) throw new Error('No jwt secret defined')

            try {
                const payload = jwt.verify(token, process.env.PUBLISHER_JWT_SECRET) as {} as Payload;
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
