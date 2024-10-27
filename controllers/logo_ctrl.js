import { logoModel } from "../models/logo/logo_model.js";

export const getLogoData = async (req, res) => {
  try {
    const logo = await logoModel.findOne();

    return res.status(200).json(logo);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error });
  }
};

export const editLogoData = async (req, res) => {
  try {
    const userId = req.userId;
    const adminId = process.env.ADMIN_ID;

    if (userId !== adminId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const imgPath =
      req.files && req.files["img"] ? req.files["img"][0].path : null;
    const imgUrl = imgPath
      ? `${process.env.BASE_URL}/${imgPath.replace(/\\/g, "/")}`
      : null;
    const logo = await logoModel.findOne();
    if (!logo) {
      return res.status(404).json({ message: "data not found" });
    }

    if (imgUrl) logo.image = imgUrl;
    const savedLogoData = await logo.save();
    return res.status(200).json(savedLogoData);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error });
  }
};
