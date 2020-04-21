const ProductModel = require("../models/product");
const CartModel = require("../models/cart");

exports.getProducts = (req, res, next) => {
  ProductModel.fetchAll()
    .then(([rows, fields]) => {
      res.render("shop/product-list", {
        pageTitle: "Products",
        prods: rows,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productID = req.params.productId;
  ProductModel.findById(productID)
    .then(([rows, fields]) => {
      res.render("shop/product-detail", {
        pageTitle: "Product Details",
        product: rows[0],
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  ProductModel.fetchAll()
    .then(([rows, fields]) => {
      res.render("shop/index", {
        pageTitle: "All Products",
        prods: rows,
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  CartModel.getCart((cart) => {
    ProductModel.fetchAll((products) => {
      const cartProducts = [];
      for (let pro of products) {
        const cartExistProduct = cart.products.find((p) => p.id === pro.id);
        if (cartExistProduct) {
          cartProducts.push({ productData: pro, qty: cartExistProduct.qty });
        }
      }
      const updatedCart = { ...cart, products: cartProducts };
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        cart: updatedCart,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  ProductModel.findById(productId, (product) => {
    CartModel.addProduct(productId, product.price);
    res.redirect("/cart");
  });
};

exports.postdeleteCartItem = (req, res, next) => {
  const pId = req.body.id;
  ProductModel.findById(pId, (product) => {
    CartModel.deleteProduct(pId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
