import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  img: String,
  imgs: [String],
  videos: [String],
  title: String,
  titleFr: String,
  titleAr: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  desc: String,
  descFr: String,
  descAr: String,
  price: {
    priceAED: Number,
    priceUSD: Number,
  },
  isOffer: Boolean,
  priceAfterOffer: {
    priceAED: Number,
    priceUSD: Number,
  },
  productQuantity: Number,
  notifyUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const Product = mongoose.model("Product", productSchema);
