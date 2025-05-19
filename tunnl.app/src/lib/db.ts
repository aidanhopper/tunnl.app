import pg from 'pg';

declare global {
    // eslint-disable-next-line no-var
    var pgClient: pg.Client | undefined; // Define pgClient type here
}

const client = global.pgClient || new pg.Client({
    connectionString: process.env.DATABASE_URL
});

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

global.pgClient = pgClient;

export default client;
