const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ClosingFee = sequelize.define(
  "ClosingFee",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    shippingMode: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isIn: [['Easy Ship', 'FBA', 'Self Ship', 'Seller Flex']],
      },
      comment: "Shipping mode for the closing fee",
    },
    priceRange: {
      type: DataTypes.RANGE(DataTypes.DECIMAL(10, 2)),
      allowNull: false,
      comment: "Price range for the closing fee, e.g., [0, 250), [250, 500)",
    },
    fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Closing fee for the given price range and shipping mode",
    },
  },
  {
    tableName: "ClosingFee",
    timestamps: false, // Disable timestamps
  }
);

module.exports = ClosingFee;