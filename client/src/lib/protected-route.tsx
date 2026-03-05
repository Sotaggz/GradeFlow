import { useAuth } from "./auth";
import { Redirect, Route } from "wouter";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  path: string;
  component: () => ReactNode;
  allowedRole?: "teacher" | "student";
}

export function ProtectedRoute({ path, component: Component, allowedRole }: ProtectedRouteProps) {
  const { user } = useAuth();

  return (
    <Route path={path}>
      {() => {
        if (!user) {
          return <Redirect to="/" />;
        }

        if (allowedRole && user.role !== allowedRole) {
          // Redirect to correct dashboard if wrong role
          return <Redirect to={user.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"} />;
        }

        return <Component />;
      }}
    </Route>
  );
}
