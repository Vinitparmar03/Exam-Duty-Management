import { useState } from "react";
import AllTeacherDashboard from "./TeacherModule/AllTeacherDashboard";
import AllTeacherLeaveManager from "./TeacherModule/AllTeacherLeaveManager";
import ESELeaveManager from "./TeacherModule/ESELeaveManager";
import ESETeacherDashboard from "./TeacherModule/ESETeacherDashboard";
import UpdateESELeave from "./TeacherModule/UpdateESELeave";
import AllTeacherUpdateLeave from "./TeacherModule/AllTeacherUpdateLeave";
import ESETeacherLeaveDashboard from "./TeacherModule/ESETeacherLeaveDashboard";

export default function TeacherModulePage() {

    // 🔥 Main toggle (ESE / CIE)
    const [activeMain, setActiveMain] = useState("ese");

    // 🔥 Sub toggle
    const [activeSub, setActiveSub] = useState("ese-dashboard");

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">

                {/* 🔥 MAIN TOGGLE */}
                <div className="flex bg-gray-300 rounded-lg p-1 w-fit mb-4">
                    <button
                        onClick={() => {
                            setActiveMain("ese");
                            setActiveSub("ese-dashboard");
                        }}
                        className={`px-4 py-2 rounded-lg ${activeMain === "ese" ? "bg-white shadow font-semibold" : ""}`}
                    >
                        ESE
                    </button>

                    <button
                        onClick={() => {
                            setActiveMain("cie");
                            setActiveSub("all-dashboard");
                        }}
                        className={`px-4 py-2 rounded-lg ${activeMain === "cie" ? "bg-white shadow font-semibold" : ""}`}
                    >
                        CIE 1
                    </button>
                </div>

                {/* 🔥 SUB MENU */}
                <div className="flex flex-wrap gap-2 bg-gray-200 p-2 rounded-lg mb-6">

                    {/* ✅ ESE MENU */}
                    {activeMain === "ese" && (
                        <>
                            <button
                                onClick={() => setActiveSub("ese-dashboard")}
                                className={`px-4 py-2 rounded ${activeSub === "ese-dashboard" ? "bg-white shadow" : ""}`}
                            >
                                ESE Teacher
                            </button>

                            <button
                                onClick={() => setActiveSub("ese-leave")}
                                className={`px-4 py-2 rounded ${activeSub === "ese-leave" ? "bg-white shadow" : ""}`}
                            >
                                ESE Teacher Leave
                            </button>

                            <button
                                onClick={() => setActiveSub("ese-update-leave")}
                                className={`px-4 py-2 rounded ${activeSub === "ese-update-leave" ? "bg-white shadow" : ""}`}
                            >
                                Update ESE Teacher Leave
                            </button>
                            <button
                                onClick={() => setActiveSub("ese-leave-dashboard")}
                                className={`px-4 py-2 rounded ${activeSub === "ese-leave-dashboard" ? "bg-white shadow" : ""}`}
                            >
                                ESE Teacher Leave Dashboard
                            </button>
                        </>
                    )}

                    {/* ✅ CIE MENU */}
                    {activeMain === "cie" && (
                        <>
                            <button
                                onClick={() => setActiveSub("all-dashboard")}
                                className={`px-4 py-2 rounded ${activeSub === "all-dashboard" ? "bg-white shadow" : ""}`}
                            >
                                All Teachers
                            </button>

                            <button
                                onClick={() => setActiveSub("all-apply-leave")}
                                className={`px-4 py-2 rounded ${activeSub === "all-apply-leave" ? "bg-white shadow" : ""}`}
                            >
                                Apply Leave
                            </button>

                            <button
                                onClick={() => setActiveSub("all-update-leave")}
                                className={`px-4 py-2 rounded ${activeSub === "all-update-leave" ? "bg-white shadow" : ""}`}
                            >
                                Update Leave
                            </button>
                        </>
                    )}
                </div>

                {/* 🔥 CONTENT RENDERING */}

                {/* ✅ ESE */}
                {activeMain === "ese" && activeSub === "ese-dashboard" && <ESETeacherDashboard />}
                {activeMain === "ese" && activeSub === "ese-leave" && <ESELeaveManager />}
                {activeMain === "ese" && activeSub === "ese-update-leave" && <UpdateESELeave />}
                {activeMain === "ese" && activeSub === "ese-leave-dashboard" && <ESETeacherLeaveDashboard />}

                {/* ✅ CIE */}
                {activeMain === "cie" && activeSub === "all-dashboard" && <AllTeacherDashboard />}
                {activeMain === "cie" && activeSub === "all-apply-leave" && <AllTeacherLeaveManager />}
                {activeMain === "cie" && activeSub === "all-update-leave" && <AllTeacherUpdateLeave />}

            </div>
        </div>
    );
}