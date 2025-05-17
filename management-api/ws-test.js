import { WebSocket } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

console.log('token', process.env.MANAGEMENT_API_TOKEN)
const ws = new WebSocket(`http://localhost:4000/ws/events?token=${process.env.MANAGEMENT_API_TOKEN}`);

ws.on('open', () => {
    console.log('Connected to server');
});

ws.on('message', (data) => {
    try {
        const jason = JSON.parse(data.toString());
        console.log(jason);
    } catch (err) {
        console.error(err);
    }
});

ws.on('close', () => {
    console.log('Connection closed');
});

ws.on('error', (err) => {
    console.error('WebSocket error:', err);
});
