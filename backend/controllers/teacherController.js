import Teacher from "../models/Teacher.js";
import nodemailer from "nodemailer"
import ESETeacher from "../models/ESETeacher.js";

export const createTeacher = async (req, res) => {
  try {
    const { name, Type} = req.body;

    const teacher = await Teacher.create({
      name,
      Type
    });

    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAllTeachersNames = async (req, res) => {
  try {
    const teachers = await Teacher.find().select("name");
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







//ESE MODULES


export const sendRandomTeachers = async (req, res) => {
  try {
    const { taCount, teacherCount, email } = req.body;
    
    if (
      taCount === undefined ||
      teacherCount === undefined ||
      !email
    ) {
      return res.status(400).json({
        message: "taCount, teacherCount and email are required"
      });
    }
    
    // 🔥 Get all teachers
    const teachers = await Teacher.find();
    
    if (teachers.length === 0) {
      return res.status(400).json({
        message: "No teachers available"
      });
    }
    console.log(teachers.length)
    // =====================================================
    // 1️⃣ FILTER: Only those NOT on leave
    // =====================================================
    const availableTeachers = teachers.filter(
      teacher => teacher.isOnLeave !== true
    );
    
    if (availableTeachers.length === 0) {
      return res.status(400).json({
        message: "No available staff (all are on leave)"
      });
    }
    
    // =====================================================
    // 2️⃣ SEPARATE TA & TEACHERS
    // =====================================================
    const availableTAs = availableTeachers.filter(
      t => t.Type === "TA"
    );
    
    const availableTeachersOnly = availableTeachers.filter(
      t => t.Type === "Teacher"
    );

    // Shuffle randomly
    const shuffledTAs = availableTAs.sort(() => 0.5 - Math.random());
    const shuffledTeachers = availableTeachersOnly.sort(() => 0.5 - Math.random());
  
    // =====================================================
    // 3️⃣ SELECT REQUIRED TA
    // =====================================================
    const selectedTAs = shuffledTAs.slice(0, taCount);

    // If TA less than required, shortage must be filled by Teachers
    const taShortage = taCount - selectedTAs.length;

    // =====================================================
    // 4️⃣ SELECT REQUIRED TEACHERS
    // =====================================================
    let requiredTeachers = teacherCount;

    // If TA shortage exists, increase teacher requirement
    if (taShortage > 0) {
      requiredTeachers += taShortage;
    }

    const selectedTeachers = shuffledTeachers.slice(0, requiredTeachers);

    // =====================================================
    // 5️⃣ FINAL MERGE
    // =====================================================
    const selected = [...selectedTAs, ...selectedTeachers];

    const totalRequired = taCount + teacherCount;

    if (selected.length < totalRequired) {
      return res.status(400).json({
        message: "Not enough staff available to fulfill request"
      });
    }

    const teacherNames = selected.map(t => t.name);

    // =====================================================
    // 📧 EMAIL SETUP
    // =====================================================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🎓 Selected Staff List",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color: #2c3e50;">Exam Duty Selection</h2>
          <p>Requested:</p>
          <ul>
            <li>TA Required: ${taCount}</li>
            <li>Teacher Required: ${teacherCount}</li>
          </ul>

          <p><strong>Selected Staff:</strong></p>
          <ul>
            ${selected
              .map(t => `<li>${t.name}</li>`)
              .join("")}
          </ul>

          <br/>
          <p style="color: gray;">
            This is an automated message from Exam Duty System.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Staff selected successfully (TA + Teacher count based)",
      selected: selected.map(t => ({
        name: t.name,
      }))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};





export const bulkInsertESETeachers = async (req, res) => {
  try {
    const { teachersText } = req.body;

    if (!teachersText) {
      return res.status(400).json({ message: "No teacher data provided" });
    }

    // 🔹 Convert textarea to clean array
    const teacherNames = teachersText
      .split("\n")
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (teacherNames.length === 0) {
      return res.status(400).json({ message: "No valid names found" });
    }

    // 🔹 Remove duplicates
    const uniqueNames = [...new Set(teacherNames)];

    // =====================================================
    // 🔥 STEP 1: Get Type from MAIN Teacher collection
    // =====================================================
    const teacherDataFromDB = await Teacher.find({
      name: { $in: uniqueNames }
    }).select("name Type");

    if (teacherDataFromDB.length === 0) {
      return res.status(400).json({
        message: "None of these names exist in main Teacher database"
      });
    }

    // Create Map for quick lookup
    const teacherMap = {};
    teacherDataFromDB.forEach(t => {
      teacherMap[t.name] = t.Type;
    });

    // =====================================================
    // 🔥 STEP 2: Check already existing in ESETeacher
    // =====================================================
    const existingESETeachers = await ESETeacher.find({
      name: { $in: uniqueNames }
    }).select("name");

    const existingNames = existingESETeachers.map(t => t.name);

    // =====================================================
    // 🔥 STEP 3: Prepare only NEW teachers
    // =====================================================
    const newTeachers = uniqueNames
      .filter(name => !existingNames.includes(name))
      .filter(name => teacherMap[name]) // ensure exists in main DB
      .map(name => ({
        name,
        Type: teacherMap[name], // 🔥 Automatically assign Type from DB
        dutyCount: 0,
        isOnLeave: false,
        unavailableSlots: [],
        unavailableDates: []
      }));

    if (newTeachers.length === 0) {
      return res.json({
        message: "All teachers already exist or not found in main database."
      });
    }

    // =====================================================
    // 🔥 STEP 4: Insert
    // =====================================================
    await ESETeacher.insertMany(newTeachers);

    res.json({
      message: `${newTeachers.length} inserted, ${existingNames.length} skipped`,
      insertedTeachers: newTeachers.map(t => t.name),
      skippedTeachers: existingNames
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Bulk insert failed" });
  }
};






export const getAllTeachers = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search) {
      filter.name = { 
        $regex: search, 
        $options: "i"   // case insensitive
      };
    }

    const teachers = await Teacher.find(filter)
      .select("name isOnLeave Type")
      .sort({ name: 1 });

    res.json(teachers);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
};


// PATCH /teachers/toggle-leave/:id

export const toggleLeave = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    console.log(teacher)

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.isOnLeave = !teacher.isOnLeave;
    await teacher.save();

    res.json({ message: "Leave status updated" });

  } catch (error) {
    res.status(500).json({ message: "Failed to update leave" });
  }
};




export const applyLeave = async (req, res) => {
  try {
    const { teacherId, fromDate, toDate, leaveType, shift } = req.body;

    if (!teacherId || !fromDate || !toDate || !leaveType || !shift) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (start > end) {
      return res.status(400).json({
        message: "From date cannot be after To date"
      });
    }

    const existingDates = teacher.unavailableDates.map(d => d.date);
    const newDates = [];

    let currentDate = new Date(start);

    while (currentDate <= end) {
      const formatted = currentDate.toISOString().split("T")[0];

      if (!existingDates.includes(formatted)) {
        newDates.push({
          date: formatted,
          leaveType,
          shift
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    teacher.unavailableDates.push(...newDates);

    if (leaveType === "isOnLeave") {
      teacher.isOnLeave = true;
    }

    await teacher.save();

    res.json({
      message: "Leave applied successfully",
      addedDates: newDates
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to apply leave" });
  }
};


export const updateLeave = async (req, res) => {
  try {

    const { teacherId, date, leaveType, shift } = req.body;

    if (!teacherId || !date || !leaveType) {
      return res.status(400).json({
        message: "Teacher, Date and LeaveType required"
      });
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const index = teacher.unavailableDates.findIndex(
      d => d.date === date
    );

    // ============================================
    // 🔥 CASE 1 → REMOVE LEAVE
    // ============================================
    if (leaveType === "isOnDuty") {

      if (index === -1) {
        return res.status(400).json({
          message: "Date not present in leave record"
        });
      }

      teacher.unavailableDates.splice(index, 1);

      if (teacher.unavailableDates.length === 0) {
        teacher.isOnLeave = false;
      }

    }

    // ============================================
    // 🔥 CASE 2 → UPDATE / ADD LEAVE
    // ============================================
    else {

      if (!shift) {
        return res.status(400).json({
          message: "Shift required"
        });
      }

      if (index === -1) {

        // 🔥 ADD NEW LEAVE (Date does not exist)
        teacher.unavailableDates.push({
          date,
          leaveType,
          shift
        });

      } else {

        // 🔥 UPDATE EXISTING LEAVE
        teacher.unavailableDates[index].leaveType = leaveType;
        teacher.unavailableDates[index].shift = shift;

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


export const getTeachersWithLeave = async (req, res) => {
  try {

    const teachers = await Teacher.find({
      unavailableDates: { $exists: true, $not: { $size: 0 } }
    }).select("name unavailableDates");

    res.json(teachers);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leave teachers" });
  }
};
