import express from "express";
import {
  addOrder,
  deleteOrderById,
  getOrderById,
  getOrders,
  getUserOrders,
} from "../controllers/order_ctrl.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.post("/submit", addOrder);
router.get("/user-orders/:userId", getUserOrders);
router.get("/", getOrders);
router.delete("/delete-order/:id", auth, deleteOrderById);
router.get("/:id", getOrderById);

export default router;
