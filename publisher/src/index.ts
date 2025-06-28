import { WebSocket } from 'ws';
import fs from 'fs/promises';
import { Client } from 'pg';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

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

const transformEvent = (e: any) => {
    switch (e.namespace) {
        case 'entityChange':
            switch (e.eventType) {
                case 'committed':
                    return {
                        namespace: e.namespace,
                        eventType: e.eventType,
                        timestamp: e.timestamp,
                    }
                case 'updated':
                    return {
                        namespace: e.namespace,
                        eventType: e.eventType,
                        entityType: e.entityType,
                        timestamp: e.timestamp,
                        id: e.initialState.id
                    }
                case 'created':
                    return {
                        namespace: e.namespace,
                        eventType: e.eventType,
                        entityType: e.entityType,
                        timestamp: e.timestamp,
                        id: e.finalState.id
                    }
                case 'deleted':
                    return {
                        namespace: e.namespace,
                        eventType: e.eventType,
                        entityType: e.entityType,
                        timestamp: e.timestamp,
                        id: e.initialState.id
                    }
            }
        default:
            return {
                namespace: e.namespace,
                timestamp: e.timestamp,
                eventType: e.event_type,
                entityType: 'identities',
                id: e.identity_id,
            }
    }
}

const subscribers = new Map<string, RegExp[]>();

const publishEvent = async (topic: string, payload: object) => {
    try {
        console.log({
            topic: topic,
            payload: payload
        })

        subscribers.forEach((topics, socketId) => {
            topics.forEach(topicRegex => {
                if (topicRegex.test(topic)) {
                    io.to(socketId).emit('event', payload);
                    console.log('sending', payload, 'to', socketId);
                }
            });
        });
    } catch (err) {
        console.error(err);
    }
}

const main = async () => {
    await client.connect();

    const ws = new WebSocket(`${process.env.MANAGEMENT_API_URL}/ws/events?token=${process.env.MANAGEMENT_API_TOKEN}`);

    console.log('connected to ws server')

    ws.on('message', async buf => {
        const data = JSON.parse(buf.toString());
        const payload = transformEvent(data);
        if (!(payload.namespace && payload.entityType && payload.id)) return;

        const isFilteredEvent = [
            'apiSessions',
            'apiSessionCertificates',
            'eventualEvents',
            'terminators',
            'sessions'
        ].find(e => e === payload.entityType);

        if (isFilteredEvent) return;
        const topic = `${payload.namespace}:${payload.entityType}:${payload.id}`;

        if (payload.namespace === 'sdk')
            updateIdentityStatus(payload.id, payload.eventType === 'sdk-online')

        publishEvent(topic, payload);
    });

    io.on("connection", (socket) => {
        const { token } = socket.handshake.auth;

        try {
            const payload = jwt.verify(token, process.env.PUBLISHER_JWT_SECRET || 'no') as {} as Payload;
            console.log('connect');

            subscribers.set(socket.id, payload.topics.map(s => RegExp(s)));

            socket.on("disconnect", () => {
                subscribers.delete(socket.id);
                console.log('disconnect');
            });
        } catch (err) {
            console.error(err)
            socket.disconnect();
            return;
        }
    });
}

main();
