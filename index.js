import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import contactRoutes from "./routes/contact_router.js";
import aboutRoutes from "./routes/about_router.js";
import slidersRoutes from "./routes/slider_router.js";
import categoriesRoutes from "./routes/category_router.js";
import departmentsRoutes from "./routes/department_router.js";
import productssRoutes from "./routes/product_router.js";
import collectionsRoutes from "./routes/collection_router.js";
import userRoutes from "./routes/user_router.js";
import orderRoutes from "./routes/order_router.js";
import voucherRoutes from "./routes/voucher_router.js";
import adminRoutes from "./routes/admin_router.js";
import logoRoutes from "./routes/logo_router.js";
import deliveryFeeRoutes from "./routes/delivery_fee_router.js";

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "video/mp4" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).fields([
    { name: "img", maxCount: 1 },
    { name: "imgs", maxCount: 5 },
    { name: "mainSliderImg", maxCount: 9 },
    { name: "contentImgs", maxCount: 5 },
    { name: "videos", maxCount: 5 },
  ])
);

app.use("/contact", contactRoutes);
app.use("/about", aboutRoutes);
app.use("/sliders", slidersRoutes);
app.use("/categories", categoriesRoutes);
app.use("/departments", departmentsRoutes);
app.use("/products", productssRoutes);
app.use("/collections", collectionsRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/voucher", voucherRoutes);
app.use("/admin", adminRoutes);
app.use("/logo", logoRoutes);
app.use("/deliveryFee", deliveryFeeRoutes);

app.get("/", (req, res) => res.send("Server is Ready"));

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.CONNECTION_URL;

mongoose
  .connect(CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server Running on ${PORT}`);
    })
  )
  .catch(error => console.log(error.message));

mongoose.set("strictQuery", true);
