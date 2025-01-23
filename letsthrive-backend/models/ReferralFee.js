const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ReferralFee = sequelize.define(
  "ReferralFee",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    productCategory: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "e.g., 'Automotive', 'Baby', 'Books'",
    },
    subCategory: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "e.g., 'Helmets', 'Vehicles' (optional for finer granularity)",
    },
    priceRange: {
      type: DataTypes.RANGE(DataTypes.DECIMAL(10, 2)),
      allowNull: false,
      comment: "e.g., [0, 500), [500, infinity)",
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: "Referral fee percentage",
    },
  },
  {
    tableName: "ReferralFee",
    timestamps: false, // Disable timestamps
  }
);

module.exports = ReferralFee;
