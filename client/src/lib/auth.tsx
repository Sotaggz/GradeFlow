import { createContext, useContext, useState, ReactNode } from "react";
import { useLocation } from "wouter";

type UserRole = "teacher" | "student" | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  LRN?: string; // numeric string only
  number?: string;
  emergency?: string;
  adviser?: string;
  sect?: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, credentials: { email?: string; LRN?: string; password: string }, userData?: Partial<User>) => { success: boolean; message?: string };
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => { success: boolean; message?: string };
}
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();

  // Mock database of users with credentials
  const studentUsers: Record<string, User & { password: string }> = {
    "123456789012": {
      id: "s1",
      name: "John Kirky",
      role: "student",
      email: "john@student.edu",
      LRN: "293719283791",
      number: "09123456789",
      emergency: "12345678901",
      adviser: "Mrs. Costillas",
      sect: "12 ICT 1",
      password: "student123",
    },
  };

  const teacherUsers: Record<string, User & { password: string }> = {
    "anderson@school.edu": {
      id: "t1",
      name: "Prof. Anderson",
      role: "teacher",
      email: "anderson@school.edu",
      password: "teacher123",
    },
  };

  const login = (role: UserRole, credentials: { email?: string; LRN?: string; password: string }, userData?: Partial<User>) => {
    if (role === "teacher") {
      const email = credentials.email || "";
      const storedUser = teacherUsers[email];
      
      if (!storedUser || storedUser.password !== credentials.password) {
        return { success: false, message: "Invalid email or password" };
      }

      setUser({
        ...storedUser,
        ...userData,
      });
      setLocation("/teacher-dashboard");
      return { success: true };
    } else if (role === "student") {
      const lrn = credentials.LRN || "";
      const storedUser = studentUsers[lrn];
      
      if (!storedUser || storedUser.password !== credentials.password) {
        return { success: false, message: "Invalid LRN or password" };
      }

      setUser({
        ...storedUser,
        ...userData,
      });
      setLocation("/student-dashboard");
      return { success: true };
    }
    return { success: false, message: "Invalid login" };
  };

  const changePassword = (oldPassword: string, newPassword: string) => {
    if (!user) {
      return { success: false, message: "Not logged in" };
    }

    if (user.password !== oldPassword) {
      return { success: false, message: "Current password is incorrect" };
    }

    setUser({
      ...user,
      password: newPassword,
    });
    return { success: true, message: "Password changed successfully" };
  };

  const logout = () => {
    setUser(null);
    setLocation("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
