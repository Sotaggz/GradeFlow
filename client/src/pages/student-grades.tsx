import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";

const MOCK_GRADES = [
  // Quarter 1
  { subject: "Animation", teacher: "Mrs. Bernroz Costillas", grade: 79, quarter: 1 },
  { subject: "Physical Education", teacher: "Ms. Rose Ann Nagpala", grade: 78, quarter: 1 },
  { subject: "Computer Programming", teacher: "Mr. Leoned Tumbaga", grade: 76, quarter: 1 },
  { subject: "Work Immersion", teacher: "Ms. Althea Suyat", grade: 78, quarter: 1 },
  { subject: "Contemporary Art from the Region", teacher: "Ms. Mary Joyce Altarez", grade: 86, quarter: 1 },
  // Quarter 2
  { subject: "Animation", teacher: "Mrs. Bernroz Costillas", grade: 82, quarter: 2 },
  { subject: "Physical Education", teacher: "Ms. Rose Ann Nagpala", grade: 81, quarter: 2 },
  { subject: "Computer Programming", teacher: "Mr. Leoned Tumbaga", grade: 80, quarter: 2 },
  { subject: "Work Immersion", teacher: "Ms. Althea Suyat", grade: 85, quarter: 2 },
  { subject: "Contemporary Art from the Region", teacher: "Ms. Mary Joyce Altarez", grade: 88, quarter: 2 },
  // Quarter 3
  { subject: "Animation", teacher: "Mrs. Bernroz Costillas", grade: 85, quarter: 3 },
  { subject: "Physical Education", teacher: "Ms. Rose Ann Nagpala", grade: 83, quarter: 3 },
  { subject: "Computer Programming", teacher: "Mr. Leoned Tumbaga", grade: 87, quarter: 3 },
  { subject: "Work Immersion", teacher: "Ms. Althea Suyat", grade: 82, quarter: 3 },
  { subject: "Contemporary Art from the Region", teacher: "Ms. Mary Joyce Altarez", grade: 90, quarter: 3 },
  // Quarter 4
  { subject: "Animation", teacher: "Mrs. Bernroz Costillas", grade: 88, quarter: 4 },
  { subject: "Physical Education", teacher: "Ms. Rose Ann Nagpala", grade: 86, quarter: 4 },
  { subject: "Computer Programming", teacher: "Mr. Leoned Tumbaga", grade: 89, quarter: 4 },
  { subject: "Work Immersion", teacher: "Ms. Althea Suyat", grade: 87, quarter: 4 },
  { subject: "Contemporary Art from the Region", teacher: "Ms. Mary Joyce Altarez", grade: 92, quarter: 4 },
];


export default function StudentGrades() {
  const [selectedQuarter, setSelectedQuarter] = useState(1);

  const filteredGrades = MOCK_GRADES.filter(grade => grade.quarter === selectedQuarter);

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/student-dashboard">
            <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Grades</h1>
            <p className="text-muted-foreground">Academic Report - Full Year</p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {[1, 2, 3, 4].map((quarter) => (
            <Button
              key={quarter}
              onClick={() => setSelectedQuarter(quarter)}
              variant={selectedQuarter === quarter ? "default" : "outline"}
              className="px-6 shadow-md hover:shadow-lg transition-shadow"
            >
              Quarter {quarter}
            </Button>
          ))}
        </div>

        <Card className="shadow-lg border-none">
          <CardHeader className="bg-muted/30">
            <CardTitle>
              {selectedQuarter === 1 || selectedQuarter === 2 ? "First Semester" : "Second Semester"}
            </CardTitle>
            <p>Quarter {selectedQuarter}</p>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Subject</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead className="text-right pr-6">Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrades.map((grade, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/50">
                    <TableCell className="pl-6 font-medium">{grade.subject}</TableCell>
                    <TableCell>{grade.teacher}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-3">
                        <span className={`font-mono font-bold ${
                          grade.grade >= 90 ? "text-green-600" : 
                          grade.grade <= 75 ? "text-red-600" : "text-orange-600"
                        }`}>
                          {grade.grade}
                        </span>
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              grade.grade >= 90 ? "bg-green-500" : 
                              grade.grade <= 75 ? "bg-red-500" : "bg-orange-500"
                            }`} 
                            style={{ width: `${grade.grade}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
