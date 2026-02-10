import express from "express";
import {
  getDutyByDate,
  autoAssignDuty,
  changeTeacher,
} from "../controllers/dutyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getDutyByDate);

router.post("/auto", protect, autoAssignDuty);
router.put("/:id/change",protect, changeTeacher);


export default router;
