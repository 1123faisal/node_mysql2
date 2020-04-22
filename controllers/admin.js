const ProductModel = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await req.user.getProducts();
    res.render("admin/products", {
      pageTitle: "Admin Products",
      prods: products,
      path: "/admin/products",
    });
  } catch (error) {
    console.log(err);
  }
};

exports.getAddPproduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    edit: false,
  });
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const products = await req.user.getProducts(req.params.productId);
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/add-product",
      product: products[0],
      edit: true,
    });
  } catch (error) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const id = req.body.id;
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const price = req.body.price;
    const desc = req.body.desc;
    const product = await ProductModel.findByPk(id);
    product.title = title;
    product.image = imgUrl;
    product.price = price;
    product.desc = desc;
    await product.save();
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const price = req.body.price;
    const desc = req.body.desc;
    await req.user.createProduct({
      title: title,
      image: imgUrl,
      price: price,
      desc: desc,
    });
    // await ProductModel.create({
    //   title: title,
    //   image: imgUrl,
    //   price: price,
    //   desc: desc,
    //   userId: req.user.id,
    // });
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const pid = req.body.id;
    const product = await ProductModel.findByPk(pid);
    await product.destroy();
    res.redirect("/admin/products");
  } catch (error) {
    console.log(err);
  }
};
