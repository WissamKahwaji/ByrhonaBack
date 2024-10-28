import express from "express";
import auth from "../middlewares/auth.js";
import {
  addReviews,
  editReview,
  getClientsReviewsData,
} from "../controllers/clients_reviews_ctrl.js";

const router = express.Router();

router.get("/", getClientsReviewsData);
router.post("/add-review", auth, addReviews);
router.put("/edit/", auth, editReview);

export default router;
