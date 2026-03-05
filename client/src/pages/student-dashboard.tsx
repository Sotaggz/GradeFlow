import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, User, MessageCircle, LogOut, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";

export default function StudentDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <img src="/logo.png" alt="GradeFlow Logo" />
              <h1 className="text-xl font-bold">Student Portal</h1>
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground">What would you like to do today?</h2>
            <p className="text-muted-foreground text-lg">Access your academic records and connect with your mentors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Check Grades Card */}
            <Link href="/check-grades">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/30 relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">Check Grades</CardTitle>
                  <CardDescription>View your academic performance and history.</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Button variant="ghost" className="w-full justify-between group-hover:text-primary pl-0">
                    View Records <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>

            {/* Consult Teacher Card */}
            <Link href="/consult">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/30 relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">Consult a Teacher</CardTitle>
                  <CardDescription>Schedule a meeting or ask a question.</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Button variant="ghost" className="w-full justify-between group-hover:text-secondary-foreground pl-0">
                    Get Help <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>

            {/* User Account Card */}
            <Link href="/account">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/30 relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                    <User className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">User Account</CardTitle>
                  <CardDescription>Manage your profile settings and preferences.</CardDescription>
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
