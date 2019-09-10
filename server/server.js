require("./config/config");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//router global config
app.use(require("./routes/index"));
app.use(express.static(path.resolve(__dirname, "../server/public")));
console.log(path.resolve(__dirname, "../server/public"))

mongoose.connect(
  process.env.DATABASEURL,
  { useNewUrlParser: true, useCreateIndex: true },
  err => {
    if (err) throw err;
    console.log("Up and going <3 =3");
  }
);

app.listen(process.env.PORT, () => {
  console.log("Listening on", 3000);
});
