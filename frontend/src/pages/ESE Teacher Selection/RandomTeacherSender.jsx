import { useState } from "react";
import API from "../../api";

export default function RandomTeacherSender() {

  const [taCount, setTaCount] = useState("");
  const [teacherCount, setTeacherCount] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendRandomTeachers = async () => {
    try {

      if (!taCount || !teacherCount || !email) {
        alert("Please enter TA count, Teacher count and email");
        return;
      }

      setLoading(true);

      const res = await API.post(
        "/teachers/random-teachers",
        {
          taCount: Number(taCount),
          teacherCount: Number(teacherCount),
          email
        }
      );

      setSelectedTeachers(res.data.selected);

      alert(res.data.message);

    } catch (error) {
      alert("Error sending email");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded mt-6">

      <h2 className="text-xl font-bold mb-4">
        Send Random Staff
      </h2>

      <div className="flex gap-3 mb-4 flex-wrap">

        {/* TA Count */}
        <input
          type="number"
          placeholder="Enter TA Count"
          className="border p-2 rounded"
          value={taCount}
          onChange={(e) => setTaCount(e.target.value)}
        />

        {/* Teacher Count */}
        <input
          type="number"
          placeholder="Enter Teacher Count"
          className="border p-2 rounded"
          value={teacherCount}
          onChange={(e) => setTeacherCount(e.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Enter email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendRandomTeachers}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Sending..." : "Send"}
        </button>

      </div>

      {/* 🔥 Show Selected Staff */}

      {selectedTeachers.length > 0 && (
        <div className="mt-4 p-4 border rounded bg-gray-100">

          <h3 className="font-bold mb-2">
            Selected Staff:
          </h3>

          <ul className="list-disc list-inside">
            {selectedTeachers.map((teacher, index) => (
              <li key={index}>
                {teacher.name}
              </li>
            ))}
          </ul>

        </div>
      )}

    </div>
  );
}
