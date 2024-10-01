import { collectionModel } from "../models/collection/collection_model.js";

export const getCollectionsData = async (req, res, next) => {
  try {
    const collectionsData = await collectionModel.find().select("-products");
    return res.status(200).json(collectionsData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getCollectionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const collectionData = await collectionModel.findById(id);
    return res.status(200).json(collectionData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const addCollectionData = async (req, res, next) => {
  try {
    const { name, nameAr, nameFr } = req.body;

    const imgPath =
      req.files && req.files["img"] ? req.files["img"][0].path : null;
    const imgUrl = imgPath
      ? `${process.env.BASE_URL}` + imgPath.replace(/\\/g, "/")
      : null;
    const newCollection = new collectionModel({
      name,
      nameAr,
      nameFr,
      image: imgUrl,
    });
    const savedNewCollection = await newCollection.save();
    return res.status(201).json(savedNewCollection);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
