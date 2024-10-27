import mongoose from "mongoose";

const deliveryFeeSchema = new mongoose.Schema({
  insideUae: Number,
  outsideUae: Number,
});

export const deliveryFeeModel = mongoose.model(
  "deliveryFee",
  deliveryFeeSchema
);
