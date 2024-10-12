import { DepartmentModel } from "../models/department/department_model.js";

export const getDepartmentsData = async (req, res, next) => {
  try {
    const departmentsData = await DepartmentModel.find().populate("categories");
    return res.status(200).json(departmentsData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const departmentData = await DepartmentModel.findById(id).populate(
      "categories"
    );
    return res.status(200).json(departmentData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const addDepartmentData = async (req, res, next) => {
  try {
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
    const newDepartment = new DepartmentModel({
      name,
      nameAr,
      nameFr,
      img: imgUrl,
    });
    await newDepartment.save();

    return res.status(201).json(newDepartment);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const editDepartmentData = async (req, res, next) => {
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
    const department = await DepartmentModel.findById(id);
    if (!department) {
      return res.status(404).json("Department not found");
    }
    if (department.name) department.name = name;
    if (department.nameAr) department.nameAr = nameAr;
    if (department.nameFr) department.nameFr = nameFr;
    if (imgPath != null) {
      department.img = imgUrl;
    } else {
      department.img = department.img;
    }
    await department.save();
    return res.status(201).json(department);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteDepartmentData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const adminId = process.env.ADMIN_ID;

    if (userId !== adminId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    // Find the product type
    const department = await DepartmentModel.findById(id);

    if (!department) {
      return res.status(404).json("Department not found");
    }

    // Delete the product type
    const deletedDepartment = await DepartmentModel.findByIdAndDelete(id);

    return res.status(200).json(deletedDepartment);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
