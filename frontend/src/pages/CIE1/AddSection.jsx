import { useState, useEffect } from "react";
import API from "../../api";

export default function AddSection() {
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [speciallization, setSpeciallization] = useState("");

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  // 🔥 Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await API.get("/departments");
        setDepartments(res.data);
      } catch (error) {
        console.error("Error fetching departments");
      }
    };
    fetchDepartments();
  }, []);

  // 🔥 When Department Changes → Set Courses
  useEffect(() => {
    if (!department) {
      setCourses([]);
      return;
    }

    const selectedDept = departments.find(
      (d) => d._id === department
    );

    if (selectedDept) {
      setCourses(selectedDept.courses || []);
    }

    setCourse("");
    setSpeciallization("");
    setSpecializations([]);
  }, [department, departments]);

  // 🔥 When Course Changes → Set Specializations
  useEffect(() => {
    if (!course) {
      setSpecializations([]);
      return;
    }

    const selectedCourse = courses.find(
      (c) => c.name === course
    );

    if (selectedCourse) {
      setSpecializations(selectedCourse.specializations || []);
    }

    setSpeciallization("");
  }, [course, courses]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/sections", {
        name,
        roomNumber,
        year: Number(year),
        department,
        course,
        speciallization
      });

      alert("Section added successfully!");

      setName("");
      setRoomNumber("");
      setYear("");
      setDepartment("");
      setCourse("");
      setSpeciallization("");
    } catch (error) {
      alert("Error adding section");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-6 text-center">
          Add Section
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Section Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          <input
            type="text"
            placeholder="Room Number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          <input
            type="number"
            placeholder="Year (1-4)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          {/* Department */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.code}
              </option>
            ))}
          </select>

          {/* Course (Visible after Department selected) */}
          {courses.length > 0 && (
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Select Course</option>
              {courses.map((c, index) => (
                <option key={index} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {/* Specialization (Visible after Course selected) */}
          {specializations.length > 0 && (
            <select
              value={speciallization}
              onChange={(e) => setSpeciallization(e.target.value)}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Select Specialization</option>
              {specializations.map((s, index) => (
                <option key={index} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Add Section
          </button>

        </form>
      </div>
    </div>
  );
}
