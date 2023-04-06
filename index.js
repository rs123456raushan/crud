const connectMongo = require('./db');
const express = require('express');
var cors = require('cors');
const port = 8000;

connectMongo();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', require('./auth'));

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
})