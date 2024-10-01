import mongoose from "mongoose";

const contactContentSchema = new mongoose.Schema({
  titleOne: String,
  phoneNumber: String,
  mobileOne: String,
  location: String,
  email: String,
  poBox: String,
  whatsApp: String,
  faceBook: String,
  linkedIn: String,
  instagram: String,
  threads: String,
  snapChat: String,
  tiktok: String,
  googleMap: String,
});

export const contactContentModel = mongoose.model(
  "contactContent",
  contactContentSchema
);
