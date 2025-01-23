const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const OtherFee = sequelize.define(
  "OtherFee",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    feeType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    applicableMode: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    productSize: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isIn: [['Standard', 'Heavy & Bulky']],
      },
    },
    subType: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    unit: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isIn: [['flat', 'per_cubic_foot', 'per_item']],
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "OtherFee",
    timestamps: false,
  }
);

module.exports = OtherFee;