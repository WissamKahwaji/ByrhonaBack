import express from "express";
import auth from "../middlewares/auth.js";
import {
  getCollectionById,
  getCollectionsData,
} from "../controllers/collection_ctrl.js";

const router = express.Router();

router.get("/", getCollectionsData);
router.get("/:id", getCollectionById);

export default router;
