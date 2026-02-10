import { useEffect, useState } from "react";
import API from "../../api";

export default function AllTeacherUpdateLeave() {

    const [teachers, setTeachers] = useState([]);
    const [teacherId, setTeacherId] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const [date, setDate] = useState("");
    const [leaveType, setLeaveType] = useState("");
    const [shift, setShift] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // 🔥 Fetch teachers having leave
    const fetchTeachers = async () => {
        const res = await API.get("/teachers/with-leave");
        setTeachers(res.data);
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    // 🔹 When teacher selected
    const handleTeacherChange = (id) => {
        setTeacherId(id);
        const teacher = teachers.find(t => t._id === id);
        setSelectedTeacher(teacher);
        setDate("");
        setLeaveType("");
        setShift("");
    };

    // 🔹 Update Leave
    const handleUpdate = async () => {

        setMessage("");
        setError("");

        if (!teacherId || !date || !leaveType) {
            setError("Please select all required fields");
            return;
        }

        if (leaveType === "isOnLeave" && !shift) {
            setError("Please select shift");
            return;
        }

        try {

            await API.put("/teachers/update-leave", {
                teacherId,
                date,
                leaveType,
                shift: leaveType === "isOnLeave" ? shift : undefined
            });

            setMessage("Leave updated successfully");

            fetchTeachers();
            setLeaveType("");
            setShift("");

        } catch (err) {
            setError(err.response?.data?.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">

                <h2 className="text-xl font-bold mb-6 text-center">
                    Update Teacher Leave
                </h2>

                {/* 1️⃣ Select Teacher */}
                <select
                    value={teacherId}
                    onChange={(e) => handleTeacherChange(e.target.value)}
                    className="border p-2 w-full rounded mb-4"
                >
                    <option value="">Select Teacher</option>
                    {teachers.map(t => (
                        <option key={t._id} value={t._id}>
                            {t.name}
                        </option>
                    ))}
                </select>

                {/* 2️⃣ Select Date */}
                {selectedTeacher && (
                    <select
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border p-2 w-full rounded mb-4"
                    >
                        <option value="">Select Leave Date</option>
                        {selectedTeacher.unavailableDates.map((d, i) => (
                            <option key={i} value={d.date}>
                                {d.date} ({d.shift})
                            </option>
                        ))}
                    </select>
                )}

                {/* 3️⃣ Select Leave Type */}
                <select
                    value={leaveType}
                    onChange={(e) => {
                        setLeaveType(e.target.value);
                        if (e.target.value === "isOnDuty") {
                            setShift("");
                        }
                    }}
                    className="border p-2 w-full rounded mb-4"
                >
                    <option value="">Select Action</option>
                    <option value="isOnLeave">Modify Leave</option>
                    <option value="isOnDuty">Remove Leave</option>
                </select>

                {/* 4️⃣ Select Shift (only if modifying leave) */}
                {leaveType === "isOnLeave" && (
                    <select
                        value={shift}
                        onChange={(e) => setShift(e.target.value)}
                        className="border p-2 w-full rounded mb-4"
                    >
                        <option value="">Select Shift</option>
                        <option value="Full Day">Full Day</option>
                        <option value="Half Day">Half Day</option>
                        <option value="Second Half Day">Second Half Day</option>
                    </select>
                )}

                <button
                    onClick={handleUpdate}
                    className="bg-blue-600 text-white w-full py-2 rounded"
                >
                    Update Leave
                </button>

                {message && <p className="text-green-600 mt-4">{message}</p>}
                {error && <p className="text-red-600 mt-4">{error}</p>}

            </div>
        </div>
    );
}
