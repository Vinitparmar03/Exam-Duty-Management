import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import dutyRoutes from "./routes/dutyRoutes.js"
import sectionRoutes from "./routes/sectionRoutes.js"
import departmentRoutes from "./routes/departmentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js"
import eseTeacherRoutes from "./routes/eseTeachersRoutes.js";
import eseDutyRoutes from "./routes/eseDutyRoutes.js";
import authRoutes from "./routes/authRoutes.js";
// import "./cron/dutyHoursCron.js";


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/duty", dutyRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/teachers", teacherRoutes);

app.use("/api/departments", departmentRoutes);
app.use("/api/ese-teachers", eseTeacherRoutes);
app.use("/api/ese-duty", eseDutyRoutes)

app.use("/api/auth", authRoutes);


app.listen(5000, () => console.log("Server running on port 5000"));
