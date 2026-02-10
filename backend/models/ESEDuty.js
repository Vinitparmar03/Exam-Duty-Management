import mongoose from "mongoose";

const eseDutySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  shift: {
    type: String,
    enum: ["Morning", "Afternoon", "Evening"],
    required: true
  },
  teacher: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ESETeacher",
    required: true
  }]
}, { timestamps: true });

export default mongoose.model("ESEDuty", eseDutySchema);
