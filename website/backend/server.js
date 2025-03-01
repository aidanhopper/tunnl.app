import express from 'express';

const PORT = process.env.PORT;

const app = express();

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
