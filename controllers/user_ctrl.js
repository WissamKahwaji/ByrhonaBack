import bcrypt from "bcrypt";
import { UserModel } from "../models/user/user_model.js";
import { validationResult } from "express-validator";

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

    res.status(200).json({
      result: existingUser,
      message: "LogIn Successfuled",
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

    return res.status(201).json({
      result: newUser,
      message: "User created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};