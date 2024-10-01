import express from "express";
import auth from "../middlewares/auth.js";
import {
  addSliders,
  editSlider,
  getSliderData,
} from "../controllers/slider_ctrl.js";

const router = express.Router();

router.get("/", getSliderData);
router.post("/add-sliders", auth, addSliders);
router.put("/edit/:sliderId", auth, editSlider);

export default router;
