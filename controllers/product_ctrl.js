import { CategoryModel } from "../models/category/category_model.js";
import { Product } from "../models/product/product_model.js";

export const getProductData = async (req, res, next) => {
  try {
    const productData = await Product.find().populate("category");

    return res.status(200).json(productData);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Something went wrong");
  }
};

export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.query;
    let products;
    if (category) {
      products = await CategoryModel.find({ _id: category }).populate(
        "products"
      );
    } else {
      products = await CategoryModel.find().populate("products");
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getProductDataById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = await Product.findById(id).populate("category");

    return res.status(200).json(productData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getLastSixProducts = async (req, res, next) => {
  try {
    const lastSixProducts = await Product.find()
      .populate("category")
      .sort({ _id: -1 })
      .limit(6);

    return res.status(200).json(lastSixProducts);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getTopTenExpensiveProducts = async (req, res, next) => {
  try {
    const topTenExpensiveProducts = await Product.find()
      .populate("category")
      .sort({ "price.priceAED": -1 })
      .limit(10);

    return res.status(200).json(topTenExpensiveProducts);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getTopTenCheapestProducts = async (req, res, next) => {
  try {
    const topTenCheapestProducts = await Product.find()
      .populate("category")
      .sort({ "price.priceAED": 1 }) // Sort by priceUSD in ascending order to get the cheapest products
      .limit(10); // Limit the results to 10 products

    return res.status(200).json(topTenCheapestProducts);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const addProductData = async (req, res, nex) => {
  try {
    const { title, titleFr, titleAr, category, desc, descFr, descAr, price } =
      req.body;

    const categoryData = await CategoryModel.findById(category);

    if (!categoryData) {
      return res.status(404).json({ message: "No category" });
    }

    const imgPath =
      req.files && req.files["img"] ? req.files["img"][0].path : null;
    const imgUrl = imgPath
      ? `${process.env.BASE_URL}` + imgPath.replace(/\\/g, "/")
      : null;

    const productData = {
      img: imgUrl,
      title: title,
      titleFr: titleFr,
      titleAr: titleAr,
      category: category,
      desc: desc,
      descFr: descFr,
      descAr: descAr,
      price: price,
    };

    if (req.files["imgs"]) {
      const productImages = req.files["imgs"];
      const imageUrls = [];
      if (!productImages || !Array.isArray(productImages)) {
        return res
          .status(404)
          .json({ message: "Attached files are missing or invalid." });
      }

      for (const image of productImages) {
        if (!image) {
          return res
            .status(404)
            .json({ message: "Attached file is not an image." });
        }

        const imageUrl =
          `${process.env.BASE_URL}` + image.path.replace(/\\/g, "/");
        imageUrls.push(imageUrl);
      }
      productData.imgs = imageUrls;
    }
    if (req.files["videos"]) {
      const productVideos = req.files["videos"];
      const videosUrls = [];
      if (!productVideos || !Array.isArray(productVideos)) {
        return res
          .status(404)
          .json({ message: "Attached files are missing or invalid." });
      }

      for (const video of productVideos) {
        if (!video) {
          return res
            .status(404)
            .json({ message: "Attached file is not an image." });
        }

        const videoUrl =
          `${process.env.BASE_URL}` + video.path.replace(/\\/g, "/");
        videosUrls.push(videoUrl);
      }
      productData.videos = videosUrls;
    }

    const product = new Product(productData);
    const savedProduct = await product.save();
    categoryData.products.push(savedProduct._id);
    await categoryData.save();
    return res.status(201).json(savedProduct);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const editProductData = async (req, res, next) => {
  try {
    const { id } = req.params; // Assuming product ID is passed as a URL param
    const { title, titleFr, titleAr, desc, descFr, descAr, price } = req.body;

    // Find existing product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.title = title || product.title;
    product.titleFr = titleFr || product.titleFr;
    product.titleAr = titleAr || product.titleAr;
    product.desc = desc || product.desc;
    product.descFr = descFr || product.descFr;
    product.descAr = descAr || product.descAr;
    product.price = price || product.price;

    const imgPath =
      req.files && req.files["img"] ? req.files["img"][0].path : null;
    if (imgPath) {
      const imgUrl = `${process.env.BASE_URL}` + imgPath.replace(/\\/g, "/");
      product.img = imgUrl;
    }

    if (req.files && req.files["imgs"]) {
      const productImages = req.files["imgs"];
      const imageUrls = [];
      if (Array.isArray(productImages)) {
        for (const image of productImages) {
          const imageUrl =
            `${process.env.BASE_URL}` + image.path.replace(/\\/g, "/");
          imageUrls.push(imageUrl);
        }
      }
      product.imgs = imageUrls;
    }

    // Save updated product
    const updatedProduct = await product.save();

    return res.status(200).json(updatedProduct);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the category associated with the product
    const category = await CategoryModel.findById(product.category);

    if (category) {
      // Remove the product reference from the category's products array
      category.products = category.products.filter(
        productId => productId.toString() !== id
      );
      await category.save();
    }

    // Delete the product
    await Product.findByIdAndDelete(id);

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};