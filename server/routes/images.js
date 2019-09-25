const express = require("express");
const fs = require("fs");
const path = require("path");
const { verifyTokenImage } = require("../middlewares/authentication");
let app = express();

app.get("/image/:type/:img", verifyTokenImage, (req, res) => {
  let tipo = req.params.type;
  let img = req.params.img;
  let pathImg = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    let noImagePath = path.resolve(__dirname, "../assets/Screenshot_7.png");
    res.sendFile(noImagePath);
  }
});

module.exports = app;
