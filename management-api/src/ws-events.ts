import { WebSocketServer, WebSocket } from "ws";
// import http from 'http';
import { watch } from 'chokidar';
import fs from 'fs';
import dotenv from 'dotenv'

dotenv.config();

const clients = new Set<WebSocket>();

const LOG_FILE = process.env.ZITI_LOG_FILE || '';

let lastSize = 0;

export const configureWsEvents = (conn: WebSocketServer) => {
    conn.on('connection', (ws: WebSocket) => {
        console.log('Client connected')
        clients.add(ws);

        ws.on('close', () => {
            console.log('Client disconnected');
            clients.delete(ws);
        });

        ws.on('error', () => {
            clients.delete(ws);
        });
    });

    watch(LOG_FILE, { awaitWriteFinish: false }).on('change', filePath => {
        const stat = fs.statSync(filePath);

        if (stat.size < lastSize) lastSize = 0;

        const stream = fs.createReadStream(filePath, {
            start: lastSize,
            end: stat.size,
            encoding: 'utf-8',
            highWaterMark: 64 * 1024
        });

        let leftover = '';

        stream.on('data', chunk => {
            const lines = (leftover + chunk).split('\n');
            leftover = lines.pop() ?? '';

            lines.forEach(line => {
                if (line.trim())
                    clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN)
                            client.send(line);
                    });
            });
        });

        stream.on('end', () => {
            lastSize = stat.size;
        });
    });
}
