import mongoose from "mongoose";

const logoSchema = new mongoose.Schema({
  image: String,
});

export const logoModel = mongoose.model("logo", logoSchema);
