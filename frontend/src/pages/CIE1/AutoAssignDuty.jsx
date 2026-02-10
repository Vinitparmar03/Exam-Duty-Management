import { useEffect, useState } from "react";
import API from "../../api";

export default function AutoAssignDuty() {
    const [sections, setSections] = useState([]);

    const [course, setCourse] = useState("");
    const [department, setDepartment] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [year, setYear] = useState("");
    const [section, setSection] = useState("");

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSections = async () => {
            const res = await API.get("/sections");
            setSections(res.data);
        };
        fetchSections();
    }, []);

    // ✅ Unique helpers (fixed department handling)
    const courses = [...new Set(sections.map(s => s.course))];

    const departments = [
        ...new Set(
            sections
                .filter(s => s.course === course)
                .map(s => s.department?.code)
        )
    ];

    const specializations = [
        ...new Set(
            sections
                .filter(
                    s =>
                        s.course === course &&
                        s.department?.code === department
                )
                .map(s => s.speciallization)
        )
    ];

    const years = [
        ...new Set(
            sections
                .filter(
                    s =>
                        s.course === course &&
                        s.department?.code === department &&
                        s.speciallization === specialization
                )
                .map(s => s.year)
        )
    ];

    const filteredSections = sections.filter(
        s =>
            s.course === course &&
            s.department?.code === department &&
            s.speciallization === specialization &&
            s.year === Number(year)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!section || !date || !startTime || !endTime) {
            setError("Please fill all fields");
            return;
        }

        if (startTime >= endTime) {
            setError("End time must be after start time");
            return;
        }

        try {
            const res = await API.post("/duty/auto", {
                date,
                section,
                startTime,
                endTime,
            });

            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Error assigning duty");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-6 text-center">
                    Hierarchy Assign Duty
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Course */}
                    <select value={course}
                        onChange={e => {
                            setCourse(e.target.value);
                            setDepartment("");
                            setSpecialization("");
                            setYear("");
                            setSection("");
                        }}
                        className="border p-2 w-full rounded">
                        <option value="">Select Course</option>
                        {courses.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    {/* Department */}
                    {course && (
                        <select value={department}
                            onChange={e => {
                                setDepartment(e.target.value);
                                setSpecialization("");
                                setYear("");
                                setSection("");
                            }}
                            className="border p-2 w-full rounded">
                            <option value="">Select Department</option>
                            {departments.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    )}

                    {/* Specialization */}
                    {department && (
                        <select value={specialization}
                            onChange={e => {
                                setSpecialization(e.target.value);
                                setYear("");
                                setSection("");
                            }}
                            className="border p-2 w-full rounded">
                            <option value="">Select Specialization</option>
                            {specializations.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    )}

                    {/* Year */}
                    {specialization && (
                        <select value={year}
                            onChange={e => {
                                setYear(e.target.value);
                                setSection("");
                            }}
                            className="border p-2 w-full rounded">
                            <option value="">Select Year</option>
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    )}

                    {/* Section */}
                    {year && (
                        <select value={section}
                            onChange={e => setSection(e.target.value)}
                            className="border p-2 w-full rounded">
                            <option value="">Select Section</option>
                            {filteredSections.map(sec => (
                                <option key={sec._id} value={sec._id}>
                                    {sec.name} (Room {sec.roomNumber})
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Date & Time */}
                    <input type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="border p-2 w-full rounded" />

                    <input type="time"
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        className="border p-2 w-full rounded" />

                    <input type="time"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="border p-2 w-full rounded" />

                    <button className="bg-green-600 text-white w-full py-2 rounded">
                        Assign
                    </button>

                    {message && <p className="text-green-600 text-center">{message}</p>}
                    {error && <p className="text-red-600 text-center">{error}</p>}
                </form>
            </div>
        </div>
    );
}
