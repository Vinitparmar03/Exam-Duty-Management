import mongoose from "mongoose";
import ESEDuty from "../models/ESEDuty.js";
import ESETeacher from "../models/ESETeacher.js";

export const getAllDuties = async (req, res) => {
  try {

    const { date, shift, teacher } = req.query;

    const filter = {};

    if (date) {
      filter.date = date;
    }

    if (shift) {
      filter.shift = shift;
    }

    if (teacher) {
      filter.teacher = {
        $in: [new mongoose.Types.ObjectId(teacher)]
      };
    }



    const duties = await ESEDuty.find(filter)
      .populate("teacher", "name dutyCount")
      .sort({ date: 1, shift: 1 });

    res.status(200).json(duties);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const changeTeacher = async (req, res) => {
  try {
    const { dutyId, oldTeacherId } = req.params;

    const duty = await ESEDuty.findById(dutyId);

    if (!duty) {
      return res.status(404).json({ message: "Duty not found" });
    }

    const examDate = duty.date;
    const examShift = duty.shift;

    // 🔹 Remove old teacher from duty
    duty.teacher = duty.teacher.filter(
      t => t.toString() !== oldTeacherId
    );

    // 🔹 Find all teachers
    let teachers = await ESETeacher.find();

    // 🔥 Filter eligible teachers
    teachers = teachers.filter(t => {

      // ❌ Skip old teacher
      if (t._id.toString() === oldTeacherId) return false;

      // ❌ Skip if on leave
      if (t.isOnLeave) return false;

      // ❌ Skip if unavailable on that date
      const unavailableDate = t.unavailableDates.some(u =>
        u.date === examDate &&
        u.shift === "Full Day"
      );

      if (unavailableDate) return false;

      // ❌ Skip if unavailable for that shift
      const unavailableSlot = t.unavailableSlots.some(u =>
        u.date === examDate &&
        u.shift === examShift
      );

      if (unavailableSlot) return false;

      return true;
    });

    if (teachers.length === 0) {
      return res.status(400).json({
        message: "No available teacher found"
      });
    }

    // 🔥 PRIORITY 1 — TA
    let selectedTeacher =
      teachers
        .filter(t => t.Type === "TA")
        .sort((a, b) => a.dutyCount - b.dutyCount)[0];

    // 🔥 PRIORITY 2 — Lowest duty count teacher
    if (!selectedTeacher) {
      selectedTeacher =
        teachers
          .filter(t => t.Type === "Teacher")
          .sort((a, b) => a.dutyCount - b.dutyCount)[0];
    }

    if (!selectedTeacher) {
      return res.status(400).json({
        message: "No suitable teacher found"
      });
    }

    // 🔹 Assign teacher to duty
    duty.teacher.push(selectedTeacher._id);

    await duty.save();

    // 🔹 Increase duty count
    selectedTeacher.dutyCount += 1;
    await selectedTeacher.save();

    res.json({
      message: "Teacher changed successfully",
      newTeacher: selectedTeacher
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
