import mongoose from "mongoose";

const aboutContentSchema = new mongoose.Schema({
  img: String,
  title: String,
  titleFr: String,
  titleAr: String,
  text: String,
  textFr: String,
  textAr: String,
});

const aboutSchema = new mongoose.Schema({
  img: String,
  title: String,
  description: String,
  content: [aboutContentSchema.obj],
});

export const aboutModel = mongoose.model("about", aboutSchema);
