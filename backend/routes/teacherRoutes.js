import express from "express";
import { applyLeave, bulkInsertESETeachers, createTeacher, getAllTeachers, getAllTeachersNames, getTeachersWithLeave, sendRandomTeachers, toggleLeave, updateLeave } from "../controllers/teacherController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTeacher);
router.get("/all", getAllTeachers);
router.get("/getteachers", getAllTeachersNames);
router.patch("/toggle-leave/:id", protect, toggleLeave);
router.post("/random-teachers", protect, sendRandomTeachers);
router.post("/ese-teachers/bulk",protect, bulkInsertESETeachers);
router.post("/apply-leave", applyLeave);
router.put("/update-leave", updateLeave);
router.get("/with-leave", getTeachersWithLeave);





export default router;
