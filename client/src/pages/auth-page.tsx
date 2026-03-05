import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School, GraduationCap, Lock } from "lucide-react";
import { useState } from "react";
import { Redirect } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import heroImage from "@assets/generated_images/abstract_educational_geometric_3d_shape.png";

export default function AuthPage() {
  const { user, login } = useAuth();

  const [studentLRN, setStudentLRN] = useState("");
  const [studentLRNError, setStudentLRNError] = useState<string | null>(null);
  const [studentPassword, setStudentPassword] = useState("");
  const [studentLoginError, setStudentLoginError] = useState<string | null>(null);
  const [teacherEmail, setTeacherEmail] = useState("anderson@school.edu");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherLoginError, setTeacherLoginError] = useState<string | null>(null);

  if (user) {
    return <Redirect to={user.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"} />;
  }

  return (
    
    <div className="min-h-screen w-full flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">

<div>
  <img src="/logo.png" alt="GradeFlow Logo" />
</div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to GradeFlow</h1>
            <p className="text-muted-foreground mt-2">Academic management made simple.</p>
            <div className="flex justify-center mt-4">
              <ThemeToggle />
            </div>
          </div>
            
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Student Login</CardTitle>
                <CardDescription>Access your grades and consult teachers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-lrn">LRN</Label>
                  <Input
                    id="student-lrn"
                    type="text"
                    placeholder="123456789012"
                    maxLength={12}
                    minLength={12}
                    inputMode="numeric"
                    pattern="\d{12}"
                    value={studentLRN}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/\D/.test(val)) {
                        setStudentLRNError("LRN must contain digits only");
                        return;
                      }
                      setStudentLRNError(null);
                      setStudentLRN(val.slice(0, 12));
                    }}
                    onPaste={(e) => {
                      const pasted = e.clipboardData?.getData("text") ?? "";
                      if (/\D/.test(pasted)) {
                        setStudentLRNError("Pasted content must contain digits only");
                        e.preventDefault();
                        return;
                      }
                      const digits = pasted.slice(0, 12);
                      setStudentLRN((prev) => (prev + digits).slice(0, 12));
                      setStudentLRNError(null);
                      e.preventDefault();
                    }}
                  />
                  {studentLRNError ? (
                    <p className="text-sm text-destructive mt-1">{studentLRNError}</p>
                  ) : studentLRN && studentLRN.trim().length < 12 ? (
                    <p className="text-sm text-muted-foreground mt-1">LRN must be 12 digits</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-pass">Password</Label>
                  <Input
                    id="student-pass"
                    type="password"
                    placeholder="Enter your password"
                    value={studentPassword}
                    onChange={(e) => {
                      setStudentPassword(e.target.value);
                      setStudentLoginError(null);
                    }}
                  />
                  {studentLoginError && (
                    <p className="text-sm text-destructive mt-1">{studentLoginError}</p>
                  )}
                </div>

                <Button
                  className="w-full text-md py-6"
                  onClick={() => {
                    if (studentLRN.trim().length >= 12 && studentPassword) {
                      const result = login("student", { LRN: studentLRN, password: studentPassword });
                      if (!result.success) {
                        setStudentLoginError(result.message || "Login failed");
                      }
                    }
                  }}
                  disabled={studentLRN.trim().length < 12 || !studentPassword}
                  aria-disabled={studentLRN.trim().length < 12 || !studentPassword}
                  data-testid="btn-login-student"
                >
                  Sign In as Student
                </Button>
              </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teacher">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Teacher Login</CardTitle>
                  <CardDescription>Manage subjects and grade students</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-email">Email</Label>
                    <Input
                      id="teacher-email"
                      type="email"
                      placeholder="professor@school.edu"
                      value={teacherEmail}
                      onChange={(e) => {
                        setTeacherEmail(e.target.value);
                        setTeacherLoginError(null);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher-pass">Password</Label>
                    <Input
                      id="teacher-pass"
                      type="password"
                      placeholder="Enter your password"
                      value={teacherPassword}
                      onChange={(e) => {
                        setTeacherPassword(e.target.value);
                        setTeacherLoginError(null);
                      }}
                    />
                    {teacherLoginError && (
                      <p className="text-sm text-destructive mt-1">{teacherLoginError}</p>
                    )}
                  </div>
                  <Button
                    className="w-full text-md py-6"
                    onClick={() => {
                      if (teacherEmail && teacherPassword) {
                        const result = login("teacher", { email: teacherEmail, password: teacherPassword });
                        if (!result.success) {
                          setTeacherLoginError(result.message || "Login failed");
                        }
                      }
                    }}
                    disabled={!teacherEmail || !teacherPassword}
                    data-testid="btn-login-teacher"
                  >
                    Sign In as Teacher
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm text-muted-foreground">
            <p>By logging in, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:block w-1/2 bg-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 z-10" />
        <img 
          src={heroImage} 
          alt="Abstract Education Art" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-12 left-12 right-12 z-20 text-white p-8 bg-black/10 backdrop-blur-md rounded-2xl border border-white/10">
          <blockquote className="text-xl font-medium italic">
            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
          </blockquote>
          <cite className="block mt-4 font-semibold not-italic">— Malcolm X</cite>
        </div>
      </div>
    </div>
  );
}
