import { useState } from "react";
import API from "../api";

export default function AddTeacher() {
    const [name, setName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.post("/teachers", { name });
            alert("Teacher added successfully!");
            setName("");
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

                    <input
                        type="text"
                        placeholder="Teacher Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                    />

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
