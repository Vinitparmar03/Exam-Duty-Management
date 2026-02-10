import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api";

export default function ESEDashboard() {

    const location = useLocation();
    const isAdmin = location.pathname === "/admin";

    // 🔹 Form state
    const [date, setDate] = useState("");
    const [shift, setShift] = useState("");
    const [teacherId, setTeacherId] = useState("");

    // 🔹 Applied filter state
    const [appliedFilters, setAppliedFilters] = useState({
        date: "",
        shift: "",
        teacherId: ""
    });

    const [teachers, setTeachers] = useState([]);
    const [duties, setDuties] = useState([]);

    // ✅ Fetch teachers
    const fetchTeachers = async () => {
        try {
            const res = await API.get("/ese-teachers");
            setTeachers(res.data);
        } catch (error) {
            console.error("Error fetching teachers", error);
        }
    };

    // ✅ Fetch duties
    const fetchDuty = async (filters = appliedFilters) => {
        try {

            const params = new URLSearchParams();

            if (filters.date) params.append("date", filters.date);
            if (filters.shift) params.append("shift", filters.shift);
            if (filters.teacherId) params.append("teacher", filters.teacherId);

            const res = await API.get(`/ese-duty?${params.toString()}`);
            setDuties(res.data);

        } catch (error) {
            console.error("Error fetching duties", error);
        }
    };

    // ✅ Apply filter
    const handleFilter = async () => {
        const newFilters = { date, shift, teacherId };
        setAppliedFilters(newFilters);
        await fetchDuty(newFilters);
    };

    // ✅ Reset filters
    const resetFilters = async () => {
        setDate("");
        setShift("");
        setTeacherId("");

        const emptyFilters = {
            date: "",
            shift: "",
            teacherId: ""
        };

        setAppliedFilters(emptyFilters);
        await fetchDuty(emptyFilters);
    };

    // ✅ Change teacher (Admin only)
    const changeTeacher = async (dutyId, oldTeacherId) => {
        try {
            await API.put(`/ese-duty/change/${dutyId}/${oldTeacherId}`);
            fetchDuty(appliedFilters);
        } catch (error) {
            alert("Error changing teacher");
        }
    };

    // ✅ Initial Load
    useEffect(() => {
        fetchTeachers();
        fetchDuty({ date: "", shift: "", teacherId: "" });
    }, []);

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">
                ESE Duty Management
            </h1>

            {/* 🔹 Filters */}
            <div className="flex gap-3 mb-6">

                <input
                    type="date"
                    className="border p-2 rounded"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <select
                    className="border p-2 rounded"
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                >
                    <option value="">All Shifts</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                </select>

                <select
                    className="border p-2 rounded"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                >
                    <option value="">All Teachers</option>
                    {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                            {teacher.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleFilter}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Filter
                </button>

                <button
                    onClick={resetFilters}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Reset
                </button>

            </div>

            {/* 🔹 Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded">

                    <thead>
                        <tr className="bg-gray-200 text-center">
                            <th className="p-3">Date</th>
                            <th className="p-3">Shift</th>
                            <th className="p-3">Teacher</th>
                            <th className="p-3">Duty Count</th>
                            {isAdmin && <th className="p-3">Action</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {duties.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={isAdmin ? 5 : 4}
                                    className="text-center p-4"
                                >
                                    No duties found
                                </td>
                            </tr>
                        ) : (
                            duties.flatMap((duty) => {

                                const teachersToShow = appliedFilters.teacherId
                                    ? duty.teacher.filter(
                                        (t) =>
                                            t._id.toString() === appliedFilters.teacherId
                                    )
                                    : duty.teacher;

                                return teachersToShow.map((teacher) => (
                                    <tr
                                        key={`${duty._id}-${teacher._id}`}
                                        className="border text-center"
                                    >

                                        <td className="p-2">{duty.date}</td>
                                        <td className="p-2">{duty.shift}</td>
                                        <td className="p-2">{teacher.name}</td>
                                        <td className="p-2">{teacher.dutyCount}</td>

                                        {isAdmin && (
                                            <td className="p-2">
                                                <button
                                                    onClick={() =>
                                                        changeTeacher(
                                                            duty._id,
                                                            teacher._id
                                                        )
                                                    }
                                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                                >
                                                    Change
                                                </button>
                                            </td>
                                        )}

                                    </tr>
                                ));
                            })
                        )}
                    </tbody>

                </table>
            </div>

        </div>
    );
}
