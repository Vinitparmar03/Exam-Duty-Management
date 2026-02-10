import mongoose from "mongoose";

const dutySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  timing: {
    startTime: {
      type: String,   // Example: "09:00 AM"
      required: true
    },
    endTime: {
      type: String,   // Example: "12:00 PM"
      required: true
    }
  }
});

export default mongoose.model("Duty", dutySchema);
