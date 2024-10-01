import express from "express";

import auth from "../middlewares/auth.js";
import {
  addAboutData,
  editAboutData,
  getAboutData,
} from "../controllers/about_ctrl.js";

const router = express.Router();

router.get("/", getAboutData);
router.post("/", addAboutData);
router.put("/edit", auth, editAboutData);

export default router;
