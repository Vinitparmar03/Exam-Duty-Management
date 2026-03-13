import { useState } from "react";
import API from "../api";

export default function AddTeacher() {
    const [name, setName] = useState("");
    const [Type, setType] = useState("Teacher");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.post("/teachers", { name, Type });
            alert("Teacher added successfully!");
            setName("");
            setType("Teacher");
        } catch (error) {
            alert("Error adding teacher");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h2 className="text-xl font-bold mb-6 text-center">
                    Add Teacher
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Teacher Name */}
                    <input
                        type="text"
                        placeholder="Teacher Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                    />

                    {/* Teacher Type Dropdown */}
                    <select
                        value={Type}
                        onChange={(e) => setType(e.target.value)}
                        className="border p-2 w-full rounded"
                    >
                        <option value="Teacher">Teacher</option>
                        <option value="TA">TA</option>
                    </select>

                    <button
                        type="submit"
                        className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
                    >
                        Add Teacher
                    </button>

                </form>
            </div>
        </div>
    );
}