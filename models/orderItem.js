const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const OrderItem = sequelize.define("orderitem", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: Sequelize.INTEGER,
});

module.exports = OrderItem;
