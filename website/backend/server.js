const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3123;

const app = express();



app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
