import { orderModel } from "../models/order/order_model.js";

export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await orderModel.find({ userId: userId });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Something went wrong");
  }
};

export const addOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      email,
      country,
      city,
      userStreet,
      userBuilding,
      userFloorNo,
      userUnitNo,
      userMobileNumber,
      userNote,
      orderStatus,
      cartItemsTotalPrice,
      paymentMethod,
      cartItems,
    } = req.body;

    const newOrder = new orderModel({
      userId: userId,
      userName,
      email,
      country,
      city,
      userStreet,
      userBuilding,
      userFloorNo,
      userUnitNo,
      userMobileNumber,
      userNote,
      orderStatus,
      cartItemsTotalPrice,
      paymentMethod,
      cartItems,
    });

    await newOrder.save();

    return res.status(201).json({
      message: "Order added successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Something went wrong");
  }
};
