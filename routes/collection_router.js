import express from "express";
import auth from "../middlewares/auth.js";
import {
  addCollectionData,
  addProductsToCollection,
  deleteCollection,
  editCollectionData,
  getCollectionById,
  getCollectionsData,
  removeProductsFromCollection,
} from "../controllers/collection_ctrl.js";

const router = express.Router();

router.get("/", getCollectionsData);
router.post("/add", auth, addCollectionData);
router.put("/edit/:id", auth, editCollectionData);
router.delete("/:id", auth, deleteCollection);
router.post("/add-products-to-collection/:id", addProductsToCollection);
router.put(
  "/remove-products-from-collection/:id",

  removeProductsFromCollection
);
router.get("/:id", getCollectionById);

export default router;
