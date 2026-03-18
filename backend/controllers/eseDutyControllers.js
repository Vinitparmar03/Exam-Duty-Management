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

    // =====================================================
    // 1️⃣ Get duty
    // =====================================================

    const duty = await ESEDuty.findById(dutyId);

    if (!duty) {
      return res.status(404).json({ message: "Duty not found" });
    }

    const examDate = duty.date;
    const examShift = duty.shift;

    // =====================================================
    // 2️⃣ Get old teacher
    // =====================================================

    const oldTeacher = await ESETeacher.findById(oldTeacherId);

    if (!oldTeacher) {
      return res.status(404).json({ message: "Old teacher not found" });
    }

    // =====================================================
    // 3️⃣ Find teachers already assigned on SAME slot
    // =====================================================

    const assignedOnSameSlot = await ESEDuty.find({
      date: examDate,
      shift: examShift
    }).distinct("teacher");

    const assignedSet = new Set(
      assignedOnSameSlot.map(id => id.toString())
    );

    // =====================================================
    // 4️⃣ Get ALL teachers
    // =====================================================

    let teachers = await ESETeacher.find();

    // =====================================================
    // 5️⃣ Filter eligible teachers
    // =====================================================

    teachers = teachers.filter(t => {

      // ❌ Skip old teacher
      if (t._id.toString() === oldTeacherId) return false;

      // ❌ Skip if already assigned in same slot
      if (assignedSet.has(t._id.toString())) return false;

      // ❌ Skip if on leave
      if (t.isOnLeave === true) return false;

      // ❌ Skip if unavailable full day
      const unavailableDate = t.unavailableDates?.some(u =>
        u.date === examDate && u.shift === "Full Day"
      );

      if (unavailableDate) return false;

      // ❌ Skip if unavailable for that shift
      const unavailableSlot = t.unavailableSlots?.some(u =>
        u.date === examDate && u.shift === examShift
      );

      if (unavailableSlot) return false;

      return true;
    });

    // =====================================================
    // 6️⃣ No teacher available
    // =====================================================

    if (teachers.length === 0) {
      return res.status(400).json({
        message: "No single teacher available for replacement"
      });
    }

    // =====================================================
    // 7️⃣ PRIORITY — TA first, then Teacher
    // =====================================================

    let selectedTeacher =
      teachers
        .filter(t => t.Type === "TA")
        .sort((a, b) => a.dutyCount - b.dutyCount)[0];

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

    // =====================================================
    // 8️⃣ Remove old teacher from duty
    // =====================================================

    duty.teacher = duty.teacher.filter(
      t => t.toString() !== oldTeacherId
    );

    // =====================================================
    // 9️⃣ Add new teacher
    // =====================================================

    duty.teacher.push(selectedTeacher._id);

    await duty.save();

    // =====================================================
    // 🔟 Mark old teacher unavailable for this slot
    // =====================================================

    const alreadyMarked = oldTeacher.unavailableSlots?.some(
      u => u.date === examDate && u.shift === examShift
    );

    if (!alreadyMarked) {
      oldTeacher.unavailableSlots.push({
        date: examDate,
        shift: examShift
      });
    }

    // =====================================================
    // 1️⃣1️⃣ Update duty counts
    // =====================================================

    // 🔽 decrease old teacher
    if (oldTeacher.dutyCount > 0) {
      oldTeacher.dutyCount -= 1;
    }

    await oldTeacher.save();

    // 🔼 increase new teacher
    selectedTeacher.dutyCount += 1;
    await selectedTeacher.save();

    // =====================================================
    // 1️⃣2️⃣ Success response
    // =====================================================

    res.json({
      message: "Teacher changed successfully",
      removedTeacher: oldTeacher.name,
      newTeacher: selectedTeacher.name
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};