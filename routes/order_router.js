import express from "express";
import { addOrder, getUserOrders } from "../controllers/order_ctrl.js";

const router = express.Router();

router.post("/submit", addOrder);
router.get("/user-orders/:userId", getUserOrders);

export default router;
