import express from "express";
import {
  addProductData,
  createPaymentIntent,
  deleteProduct,
  editallProductQuantity,
  editProductData,
  getConfig,
  getLastSixProducts,
  getOffersProducts,
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
router.get("/get-offers-products", getOffersProducts);
router.post("/add", addProductData);
router.put("/edit/:id", editProductData);
router.put("/delete/:id", deleteProduct);
router.post("/upload-video", uploadVideo);
router.post("/edit-product-quantity", editallProductQuantity);
router.post("/create-payment", createPaymentIntent);
router.get("/config", getConfig);
router.get("/:id", getProductDataById);

export default router;
