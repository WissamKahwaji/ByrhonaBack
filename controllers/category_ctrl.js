import { CategoryModel } from "../models/category/category_model.js";
import { DepartmentModel } from "../models/department/department_model.js";
import { Product } from "../models/product/product_model.js";

export const getCategoriesData = async (req, res, next) => {
  try {
    const categoriesData = await CategoryModel.find().select("-products");
    return res.status(200).json(categoriesData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoryData = await CategoryModel.findById(id);
    return res.status(200).json(categoryData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getCategoriesWithProducts = async (req, res, next) => {
  try {
    const { category } = req.query;
    let products;
    if (category) {
      products = await CategoryModel.find({ _id: category })
        .populate("products")
        .populate({
          path: "department",
          select: ["name", "nameAr", "nameFr"],
        });
    } else {
      products = await CategoryModel.find()
        .populate("products")
        .populate({
          path: "department",
          select: ["name", "nameAr", "nameFr"],
        });
    }
    return res.status(200).json(products);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const addCategoryData = async (req, res, next) => {
  try {
    const { name, nameAr, nameFr, department } = req.body;
    const userId = req.userId;
    const adminId = process.env.ADMIN_ID;

    if (userId !== adminId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const departmentData = await DepartmentModel.findById(department);

    if (!departmentData) {
      return res.status(404).json({ message: "department not found" });
    }
    console.log("1111111111111");
    const imgPath =
      req.files && req.files["img"] ? req.files["img"][0].path : null;
    const imgUrl = imgPath
      ? `${process.env.BASE_URL}` + imgPath.replace(/\\/g, "/")
      : null;
    const newCategory = new CategoryModel({
      name,
      nameAr,
      nameFr,
      img: imgUrl,
      department,
    });
    console.log("22222222222222");
    const savedNewCategory = await newCategory.save();
    console.log(savedNewCategory);
    departmentData.categories.push(savedNewCategory._id);
    await departmentData.save();
    return res.status(201).json(savedNewCategory);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const editCategoryData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, nameAr, nameFr } = req.body;
    const userId = req.userId;
    const adminId = process.env.ADMIN_ID;

    if (userId !== adminId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const imgPath =
      req.files && req.files["img"] ? req.files["img"][0].path : null;
    const imgUrl = imgPath
      ? `${process.env.BASE_URL}` + imgPath.replace(/\\/g, "/")
      : null;
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json("Category not found");
    }
    if (category.name) category.name = name;
    if (category.nameAr) category.nameAr = nameAr;
    if (category.nameFr) category.nameFr = nameFr;
    if (imgPath != null) {
      category.img = imgUrl;
    } else {
      category.img = category.img;
    }
    await category.save();
    return res.status(201).json(category);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteCategoryData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const adminId = process.env.ADMIN_ID;

    if (userId !== adminId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    // Find the product type
    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).json("Category not found");
    }

    const department = await DepartmentModel.findById(category.department);

    if (!department) {
      return res.status(404).json("Department not found");
    }

    department.categories = department.categories.filter(
      categoryId => categoryId.toString() !== id
    );
    await department.save();

    const productIds = category.products;

    // Delete all associated products
    await Product.deleteMany({ _id: { $in: productIds } });

    // Delete the product type
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    return res.status(200).json(deletedCategory);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
