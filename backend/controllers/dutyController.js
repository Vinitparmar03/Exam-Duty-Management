import Duty from "../models/Duty.js";
import Teacher from "../models/Teacher.js";
import Section from "../models/Section.js";
import mongoose from "mongoose";


export const getDutyByDate = async (req, res) => {
  try {
    const { date, teacher } = req.query;


    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    let filter = { date };

    if (teacher) {
      filter.teacher = teacher; // teacher _id
    }

    const duties = await Duty.find(filter)
      .populate("teacher")
      .populate("section");

    res.json(duties);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


export const changeTeacher = async (req, res) => {
  try {
    const duty = await Duty.findById(req.params.id);

    if (!duty) {
      return res.status(404).json({ message: "Duty not found" });
    }

    const examDate = duty.date;
    const { startTime, endTime } = duty.timing;
    const oldTeacherId = duty.teacher;

    // =========================================================
    // 1️⃣ FIND BUSY TEACHERS
    // =========================================================
    const overlappingDuties = await Duty.find({
      date: examDate,
      _id: { $ne: duty._id },
      $and: [
        { "timing.startTime": { $lt: endTime } },
        { "timing.endTime": { $gt: startTime } }
      ]
    });

    const busyTeacherIds = overlappingDuties.map(d =>
      d.teacher.toString()
    );

    // =========================================================
    // 2️⃣ FIND UNAVAILABLE TEACHERS
    // =========================================================
    const unavailableTeachers = await Teacher.find({
      unavailableSlots: {
        $elemMatch: {
          date: examDate,
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      }
    }).select("_id");

    const unavailableIds = unavailableTeachers.map(t =>
      t._id.toString()
    );

    // =========================================================
    // 3️⃣ SELECT LOWEST totalDutyCount TEACHER
    // =========================================================
    const excludedIds = [
      ...busyTeacherIds,
      ...unavailableIds,
      oldTeacherId.toString()
    ];

    const selectedTeacher = await Teacher.find({
      _id: { $nin: excludedIds }
    })
      .sort({ totalDutyCount: 1 })
      .limit(1);

    if (!selectedTeacher.length) {
      return res.status(400).json({
        message: "No teacher available for replacement."
      });
    }

    const newTeacher = selectedTeacher[0];

    // =========================================================
    // 4️⃣ UPDATE DUTY
    // =========================================================
    duty.teacher = newTeacher._id;
    await duty.save();

    // =========================================================
    // 5️⃣ UPDATE COUNTS
    // =========================================================
    await Teacher.findByIdAndUpdate(
      oldTeacherId,
      { $inc: { totalDutyCount: -1 } }
    );

    await Teacher.findByIdAndUpdate(
      newTeacher._id,
      { $inc: { totalDutyCount: 1 } }
    );

    res.json({
      message: "Teacher changed successfully.",
      duty
    });

  } catch (error) {
    console.error(error);   // 🔥 VERY IMPORTANT
    res.status(500).json({ error: error.message });
  }
};

export const autoAssignDuty = async (req, res) => {
  const { date, section, startTime, endTime } = req.body;

  try {
    // =========================================================
    // 1️⃣ VALIDATION
    // =========================================================
    if (!date || !section || !startTime || !endTime) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        message: "End time must be after start time"
      });
    }

    // =========================================================
    // 2️⃣ SECTION TIME CONFLICT CHECK
    // =========================================================
    const existingSectionDuty = await Duty.findOne({
      date,
      section,
      $and: [
        { "timing.startTime": { $lt: endTime } },
        { "timing.endTime": { $gt: startTime } }
      ]
    });

    if (existingSectionDuty) {
      return res.status(400).json({
        message:
          "Conflict: Section already has a teacher during this time."
      });
    }

    // =========================================================
    // 3️⃣ FIND BUSY TEACHERS (TIME OVERLAP)
    // =========================================================
    const overlappingDuties = await Duty.find({
      date,
      $and: [
        { "timing.startTime": { $lt: endTime } },
        { "timing.endTime": { $gt: startTime } }
      ]
    });

    const busyTeacherIds = overlappingDuties.map(d =>
      d.teacher.toString()
    );

    // =========================================================
    // 4️⃣ FILTER UNAVAILABLE SLOT TEACHERS
    // =========================================================
    const unavailableTeachers = await Teacher.find({
      "unavailableSlots": {
        $elemMatch: {
          date,
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      }
    }).select("_id");

    const unavailableIds = unavailableTeachers.map(t =>
      t._id.toString()
    );

    // Combine busy + unavailable
    const excludedTeacherIds = [
      ...busyTeacherIds,
      ...unavailableIds
    ];

    // =========================================================
    // 5️⃣ SELECT TEACHER WITH LOWEST TOTAL DUTY COUNT 🔥
    // =========================================================
    const selectedTeacher = await Teacher.find({
      _id: { $nin: excludedTeacherIds }
    })
      .sort({ totalDutyCount: 1 }) // 🔥 Lowest first
      .limit(1);

    if (!selectedTeacher.length) {
      return res.status(400).json({
        message:
          "No teacher available. All teachers are busy or unavailable."
      });
    }

    const teacher = selectedTeacher[0];

    // =========================================================
    // 6️⃣ CREATE DUTY
    // =========================================================
    const duty = await Duty.create({
      date,
      section,
      teacher: teacher._id,
      timing: {
        startTime,
        endTime
      }
    });

    // =========================================================
    // 7️⃣ INCREMENT TOTAL DUTY COUNT (ATOMIC) 🔥
    // =========================================================
    await Teacher.findByIdAndUpdate(
      teacher._id,
      { $inc: { totalDutyCount: 1 } }
    );

    // =========================================================
    // SUCCESS RESPONSE
    // =========================================================
    res.json({
      message:
        "Teacher assigned successfully based on lowest total duty count.",
      duty
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
