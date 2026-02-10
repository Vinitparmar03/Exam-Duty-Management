import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roomNumber: { type: String, required: true },
  year: { type: Number, required: true },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },
  course: { type: String, required: true },
  speciallization: { type: String, required: true } // ✅ fixed spelling
});

export default mongoose.model("Section", sectionSchema);
