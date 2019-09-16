const express = require("express");
const app = express();
app.use(require("./cards"));
app.use(require("./users"));
app.use(require("./login"));
app.use(require("./categories"));
app.use(require("./product"));
module.exports = app;
