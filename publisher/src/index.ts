import { WebSocket } from 'ws';
import fs from 'fs/promises';
import { Client } from 'pg';

const client = new Client({
    connectionString: process.env.DATABASE_URL,
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

const publishEvent = async (topic: string, payload: object) => {
    try {
        await client.query(
            'INSERT INTO events (topic, payload) VALUES ($1, $2)',
            [topic, payload]
        );
    } catch (err) {
        console.error(err);
    }
}

const main = async () => {
    await client.connect();

    const ws = new WebSocket(`${process.env.MANAGEMENT_API_URL}/ws/events?token=${process.env.MANAGEMENT_API_TOKEN}`);

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
        await publishEvent(topic, payload);
    });

    client.on('notification', msg => console.log(msg.payload ? JSON.parse(msg.payload) : ''));

    await client.query('LISTEN events');

}

main();
