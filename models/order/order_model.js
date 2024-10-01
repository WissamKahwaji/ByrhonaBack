import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    userName: String,
    email: String,
    country: String,
    city: String,
    userStreet: String,
    userBuilding: String,
    userFloorNo: String,
    userUnitNo: String,
    userMobileNumber: String,
    userNote: String,
    orderStatus: String,
    cartItemsTotalPrice: Number,
    paymentMethod: String,
    cartItems: [
      {
        id: String,
        img: String,
        title: String,
        price: {
          priceAED: Number,
          priceUSD: Number,
        },
        quantity: Number,
        note: String,
      },
    ],
  },
  { timestamps: true }
);
export const orderModel = mongoose.model("Order", orderSchema);
