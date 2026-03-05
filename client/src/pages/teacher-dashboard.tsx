import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Settings, LogOut, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";


export default function TeacherDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <img src="/logo.png" alt="GradeFlow Logo" />
              <h1 className="text-xl font-bold">Teacher Portal</h1>
            </div>
            <div>
              
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" onClick={logout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome, Teacher!</h2>
            <p className="text-muted-foreground text-lg">Manage grades, track student progress, and access your account settings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Manage Grades Card */}
            <Link href="/manage-grades">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/30 relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-xl">Manage Grades</CardTitle>
                  <CardDescription>Add, edit, and manage student grades and records.</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Button variant="ghost" className="w-full justify-between group-hover:text-blue-600 dark:group-hover:text-blue-400 pl-0">
                    View Grades <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>

            {/* Student Progress Card */}
            <Link href="/student-progress">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/30 relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-xl">Student Progress</CardTitle>
                  <CardDescription>View and track your students' academic performance.</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Button variant="ghost" className="w-full justify-between group-hover:text-green-600 dark:group-hover:text-green-400 pl-0">
                    View Students <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>

            {/* Account Settings Card */}
            <Link href="/teacher-account">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/30 relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                    <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-xl">Account Settings</CardTitle>
                  <CardDescription>Manage your profile and account preferences.</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Button variant="ghost" className="w-full justify-between group-hover:text-purple-600 dark:group-hover:text-purple-400 pl-0">
                    My Profile <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
