import { WebSocket, RawData } from 'ws';
import axios from 'axios';
import https from 'https';
import { Buffer } from 'buffer';
import dotenv from 'dotenv';

let ws: WebSocket | null = null;
let reconnectDelay = 1000;
let heartbeatInterval: NodeJS.Timeout | null = null;
let pongTimeout: NodeJS.Timeout | null = null;

dotenv.config({
    path: './../.env',
});

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

const stopHeartbeat = () => {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    if (pongTimeout) clearTimeout(pongTimeout);
    heartbeatInterval = null;
    pongTimeout = null;
}

const startHeartbeat = () => {
    stopHeartbeat();
    heartbeatInterval = setInterval(() => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        // console.log('Sending ping');
        ws.ping();
        pongTimeout = setTimeout(() => {
            console.warn('Pong timeout. Terminating connection.');
            ws?.terminate(); // triggers onclose
        }, 5000); // wait max 5s for pong
    }, 30000); // ping every 30s
}

const cleanupAndReconnect = (
    args: {
        onMessage: (msg: object) => void,
        subscriptions: { type: string, options: { version?: number } | null }[]
    }) => {
    stopHeartbeat();
    reconnectDelay = Math.min(reconnectDelay * 2, 30000); // exponential backoff
    setTimeout(() => createZitiEventWebSocket(args), reconnectDelay);
}

const createZitiEventWebSocket = async ({
    onMessage,
    subscriptions
}: {
    onMessage: (msg: object) => void,
    subscriptions: { type: string, options: { version?: number } | null }[]
}) => {
    const agent = new https.Agent({ rejectUnauthorized: false });

    ws = new WebSocket(`${process.env.ZITI_WEBSOCKET_CONTROLLER_URL}/fabric/v1/ws-api`, {
        agent: agent,
        headers: {
            'Content-Type': 'application/json',
            'zt-session': await token()
        }
    });

    ws.on('open', () => {
        console.log('Ziti WS connected');
        ws?.send(subscribeMessage(subscriptions));
        startHeartbeat();
    });

    ws.on('close', () => {
        console.error('Ziti WS closed');
        cleanupAndReconnect({
            onMessage: onMessage,
            subscriptions: subscriptions
        });
    });

    ws.on('message', msg => {
        const str = parseMessage(msg)
        if (str === 'success' || !str) return;
        onMessage(JSON.parse(str));
    });

    ws.on('error', () => {
        console.error('Ziti WS error');
        ws?.close();
    });

    ws.on('pong', () => {
        if (pongTimeout) clearTimeout(pongTimeout);
        // console.log('Pong received');
    });
}

export default createZitiEventWebSocket;
