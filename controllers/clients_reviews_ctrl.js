import { clientsReviewsModel } from "../models/clients_review/clients_reviews_model.js";

export const getClientsReviewsData = async (req, res) => {
  try {
    const reviews = await clientsReviewsModel.findOne();

    return res.status(200).json(reviews);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error });
  }
};

export const addReviews = async (req, res, next) => {
  try {
    const newReview = new clientsReviewsModel();

    if (req.files["imgs"]) {
      const reviewsImg = req.files["imgs"];
      const imageUrls = [];
      if (!reviewsImg || !Array.isArray(reviewsImg)) {
        return res
          .status(404)
          .json({ message: "Attached files are missing or invalid." });
      }

      for (const image of reviewsImg) {
        if (!image) {
          return res
            .status(404)
            .json({ message: "Attached file is not an image." });
        }

        const imageUrl = `${process.env.BASE_URL}/${image.path.replace(
          /\\/g,
          "/"
        )}`;
        imageUrls.push(imageUrl);
      }
      newReview.images = imageUrls;
    }

    const savedReview = await newReview.save();
    return res.status(201).json(savedReview);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const editReview = async (req, res, next) => {
  try {
    const { removeImages } = req.body;

    const review = await clientsReviewsModel.findOne();
    if (!review) return res.status(404).json("Reviews not found");

    if (removeImages) {
      review.images = review.images.filter(
        image => !removeImages.includes(image)
      );
    }

    if (req.files) {
      if (req.files["imgs"]) {
        const mainSliderImg = req.files["imgs"];
        const imageUrls = [];

        for (const image of mainSliderImg) {
          const imageUrl = `${process.env.BASE_URL}${image.path.replace(
            /\\/g,
            "/"
          )}`;
          imageUrls.push(imageUrl);
        }

        review.images = review.images.concat(imageUrls);
      }
    }

    const updatedSlider = await review.save();

    return res.status(200).json(updatedSlider);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
