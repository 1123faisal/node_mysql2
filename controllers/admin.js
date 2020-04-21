const ProductModel = require("../models/product");

exports.getProducts = (req, res, next) => {
  ProductModel.fetchAll()
    .then(([rows, fields]) => {
      res.render("admin/products", {
        pageTitle: "Admin Products",
        prods: rows,
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddPproduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    edit: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  ProductModel.findById(req.params.productId)
    .then(([row, fields]) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/add-product",
        product: row[0],
        edit: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const desc = req.body.desc;
  const product = new ProductModel(id, title, imgUrl, price, desc);
  product.save();
  res.redirect("/admin/products");
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const desc = req.body.desc;
  const product = new ProductModel(null, title, imgUrl, price, desc);
  product
    .save()
    .then((rs) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const pid = req.body.id;
  ProductModel.removeById(pid)
    .then((rs) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
