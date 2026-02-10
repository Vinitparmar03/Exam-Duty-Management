import express from "express";
import { changeTeacher, getAllDuties } from "../controllers/eseDutyControllers.js"; 
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllDuties);
router.put("/change/:dutyId/:oldTeacherId", protect ,changeTeacher);

export default router;
