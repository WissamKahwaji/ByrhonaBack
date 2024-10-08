import { sliderModel } from "../models/sliders/slider_model.js";

export const getSliderData = async (req, res) => {
  try {
    const slider = await sliderModel.findOne();

    return res.status(200).json(slider);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error });
  }
};

export const addSliders = async (req, res, next) => {
  try {
    const newSliders = new sliderModel({});
    if (req.files["mainSliderImg"]) {
      const mainSliderImg = req.files["mainSliderImg"];
      const imageUrls = [];
      if (!mainSliderImg || !Array.isArray(mainSliderImg)) {
        return res
          .status(404)
          .json({ message: "Attached files are missing or invalid." });
      }

      for (const image of mainSliderImg) {
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
      newSliders.images = imageUrls;
    }

    const savedSlider = await newSliders.save();
    return res.status(201).json(savedSlider);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const editSlider = async (req, res, next) => {
  try {
    const { sliderId } = req.params;
    const { removeMainSliderImages } = req.body;

    const slider = await sliderModel.findById(sliderId);
    if (!slider) return res.status(404).json("Slider not found");

    if (removeMainSliderImages) {
      slider.images = slider.images.filter(
        image => !removeMainSliderImages.includes(image)
      );
    }

    if (req.files) {
      if (req.files["mainSliderImg"]) {
        const mainSliderImg = req.files["mainSliderImg"];
        const imageUrls = [];

        for (const image of mainSliderImg) {
          const imageUrl = `${process.env.BASE_URL}/${image.path.replace(
            /\\/g,
            "/"
          )}`;
          imageUrls.push(imageUrl);
        }

        slider.images = slider.images.concat(imageUrls);
      }
    }
    const updatedSlider = await slider.save();

    return res.status(200).json(updatedSlider);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
