import express from "express";
import {
  addDepartmentData,
  deleteDepartmentData,
  editDepartmentData,
  getDepartmentById,
  getDepartmentsData,
} from "../controllers/department_ctrl.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.get("/", getDepartmentsData);
router.get("/:id", getDepartmentById);
router.post("/add", auth, addDepartmentData);
router.put("/edit/:id", auth, editDepartmentData);
router.delete("/delete/:id", auth, deleteDepartmentData);

export default router;
