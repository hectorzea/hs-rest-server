const express = require("express");
let { verifyToken, checkAdminRoles } = require("../middlewares/authentication");
let app = express();
const _ = require("lodash");

let Product = require("../model/product");

//get de productos paginado popular con usuario y categoria y paginar
app.get("/product", verifyToken, (request, response) => {
  let iFrom = Number(request.query.from) || 0;
  let iLimit = Number(request.query.limit) || 5;
  Product.find({})
    .limit(iLimit)
    .skip(iFrom)
    .populate("categoria usuario")
    .exec((err, Categories) => {
      if (err) return response.status(500).json({ ok: false, err });
      response.json({
        ok: true,
        Categories
      });
    });
});

//GET PRODUCTOS CON QUERY STRING
app.get("/product/find/:query_string", verifyToken, (request, response) => {
  let sQueryString = request.params.query_string;
  let regex = new RegExp(sQueryString, 'i');
  Product.find({nombre:regex})
    .populate("categoria")
    .exec((err, Products) => {
      if (err) return response.status(500).json({ ok: false, err });
      response.json({
        ok: true,
        Products
      });
    });
});

//get de productos por ID popular con usuario y categoria y paginar
app.get("/product/:product_id", verifyToken, (request, response) => {
  let iFrom = Number(request.query.from) || 0;
  let iLimit = Number(request.query.limit) || 5;
  let sProductId = request.params.product_id;
  Product.findById(sProductId)
    .limit(iLimit)
    .skip(iFrom)
    .populate("categoria usuario")
    .exec((err, Product) => {
      if (err) return response.status(500).json({ ok: false, err });
      response.json({
        ok: true,
        Product
      });
    });
});

//post de productos saber que usuario es y grabar una categoria del listado

app.post("/product", verifyToken, (request, response) => {
  let sTokenid = request.user._id;
  let body = request.body;
  let product = new Product({
    nombre: body.name,
    precioUni: body.unit_price,
    descripcion: body.description,
    disponible: body.available,
    categoria: body.category,
    usuario: sTokenid
  });

  product.save((err, oProduct) => {
    if (err) return response.status(500).json({ ok: false, err });
    response.json({
      ok: true,
      oProduct
    });
  });
});

module.exports = app;

//actualizar producto por ID

app.put("/product/:product_id", verifyToken, (request, response) => {
  let sProductId = request.params.product_id;
  let oBody = request.body;
  let oProduct = {
    nombre: oBody.name,
    precioUni: oBody.unit_price,
    descripcion: oBody.description,
    disponible: oBody.available
  };
  Product.findByIdAndUpdate(
    sProductId,
    oProduct,
    { runValidators: true, new: true },
    (err, oProduct) => {
      if (err) return response.status(500).json({ ok: false, err });
      response.json({
        ok: true,
        oProduct
      });
    }
  );
});

//borra un producto cambiando el estado a DISPONIBLE
