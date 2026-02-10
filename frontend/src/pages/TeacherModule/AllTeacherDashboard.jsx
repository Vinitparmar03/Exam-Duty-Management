import { useEffect, useState } from "react";
import API from "../../api";

export default function AllTeacherDashboard() {

  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");

  // 🔥 Fetch Teachers with Search
  const fetchTeachers = async (searchValue = "") => {
    try {
      const res = await API.get(`/teachers/all?search=${searchValue}`);
      setTeachers(res.data);
    } catch (error) {
      console.error("Error fetching teachers");
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // 🔥 Handle Search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchTeachers(value);
  };

  // 🔥 Toggle Leave
  const toggleLeave = async (id) => {
    try {
      await API.patch(`/teachers/toggle-leave/${id}`);
      fetchTeachers(search); // refresh list
    } catch (error) {
      console.error("Error updating leave");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">

        <h2 className="text-xl font-bold mb-6">
          All Teacher Dashboard
        </h2>

        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search teacher by name..."
          value={search}
          onChange={handleSearch}
          className="border p-2 rounded w-full mb-6"
        />

        {/* 📋 Table */}
        <table className="w-full border-collapse border">

          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Type</th> {/* ✅ NEW COLUMN */}
              <th className="border p-2">Leave Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher._id} className="text-center">

                <td className="border p-2">
                  {teacher.name}
                </td>

                {/* ✅ SHOW TYPE */}
                <td className="border p-2 font-semibold">
                  {teacher.Type === "Teacher" ? (
                    <span className="text-blue-600">
                      Teacher
                    </span>
                  ) : (
                    <span className="text-purple-600">
                      TA
                    </span>
                  )}
                </td>

                <td className="border p-2">
                  {teacher.isOnLeave ? (
                    <span className="text-red-600 font-semibold">
                      On Leave
                    </span>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      Available
                    </span>
                  )}
                </td>

                <td className="border p-2">
                  <button
                    onClick={() => toggleLeave(teacher._id)}
                    className={`px-3 py-1 rounded text-white ${teacher.isOnLeave
                        ? "bg-green-600"
                        : "bg-red-600"
                      }`}
                  >
                    {teacher.isOnLeave
                      ? "Set Available"
                      : "Set Leave"}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}
