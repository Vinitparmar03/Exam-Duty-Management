import mongoose from "mongoose";

const eseTeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  dutyCount: {
    type: Number,
    default: 0
  },

  isOnLeave: {
    type: Boolean,
    default: false
  },
  Type:{
    type: String,
    enum: ["TA", "Teacher"]
  },

  unavailableSlots: [
    {
      date: {
        type: String,
        required: true
      },
      shift: {
        type: String,
        enum: ["Morning", "Afternoon", "Evening"],
        required: true
      }
    }
  ],
  unavailableDates: [
    {
      date: {
        type: String,
        required: true
      },
      leaveType:{
        type: String,
        enum: ["isOnDuty", "isOnLeave"]
      },
      shift: {
        type: String,
        enum: ["Half Day", "Second Half Day", "Full Day"],
        required: true
      }
    }
  ],



}, { timestamps: true });

export default mongoose.model("ESETeacher", eseTeacherSchema);
