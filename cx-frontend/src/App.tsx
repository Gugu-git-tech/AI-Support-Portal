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
import AdminReports from "./pages/AdminReports";
import AdminUsers from "./pages/AdminUsers";
import AdminAI from "./pages/AdminAI";
import AdminKnowledge from "./pages/AdminKnowledge";
import AdminCases from "./pages/AdminCases";
import AdminConfig from "./pages/AdminConfig";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* USER ROUTES */}
      <Route
        path="/user/home"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/submit"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserSubmit />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/profile"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/settings"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserSettings />
          </ProtectedRoute>
        }
      />

      {/* AGENT ROUTES */}
      <Route
        path="/agent/home"
        element={
          <ProtectedRoute allowedRoles={["agent"]}>
            <AgentHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/agent/tickets"
        element={
          <ProtectedRoute allowedRoles={["agent"]}>
            <AgentTickets />
          </ProtectedRoute>
        }
      />

      <Route
        path="/agent/profile"
        element={
          <ProtectedRoute allowedRoles={["agent"]}>
            <AgentProfile />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin/home"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/ai"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminAI />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/knowledge"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminKnowledge />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/cases"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCases />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/config"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminConfig />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}