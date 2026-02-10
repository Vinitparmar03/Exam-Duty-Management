import { Link, useLocation, useNavigate } from "react-router-dom";
import { PiUsersFourFill } from "react-icons/pi";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {

    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isActive = (path) =>
        location.pathname === path ||
        location.pathname.endsWith(path);

    const linkStyle = (path) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive(path)
            ? "bg-white text-blue-600"
            : "text-white hover:bg-blue-500"
        }`;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-blue-600 shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

                {/* 🔵 LEFT SIDE */}
                <h1 className="text-white text-xl font-bold">
                    Exam Duty System
                </h1>

                {/* 🔵 RIGHT SIDE */}
                <div className="flex items-center gap-4">

                    <Link to="/" className={linkStyle("/")}>
                        Dashboard
                    </Link>
                    {/* 🔐 IF USER LOGGED IN */}
                    {user ? (
                        <>
                            {/* Admin Navigation */}
                            <Link to="/admin" className={linkStyle("/admin")}>
                                Admin Dashboard
                            </Link>

                            <Link
                                to="/admin/add-teacher"
                                className={linkStyle("/add-teacher")}
                            >
                                Add Teacher
                            </Link>

                            <Link
                                to="/admin/assign-ese-duty"
                                className={linkStyle("/assign-ese-duty")}
                            >
                                Assign Duty
                            </Link>

                            <Link
                                to="/admin/ese-teacher-selection"
                                className={linkStyle("/ese-teacher-selection")}
                            >
                                Selection
                            </Link>

                            <Link
                                to="/admin/teacher-dashboard"
                                className={`flex items-center gap-2 ${linkStyle(
                                    "/teacher-dashboard"
                                )}`}
                            >
                                <PiUsersFourFill size={18} />
                                Teachers
                            </Link>

                            {/* User Info */}
                            <span className="text-white text-sm ml-4">
                                👋 {user.username}
                            </span>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="ml-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition text-sm"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        /* 🌍 IF NOT LOGGED IN */
                        <>
                            <Link
                                to="/login"
                                className={linkStyle("/login")}
                            >
                                Login
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </nav>
    );
}
