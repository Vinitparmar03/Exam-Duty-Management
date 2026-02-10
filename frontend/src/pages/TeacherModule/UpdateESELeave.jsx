import { useEffect, useState } from "react";
import API from "../../api";

export default function UpdateESELeave() {

    const [teachers, setTeachers] = useState([]);
    const [teacherId, setTeacherId] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [leaveType, setLeaveType] = useState("");
    const [shift, setShift] = useState("");

    const fetchTeachers = async () => {
        const res = await API.get("/ese-teachers/with-leave");
        setTeachers(res.data);
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleTeacherChange = (id) => {
        setTeacherId(id);
        const teacher = teachers.find(t => t._id === id);
        setSelectedTeacher(teacher);
        setSelectedDate("");
    };

    const handleUpdate = async () => {

        if (!teacherId || !selectedDate || !leaveType) {
            alert("Fill required fields");
            return;
        }

        if (leaveType === "isOnLeave" && !shift) {
            alert("Select shift for leave");
            return;
        }

        try {
            await API.put("/ese-teachers/update-leave", {
                teacherId,
                date: selectedDate,
                leaveType,
                shift: leaveType === "isOnLeave" ? shift : undefined
            });

            alert("Leave updated successfully");

            setLeaveType("");
            setShift("");
            fetchTeachers();

        } catch (error) {
            alert(error.response?.data?.message);
        }
    };

    return (
        <div className="p-6 bg-white shadow rounded max-w-4xl mx-auto">

            <h2 className="text-xl font-bold mb-6">
                Update ESE Teacher Leave
            </h2>

            {/* Teacher Dropdown */}
            <select
                value={teacherId}
                onChange={(e) => handleTeacherChange(e.target.value)}
                className="border p-2 w-full mb-4"
            >
                <option value="">Select Teacher</option>
                {teachers.map(t => (
                    <option key={t._id} value={t._id}>
                        {t.name}
                    </option>
                ))}
            </select>

            {/* Date Dropdown */}
            {selectedTeacher && (
                <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border p-2 w-full mb-4"
                >
                    <option value="">Select Leave Date</option>
                    {selectedTeacher.unavailableDates.map((d, index) => (
                        <option key={index} value={d.date}>
                            {d.date} ({d.shift})
                        </option>
                    ))}
                </select>
            )}

            {/* Leave Type */}
            <select
                value={leaveType}
                onChange={(e) => {
                    setLeaveType(e.target.value);
                    if (e.target.value === "isOnDuty") {
                        setShift(""); // auto clear shift
                    }
                }}
                className="border p-2 w-full mb-4"
            >
                <option value="">Select Leave Type</option>
                <option value="isOnLeave">On Leave</option>
                <option value="isOnDuty">On Duty (Remove Leave)</option>
            </select>

            {/* 🔥 Shift shown only if On Leave */}
            {leaveType === "isOnLeave" && (
                <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="border p-2 w-full mb-4"
                >
                    <option value="">Select Shift</option>
                    <option value="Full Day">Full Day</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Second Half Day">Second Half Day</option>
                </select>
            )}

            <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
                Update Leave
            </button>

        </div>
    );
}
