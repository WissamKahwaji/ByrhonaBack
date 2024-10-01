import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: String,
  nameAr: String,
  nameFr: String,
  img: String,
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

export const DepartmentModel = mongoose.model("Department", departmentSchema);
