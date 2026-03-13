import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: String,

  // unavailableSlots: [
  //   {
  //     date: { type: String, required: true },
  //     startTime: { type: String, required: true },
  //     endTime: { type: String, required: true }
  //   }
  // ],
  Type:{
    type: String,
    enum: ["TA", "Teacher"]
  },

  // totalDutyCount: {
  //   type: Number,
  //   default: 0
  // },
  // isOnLeave: {
  //   type: Boolean,
  //   default: false
  // },

  // // 🔥 ONE OBJECT PER DATE WITH TRUE/FALSE
  // allocatedDates: [
  //   {
  //     date: { type: String, required: true },
  //     assigned: { type: Boolean, default: false }
  //   }
  // ],

  // unavailableDates: [
  //   {
  //     date: {
  //       type: String,
  //       required: true
  //     },
  //     leaveType:{
  //       type: String,
  //       enum: ["isOnDuty", "isOnLeave"]
  //     },
  //     shift: {
  //       type: String,
  //       enum: ["Half Day", "Second Half Day", "Full Day"],
  //       required: true
  //     }
  //   }
  // ],
});

export default mongoose.model("Teacher", teacherSchema);
