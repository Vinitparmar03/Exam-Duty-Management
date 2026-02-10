import { BrowserRouter, Route, Routes } from "react-router-dom";

import AddTeacher from "./pages/AddTeacher";
import AssignESEDuty from "./pages/assignESEDuty";
import ESEDashboard from "./pages/ESEDashboard";
import ESETeacherSelection from "./pages/ESETeacherSelection";
import TeacherModulePage from "./pages/TeacherModulePage";
import Login from "./pages/Login";

import Navbar from "./components/navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>

          {/* 🌍 Public Routes */}
          <Route path="/" element={<ESEDashboard />} />
          <Route path="/login" element={<Login />} />

          {/* 🔐 Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>

            <Route index element={<ESEDashboard />} />
            <Route path="add-teacher" element={<AddTeacher />} />
            <Route path="assign-ese-duty" element={<AssignESEDuty />} />
            <Route path="ese-teacher-selection" element={<ESETeacherSelection />} />
            <Route path="teacher-dashboard" element={<TeacherModulePage />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
