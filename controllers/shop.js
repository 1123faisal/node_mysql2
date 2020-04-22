const ProductModel = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.findAll();
    res.render("shop/product-list", {
      pageTitle: "Products",
      prods: products,
      path: "/products",
    });
  } catch (error) {
    console.log(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const productID = req.params.productId;
    const product = await ProductModel.findByPk(productID);
    res.render("shop/product-detail", {
      pageTitle: "Product Details",
      product: product,
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await ProductModel.findAll();
    res.render("shop/index", {
      pageTitle: "All Products",
      prods: products,
      path: "/",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    let totalPrice = 0;
    products.forEach((p) => (totalPrice += p.price * p.cartitem.quantity));
    res.render("shop/cart", {
      pageTitle: "Cart",
      path: "/cart",
      products: products,
      totalPrice: totalPrice,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const cart = await req.user.getCart();
    const cartProducts = await cart.getProducts({ where: { id: productId } });
    let product;
    let newQuantity = 1;
    if (cartProducts.length > 0) {
      product = cartProducts[0];
    }
    if (product) {
      newQuantity += product.cartitem.quantity;
    } else {
      product = await ProductModel.findByPk(productId);
    }
    await cart.addProduct(product, { through: { quantity: newQuantity } });
    res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

exports.postdeleteCartItem = async (req, res, next) => {
  try {
    const pId = req.body.id;
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: pId } });
    await products[0].cartitem.destroy();
    res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders({ include: ["products"] });
    res.render("shop/orders", {
      pageTitle: "Orders",
      path: "/orders",
      orders: orders,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const order = await req.user.createOrder();
    await order.addProducts(
      products.map((product) => {
        product.orderitem = { quantity: product.cartitem.quantity };
        return product;
      })
    );
    await cart.setProducts(null);
    res.redirect("/orders");
  } catch (error) {
    console.log(error);
  }
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
