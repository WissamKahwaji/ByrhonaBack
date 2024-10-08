import express from "express";

import auth from "../middlewares/auth.js";
import {
  addVoucher,
  editVoucherAmount,
  getUserVoucher,
} from "../controllers/voucher_ctrl.js";

const router = express.Router();

router.post("/add/:userId", addVoucher);
router.put("/edit/:voucherId", editVoucherAmount);
router.get("/user-voucher", auth, getUserVoucher);

export default router;
