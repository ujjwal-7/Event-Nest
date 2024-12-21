'use strict';
const {
  Model
} = require('sequelize');
const { enums} = require("../utils/index");
const { PENDING, COMPLETED, CANCELLED } = enums.orderStatus;

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      this.belongsTo(models.Event, {
        foreignKey: 'eventId',
        as: 'event'
      });
    }
  }
  Order.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    paymentGatewayOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    status: {
      type: DataTypes.ENUM,
      values: [PENDING, CANCELLED, COMPLETED],
      defaultValue: PENDING,
      allowNull: false
    },
    
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    totalCost:{
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};