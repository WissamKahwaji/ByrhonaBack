import express from "express";
import {
  addDepartmentData,
  deleteDepartmentData,
  editDepartmentData,
  getDepartmentById,
  getDepartmentsData,
} from "../controllers/department_ctrl.js";
const router = express.Router();

router.get("/", getDepartmentsData);
router.get("/:id", getDepartmentById);
router.post("/add", addDepartmentData);
router.put("/edit/:id", editDepartmentData);
router.delete("/delete/:id", deleteDepartmentData);

export default router;
