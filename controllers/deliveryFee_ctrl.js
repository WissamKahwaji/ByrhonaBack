import { deliveryFeeModel } from "../models/deliveryFee/delivery_fee_model.js";

export const getDeliveryFeeData = async (req, res) => {
  try {
    const fee = await deliveryFeeModel.findOne();

    return res.status(200).json(fee);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error });
  }
};

export const editDeliveryFeeData = async (req, res) => {
  try {
    const userId = req.userId;
    const adminId = process.env.ADMIN_ID;

    if (userId !== adminId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const { insideUae, outsideUae } = req.body;
    const fee = await deliveryFeeModel.findOne();
    if (insideUae) fee.insideUae = insideUae;
    if (outsideUae) fee.outsideUae = outsideUae;
    const updatedFee = await fee.save();
    return res.status(200).json(updatedFee);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error });
  }
};
