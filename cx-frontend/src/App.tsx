// App router — all pages are frontend-only and use mock data
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserHome from "./pages/UserHome";
import UserSubmit from "./pages/UserSubmit";
import UserProfile from "./pages/UserProfile";
import UserSettings from "./pages/UserSettings";
import AgentHome from "./pages/AgentHome";
import AgentTickets from "./pages/AgentTickets";
import AgentProfile from "./pages/AgentProfile";
import AdminHome from "./pages/AdminHome";
import AdminOperations from "./pages/AdminOperations";
import AdminReports from "./pages/AdminReports";
import AdminAssignment from "./pages/AdminAssignment";
import AdminSla from "./pages/AdminSla";
import AdminProfile from "./pages/AdminProfile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/user/home" element={<UserHome />} />
      <Route path="/user/submit" element={<UserSubmit />} />
      <Route path="/user/profile" element={<UserProfile />} />
      <Route path="/user/settings" element={<UserSettings />} />

      <Route path="/agent/home" element={<AgentHome />} />
      <Route path="/agent/tickets" element={<AgentTickets />} />
      <Route path="/agent/profile" element={<AgentProfile />} />

      <Route path="/admin/home" element={<AdminHome />} />
      <Route path="/admin/operations" element={<AdminOperations />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/assignment" element={<AdminAssignment />} />
      <Route path="/admin/sla" element={<AdminSla />} />
      <Route path="/admin/profile" element={<AdminProfile />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
