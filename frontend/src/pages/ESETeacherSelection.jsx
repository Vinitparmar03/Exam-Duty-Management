import { useState } from "react";
import BulkInsert from "./ESE Teacher Selection/BulkInsert";
import RandomTeacherSender from "./ESE Teacher Selection/RandomTeacherSender";


export default function ESETeacherSelection() {

    const [activePage, setActivePage] = useState("add");

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">

                {/* 🔥 Toggle Buttons */}
                <div className="flex bg-gray-200 rounded-lg p-1 w-fit mb-6">

                    <button
                        onClick={() => setActivePage("add")}
                        className={`px-4 py-2 rounded-lg transition ${activePage === "add"
                            ? "bg-white shadow font-semibold"
                            : ""
                            }`}
                    >
                        Random Teacher
                    </button>

                    <button
                        onClick={() => setActivePage("random")}
                        className={`px-4 py-2 rounded-lg transition ${activePage === "random"
                            ? "bg-white shadow font-semibold"
                            : ""
                            }`}
                    >
                        Bulk Insert Teacher
                    </button>

                </div>

                {/* 🔥 Conditional Rendering */}
                {activePage === "add" ? (
                    <RandomTeacherSender />
                ) : (
                    <BulkInsert />
                )}

            </div>
        </div>
    );
}
