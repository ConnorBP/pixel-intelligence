const express = require('express');
const routes = require('./routes/index');

const app = express();

// Middleware to parse JSON
app.use(express.json());

app.use('/', routes);


module.exports = app;