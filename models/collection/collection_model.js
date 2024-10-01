import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  image: String,
  name: String,
  nameFr: String,
  nameAr: String,
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

export const collectionModel = mongoose.model("collection", collectionSchema);
