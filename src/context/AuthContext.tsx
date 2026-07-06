import React, { createContext, useContext, useMemo, useState } from "react";

type User = {
  name: string;
  email: string;
  onboardingCompleted: boolean;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setOnboardingCompleted: (completed: boolean) => void;
  completeOnboarding: (data: unknown) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  const login = async (email: string, _password: string) => {
    // NOTE: Stubbed auth for UI development.
    // Replace with real API calls.
    void _password;
    const nameFromEmail = email.split("@")[0]?.replace(/\W+/g, " ").trim();

    setUser({
      name: nameFromEmail
        ? nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
        : "User",
      email,
      // Onboarding page was deleted; default to completed.
      onboardingCompleted: true,
    });
  };

  const register = async (email: string, _password: string, name: string) => {
    // NOTE: Stubbed auth for UI development.
    setUser({
      name,
      email,
      onboardingCompleted: true,
    });
  };

  const logout = () => setUser(null);

  const setOnboardingCompleted = (completed: boolean) => {
    setUser((prev) =>
      prev ? { ...prev, onboardingCompleted: completed } : prev,
    );
  };

  const completeOnboarding = async (_data: unknown) => {
    void _data;
    // Stub: in a real implementation, persist onboarding answers to backend.
    setOnboardingCompleted(true);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      login,
      register,
      logout,
      setOnboardingCompleted,
      completeOnboarding,
    }),
    [user, isAuthenticated, completeOnboarding],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
