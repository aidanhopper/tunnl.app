"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
const ws_1 = require("ws");
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
const buffer_1 = require("buffer");
const dotenv_1 = __importDefault(require("dotenv"));
let ws = null;
let reconnectDelay = 1000;
let heartbeatInterval = null;
let pongTimeout = null;
dotenv_1.default.config({
    path: './../.env',
});
const managementAPI = `${process.env.ZITI_CONTROLLER_URL}/edge/management/v1`;
const auth = { token: '', expires: new Date() };
const token = () => __awaiter(void 0, void 0, void 0, function* () {
    if (auth && auth.token !== '' && auth.expires > new Date())
        return auth.token;
    const url = `${managementAPI}/authenticate?method=password`;
    const r = yield axios_1.default.post(url, {
        username: process.env.ZITI_ADMIN_USERNAME,
        password: process.env.ZITI_ADMIN_PASSWORD,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = r.data.data;
    const token = data.token;
    const expires = new Date(data.expiresAt);
    auth.token = token;
    auth.expires = expires;
    return auth.token;
});
exports.token = token;
const subscribeMessage = (subscriptions) => {
    const CONTENT_TYPE_STREAM_EVENTS_REQUEST = 10040;
    const SEQUENCE = -1; // Default
    const HEADERS = buffer_1.Buffer.alloc(0); // No headers
    const payload = {
        format: "json",
        subscriptions: subscriptions
    };
    const body = buffer_1.Buffer.from(JSON.stringify(payload), 'utf8');
    const marker = buffer_1.Buffer.from([0x03, 0x06, 0x09, 0x0c]);
    const contentType = buffer_1.Buffer.alloc(4);
    contentType.writeUint32LE(CONTENT_TYPE_STREAM_EVENTS_REQUEST);
    const sequence = buffer_1.Buffer.alloc(4);
    sequence.writeInt32LE(SEQUENCE);
    const headersLength = buffer_1.Buffer.alloc(4);
    headersLength.writeUint32LE(0);
    const bodyLength = buffer_1.Buffer.alloc(4);
    bodyLength.writeUint32LE(body.length);
    return buffer_1.Buffer.concat([
        marker,
        contentType,
        sequence,
        headersLength,
        bodyLength,
        body
    ]);
};
const checkMarker = (buf) => {
    return buf.readUInt8(0) === 0x03 &&
        buf.readUInt8(1) === 0x06 &&
        buf.readUInt8(2) === 0x09 &&
        buf.readUInt8(3) === 0x0c;
};
const readBytes = (buf, start, length) => {
    const out = buffer_1.Buffer.alloc(length);
    for (let i = 0; i < length; i++) {
        out[i] = buf.readUInt8(start + i);
    }
    return out;
};
const parseMessage = (msg) => {
    if (!buffer_1.Buffer.isBuffer(msg))
        return null;
    const buf = buffer_1.Buffer.from(msg);
    if (!checkMarker(buf))
        throw new Error('Invalid marker');
    const contentType = buf.readInt32LE(4);
    const sequence = buf.readInt32LE(8);
    const headersLength = buf.readInt32LE(12);
    const bodyLength = buf.readInt32LE(16);
    const headers = readBytes(buf, 20, headersLength);
    const body = readBytes(buf, 20 + headersLength, bodyLength);
    const bodyUtf8 = body.toString('utf8');
    return bodyUtf8;
};
const stopHeartbeat = () => {
    if (heartbeatInterval)
        clearInterval(heartbeatInterval);
    if (pongTimeout)
        clearTimeout(pongTimeout);
    heartbeatInterval = null;
    pongTimeout = null;
};
const startHeartbeat = () => {
    stopHeartbeat();
    heartbeatInterval = setInterval(() => {
        if (!ws || ws.readyState !== ws_1.WebSocket.OPEN)
            return;
        // console.log('Sending ping');
        ws.ping();
        pongTimeout = setTimeout(() => {
            console.warn('Pong timeout. Terminating connection.');
            ws === null || ws === void 0 ? void 0 : ws.terminate(); // triggers onclose
        }, 5000); // wait max 5s for pong
    }, 30000); // ping every 30s
};
const cleanupAndReconnect = (args) => {
    stopHeartbeat();
    reconnectDelay = Math.min(reconnectDelay * 2, 30000); // exponential backoff
    setTimeout(() => createZitiEventWebSocket(args), reconnectDelay);
};
const createZitiEventWebSocket = (_a) => __awaiter(void 0, [_a], void 0, function* ({ onMessage, subscriptions }) {
    const agent = new https_1.default.Agent({ rejectUnauthorized: false });
    ws = new ws_1.WebSocket(`${process.env.ZITI_WEBSOCKET_CONTROLLER_URL}/fabric/v1/ws-api`, {
        agent: agent,
        headers: {
            'Content-Type': 'application/json',
            'zt-session': yield (0, exports.token)()
        }
    });
    ws.on('open', () => {
        console.log('Ziti WS connected');
        ws === null || ws === void 0 ? void 0 : ws.send(subscribeMessage(subscriptions));
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
        const str = parseMessage(msg);
        if (str === 'success' || !str)
            return;
        onMessage(JSON.parse(str));
    });
    ws.on('error', () => {
        console.error('Ziti WS error');
        ws === null || ws === void 0 ? void 0 : ws.close();
    });
    ws.on('pong', () => {
        if (pongTimeout)
            clearTimeout(pongTimeout);
        // console.log('Pong received');
    });
});
exports.default = createZitiEventWebSocket;
