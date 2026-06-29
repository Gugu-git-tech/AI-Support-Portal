// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { HomeView } from "@/views/HomeView";
import { SubmitRequestView } from "@/views/SubmitRequestView";
import { ProfileView } from "@/views/ProfileView";
import { SettingsView } from "@/views/SettingsView";
import { AdminDashboardView } from "@/views/AdminDashboardView";
import { AdminProfileView } from "@/views/AdminProfileView";
import { AdminSettingsView } from "@/views/AdminSettingsView";
import AuthPage from "@/pages/AuthPage";
import AdminLayout from "@/pages/AdminLayout";
import BotPage from "@/pages/BotPage";
import ChatWidget from './components/ChatBot/ChatWidget';

const wrap = (C: React.ComponentType) => (
  <AppLayout>
    <C />
  </AppLayout>
);

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={wrap(HomeView)} />
        <Route path="/submit" element={wrap(SubmitRequestView)} />
        <Route path="/profile" element={wrap(ProfileView)} />
        <Route path="/settings" element={wrap(SettingsView)} />
        
        {/* Bot Route */}
        <Route path="/bot" element={wrap(BotPage)} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardView />} />
          <Route path="profile" element={<AdminProfileView />} />
          <Route path="settings" element={<AdminSettingsView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Chat Widget - shows on ALL pages */}
      <ChatWidget />
    </>
  );
}