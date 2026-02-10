import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true
  },
  courses: [
    {
      name: String,   // CSE, IT, MECH
      specializations: [String]   // AI, Data Science, Cyber Security
    }
  ]
}, { timestamps: true });

export default mongoose.model("Department", departmentSchema);
