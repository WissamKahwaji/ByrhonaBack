import { orderModel } from "../models/order/order_model.js";
import { Product } from "../models/product/product_model.js";

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
  const session = await orderModel.startSession(); // Start a session for transaction
  session.startTransaction();

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

    // Create new order
    const newOrder = new orderModel({
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
    });

    // Save the order
    await newOrder.save({ session });

    // Loop through cartItems and update productQuantity
    for (const item of cartItems) {
      const product = await Product.findById(item.id).session(session); // Find the product by ID

      if (!product) {
        throw new Error(`Product with ID ${item.id} not found.`);
      }

      // Decrease productQuantity by the ordered quantity
      if (product.productQuantity >= item.quantity) {
        product.productQuantity -= item.quantity;
        await product.save({ session }); // Save updated product with session
      } else {
        throw new Error(`Product ${item.title} has insufficient stock.`);
      }
    }

    // Commit the transaction after successful product update
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Order added successfully, product quantities updated",
      data: newOrder,
    });
  } catch (error) {
    console.error(error);

    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      message: "Something went wrong while processing the order.",
      error: error.message,
    });
  }
};
