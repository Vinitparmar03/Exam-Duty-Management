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
    const duty = await Duty.findById(req.params.id);

    if (!duty) {
      return res.status(404).json({ message: "Duty not found" });
    }

    const examDate = duty.date;
    const { startTime, endTime } = duty.timing;
    const oldTeacherId = duty.teacher;

    // =========================================================
    // 1️⃣ FIND BUSY TEACHERS (TIME OVERLAP)
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
    // 2️⃣ FIND UNAVAILABLE TEACHERS (TIME SLOT CHECK)
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
    // 3️⃣ FIND TEACHERS ALREADY ASSIGNED TRUE THAT DAY
    // =========================================================
    const alreadyAssignedTeachers = await Teacher.find({
      allocatedDates: {
        $elemMatch: {
          date: examDate,
          assigned: true
        }
      }
    }).select("_id");

    const allocatedIds = alreadyAssignedTeachers.map(t =>
      t._id.toString()
    );

    // =========================================================
    // 4️⃣ EXCLUDE INVALID TEACHERS
    // =========================================================
    const excludedIds = [
      ...busyTeacherIds,
      ...unavailableIds,
      ...allocatedIds,
      oldTeacherId.toString()
    ];

    const selectedTeacher = await Teacher.find({
      _id: { $nin: excludedIds }
    })
      .sort({ totalDutyCount: 1 })
      .limit(1);

    // =========================================================
    // 5️⃣ IF NO TEACHER AVAILABLE → STOP HERE
    // =========================================================
    if (!selectedTeacher.length) {
      return res.status(400).json({
        message: "No teacher available for replacement."
      });
    }

    const newTeacher = selectedTeacher[0];

    // =========================================================
    // 6️⃣ NOW SAFE TO UPDATE OLD TEACHER
    // =========================================================

    await Teacher.findByIdAndUpdate(
      oldTeacherId,
      { $inc: { totalDutyCount: -1 } }
    );

    await Teacher.findByIdAndUpdate(
      oldTeacherId,
      {
        $addToSet: {
          unavailableSlots: {
            date: examDate,
            startTime,
            endTime
          }
        }
      }
    );

    await Teacher.updateOne(
      { _id: oldTeacherId, "allocatedDates.date": examDate },
      { $set: { "allocatedDates.$.assigned": false } }
    );

    // =========================================================
    // 7️⃣ UPDATE DUTY
    // =========================================================
    duty.teacher = newTeacher._id;
    await duty.save();

    // =========================================================
    // 8️⃣ UPDATE NEW TEACHER
    // =========================================================
    await Teacher.findByIdAndUpdate(
      newTeacher._id,
      { $inc: { totalDutyCount: 1 } }
    );

    // Ensure single object per date
    const existingDate = await Teacher.findOne({
      _id: newTeacher._id,
      "allocatedDates.date": examDate
    });

    if (existingDate) {
      await Teacher.updateOne(
        { _id: newTeacher._id, "allocatedDates.date": examDate },
        { $set: { "allocatedDates.$.assigned": true } }
      );
    } else {
      await Teacher.updateOne(
        { _id: newTeacher._id },
        {
          $push: {
            allocatedDates: {
              date: examDate,
              assigned: true
            }
          }
        }
      );
    }

    res.json({
      message: "Teacher changed successfully with perfect availability logic.",
      duty
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
