import Section from "../models/Section.js";


export const getSections = async (req, res) => {
  try {
    const sections = await Section.find()
      .populate("department", "name code"); // only needed fields

    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSection = async (req, res) => {
  try {
    const {
      name,
      roomNumber,
      year,
      department,
      course,
      speciallization
    } = req.body;

    if (!name || !roomNumber || !year || !department || !course || !speciallization) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const section = await Section.create({
      name,
      roomNumber,
      year,
      department,
      course,
      speciallization
    });

    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


