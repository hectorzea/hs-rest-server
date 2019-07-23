require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(require('./routes/cards'));
app.use(require('./routes/users'));

mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useCreateIndex: true}, (err) => {
    if (err) throw err;
    console.log("Up and going <3 =3");
});

app.listen(process.env.PORT, () => {
    console.log("Listening on", 3000);
});
