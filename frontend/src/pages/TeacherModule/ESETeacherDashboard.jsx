import { useEffect, useState, useMemo } from "react";
import API from "../../api";
import { FaPlus, FaMinus } from "react-icons/fa";

export default function ESETeacherDashboard() {

    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("asc"); // asc | desc
    const [loadingId, setLoadingId] = useState(null);



    // 🔥 Fetch all teachers initially
    const fetchTeachers = async () => {
        const res = await API.get("/ese-teachers");
        setTeachers(res.data);
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    // 🔥 Toggle Leave
    const toggleLeave = async (id, currentStatus) => {
        console.log("hello")
        await API.put(`/ese-teachers/${id}/leave`, {
            isOnLeave: !currentStatus
        });

        fetchTeachers();
    };

    // 🔥 Search + Sort Logic (Frontend)
    const filteredTeachers = useMemo(() => {
        let filtered = teachers.filter(t =>
            t.name.toLowerCase().includes(search.toLowerCase())
        );

        filtered.sort((a, b) =>
            sortOrder === "asc"
                ? a.dutyCount - b.dutyCount
                : b.dutyCount - a.dutyCount
        );

        return filtered;
    }, [teachers, search, sortOrder]);

    const updateDuty = async (id, type) => {
        try {
            setLoadingId(id); // disable buttons

            await API.put(`/ese-teachers/${id}/duty`, { type });

            await fetchTeachers();
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <h2 className="text-2xl font-bold text-center mb-6">
                ESE Teacher Dashboard
            </h2>

            {/* 🔥 Search + Sort Controls */}
            <div className="flex justify-between mb-4 max-w-4xl mx-auto">

                <input
                    type="text"
                    placeholder="Search teacher by name..."
                    className="border p-2 rounded w-1/2"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button
                    onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Sort by Duty ({sortOrder === "asc" ? "Ascending" : "Descending"})
                </button>

            </div>

            <div className="flex justify-center">
                <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl">

                    <table className="w-full text-left">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Type</th> {/* ✅ NEW */}
                                <th className="p-3">Duty Count</th>
                                <th className="p-3">Leave Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredTeachers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center">
                                        No teachers found
                                    </td>
                                </tr>
                            ) : (
                                filteredTeachers.map(teacher => (
                                    <tr key={teacher._id} className="border-t">

                                        {/* Name */}
                                        <td className="p-3 font-medium">
                                            {teacher.name}
                                        </td>

                                        {/* ✅ Type Badge */}
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded text-white text-sm ${teacher.Type === "Teacher"
                                                    ? "bg-blue-600"
                                                    : "bg-purple-600"
                                                    }`}
                                            >
                                                {teacher.Type}
                                            </span>
                                        </td>

                                        {/* Duty Count */}
                                        <td className="p-3">
                                            <button
                                                disabled={loadingId === teacher._id}
                                                onClick={() => updateDuty(teacher._id, "decrement")}
                                                className={`p-2 rounded text-white ${loadingId === teacher._id
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-red-500 hover:bg-red-600"
                                                    }`}
                                            >
                                                <FaMinus size={12} />
                                            </button>
                                            <span className="font-semibold inline-flex w-7 content-center justify-center">
                                                {teacher.dutyCount}
                                            </span>

                                            <button
                                                disabled={loadingId === teacher._id}
                                                onClick={() => updateDuty(teacher._id, "increment")}
                                                className={`p-2 rounded text-white ${loadingId === teacher._id
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-red-500 hover:bg-red-600"
                                                    }`}
                                            >
                                                <FaPlus size={12} />
                                            </button>
                                        </td>

                                        {/* Leave Status */}
                                        <td className="p-3">
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

                                        {/* Action */}
                                        <td className="p-3">
                                            <button
                                                onClick={() =>
                                                    toggleLeave(teacher._id, teacher.isOnLeave)
                                                }
                                                className={`px-3 py-1 rounded text-white ${teacher.isOnLeave
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                                    }`}
                                            >
                                                {teacher.isOnLeave
                                                    ? "Mark Available"
                                                    : "Set Leave"}
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>


                </div>
            </div>
        </div>
    );
}
