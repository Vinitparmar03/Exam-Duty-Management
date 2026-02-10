import express from "express";
import { addLeaveRange, assignTeachersAndSendEmail, getESETeachers, getTeachersWithLeave, searchTeachers, setTeacherLeave, updateUnavailableDate } from "../controllers/eseTeacherController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", getESETeachers);
router.get("/search", searchTeachers);
router.put("/:id/leave", protect, setTeacherLeave);
router.post("/ese-teacher-assign", protect,  assignTeachersAndSendEmail);
router.post("/add-leave-range", addLeaveRange);
router.get("/with-leave", getTeachersWithLeave);
router.put("/update-leave", updateUnavailableDate);



export default router;
