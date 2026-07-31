import { Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/login/page";
import RegisterPage from "./pages/Register/page";

import DashboardLayout from "./dashboard/layout";
import UsersPage from "./dashboard/home/page";
import HospitalsLabHistoryPage from "./dashboard/consents/page";
import SettingsPage from "./dashboard/settings/page";
import SafeguardPage from "./dashboard/security/page";
import QrScanPage from "./dashboard/scan/page";

type DashboardTabKey = "home" | "hospitals" | "settings" | "logout";

import { useState } from "react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated } = useAuth();
  // Kept for now to avoid changing behavior unexpectedly in layout.
  const [activeTab] = useState<DashboardTabKey>("home");

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              {/* fallback dashboard index */}
              {activeTab === "home" ? (
                <UsersPage />
              ) : activeTab === "hospitals" ? (
                <HospitalsLabHistoryPage />
              ) : activeTab === "settings" ? (
                <SettingsPage />
              ) : (
                <UsersPage />
              )}
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/home"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <UsersPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/consents"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <HospitalsLabHistoryPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/security"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SafeguardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/scan"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <QrScanPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
