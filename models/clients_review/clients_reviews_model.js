import mongoose from "mongoose";

const clientsReviewsSchema = new mongoose.Schema({
  images: [String],
});

export const clientsReviewsModel = mongoose.model(
  "clientsReviews",
  clientsReviewsSchema
);
