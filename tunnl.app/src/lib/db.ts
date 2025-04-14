import pg from 'pg';

declare global {
    // eslint-disable-next-line no-var
    var pgClient: import('pg').Client | undefined; // Define pgClient type here
}


const client = global.pgClient || new pg.Client({
    connectionString: process.env.DATABASE_URL
});

if (process.env.NODE_ENV !== 'production') {
    global.pgClient = client; // Store the client on the global object during dev mode
}

client.connect()
    .then(() => console.log("Connected to PostgreSQL DB"))
    .catch(() => console.error("Error"));

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

export default client;
