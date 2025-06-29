import { WebSocket, RawData } from 'ws';
import fs from 'fs/promises';
import { Client } from 'pg';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
import https from 'https';
import { Buffer } from 'buffer';
import crypto from 'crypto';

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
        console.log('publishing', {
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

const managementAPI = `${process.env.ZITI_CONTROLLER_URL}/edge/management/v1`;

interface Auth {
    token: string
    expires: Date
}

interface TokenResponse {
    data: {
        token: string
        expiresAt: string
    }
}

const auth: Auth = { token: '', expires: new Date() }

export const token = async () => {
    if (auth && auth.token !== '' && auth.expires > new Date()) return auth.token;

    const url = `${managementAPI}/authenticate?method=password`;
    const r = await axios.post<TokenResponse>(
        url,
        {
            username: process.env.ZITI_ADMIN_USERNAME,
            password: process.env.ZITI_ADMIN_PASSWORD,
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    const data = r.data.data;

    const token = data.token;
    const expires = new Date(data.expiresAt);

    auth.token = token;
    auth.expires = expires;

    return auth.token;
}

const subscribeMessage = (subscriptions: { type: string, options: { version?: number } | null }[]) => {
    const CONTENT_TYPE_STREAM_EVENTS_REQUEST = 10040;
    const SEQUENCE = -1; // Default
    const HEADERS = Buffer.alloc(0); // No headers
    const payload = {
        format: "json",
        subscriptions: subscriptions
    };

    const body = Buffer.from(JSON.stringify(payload), 'utf8');

    const marker = Buffer.from([0x03, 0x06, 0x09, 0x0c]);

    const contentType = Buffer.alloc(4);
    contentType.writeUint32LE(CONTENT_TYPE_STREAM_EVENTS_REQUEST);

    const sequence = Buffer.alloc(4);
    sequence.writeInt32LE(SEQUENCE);

    const headersLength = Buffer.alloc(4);
    headersLength.writeUint32LE(0);

    const bodyLength = Buffer.alloc(4);
    bodyLength.writeUint32LE(body.length);


    return Buffer.concat([
        marker,
        contentType,
        sequence,
        headersLength,
        bodyLength,
        body
    ]);
}

const checkMarker = (buf: Buffer): boolean => {
    return buf.readUInt8(0) === 0x03 &&
        buf.readUInt8(1) === 0x06 &&
        buf.readUInt8(2) === 0x09 &&
        buf.readUInt8(3) === 0x0c;
}

const readBytes = (buf: Buffer, start: number, length: number): Buffer => {
    const out = Buffer.alloc(length);
    for (let i = 0; i < length; i++) {
        out[i] = buf.readUInt8(start + i);
    }
    return out;
}

const parseMessage = (msg: RawData) => {
    if (!Buffer.isBuffer(msg)) return null;

    const buf = Buffer.from(msg);

    if (!checkMarker(buf)) throw new Error('Invalid marker');

    const contentType = buf.readInt32LE(4);
    const sequence = buf.readInt32LE(8);
    const headersLength = buf.readInt32LE(12);
    const bodyLength = buf.readInt32LE(16);

    const headers = readBytes(buf, 20, headersLength);
    const body = readBytes(buf, 20 + headersLength, bodyLength);
    const bodyUtf8 = body.toString('utf8');

    return bodyUtf8;
}

const main = async () => {
    await client.connect();

    try {
        const agent = new https.Agent({ rejectUnauthorized: false });

        const ws = new WebSocket(`wss://ziti.ahop.dev:1280/fabric/v1/ws-api`, {
            agent: agent,
            headers: {
                'Content-Type': 'application/json',
                'zt-session': await token()
            }
        });

        ws.on('open', () => {
            ws.send(subscribeMessage([
                { type: "entityChange", options: null },
                { type: "service", options: null },
                { type: "sdk", options: null },
            ]));
            console.log('connected');
        });

        ws.on('close', () => console.log('close'));

        ws.on('message', msg => {
            const str = parseMessage(msg)

            if (str === 'success' || !str) return;

            const payload = transformEvent(JSON.parse(str));

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
        ws.on('error', console.error);

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
    } catch (err) {
        console.error(err);
    }
}

main();
