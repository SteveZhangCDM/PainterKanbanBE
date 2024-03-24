const mongoose = require("mongoose");

const paintSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      enum: ["blue", "grey", "black", "white", "purple"],
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["available", "running low", "out of stock"],
      required: true,
    },
    quantity: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Paint", paintSchema);
