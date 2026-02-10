import { useEffect, useState } from "react";
import API from "../../api";

export default function AllTeacherLeaveManager() {

    const [teachers, setTeachers] = useState([]);
    const [teacherId, setTeacherId] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [leaveType, setLeaveType] = useState("isOnLeave");
    const [shift, setShift] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchTeachers = async () => {
        const res = await API.get("/teachers/getteachers");
        setTeachers(res.data);
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await API.post("/teachers/apply-leave", {
                teacherId,
                fromDate,
                toDate,
                leaveType,
                shift
            });

            setMessage(res.data.message);

            setFromDate("");
            setToDate("");
            setShift("");

        } catch (err) {
            setError(err.response?.data?.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">

            <h2 className="text-xl font-bold mb-6 text-center">
                Apply Leave
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="border p-2 w-full rounded"
                >
                    <option value="">Select Teacher</option>
                    {teachers.map(t => (
                        <option key={t._id} value={t._id}>
                            {t.name}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="border p-2 w-full rounded"
                />

                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="border p-2 w-full rounded"
                />

                <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="border p-2 w-full rounded"
                >
                    <option value="">Select Shift</option>
                    <option value="Full Day">Full Day</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Second Half Day">Second Half Day</option>
                </select>

                <button className="bg-blue-600 text-white w-full py-2 rounded">
                    Apply Leave
                </button>

                {message && <p className="text-green-600">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}

            </form>

        </div>
    );
}
