const express = require('express');
const app = express();
const dotenv = require("dotenv");
const sequelize = require('./db');
const { Op } = require("sequelize");
const ReferralFee = require("./models/ReferralFee");
const ClosingFee = require("./models/ClosingFee");
const ShippingFee = require("./models/ShippingFee");
const OtherFee = require("./models/OtherFee");
const cors = require('cors');

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    sequelize.sync();
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// API Endpoint
app.post("/api/v1/profitability-calculator", async (req, res) => {
  try {
    const {
      productCategory: fullCategory,
      sellingPrice,
      weight,
      shippingMode,
      serviceLevel,
      productSize,
      location,
    } = req.body;

    // Split productCategory into productCategory and subCategory
    const [productCategory, subCategory] = fullCategory.split(" - ").map((str) => str.trim());

    // Calculate Referral Fee
    const referralFeeData = await ReferralFee.findOne({
      where: {
        productCategory,
        subCategory: subCategory || null,
        priceRange: { [Op.contains]: sellingPrice },
      },
    });

    const referralFee = referralFeeData
      ? (sellingPrice * parseFloat(referralFeeData.percentage)) / 100
      : 0;

    // Calculate Closing Fee
    const closingFeeData = await ClosingFee.findOne({
      where: {
        shippingMode,
        priceRange: { [Op.contains]: sellingPrice },
      },
    });

    const closingFee = closingFeeData ? parseFloat(closingFeeData.fee) : 0;

    // Calculate Weight Handling Fee
    let weightHandlingFee = 0;
    const weightHandlingData = await ShippingFee.findAll({
      where: {
        shippingMode,
        serviceLevel,
        productSize,
        location,
        weightMin: { [Op.lte]: weight },
        [Op.or]: [{ weightMax: { [Op.gte]: weight } }, { weightMax: null }],
      },
    });

    weightHandlingData.forEach((fee) => {
      if (fee.pricingType === "range") {
        weightHandlingFee += parseFloat(fee.price);
      } else if (fee.pricingType === "additional") {
        const additionalWeight = Math.max(0, weight - fee.weightMin);
        weightHandlingFee += Math.ceil(additionalWeight) * parseFloat(fee.price);
      }
    });

    // Calculate Pick and Pack Fee
    const pickAndPackData = await OtherFee.findOne({
      where: {
        feeType: "Pick & Pack Fee",
        productSize,
      },
    });

    const pickAndPackFee = pickAndPackData ? parseFloat(pickAndPackData.price) : 0;

    // Calculate Total Fees and Net Earnings
    const totalFees =
      parseFloat(referralFee) +
      parseFloat(closingFee) +
      parseFloat(weightHandlingFee) +
      parseFloat(pickAndPackFee);

    const netEarnings = sellingPrice - totalFees;

    // Response
    res.json({
      referralFee,
      closingFee,
      weightHandlingFee,
      pickAndPackFee,
      totalFees,
      netEarnings,
    });
  } catch (error) {
    console.error("Error calculating profitability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});