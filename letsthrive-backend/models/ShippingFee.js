const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ShippingFee = sequelize.define(
  "ShippingFee",
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
        isIn: [['Easy Ship', 'FBA', 'Self Ship']],
      },
    },
    serviceLevel: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isIn: [['Premium', 'Advanced', 'Standard', 'Basic']],
      },
    },
    productSize: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isIn: [['Standard', 'Heavy & Bulky']],
      },
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isIn: [['Local', 'Regional', 'National', 'IXD']],
      },
    },
    weightMin: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    weightMax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    pricingType: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isIn: [['range', 'additional']],
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "ShippingFee",
    timestamps: false,
  }
);

module.exports = ShippingFee;