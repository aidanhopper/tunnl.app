import pg from 'pg';

export interface EventPayload {
    id: string,
    eventType: string,
    namespace: string,
    timestamp: string,
    entityType: string,
}

interface Event {
    topic: string,
    payload: EventPayload
}

export type EventCallback = (payload: EventPayload) => void

declare global {
    // eslint-disable-next-line no-var
    var pgClient: pg.Client | undefined; // Define pgClient type here
    // eslint-disable-next-line no-var
    var pgEventListener: {
        ready: boolean,
        handlers: Map<string, { regexp: RegExp, callback: EventCallback }>
    } | undefined;
}

const client = global.pgClient || new pg.Client({
    connectionString: process.env.DATABASE_URL
});

const pgEventListener = global.pgEventListener ?? {
    ready: false,
    handlers: new Map<string, { regexp: RegExp, callback: EventCallback }>(),
};

if (!global.pgClient) {
    client.connect()
        .then(() => console.log("Connected to PostgreSQL DB"))
        .catch(() => console.error("Error"));
    global.pgClient = client;
}

export const disconnectClient = async () => {
    try {
        await client.end(); // Close the connection
        console.log('Disconnected from PostgreSQL DB');
    } catch {
        console.error('Error during disconnection');
    }
};

if (process.env.NODE_ENV !== 'production') {
    process.on('SIGINT', async () => {
        await disconnectClient();
        process.exit(0); // Exit the process after disconnecting
    });

    process.on('SIGTERM', async () => {
        await disconnectClient();
        process.exit(0); // Exit the process after disconnecting
    });
}

export const startEventListener = async () => {
    if (pgEventListener.ready) return;
    await client.query('LISTEN events');
    client.on('notification', msg => {
        const data = JSON.parse(msg.payload ?? '{}') as Event;
        pgEventListener.handlers.forEach(handler => {
            if (handler.regexp.test(data.topic)) handler.callback(data.payload);
        });
    });
    pgEventListener.ready = true;
}

global.pgClient = pgClient;
global.pgEventListener = pgEventListener;

export default client;
