import Department from "../models/Department.js";

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ code: 1 });
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
