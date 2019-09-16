const express = require("express");
let { verifyToken, checkAdminRoles } = require("../middlewares/authentication");
let app = express();
const _ = require("lodash");

let Category = require("../model/category");

//todos los servicios tienen que validar por token

//crear un servicio que muestre todas las categorias.
app.get("/category", verifyToken, (request, response) => {
  Category.find({}).populate("usuario").exec((err, Categories) => {
    if (err) return response.status(500).json({ ok: false, err });
    response.json({
      ok: true,
      Categories
    });
  });
});

//crear un servicio que muestre una categoria por id (findById)
app.get("/category/:category_id", verifyToken, (request, response) => {
  let sCategoryId = request.params.category_id;
  Category.findById(sCategoryId, (err, Category) => {
    if (err) return response.status(500).json({ ok: false, err });
    if (!Category) {
      return response.status(404).json({ ok: false, err: err });
    }
    response.json({
      ok: true,
      Category
    });
  });
});

//crear un servicio que CREE una nueva categoria y que devuelva la nueva categoria. req.usuario.id
app.post("/category", verifyToken, (request, response) => {
  let body = request.body;
  let category = new Category({
    name: body.name,
    usuario: request.user._id
  });
  category.save((err, categoryDB) => {
    if (err) return response.status(400).json({ ok: false, err });
    response.json({
      ok: true,
      categoryDB
    });
  });
});

//crear un servicio que modifique una categoria por id de categoria
app.put("/category/:category_id", verifyToken, (request, response) => {
  let sCategoryId = request.params.category_id;
  let oCategory = _.pick(request.body, ["name"]);
  Category.findByIdAndUpdate(
    sCategoryId,
    oCategory,
    { runValidators: true, new: true },
    (err, oCategory) => {
      if (err) return response.status(400).json({ ok: false, err });
      response.json({
        ok: true,
        oCategory
      });
    }
  );
});

//crear un servicio que elimine una categoria. por id solo la pueda borrar un administrador, y que pida token, ELIMINACION FISICA

app.delete(
  "/category/:category_id",
  [verifyToken, checkAdminRoles],
  (request, response) => {
    let sCategoryId = request.params.category_id;
    Category.findByIdAndRemove(sCategoryId, (err, deletedCategory) => {
      if (err) return response.status(400).json({ ok: false, err });
      if (!deletedCategory)
        return response
          .status(400)
          .json({ ok: false, err: "Category not found to delete" });
      response.json({
        ok: true,
        deletedCategory
      });
    });
  }
);

module.exports = app;
