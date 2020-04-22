const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorCtrl = require("./controllers/error");
const sequelize = require("./utils/database");
const ProductModel = require("./models/product");
const UserModel = require("./models/user");
const CartModel = require("./models/cart");
const CartItemModel = require("./models/cartItem");
const OrderModel = require("./models/order");
const OrderItemModel = require("./models/orderItem");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600 }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  const user = await UserModel.findByPk(1);
  req.user = user;
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorCtrl.get404);

ProductModel.belongsTo(UserModel, { constraints: true, onDelete: "CASCADE" });
UserModel.hasMany(ProductModel);
UserModel.hasOne(CartModel);
CartModel.belongsTo(UserModel);
ProductModel.belongsToMany(CartModel, { through: CartItemModel });
CartModel.belongsToMany(ProductModel, { through: CartItemModel });
OrderModel.belongsTo(UserModel);
UserModel.hasMany(OrderModel);
OrderModel.belongsToMany(ProductModel, { through: OrderItemModel });

sequelize
  .sync()
  .then(async (rs) => {
    const user = await UserModel.findByPk(1);
    if (!user) {
      const newUser = await UserModel.create({
        name: "faisal",
        email: "test@test.com",
      });
      await newUser.createCart();
    } else {
      // await user.createCart();
    }

    app.listen(3000);
    console.log("Database Connected!");
  })
  .catch((err) => {
    console.log("database Not Connected!");
  });
