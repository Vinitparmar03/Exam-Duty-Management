import { useEffect, useState } from "react";
import API from "../../api";

export default function ESELeaveManager() {

    const [teachers, setTeachers] = useState([]);
    const [teacherId, setTeacherId] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [leaveType, setLeaveType] = useState("");
    const [shift, setShift] = useState("Full Day");

    const [message, setMessage] = useState("");

    // 🔹 Fetch Teachers
    const fetchTeachers = async () => {
        try {
            const res = await API.get("/ese-teachers");

            // 🔥 Sort by Name on frontend
            const sorted = res.data.sort((a, b) =>
                a.name.localeCompare(b.name)
            );

            setTeachers(sorted);

        } catch (error) {
            console.error("Error fetching teachers");
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    // 🔹 Submit Leave
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!teacherId || !fromDate || !toDate || !leaveType) {
            alert("Please fill all fields");
            return;
        }

        try {
            const res = await API.post("/ese-teachers/add-leave-range", {
                teacherId,
                fromDate,
                toDate,
                leaveType,
                shift
            });

            setMessage(res.data.message);

            // Reset form
            setFromDate("");
            setToDate("");
            setLeaveType("");

        } catch (error) {
            console.error(error);
            alert("Failed to set leave");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">

                <h2 className="text-xl font-bold mb-6">
                    Set Faculty Leave
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Faculty Dropdown */}
                    <select
                        value={teacherId}
                        onChange={(e) => setTeacherId(e.target.value)}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">Select Faculty</option>
                        {teachers.map((teacher) => (
                            <option key={teacher._id} value={teacher._id}>
                                {teacher.name}
                            </option>
                        ))}
                    </select>

                    {/* From Date */}
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="border p-2 rounded w-full"
                    />

                    {/* To Date */}
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="border p-2 rounded w-full"
                    />

                    {/* Leave Type */}
                    <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">Select Leave Type</option>
                        <option value="isOnLeave">On Leave</option>
                        <option value="isOnDuty">On Duty</option>
                    </select>

                    {/* Shift */}
                    {leaveType === "isOnLeave" && (
                        <select
                            value={shift}
                            onChange={(e) => setShift(e.target.value)}
                            className="border p-2 rounded w-full"
                        >
                            <option value="Full Day">Full Day</option>
                            <option value="Half Day">Half Day</option>
                            <option value="Second Half Day">Second Half Day</option>
                        </select>
                    )}


                    {/* Submit Button */}
                    <button className="bg-blue-600 text-white w-full py-2 rounded">
                        Set Leave
                    </button>

                </form>

                {message && (
                    <p className="text-green-600 mt-4 text-center">
                        {message}
                    </p>
                )}

            </div>

        </div>
    );
}
