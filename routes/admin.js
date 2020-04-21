const express = require("express");
const adminCtrl = require("../controllers/admin");

const route = express.Router();


route.get("/add-product", adminCtrl.getAddPproduct);

route.post("/add-product", adminCtrl.postAddProduct);

route.get("/products", adminCtrl.getProducts);

route.get("/edit-product/:productId", adminCtrl.getEditProduct);

route.post("/edit-product", adminCtrl.postEditProduct);

route.post("/delete-product", adminCtrl.postDeleteProduct);

module.exports = route;
