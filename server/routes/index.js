const express = require('express');
const app = express();
app.use(require('./cards'));
app.use(require('./users'));
app.use(require('./login'));
module.exports = app;