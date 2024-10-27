import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
  },

  voucherAmount: Number,
  voucher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "voucher",
  },
  favorites: {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
  },
});

export const UserModel = mongoose.model("user", userSchema);
