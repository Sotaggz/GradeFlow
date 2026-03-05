import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import AuthPage from "@/pages/auth-page";
import TeacherDashboard from "@/pages/teacher-dashboard";
import StudentDashboard from "@/pages/student-dashboard";
import StudentGrades from "@/pages/student-grades";
import Consult from "@/pages/consult";
import Account from "@/pages/account";
import ManageGrades from "@/pages/manage-grades";
import StudentProgress from "@/pages/student-progress";
import TeacherAccount from "@/pages/teacher-account";
import { ProtectedRoute } from "@/lib/protected-route";
import { ThemeProvider } from "@/lib/theme-provider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      
      <ProtectedRoute 
        path="/teacher-dashboard" 
        component={TeacherDashboard} 
        allowedRole="teacher" 
      />

      <ProtectedRoute 
        path="/manage-grades" 
        component={ManageGrades} 
        allowedRole="teacher" 
      />

      <ProtectedRoute 
        path="/student-progress" 
        component={StudentProgress} 
        allowedRole="teacher" 
      />

      <ProtectedRoute 
        path="/teacher-account" 
        component={TeacherAccount} 
        allowedRole="teacher" 
      />
      
      <ProtectedRoute 
        path="/student-dashboard" 
        component={StudentDashboard} 
        allowedRole="student" 
      />
      
      <ProtectedRoute 
        path="/check-grades" 
        component={StudentGrades} 
        allowedRole="student" 
      />
      
      <ProtectedRoute 
        path="/consult" 
        component={Consult} 
        allowedRole="student" 
      />
      
      <ProtectedRoute 
        path="/account" 
        component={Account} 
        allowedRole="student" 
      />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
