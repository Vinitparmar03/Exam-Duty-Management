import express from "express";
import { createSection, getSections } from "../controllers/sectionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSections);
router.post("/", protect, createSection);


export default router;
