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

export const addProductToFavorites = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Find the user by userId

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product already exists in the favorites list
    const isProductInFavorites = user.favorites.products.find(
      item => item.productId.toString() === productId
    );

    if (isProductInFavorites) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    // Add the product to the favorites list
    user.favorites.products.push({ productId });

    // Save the updated user
    await user.save();

    res.status(200).json("Product added to favorites");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeProductFromFavorites = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product exists in the favorites list
    const productIndex = user.favorites.products.findIndex(
      item => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(400)
        .json({ message: "Product not found in favorites" });
    }

    // Remove the product from the favorites list
    user.favorites.products.splice(productIndex, 1);

    // Save the updated user
    await user.save();

    res.status(200).json("Product removed from favorites");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by userId and populate the favorite products
    const user = await UserModel.findById(userId)
      .populate({
        path: "favorites.products.productId",
        select: "img title titleFr titleAr category desc descAr descFr price",
        populate: { path: "category", select: "name nameFr nameAr" },
      })
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the favorite products from the user object
    const favoriteProducts = user.favorites.products.map(favorite => {
      const { productId } = favorite;
      const {
        img,
        title,
        titleFr,
        titleAr,
        category,
        desc,
        descAr,
        descFr,
        price,
      } = productId;
      const categoryName = category ? category.name : null;
      const categoryNameAr = category ? category.nameAr : null;
      const categoryNameFr = category ? category.nameFr : null;

      return {
        productId: productId._id,
        title,
        titleFr,
        titleAr,
        img,
        desc,
        descAr,
        descFr,
        price,
        category: categoryName,
        categoryNameAr,
        categoryNameFr,
      };
    });

    res.status(200).json(favoriteProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
