import { useState } from "react";
import AllTeacherDashboard from "./TeacherModule/AllTeacherDashboard";
import AllTeacherLeaveManager from "./TeacherModule/AllTeacherLeaveManager";
import ESELeaveManager from "./TeacherModule/ESELeaveManager";
import ESETeacherDashboard from "./TeacherModule/ESETeacherDashboard";
import UpdateESELeave from "./TeacherModule/UpdateESELeave";
import AllTeacherUpdateLeave from "./TeacherModule/AllTeacherUpdateLeave";

export default function TeacherModulePage() {

    const [activePage, setActivePage] = useState("ese");

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">

                {/* 🔥 Toggle Buttons */}
                <div className="flex bg-gray-200 rounded-lg p-1 w-fit mb-6">

                    <button
                        onClick={() => setActivePage("ese")}
                        className={`px-4 py-2 rounded-lg transition ${activePage === "ese"
                            ? "bg-white shadow font-semibold"
                            : ""
                            }`}
                    >
                        ESE Teacher
                    </button>

                    <button
                        onClick={() => setActivePage("all")}
                        className={`px-4 py-2 rounded-lg transition ${activePage === "all"
                            ? "bg-white shadow font-semibold"
                            : ""
                            }`}
                    >
                        All Teachers
                    </button>

                    <button
                        onClick={() => setActivePage("ese-teacher-leave")}
                        className={`px-4 py-2 rounded-lg transition ${activePage === "ese-teacher-leave"
                            ? "bg-white shadow font-semibold"
                            : ""
                            }`}
                    >
                        ESE Teacher Leave
                    </button>

                    <button
                        onClick={() => setActivePage("update-ese-teacher-leave")}
                        className={`px-4 py-2 rounded-lg transition ${activePage === "update-ese-teacher-leave"
                            ? "bg-white shadow font-semibold"
                            : ""
                            }`}
                    >
                        Update ESE Teacher Leave
                    </button>
                    <button
                        onClick={() => setActivePage("all-teacher-apply-leave")}
                        className={`px-4 py-2 rounded-lg transition ${activePage === "all-teacher-apply-leave"
                            ? "bg-white shadow font-semibold"
                            : ""
                            }`}
                    >
                        All Teacher Apply Leave
                    </button>
                    <button
                        onClick={() => setActivePage("all-teacher-update-leave")}
                        className={`px-4 py-2 rounded-lg transition ${activePage === "all-teacher-update-leave"
                            ? "bg-white shadow font-semibold"
                            : ""
                            }`}
                    >
                        All Teacher Update Leave
                    </button>

                </div>

                {/* 🔥 Conditional Rendering */}
                {activePage === "ese" && <ESETeacherDashboard />}
                {activePage === "all" && <AllTeacherDashboard />}
                {activePage === "ese-teacher-leave" && <ESELeaveManager />}
                {activePage === "update-ese-teacher-leave" && <UpdateESELeave />}
                {activePage === "all-teacher-apply-leave" && <AllTeacherLeaveManager />}
                {activePage === "all-teacher-update-leave" && <AllTeacherUpdateLeave />}

            </div>
        </div>
    );
}
