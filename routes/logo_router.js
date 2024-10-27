import express from "express";

import auth from "../middlewares/auth.js";
import { editLogoData, getLogoData } from "../controllers/logo_ctrl.js";

const router = express.Router();

router.get("/", getLogoData);
router.put("/edit", auth, editLogoData);

export default router;
