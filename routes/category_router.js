import express from "express";
import {
  addCategoryData,
  deleteCategoryData,
  editCategoryData,
  getCategoriesData,
  getCategoriesWithProducts,
  getCategoryById,
} from "../controllers/category_ctrl.js";

import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getCategoriesData);
router.get("/category-products", getCategoriesWithProducts);
router.get("/:id", getCategoryById);
router.post("/add", auth, addCategoryData);
router.put("/edit/:id", auth, editCategoryData);
router.delete("/delete/:id", auth, deleteCategoryData);

export default router;
