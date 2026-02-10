import express from "express";
import { getAllDepartments } from "../controllers/departmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllDepartments);

export default router;
