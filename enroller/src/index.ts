import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
    try {
        res.json({ message: 'Hello!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

app.listen(4000, () => {
    console.log('Server is running');
})
