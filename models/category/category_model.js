import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: String,
  nameAr: String,
  nameFr: String,
  img: String,
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
});

export const CategoryModel = mongoose.model("Category", categorySchema);
