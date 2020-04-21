const db = require("../utils/database");
const CartModel = require("./cart");

module.exports = class Product {
  constructor(id, title, imgurl, price, desc) {
    this.id = id;
    this.title = title;
    this.imgurl = imgurl;
    this.price = parseFloat(price);
    this.desc = desc;
  }

  save() {
    return db.query("INSERT INTO products SET ? ", {
      title: this.title,
      price: this.price,
      desc: this.desc,
      imgurl: this.imgurl,
    });
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id=?", [id]);
  }

  static removeById(id) {
    return db.execute("DELETE FROM products WHERE products.id=?", [id]);
  }
};
