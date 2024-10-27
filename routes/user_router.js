import express from "express";
import {
  addProductToFavorites,
  getAllFavorites,
  getUserById,
  removeProductFromFavorites,
  requestVoucherAmount,
  signin,
  signUp,
} from "../controllers/user_ctrl.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Please enter a valid email address"),
    check("password")
      .trim()
      .isLength({ min: 7 })
      .not()
      .isEmpty()
      .withMessage("Please enter a valid email address"),
  ],
  signin
);
router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Please enter a valid email address"),
    check("password")
      .trim()
      .isLength({ min: 7 })
      .not()
      .isEmpty()
      .withMessage("Please enter a valid email address"),
  ],
  signUp
);

router.post("/request-amount/:userId", requestVoucherAmount);
router.post("/favorites/add", addProductToFavorites);
router.post("/favorites/remove", removeProductFromFavorites);

router.get("/favorites/:userId", getAllFavorites);
router.get("/byId/:userId", getUserById);

export default router;
