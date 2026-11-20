const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

module.exports = app;