import express from "express";
import {
  addProductData,
  deleteProduct,
  editProductData,
  getLastSixProducts,
  getProductData,
  getProductDataById,
  getTopTenCheapestProducts,
  getTopTenExpensiveProducts,
  uploadVideo,
} from "../controllers/product_ctrl.js";

const router = express.Router();

router.get("/", getProductData);
router.get("/get-last-six", getLastSixProducts);
router.get("/get-top-ten-expensive", getTopTenExpensiveProducts);
router.get("/get-top-ten-cheapest", getTopTenCheapestProducts);
router.get("/:id", getProductDataById);
router.post("/add", addProductData);
router.put("/edit/:id", editProductData);
router.put("/delete/:id", deleteProduct);
router.post("/upload-video", uploadVideo);

export default router;
