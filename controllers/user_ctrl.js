import bcrypt from "bcrypt";
import { UserModel } from "../models/user/user_model.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({
      success: false,
      message: "Invalid email or password",
    });
  }
  try {
    let existingUser;
    if (/\S+@\S+\.\S+/.test(email)) {
      // If identifier is an email
      const normalizedEmail = email.toLowerCase();
      existingUser = await UserModel.findOne({
        email: { $regex: new RegExp("^" + normalizedEmail + "$", "i") },
      });
    }
    if (!existingUser)
      return res.status(401).json({ message: "User doesn't exist." });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1y" }
    );
    res.status(200).json({
      result: existingUser,
      message: "LogIn Successfuled",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.json(error);
    }

    let existingUser;
    const normalizedEmail = email.toLowerCase();
    existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(422)
        .json({ message: "User already exists, please login!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await UserModel.create({
      fullName: fullName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    await newUser.save();
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1y" }
    );

    return res.status(201).json({
      result: newUser,
      message: "User created",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const requestVoucherAmount = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;
    console.log(amount);
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.voucherAmount) {
      user.voucherAmount = Number(user.voucherAmount) + Number(amount);
    } else {
      user.voucherAmount = amount;
    }
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
