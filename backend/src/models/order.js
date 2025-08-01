import { DataTypes } from "sequelize";
import { sequelize } from "../database/index.js";

export const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Pending",
  },
  subTotal: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  items: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});
