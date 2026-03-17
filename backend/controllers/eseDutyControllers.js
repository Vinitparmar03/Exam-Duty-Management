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
    const duty = await ESEDuty.findById(req.params.dutyId);
    const oldTeacherId = await ESETeacher.findById(req.params.dutyId);

    if (!duty) {
      return res.status(404).json({ message: "Duty not found" });
    }

    const examDate = duty.date;
    const examShift = duty.shift;
      

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
