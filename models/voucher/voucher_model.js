import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
  voucherNumber: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  amount: {
    type: Number,
    required: true,
  },
});

export const voucherModel = mongoose.model("voucher", voucherSchema);
