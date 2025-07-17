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
const promises_1 = __importDefault(require("fs/promises"));
const pg_1 = require("pg");
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const ziti_ws_1 = __importDefault(require("./ziti-ws"));
dotenv_1.default.config({
    path: './../.env',
});
const client = new pg_1.Client({
    connectionString: process.env.DATABASE_URL,
});
const io = new socket_io_1.Server(Number(process.env.PUBLISHER_PORT || 1234), {
    cors: {
        origin: "*",
    },
});
const updateIdentityStatus = (ziti_id, is_online) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.query(`
        UPDATE identities
        SET is_online = $1,
            last_seen = NOW()
        WHERE ziti_id = $2
    `, [is_online, ziti_id]);
    }
    catch (err) {
        console.error(err);
    }
});
const insertServiceDial = (e) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.query(`
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
    }
    catch (err) {
        console.error(err);
    }
});
const logEvent = (e) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const out = JSON.stringify(e);
        promises_1.default.appendFile('publisher.log', out + '\n');
    }
    catch (_a) { }
});
// to be inserted into the events table the event needs
// namespace
// eventType
// id
const transformEvent = (e) => __awaiter(void 0, void 0, void 0, function* () {
    switch (e.namespace) {
        case 'entityChange':
            switch (e.eventType) {
                case 'committed':
                    return null;
                case 'updated':
                    return {
                        namespace: 'entityChange',
                        eventType: 'updated',
                        entityType: e.entityType,
                        timestamp: e.timestamp,
                        id: e.initialState.id
                    };
                case 'created':
                    return {
                        namespace: 'entityChange',
                        eventType: 'created',
                        entityType: e.entityType,
                        timestamp: e.timestamp,
                        id: e.finalState.id
                    };
                case 'deleted':
                    return {
                        namespace: 'entityChange',
                        eventType: 'deleted',
                        entityType: e.entityType,
                        timestamp: e.timestamp,
                        id: e.initialState.id
                    };
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
            };
        case 'circuit':
            return null;
        default: return null;
    }
});
const subscribers = new Map();
const publishEvent = (topic, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        subscribers.forEach((topics, socketId) => {
            topics.forEach(topicRegex => {
                if (topicRegex.test(topic))
                    io.to(socketId).emit('event', payload);
            });
        });
    }
    catch (err) {
        console.error(err);
    }
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.connect();
    try {
        (0, ziti_ws_1.default)({
            subscriptions: [
                { type: "entityChange", options: null },
                { type: "service", options: null },
                { type: "sdk", options: null },
                { type: "circuit", options: null },
            ],
            onMessage: (msg) => __awaiter(void 0, void 0, void 0, function* () {
                yield logEvent(msg);
                const payload = yield transformEvent(msg);
                if (!payload || !payload.namespace)
                    return;
                switch (payload.namespace) {
                    case 'entityChange':
                        const topic1 = `${payload.namespace}:${payload.entityType}:${payload.id}`;
                        publishEvent(topic1, payload);
                        break;
                    case 'sdk':
                        const topic2 = `${payload.namespace}:identities:${payload.id}`;
                        publishEvent(topic2, payload);
                        updateIdentityStatus(payload.id, payload.eventType === 'sdk-online');
                        break;
                    case 'service':
                        insertServiceDial(payload);
                    default: break;
                }
            })
        });
        io.on("connection", (socket) => {
            const { token } = socket.handshake.auth;
            if (!process.env.PUBLISHER_JWT_SECRET)
                throw new Error('No jwt secret defined');
            try {
                const payload = jsonwebtoken_1.default.verify(token, process.env.PUBLISHER_JWT_SECRET);
                // console.log('connect');
                subscribers.set(socket.id, payload.topics.map(s => RegExp(s)));
                socket.on("disconnect", () => {
                    subscribers.delete(socket.id);
                    // console.log('disconnect');
                });
            }
            catch (err) {
                console.error(err);
                socket.disconnect();
                return;
            }
        });
    }
    catch (err) {
        console.error(err);
    }
});
exports.default = main();
