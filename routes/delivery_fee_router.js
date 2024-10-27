import express from "express";

import auth from "../middlewares/auth.js";
import {
  editDeliveryFeeData,
  getDeliveryFeeData,
} from "../controllers/deliveryFee_ctrl.js";

const router = express.Router();

router.get("/", getDeliveryFeeData);
router.put("/edit", auth, editDeliveryFeeData);

export default router;
