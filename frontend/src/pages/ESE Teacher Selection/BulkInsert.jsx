import { useState } from "react";
import API from "../../api";

export default function BulkInsert() {

    const [teachersText, setTeachersText] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [insertedTeachers, setInsertedTeachers] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setInsertedTeachers([]);

        if (!teachersText.trim()) {
            setError("Please enter teacher names");
            return;
        }

        try {
            const res = await API.post("/teachers/ese-teachers/bulk", {
                teachersText
            });

            setMessage(res.data.message);
            setInsertedTeachers(res.data.insertedTeachers || []);
            setTeachersText("");

        } catch (err) {
            setError("Error inserting teachers");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">

                {/* LEFT COLUMN */}
                <div className="bg-white p-8 rounded-xl shadow-lg">

                    <h2 className="text-xl font-bold text-center mb-6">
                        ESE Teacher Bulk Insert
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <textarea
                            rows="8"
                            placeholder={`Enter one teacher per line:
Ankit Khandelwal Sir
Priya Swami Mam`}
                            value={teachersText}
                            onChange={(e) => setTeachersText(e.target.value)}
                            className="border p-3 w-full rounded resize-none"
                        />

                        <button className="bg-green-600 text-white w-full py-2 rounded">
                            Insert Teachers
                        </button>

                        {message && <p className="text-green-600 text-center">{message}</p>}
                        {error && <p className="text-red-600 text-center">{error}</p>}

                    </form>
                </div>

                {/* RIGHT COLUMN */}
                <div className="bg-white p-8 rounded-xl shadow-lg">

                    <h2 className="text-lg font-semibold mb-4 text-center">
                        Inserted Teachers
                    </h2>

                    {insertedTeachers.length > 0 ? (
                        <div>
                            <p className="font-medium mb-2">
                                Following teachers are inserted into ESE-Teacher:
                            </p>

                            <ul className="list-disc list-inside space-y-1">
                                {insertedTeachers.map((teacher, index) => (
                                    <li key={index}>{teacher}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">
                            No teachers inserted yet.
                        </p>
                    )}

                </div>

            </div>
        </div>
    );
}
