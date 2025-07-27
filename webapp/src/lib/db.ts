import pg from 'pg';

declare global {
    // eslint-disable-next-line no-var
    var pgClient: pg.Pool | undefined; // Define pgClient type here
}

const pool = global.pgClient || new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

if (!global.pgClient) {
    global.pgClient = pool;
}

export const disconnectClient = async () => {
    try {
        await pool.end(); // Close the connection
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

export default pool;
