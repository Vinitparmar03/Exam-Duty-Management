import React, { useState } from "react";
import API from "../../api";

const ESETeacherLeaveDashboard = () => {
    const [date, setDate] = useState("");
    const [includeOnLeave, setIncludeOnLeave] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        if (!date) {
            alert("Please select a date");
            return;
        }

        setLoading(true);

        try {
            const res = await API.get("/ese-teachers/leave-dashboard", {
                params: { date, includeOnLeave }
            });

            setData(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error(error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">

                {/* 🔥 HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        📅 ESE Teacher Leave Dashboard
                    </h2>
                </div>

                {/* 🔥 FILTER CARD */}
                <div className="bg-gray-50 p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-center">

                    {/* Date */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Toggle */}
                    <div className="flex items-center gap-2 mt-5">
                        <input
                            type="checkbox"
                            checked={includeOnLeave}
                            onChange={() => setIncludeOnLeave(!includeOnLeave)}
                            className="w-4 h-4"
                        />
                        <span className="text-gray-700 text-sm">
                            Include Full Leave Teachers
                        </span>
                    </div>

                    {/* Apply Button */}
                    <button
                        onClick={fetchData}
                        className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        Apply Filter
                    </button>
                </div>

                {/* 🔥 LOADING */}
                {loading && (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* 🔥 TABLE */}
                {!loading && (
                    <div className="overflow-hidden rounded-xl border">

                        <table className="w-full text-sm text-left">

                            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Teacher</th>
                                    <th className="px-6 py-3">Shift</th>
                                    <th className="px-6 py-3">Leave Type</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.length > 0 ? (
                                    data.map((teacher, index) => (
                                        <tr
                                            key={index}
                                            className="border-t hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                {teacher.name}
                                            </td>

                                            <td className="px-6 py-4">
                                                {teacher.shift}
                                            </td>

                                            <td className="px-6 py-4">
                                                {teacher.leaveType}
                                            </td>


                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-10 text-gray-500"
                                        >
                                            No data available for selected date
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ESETeacherLeaveDashboard;