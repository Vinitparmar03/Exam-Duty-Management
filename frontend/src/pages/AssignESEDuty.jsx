import { useState } from "react";
import API from "../api";

export default function AssignESEDuty() {

    const [date, setDate] = useState("");
    const [email, setEmail] = useState("");
    const [count, setCount] = useState("");
    const [shift, setShift] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [selectedTeachers, setSelectedTeachers] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setSelectedTeachers([]);

        if (!date || !email || !count || !shift) {
            setError("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const res = await API.post("/ese-teachers/ese-teacher-assign", {
                date,
                email,
                count: Number(count),
                shift
            });

            setMessage(res.data.message);
            setSelectedTeachers(res.data.teachers || []);

        } catch (err) {
            setError(
                err.response?.data?.message || "Assignment failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* 🔹 LEFT COLUMN – FORM */}
                <div className="bg-white p-8 rounded-xl shadow-lg">

                    <h2 className="text-xl font-bold text-center mb-6">
                        Assign ESE Teachers
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border p-2 w-full rounded"
                        />

                        <select
                            value={shift}
                            onChange={(e) => setShift(e.target.value)}
                            className="border p-2 w-full rounded"
                        >
                            <option value="">Select Shift</option>
                            <option value="Morning">Morning</option>
                            <option value="Afternoon">Afternoon</option>
                            <option value="Evening">Evening</option>
                        </select>

                        <input
                            type="email"
                            placeholder="Enter Admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 w-full rounded"
                        />

                        <input
                            type="number"
                            placeholder="Number of Teachers"
                            min="1"
                            value={count}
                            onChange={(e) => setCount(e.target.value)}
                            className="border p-2 w-full rounded"
                        />

                        <button
                            disabled={loading}
                            className={`w-full py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600"
                                }`}
                        >
                            {loading ? "Assigning..." : "Assign & Send Email"}
                        </button>

                        {message && (
                            <p className="text-green-600 text-center">
                                {message}
                            </p>
                        )}

                        {error && (
                            <p className="text-red-600 text-center">
                                {error}
                            </p>
                        )}

                    </form>

                </div>

                {/* 🔹 RIGHT COLUMN – SELECTED TEACHERS */}
                <div className="bg-white p-8 rounded-xl shadow-lg">

                    <h2 className="text-xl font-bold mb-6 text-center">
                        Selected Teachers
                    </h2>

                    {selectedTeachers.length === 0 ? (
                        <p className="text-gray-500 text-center">
                            No teachers selected yet
                        </p>
                    ) : (
                        <ul className="space-y-3">
                            {selectedTeachers.map((teacher, index) => (
                                <li
                                    key={index}
                                    className="border p-3 rounded bg-blue-50 text-center"
                                >
                                    {teacher}
                                </li>
                            ))}
                        </ul>
                    )}

                </div>

            </div>
        </div>
    );
}
