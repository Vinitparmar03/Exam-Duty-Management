import ESEDuty from "../models/ESEDuty.js";
import ESETeacher from "../models/ESETeacher.js";
import { sendAdminEmail } from "../service/emailService.js";

export const getESETeachers = async (req, res) => {
  try {
    const teachers = await ESETeacher.find().sort({ dutyCount: 1 });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Set leave
export const setTeacherLeave = async (req, res) => {
   try {
    const { isOnLeave } = req.body;
    console.log("hello")
    const teacher = await ESETeacher.findByIdAndUpdate(
      req.params.id,
      { isOnLeave },
      { new: true }
    );

    res.json({ message: "Leave status updated", teacher });

  } catch (error) {
    res.status(500).json({ message: "Error updating leave" });
  }
};




export const assignTeachersAndSendEmail = async (req, res) => {
  try {
    const { date, email, count, shift } = req.body;

    if (!date || !email || !count || !shift) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // ==================================================
    // 1️⃣ Get teachers not on leave
    // ==================================================

    let teachers = await ESETeacher.find({ isOnLeave: false });

    if (teachers.length === 0) {
      return res.status(400).json({ message: "No available teachers" });
    }

    // ==================================================
    // 2️⃣ Leave restriction logic
    // ==================================================

    teachers = teachers.filter(teacher => {

      const leaveForThatDate = teacher.unavailableDates.find(
        d => d.date === date
      );

      if (!leaveForThatDate) return true;

      if (leaveForThatDate.shift === "Full Day") return false;

      if (
        leaveForThatDate.shift === "Half Day" &&
        shift === "Morning"
      ) return false;

      if (
        leaveForThatDate.shift === "Second Half Day" &&
        (shift === "Afternoon" || shift === "Evening")
      ) return false;

      return true;
    });

    if (teachers.length === 0) {
      return res.status(400).json({
        message: "No teacher available due to leave restrictions."
      });
    }

    // ==================================================
    // 3️⃣ Get duty document
    // ==================================================

    let dutyDoc = await ESEDuty.findOne({ date, shift });

    const allDutiesSameDate = await ESEDuty.find({ date });

    let alreadyAssignedIds = [];

    allDutiesSameDate.forEach(d => {
      alreadyAssignedIds.push(...d.teacher.map(id => id.toString()));
    });

    // ==================================================
    // 4️⃣ Remove already assigned teachers (ONLY for Teachers)
    // ==================================================

    let unassignedTeachers = teachers.filter(
      t => !alreadyAssignedIds.includes(t._id.toString())
    );

    let selectedTeachers = [];

    // ==================================================
    // 5️⃣ SHIFT BASED LOGIC
    // ==================================================

    if (shift === "Morning" || shift === "Evening") {

      // 🔥 Step 1: Select ALL TA directly from teachers (ignore alreadyAssigned)
      const availableTA = teachers.filter(t => t.Type === "TA");

      selectedTeachers.push(...availableTA);

      let remaining = count - selectedTeachers.length;

      // 🔥 Step 2: Select Teachers (lowest dutyCount) from unassigned list
      if (remaining > 0) {

        const availableTeachersOnly = unassignedTeachers
          .filter(t => t.Type === "Teacher")
          .sort((a, b) => a.dutyCount - b.dutyCount);

        selectedTeachers.push(
          ...availableTeachersOnly.slice(0, remaining)
        );
      }

    } else if (shift === "Afternoon") {

      // 🔥 Only Teachers allowed
      const availableTeachersOnly = unassignedTeachers
        .filter(t => t.Type === "Teacher")
        .sort((a, b) => a.dutyCount - b.dutyCount);

      selectedTeachers = availableTeachersOnly.slice(0, count);
    }

    if (selectedTeachers.length === 0) {
      return res.status(400).json({
        message: "No eligible teachers found."
      });
    }

    const selectedIds = selectedTeachers.map(t => t._id);

    // ==================================================
    // 6️⃣ Save or update duty
    // ==================================================

    if (!dutyDoc) {
      dutyDoc = await ESEDuty.create({
        date,
        shift,
        teacher: selectedIds
      });
    } else {
      dutyDoc.teacher.push(...selectedIds);
      await dutyDoc.save();
    }

    // ==================================================
    // 7️⃣ Update dutyCount for all selected
    // ==================================================

    for (let teacher of selectedTeachers) {
      teacher.dutyCount += 1;
      await teacher.save();
    }

    const teacherNames = selectedTeachers.map(t => t.name);

    // ==================================================
    // 8️⃣ Send email
    // ==================================================

    await sendAdminEmail(email, teacherNames, date);

    res.json({
      message: "Teachers assigned successfully",
      teachers: teacherNames
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Assignment failed" });
  }
};



export const searchTeachers = async (req, res) => {
  try {
    const { name } = req.query;

    const teachers = await ESETeacher.find({
      name: { $regex: name, $options: "i" }
    });

    res.json(teachers);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const addLeaveRange = async (req, res) => {
  try {
    const { teacherId, fromDate, toDate, leaveType, shift } = req.body;

    if (!teacherId || !fromDate || !toDate || !leaveType || !shift) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const teacher = await ESETeacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found"
      });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (start > end) {
      return res.status(400).json({
        message: "From date cannot be after To date"
      });
    }

    const existingDates = teacher.unavailableDates.map(d => d.date);
    const uniqueDatesToAdd = [];

    let currentDate = new Date(start);

    while (currentDate <= end) {

      const formattedDate = currentDate.toISOString().split("T")[0];

      if (!existingDates.includes(formattedDate)) {
        uniqueDatesToAdd.push({
          date: formattedDate,
          leaveType,
          shift
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    teacher.unavailableDates.push(...uniqueDatesToAdd);

    await teacher.save();

    res.json({
      message: "Leave dates added successfully",
      addedDates: uniqueDatesToAdd
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add leave range"
    });
  }
};


export const getTeachersWithLeave = async (req, res) => {
  try {
    const teachers = await ESETeacher.find({
      unavailableDates: { $exists: true, $not: { $size: 0 } }
    }).select("name unavailableDates");

    res.json(teachers);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch teachers with leave data"
    });
  }
};


export const updateUnavailableDate = async (req, res) => {
  try {

    const { teacherId, date, leaveType, shift } = req.body;

    if (!teacherId || !date || !leaveType) {
      return res.status(400).json({
        message: "Teacher, Date and LeaveType are required"
      });
    }

    const teacher = await ESETeacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found"
      });
    }

    const leaveIndex = teacher.unavailableDates.findIndex(
      d => d.date === date
    );

    // ============================================
    // 🔥 CASE 1 → REMOVE LEAVE
    // ============================================
    if (leaveType === "isOnDuty") {

      if (leaveIndex === -1) {
        return res.status(400).json({
          message: "Date not found in leave records"
        });
      }

      teacher.unavailableDates.splice(leaveIndex, 1);

      if (teacher.unavailableDates.length === 0) {
        teacher.isOnLeave = false;
      }

    }

    // ============================================
    // 🔥 CASE 2 → UPDATE OR ADD LEAVE
    // ============================================
    else {

      if (!shift) {
        return res.status(400).json({
          message: "Shift is required for leave"
        });
      }

      if (leaveIndex === -1) {

        // 🔥 ADD NEW LEAVE (Date not found)
        teacher.unavailableDates.push({
          date,
          leaveType,
          shift
        });

      } else {

        // 🔥 UPDATE EXISTING LEAVE
        teacher.unavailableDates[leaveIndex].leaveType = leaveType;
        teacher.unavailableDates[leaveIndex].shift = shift;

      }

      teacher.isOnLeave = true;
    }

    await teacher.save();

    res.json({
      message: "Leave updated successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update leave"
    });
  }
};



