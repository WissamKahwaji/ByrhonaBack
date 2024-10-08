import { UserModel } from "../models/user/user_model.js";
import { voucherModel } from "../models/voucher/voucher_model.js";

const generateUniqueVoucherNumber = async () => {
  let voucherNumber;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 9-digit number
    voucherNumber = Math.floor(
      100000000 + Math.random() * 900000000
    ).toString();

    // Check if this card number already exists in the database
    const existingVoucher = await voucherModel.findOne({
      voucherNumber: voucherNumber,
    });
    if (!existingVoucher) {
      isUnique = true;
    }
  }

  return voucherNumber;
};

export const addVoucher = async (req, res) => {
  try {
    const { amount } = req.body;
    const { userId } = req.params;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not found" });
    }

    const voucherNumber = await generateUniqueVoucherNumber();
    const newVoucher = new voucherModel({
      voucherNumber: voucherNumber,
      amount: amount,
      userId: userId,
    });

    const savedVoucher = await newVoucher.save();
    user.voucher = savedVoucher._id;
    await user.save();
    return res.status(201).json(savedVoucher);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error });
  }
};

export const editVoucherAmount = async (req, res) => {
  try {
    const { voucherId } = req.params;
    const { amount } = req.body;
    const voucher = await voucherModel.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ message: "voucher Not found" });
    }
    if (voucher.amount) {
      voucher.amount = Number(voucher.amount) + Number(amount);
    } else {
      voucher.amount = amount;
    }
    const updatedVoucher = await voucher.save();
    return res.status(200).json(updatedVoucher);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error });
  }
};

export const getUserVoucher = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not found" });
    }
    const voucher = await voucherModel.findById(user.voucher);
    return res.status(200).json(voucher);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error });
  }
};
