import { useEffect, useState } from "react";
import API from "../../api";

export default function Dashboard() {
    const [date, setDate] = useState("");
    const [teacherId, setTeacherId] = useState("");
    const [teachers, setTeachers] = useState([]);
    const [duties, setDuties] = useState([]);

    // 🔥 Fetch Teachers
    const fetchTeachers = async () => {
        try {
            const res = await API.get("/teachers/getteachers");
            setTeachers(res.data);
        } catch (error) {
            console.error("Error fetching teachers", error);
        }
    };

    // 🔥 Fetch Duties
    const fetchDuty = async () => {
        if (!date) {
            alert("Please select a date");
            return;
        }

        try {
            let url = `/duty?date=${date}`;
            console.log(url)

            if (teacherId) {
                url += `&teacher=${teacherId}`;
            }

            const res = await API.get(url);
            setDuties(res.data);

        } catch (error) {
            console.error("Error fetching duties", error);
        }
    };

    const resetFilters = () => {
        setDate("");
        setTeacherId("");
        setDuties([]);
    };

    const changeTeacher = async (id) => {
        try {
            await API.put(`/duty/${id}/change`);
            fetchDuty();
        } catch (error) {
            alert("Error changing teacher");
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                Exam Duty Management
            </h1>

            <div className="flex gap-3 mb-6">

                <input
                    type="date"
                    className="border p-2 rounded"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

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
                    onClick={fetchDuty}
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

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded">
                    <thead>
                        <tr className="bg-gray-200 text-center">
                            <th className="p-3">Date</th>
                            <th className="p-3">Section</th>
                            <th className="p-3">Room</th>
                            <th className="p-3">Teacher</th>
                            <th className="p-3">Start Time</th>
                            <th className="p-3">End Time</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {duties.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center p-4">
                                    No duties found
                                </td>
                            </tr>
                        ) : (
                            duties.map((duty) => (
                                <tr key={duty._id} className="border text-center">
                                    <td className="p-2">{duty.date}</td>
                                    <td className="p-2">{duty.section?.name}</td>
                                    <td className="p-2">{duty.section?.roomNumber}</td>
                                    <td className="p-2">{duty.teacher?.name}</td>
                                    <td className="p-2">{duty.timing?.startTime}</td>
                                    <td className="p-2">{duty.timing?.endTime}</td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => changeTeacher(duty._id)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                                        >
                                            Change
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
