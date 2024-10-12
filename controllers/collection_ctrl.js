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
    const collectionData = await collectionModel
      .findById(id)
      .populate("products");
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

export const editCollectionData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, nameAr, nameFr } = req.body;
    const userId = req.userId;
    const adminId = process.env.ADMIN_ID;

    if (userId !== adminId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const collection = await collectionModel.findById(id);
    if (!collection) {
      return res.status(404).json({ message: "collection not found" });
    }

    collection.name = name || collection.name;
    collection.nameAr = nameAr || collection.nameAr;
    collection.nameFr = nameFr || collection.nameFr;

    const imgPath =
      req.files && req.files["img"] ? req.files["img"][0].path : null;
    if (imgPath) {
      const imgUrl = `${process.env.BASE_URL}` + imgPath.replace(/\\/g, "/");
      collection.image = imgUrl;
    }
    const updatedCollection = await collection.save();
    return res.status(201).json(updatedCollection);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const adminId = process.env.ADMIN_ID;

    if (userId !== adminId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const collection = await collectionModel.findById(id);

    if (!collection) {
      return res.status(404).json("collection not found");
    }

    const deletedCollection = await collectionModel.findByIdAndDelete(id);

    return res.status(200).json(deletedCollection);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const addProductsToCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { productIds } = req.body;
    // const userId = req.userId;
    // const adminId = process.env.ADMIN_ID;

    // if (userId !== adminId) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    const collection = await collectionModel.findById(id);
    if (!collection) {
      return res.status(404).json("collection not found");
    }

    const productIdsArray = Array.isArray(productIds)
      ? productIds
      : [productIds];
    const newProductIds = productIdsArray.filter(
      productId => !collection.products.includes(productId)
    );
    collection.products.push(...newProductIds);

    await collection.save();

    res.json({ message: "Products added to Collection" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const removeProductsFromCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { productIds } = req.body;
    // const userId = req.userId;
    // const adminId = process.env.ADMIN_ID;

    // if (userId !== adminId) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    const collection = await collectionModel.findById(id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const productIdsArray = Array.isArray(productIds)
      ? productIds
      : [productIds];

    collection.products = collection.products.filter(
      productId => !productIdsArray.includes(productId.toString())
    );

    await collection.save();

    res.json({ message: "Products removed from Collection" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
