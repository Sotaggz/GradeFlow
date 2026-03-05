import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, LogOut, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "wouter";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface StudentSubject {
  subject: string;
  grade: number;
}

interface StudentProgress {
  id: string;
  studentName: string;
  totalSubjects: number;
  passedCount: number;
  failedCount: number;
  status: "excellent" | "good" | "average" | "needs-improvement";
  subjects: StudentSubject[];
}

export default function StudentProgress() {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState<StudentProgress[]>([
    { 
      id: "1", 
      studentName: "Johnson, Alice", 
      totalSubjects: 6,
      passedCount: 6,
      failedCount: 0,
      status: "excellent",
      subjects: [
        { subject: "General Mathematics", grade: 95 },
        { subject: "Physical Education", grade: 90 },
        { subject: "Contemporary Arts", grade: 92 },
        { subject: "Programming", grade: 93 },
        { subject: "Animation", grade: 91 },
        { subject: "Media Information Literacy", grade: 90 },
      ]
    },
    { 
      id: "2", 
      studentName: "Smith, Bob", 
      totalSubjects: 6,
      passedCount: 5,
      failedCount: 1,
      status: "good",
      subjects: [
        { subject: "General Mathematics", grade: 82 },
        { subject: "Physical Education", grade: 85 },
        { subject: "Contemporary Arts", grade: 78 },
        { subject: "Programming", grade: 68 },
        { subject: "Animation", grade: 80 },
        { subject: "Media Information Literacy", grade: 77 },
      ]
    },
    { 
      id: "3", 
      studentName: "Brown, Charlie", 
      totalSubjects: 6,
      passedCount: 6,
      failedCount: 0,
      status: "good",
      subjects: [
        { subject: "General Mathematics", grade: 88 },
        { subject: "Physical Education", grade: 82 },
        { subject: "Contemporary Arts", grade: 85 },
        { subject: "Programming", grade: 86 },
        { subject: "Animation", grade: 84 },
        { subject: "Media Information Literacy", grade: 85 },
      ]
    },
    { 
      id: "4", 
      studentName: "Davis, Diana", 
      totalSubjects: 6,
      passedCount: 4,
      failedCount: 2,
      status: "average",
      subjects: [
        { subject: "General Mathematics", grade: 65 },
        { subject: "Physical Education", grade: 80 },
        { subject: "Contemporary Arts", grade: 75 },
        { subject: "Programming", grade: 70 },
        { subject: "Animation", grade: 72 },
        { subject: "Media Information Literacy", grade: 68 },
      ]
    },
    { 
      id: "5", 
      studentName: "Evans, Edward", 

      totalSubjects: 6,
      passedCount: 0,
      failedCount: 6,
      status: "needs-improvement",
      subjects: [
        { subject: "General Mathematics", grade: 58 },
        { subject: "Physical Education", grade: 72 },
        { subject: "Contemporary Arts", grade: 62 },
        { subject: "Programming", grade: 55 },
        { subject: "Animation", grade: 68 },
        { subject: "Media Information Literacy", grade: 60 },
      ]
    },
  ]);

  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"highest" | "lowest" | "name">("highest");
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  const hasValidGrades = (student: StudentProgress) => {
    return student.subjects.every((s) => s.grade >= 74);
  };

  const calculateAverage = (student: StudentProgress) => {
    if (!hasValidGrades(student)) return null;
    const sum = student.subjects.reduce((acc, subject) => acc + subject.grade, 0);
    return sum / student.subjects.length;
  };

  const formatAverage = (avg: number | null) => {
    if (avg === null) return "No Grade";
    return parseFloat(avg.toFixed(2)).toString();
  };

  const getFailedSubjects = (student: StudentProgress) => {
    return student.subjects.filter((s) => s.grade < 75);
  };

  const getPassedSubjects = (student: StudentProgress) => {
    return student.subjects.filter((s) => s.grade >= 75);
  };

  let filteredStudents = students.filter((s) =>
    s.studentName.toLowerCase().includes(searchName.toLowerCase())
  );

  if (statusFilter !== "all") {
    filteredStudents = filteredStudents.filter((s) => s.status === statusFilter);
  }

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === "highest") {
      const avgA = calculateAverage(a) || 0;
      const avgB = calculateAverage(b) || 0;
      return avgB - avgA;
    } else if (sortBy === "lowest") {
      const avgA = calculateAverage(a) || 0;
      const avgB = calculateAverage(b) || 0;
      return avgA - avgB;
    } else {
      return a.studentName.localeCompare(b.studentName);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "average":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "needs-improvement":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "excellent":
        return "Excellent";
      case "good":
        return "Good";
      case "average":
        return "Average";
      case "needs-improvement":
        return "Needs Improvement";
      default:
        return status;
    }
  };

  const averageOfAllStudents = (() => {
    const validStudents = students.filter(s => hasValidGrades(s));
    if (validStudents.length === 0) return 0;
    const sum = validStudents.reduce((acc, s) => acc + (calculateAverage(s) || 0), 0);
    return sum / validStudents.length;
  })();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/teacher-dashboard">
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <img src="/logo.png" alt="GradeFlow Logo" />
              <h1 className="text-xl font-bold">Student Progress</h1>
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

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-lg dark:bg-slate-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Enrolled in courses</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-lg dark:bg-slate-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Class Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatAverage(averageOfAllStudents)}</div>
              <p className="text-xs text-muted-foreground mt-1">Out of 100</p>
            </CardContent>
          </Card>

          <Card className="rounded-lg dark:bg-slate-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Passing Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {Math.round((students.filter((s) => s.failedCount === 0).length / students.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Students with no failures</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Table */}
        <Card className="shadow-md dark:bg-slate-950 rounded-lg">
          <CardHeader className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Student Performance</CardTitle>
              <CardDescription>View detailed progress for each student</CardDescription>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-48">
                <Input
                  placeholder="Search by name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger aria-label="Status Filter" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: 'var(--color-background)', opacity: 1 }}>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="needs-improvement">Needs Improvement</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "highest" | "lowest" | "name")}>
                <SelectTrigger aria-label="Sort By" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: 'var(--color-background)', opacity: 1 }}>
                  <SelectItem value="highest">Highest Grade</SelectItem>
                  <SelectItem value="lowest">Lowest Grade</SelectItem>
                  <SelectItem value="name">By Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="dark:bg-slate-950">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b dark:border-slate-700 dark:bg-slate-900">
                    <TableHead className="w-10"></TableHead>
                    <TableHead className="font-semibold text-foreground dark:text-slate-100">Student Name</TableHead>
                    <TableHead className="text-center font-semibold text-foreground dark:text-slate-100">Average Grade</TableHead>
                    <TableHead className="text-center font-semibold text-foreground dark:text-slate-100">Subjects</TableHead>
                    <TableHead className="text-center font-semibold text-foreground dark:text-slate-100">Passed</TableHead>
                    <TableHead className="text-center font-semibold text-foreground dark:text-slate-100">Failed</TableHead>
                    <TableHead className="text-center font-semibold text-foreground dark:text-slate-100">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No students match the current filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedStudents.map((student) => [
                      <TableRow key={student.id} className="dark:hover:bg-slate-800">
                        <TableCell className="w-10">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedStudentId(
                                expandedStudentId === student.id ? null : student.id
                              )
                            }
                            className="p-0 h-auto w-auto"
                          >
                            {expandedStudentId === student.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium dark:text-slate-100">{student.studentName}</TableCell>
                        <TableCell className="text-center dark:text-slate-100">
                          <span className="font-bold text-lg">
                            {formatAverage(calculateAverage(student))}
                          </span>
                        </TableCell>
                        <TableCell className="text-center dark:text-slate-100">{student.totalSubjects}</TableCell>
                        <TableCell className="text-center dark:text-slate-100">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-semibold">
                            {student.passedCount}
                          </span>
                        </TableCell>
                        <TableCell className="text-center dark:text-slate-100">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 font-semibold">
                            {student.failedCount}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                            {getStatusLabel(student.status)}
                          </span>
                        </TableCell>
                      </TableRow>,
                      expandedStudentId === student.id && (
                        <TableRow key={`${student.id}-details`} className="bg-slate-50 dark:bg-slate-900/50">
                          <TableCell colSpan={7}>
                            <div className="p-4 space-y-4">
                              {getPassedSubjects(student).length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-3 dark:text-slate-100">Passed Subjects:</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {getPassedSubjects(student).map((subject) => (
                                      <div
                                        key={subject.subject}
                                        className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-900/30"
                                      >
                                        <span className="dark:text-slate-100">{subject.subject}</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">{subject.grade}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {getFailedSubjects(student).length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-3 dark:text-slate-100">Failed Subjects:</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {getFailedSubjects(student).map((subject) => (
                                      <div
                                        key={subject.subject}
                                        className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-900/30"
                                      >
                                        <span className="dark:text-slate-100">{subject.subject}</span>
                                        <span className="font-bold text-red-600 dark:text-red-400">
                                          {subject.grade < 74 ? "No Grade" : subject.grade}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ),
                    ]).flat()
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Performance Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="rounded-lg dark:bg-slate-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Excellent", count: students.filter((s) => s.status === "excellent").length, color: "bg-green-500" },
                { label: "Good", count: students.filter((s) => s.status === "good").length, color: "bg-blue-500" },
                { label: "Average", count: students.filter((s) => s.status === "average").length, color: "bg-yellow-500" },
                { label: "Needs Improvement", count: students.filter((s) => s.status === "needs-improvement").length, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm dark:text-slate-100">{item.label}</span>
                  <span className="ml-auto font-semibold dark:text-slate-100">{item.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg dark:bg-slate-950">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Highest Performing Student</p>
                <p className="font-semibold dark:text-slate-100">
                  {(() => {
                    const validStudents = students.filter(s => hasValidGrades(s) && calculateAverage(s) !== null);
                    return validStudents.length > 0
                      ? validStudents.reduce((max, s) => ((calculateAverage(s) || 0) > (calculateAverage(max) || 0) ? s : max)).studentName
                      : "N/A";
                  })()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Lowest Performing Student</p>
                <p className="font-semibold dark:text-slate-100">
                  {(() => {
                    const validStudents = students.filter(s => hasValidGrades(s) && calculateAverage(s) !== null);
                    return validStudents.length > 0
                      ? validStudents.reduce((min, s) => ((calculateAverage(s) || 0) < (calculateAverage(min) || 0) ? s : min)).studentName
                      : "N/A";
                  })()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Students Needing Support</p>
                <p className="font-semibold dark:text-slate-100">
                  {students.filter((s) => s.status === "needs-improvement").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
