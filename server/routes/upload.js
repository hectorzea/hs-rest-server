const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const User = require("../model/user");
const Product = require("../model/product");
const fs = require("fs");
const path = require("path");

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
  })
);

function uploadImage(res, sId, NombreArchivo, sType) {
  let oSchemaToUpload = sType === "users" ? User : Product; 

  oSchemaToUpload.findById(sId, (err, oDBRecord) => {
    if (err) {
      deleteFile(sType, oDBRecord.img);
      return res.status(500).json({ ok: false, err });
    }
    if (!oDBRecord) {
      deleteFile(sType, oDBRecord.img);
      return res.status(403).json({ ok: false, err });
    }

    deleteFile(sType, oDBRecord.img);

    oDBRecord.img = NombreArchivo;
    oDBRecord.save((err, oDBRecordSaved) => {
      if (err) return res.status(500).json({ ok: false, err });
      res.json({
        ok: true,
        newImage: NombreArchivo,
        oDBRecordSaved
      });
    });
  });
}


function deleteFile(type, sPath) {
  let imagePath = path.resolve(
    __dirname,
    `../../server/uploads/${type}/${sPath}`
  );
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
}

/**
 * SUBIR IMAGEEEEEN
 */
app.post("/upload/:tipo/:id", function(req, res) {
  let sType = req.params.tipo;
  let sId = req.params.id;

  if (!sType) {
    return res.status(403).json({
      ok: false,
      msg: "Tiene que especificar si es producto/categoria"
    });
  }

  if (!sId) {
    return res.status(403).json({
      ok: false,
      msg: "Tiene que especificar el id de producto/categoria"
    });
  }

  if (Object.keys(req.files).length == 0) {
    return res.status(400).json({
      ok: false,
      msg: "No se ha seleccionado ningun archivo"
    });
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.inputFile;
  let validExtensions = ["jpg", "png", "gif", "jpeg"];
  let aSplit = sampleFile.name.split(".");
  let sExtension = aSplit[1];
  let sName = sampleFile.name;
  let bValidExtension = validExtensions.find(e => {
    return e === sExtension;
  });

  if (!bValidExtension) {
    return res.status(403).json({
      ok: false,
      msg: "FILE EXTENSION not allawed"
    });
  }

  //cambiar nombre archivo
  let NombreArchivo = `${sId}-${new Date().getMilliseconds()}.${sExtension}`;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(`uploads/${sType}/${NombreArchivo}`, function(err) {
    if (err)
      return res.status(500).json({
        ok: false,
        msg: "ERROR INTERNO AL SUBIR ARCHIVO",
        err: err
      });
      uploadImage(res, sId, NombreArchivo, sType);
  });
});

module.exports = app;
