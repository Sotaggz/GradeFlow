import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Save, Trash2, LogOut, FileUp, Download, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "wouter";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface GradeEntry {
  id: string;
  studentName: string;
  subject: string;
  grade: number;
  quarter?: number;
}

export default function ManageGrades() {
  const { user, logout } = useAuth();
  const [selectedQuarter, setSelectedQuarter] = useState<number>(1);
  const [grades, setGrades] = useState<GradeEntry[]>([
    { id: "1", studentName: "Johnson, Alice", subject: "General Mathematics", grade: 92, quarter: 1 },
    { id: "2", studentName: "Smith, Bob", subject: "Physical Education", grade: 78, quarter: 1 },
    { id: "3", studentName: "Brown, Charlie", subject: "Contemporary Arts", grade: 85, quarter: 1 },
  ]);

  const [newStudent, setNewStudent] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [newGradeError, setNewGradeError] = useState<string | null>(null);
  const [customSubject, setCustomSubject] = useState("");
  const [customSubjectError, setCustomSubjectError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[]>([
    "General Mathematics",
    "Physical Education",
    "Contemporary Arts",
    "Programming",
    "Animation",
    "Media Information Literacy",
  ]);
  const [importErrors, setImportErrors] = useState<string[] | null>(null);
  const [duplicateSubjectError, setDuplicateSubjectError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"high-to-low" | "low-to-high">("high-to-low");
  const [alphabeticalSort, setAlphabeticalSort] = useState<"a-z" | "z-a" | "none">("none");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pass" | "fail">("all");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDownloadCSV = () => {
    const headers = ["Student Name", "Subject", "Grade", "Quarter", "Status"];
    const csvContent = [
      headers.join(","),
      ...sortedGrades.map((entry) =>
        [entry.studentName, entry.subject, entry.grade, entry.quarter, entry.grade >= 75 ? "Passed" : "Failed"].map((v) =>
          typeof v === "string" && (v.includes(",") || v.includes("\"")) ? `\"${v.replace(/\"/g, "\"\"")}\"`  : v
        ).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `grades-quarter-${selectedQuarter}-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      const headers = ["Student Name", "Subject", "Grade", "Quarter", "Status"];
      const rows = sortedGrades.map((entry) => [
        entry.studentName,
        entry.subject,
        entry.grade.toString(),
        `Q${entry.quarter}`,
        entry.grade >= 75 ? "Passed" : "Failed"
      ]);

      doc.setFontSize(16);
      doc.text(`Grading Report - Quarter ${selectedQuarter}`, 14, 22);
      doc.setFontSize(10);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

      if ((doc as any).autoTable) {
        (doc as any).autoTable({
          head: [headers],
          body: rows,
          startY: 40,
          theme: "grid",
          headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: "bold" },
          bodyStyles: { textColor: 50 },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { left: 14, right: 14 }
        });
      } else {
        let yPosition = 50;
        headers.forEach((header, index) => {
          doc.text(header, 14 + index * 35, yPosition);
        });
        rows.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            doc.text(cell, 14 + colIndex * 35, yPosition + 10 + rowIndex * 10);
          });
        });
      }

      doc.save(`grades-quarter-${selectedQuarter}-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleAddGrade = () => {
    if (newStudent && newSubject && newGrade.length === 2 && !newGradeError) {
      setGrades([
        ...grades,
        {
          id: Math.random().toString(36).substr(2, 9),
          studentName: newStudent,
          subject: newSubject,
          grade: parseInt(newGrade),
          quarter: selectedQuarter,
        },
      ]);
      setNewStudent("");
      setNewSubject("");
      setNewGrade("");
      setNewGradeError(null);
    }
  };

  const handleDelete = (id: string) => {
    setGrades(grades.filter((g) => g.id !== id));
  };

  const handleAddCustomSubject = () => {
    const val = customSubject.trim();
    if (!val) {
      setCustomSubjectError("Please enter a subject name");
      return;
    }
    if (subjects.includes(val)) {
      setCustomSubjectError("This subject already exists");
      return;
    }
    setSubjects((prev) => [...prev, val]);
    setNewSubject(val);
    setCustomSubject("");
    setCustomSubjectError(null);
  };

  function splitCSVLine(line: string) {
    const result: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    result.push(cur);
    return result;
  }

  function parseCSV(text: string) {
    const lines = text.split(/\r\n|\n/);
    const rows = lines.map((l) => splitCSVLine(l));
    return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0].trim() !== ""));
  }

  const handleImportFile = (file?: File) => {
    setImportErrors(null);
    setDuplicateSubjectError(null);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const rows = parseCSV(text);
      if (rows.length === 0) {
        setImportErrors(["CSV is empty or invalid"]);
        return;
      }

      // Check if this is the specific format (B12, F11, V9)
      // More flexible detection - look for any CSV with reasonable structure
      const hasEnoughRows = rows.length >= 12;
      const hasEnoughColumns = rows.some(row => row.length >= 22);

      if (hasEnoughRows && hasEnoughColumns) {
        // Specific format: Column F has header at F11, grades start from F12 downward
        // Subject is at V9 (row 8, column 21), Student Name in column B, Grade in column F for each row
        const subject = rows[8]?.[21]?.trim(); // V9
        if (!subject) {
          setImportErrors(["Subject not found at V9"]);
          return;
        }

        const newRows: GradeEntry[] = [];
        const errors: string[] = [];
        const studentSubjects: Record<string, Set<string>> = {};
        grades.forEach((g) => {
          if (!studentSubjects[g.studentName]) studentSubjects[g.studentName] = new Set();
          studentSubjects[g.studentName].add(g.subject);
        });

        // Start from row 11 (F12) and go downward (F11 is the header in column F)
        for (let rowIndex = 11; rowIndex < rows.length; rowIndex++) {
          const row = rows[rowIndex];
          if (!row || row.length < 6) continue; // Need at least columns A-F

          const studentName = row[1]?.trim(); // Column B (B12, B13, etc.)
          const gradeRaw = row[5]?.trim(); // Column F (F12, F13, F14, etc.)

          // Skip empty rows or rows without required data
          if (!studentName || !gradeRaw) continue;

          // Validate grade
          if (!/^\d{1,3}$/.test(gradeRaw)) {
            errors.push(`Row ${rowIndex + 1}: grade must be numeric (0-99)`);
            continue;
          }
          const gradeNum = parseInt(gradeRaw, 10);
          if (Number.isNaN(gradeNum) || gradeNum < 0 || gradeNum > 99) {
            errors.push(`Row ${rowIndex + 1}: grade out of range (0-99)`);
            continue;
          }

          // Check for duplicates
          if (!studentSubjects[studentName]) studentSubjects[studentName] = new Set();
          if (studentSubjects[studentName].has(subject)) {
            errors.push(`Row ${rowIndex + 1}: ${studentName} already has a grade for "${subject}" in Quarter ${selectedQuarter}`);
            continue;
          }
          studentSubjects[studentName].add(subject);

          newRows.push({
            id: Math.random().toString(36).substr(2, 9),
            studentName,
            subject,
            grade: gradeNum,
            quarter: selectedQuarter,
          });
        }

        if (errors.length) {
          setImportErrors(errors);
          return;
        }

        if (newRows.length === 0) {
          setImportErrors([
            "No valid grade entries found in the expected format.",
            "Expected format: Column F should have header at F11, grades in F12, F13, F14, etc.",
            "Student Name in column B, Subject at V9 for the entire sheet.",
            "Alternatively, use standard CSV with headers: 'Student Name', 'Subject', 'Grade'"
          ]);
          return;
        }

        // Add subjects to subjects list if not exists
        const addedSubjects = new Set<string>();
        newRows.forEach((nr) => {
          if (!subjects.includes(nr.subject) && nr.subject.trim()) addedSubjects.add(nr.subject);
        });
        if (addedSubjects.size) {
          setSubjects((prev) => [...prev, ...Array.from(addedSubjects)]);
        }

        setGrades((prev) => [...prev, ...newRows]);
        return;
      }

      // Original header-based CSV import logic
      const headers = rows[0].map((h) => h.trim().toLowerCase());
      const colMap: Record<string, number> = {};
      headers.forEach((h, i) => {
        if (h.includes("student") || h.includes("name")) colMap.studentName = i;
        if (h.includes("subject")) colMap.subject = i;
        if (h.includes("grade")) colMap.grade = i;
        if (h.includes("quarter")) colMap.quarter = i;
      });

      if (colMap.studentName === undefined || colMap.subject === undefined || colMap.grade === undefined) {
        setImportErrors(["CSV must include headers: student (or name), subject, grade"]);
        return;
      }

      const newRows: GradeEntry[] = [];
      const errors: string[] = [];
      const studentSubjects: Record<string, Set<string>> = {};
      grades.forEach((g) => {
        if (!studentSubjects[g.studentName]) studentSubjects[g.studentName] = new Set();
        studentSubjects[g.studentName].add(g.subject);
      });
      const duplicateErrors: string[] = [];
      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        const student = (row[colMap.studentName] ?? "").trim();
        const subject = (row[colMap.subject] ?? "").trim();
        const gradeRaw = (row[colMap.grade] ?? "").trim();
        const quarterRaw = colMap.quarter !== undefined ? (row[colMap.quarter] ?? "").trim() : "";

        if (!student) {
          errors.push(`Row ${r + 1}: missing student name`);
          continue;
        }
        if (!subject) {
          errors.push(`Row ${r + 1}: missing subject`);
          continue;
        }
        if (!studentSubjects[student]) studentSubjects[student] = new Set();
        if (studentSubjects[student].has(subject)) {
          duplicateErrors.push(`Row ${r + 1}: ${student} has duplicate subject "${subject}" in import file.`);
          continue;
        }
        studentSubjects[student].add(subject);

        if (!/^\d{1,3}$/.test(gradeRaw)) {
          errors.push(`Row ${r + 1}: grade must be numeric (0-99)`);
          continue;
        }
        const gradeNum = parseInt(gradeRaw, 10);
        if (Number.isNaN(gradeNum) || gradeNum < 0 || gradeNum > 99) {
          errors.push(`Row ${r + 1}: grade out of range (0-99)`);
          continue;
        }

        let quarterNum = selectedQuarter;
        if (quarterRaw) {
          const parsedQuarter = parseInt(quarterRaw, 10);
          if (Number.isNaN(parsedQuarter) || parsedQuarter < 1 || parsedQuarter > 4) {
            errors.push(`Row ${r + 1}: quarter must be 1-4`);
            continue;
          }
          quarterNum = parsedQuarter;
        }

        newRows.push({
          id: Math.random().toString(36).substr(2, 9),
          studentName: student,
          subject,
          grade: gradeNum,
          quarter: quarterNum,
        });
      }
      if (duplicateErrors.length > 0) {
        setDuplicateSubjectError(duplicateErrors.join("\n"));
        setTimeout(() => setDuplicateSubjectError(null), 10000);
      }

      if (errors.length) setImportErrors(errors);

      if (newRows.length) {
        const addedSubjects = new Set<string>();
        newRows.forEach((nr) => {
          if (!subjects.includes(nr.subject) && nr.subject.trim()) addedSubjects.add(nr.subject);
        });
        if (addedSubjects.size) {
          setSubjects((prev) => [...prev, ...Array.from(addedSubjects)]);
        }
        setGrades((prev) => [...prev, ...newRows]);
      }
    };
    reader.onerror = () => setImportErrors(["Failed to read file"]);
    reader.readAsText(file);
  };

  let filteredGrades = grades.filter((g) => g.quarter === selectedQuarter);

  if (selectedSubject) {
    filteredGrades = filteredGrades.filter((g) => g.subject === selectedSubject);
  }

  if (statusFilter !== "all") {
    filteredGrades = filteredGrades.filter((g) =>
      statusFilter === "pass" ? g.grade >= 75 : g.grade < 75
    );
  }

  const sortedGrades = [...filteredGrades].sort((a, b) => {
    if (alphabeticalSort === "a-z") {
      return a.studentName.localeCompare(b.studentName);
    } else if (alphabeticalSort === "z-a") {
      return b.studentName.localeCompare(a.studentName);
    }
    let gradeSort = sortOrder === "high-to-low" ? b.grade - a.grade : a.grade - b.grade;
    return gradeSort;
  });

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
              <h1 className="text-xl font-bold">Manage Grades</h1>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4].map((quarter) => (
                  <Button
                    key={quarter}
                    variant={selectedQuarter === quarter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedQuarter(quarter)}
                    className="text-xs"
                  >
                    Q{quarter}
                  </Button>
                ))}
              </div>
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
        {/* Input Section */}
        <Card className="shadow-sm border-blue-200 dark:border-blue-900/30 dark:bg-slate-950">
        <CardHeader className="border-b dark:border-slate-700">
            <CardTitle className="text-black: flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Grade Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 dark:bg-slate-950">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="student">Student Name</Label>
                <Input 
                  id="student" 
                  placeholder="e.g. Doe, John" 
                  value={newStudent}
                  onChange={(e) => setNewStudent(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={newSubject} onValueChange={(v) => setNewSubject(v)}>
                  <SelectTrigger aria-label="Subject">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger >
                  <SelectContent style={{ backgroundColor: 'var(--color-background)', opacity: 1 }}>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom subject"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="flex-1 rounded-md border px-2 py-1 text-sm bg-background text-foreground dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                    aria-label="Custom subject name"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddCustomSubject}
                    disabled={!customSubject.trim()}
                    className="whitespace-nowrap"
                  >
                    Add
                  </Button>
                </div>
                {customSubjectError && (
                  <p className="text-sm text-destructive mt-1">{customSubjectError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade (00-99)</Label>
                <Input
                  id="grade"
                  type="text"
                  inputMode="numeric"
                  placeholder="95"
                  maxLength={2}
                  value={newGrade}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (/\D/.test(raw)) {
                      setNewGradeError("Grade must contain digits only");
                      return;
                    }
                    const digits = raw.slice(0, 2);
                    setNewGrade(digits);
                    setNewGradeError(null);
                  }}
                  onPaste={(e) => {
                    const pasted = e.clipboardData?.getData("text") ?? "";
                    if (/\D/.test(pasted)) {
                      setNewGradeError("Pasted content must contain digits only");
                      e.preventDefault();
                      return;
                    }
                    const digits = pasted.slice(0, 2);
                    setNewGrade((prev) => (prev + digits).slice(0, 2));
                    setNewGradeError(null);
                    e.preventDefault();
                  }}
                />
                {newGradeError ? (
                  <p className="text-sm text-destructive mt-1">{newGradeError}</p>
                ) : newGrade && newGrade.length < 2 ? (
                  <p className="text-sm text-muted-foreground mt-1">Grade must be exactly 2 digits</p>
                ) : null}
              </div>
              <div className="md:col-span-3 flex gap-3 items-start pt-2">
                <div className="flex-1">
                  <Button
                    onClick={handleAddGrade}
                    className="w-full shadow-sm bg-blue-600 hover:bg-blue-700"
                    disabled={!newStudent || !newSubject || newGrade.length !== 2 || !!newGradeError}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Grade
                  </Button>
                </div>

                <div className="w-48">
                  <input
                    id="csv-import"
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(e) => handleImportFile(e.target.files?.[0])}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full shadow-sm"
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    Import CSV
                  </Button>
                  {importErrors && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-destructive">Import issues:</p>
                      <ul className="list-disc ml-5 text-sm text-destructive">
                        {importErrors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {duplicateSubjectError && (
                    <div className="mt-2">
                      {duplicateSubjectError.split("\n").map((err, idx) => (
                        <p key={idx} style={{ color: 'red' }} className="text-sm font-medium">{err}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grading Sheet */}
        <Card className="shadow-md dark:bg-slate-950">
          <CardHeader className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <CardTitle>Grade Records</CardTitle>
              <div className="ml-auto flex gap-2">
                <Button
                  size="sm"
                  onClick={handleDownloadCSV}
                  disabled={sortedGrades.length === 0}
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownloadPDF}
                  disabled={sortedGrades.length === 0}
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap w-full">
              <div className="flex items-center gap-2">
                <Label htmlFor="alphabetical-sort" className="hidden md:block text-sm">Name</Label>
                <Select value={alphabeticalSort} onValueChange={(v) => setAlphabeticalSort(v as "a-z" | "z-a" | "none")}> 
                  <SelectTrigger aria-label="Alphabetical Sort" className="w-32">
                    <SelectValue>{alphabeticalSort}</SelectValue>
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: 'var(--color-background)', opacity: 1 }}>
                    <SelectItem value="none">No Sort</SelectItem>
                    <SelectItem value="a-z">A - Z</SelectItem>
                    <SelectItem value="z-a">Z - A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="subject-filter" className="hidden md:block text-sm">Subject</Label>
                <Select value={selectedSubject || "all-subjects"} onValueChange={(v) => setSelectedSubject(v === "all-subjects" ? "" : v)}>
                  <SelectTrigger aria-label="Subject Filter" className="w-40">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: 'var(--color-background)', opacity: 1 }}>
                    <SelectItem value="all-subjects">All Subjects</SelectItem>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="status-filter" className="hidden md:block text-sm">Status</Label>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | "pass" | "fail")}> 
                  <SelectTrigger aria-label="Status Filter" className="w-32">
                    <SelectValue>{statusFilter}</SelectValue>
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: 'var(--color-background)', opacity: 1 }}>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pass">Passed</SelectItem>
                    <SelectItem value="fail">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="sort-order" className="hidden md:block text-sm">Sort</Label>
                <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "high-to-low" | "low-to-high")}> 
                  <SelectTrigger aria-label="Sort Order" className="w-40">
                    <SelectValue>{sortOrder}</SelectValue>
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: 'var(--color-background)', opacity: 1 }}>
                    <SelectItem value="high-to-low">Highest to Lowest</SelectItem>
                    <SelectItem value="low-to-high">Lowest to Highest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="dark:bg-slate-950">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b dark:border-slate-700 dark:bg-slate-900">
                    <TableHead className="font-semibold text-foreground dark:text-slate-100">Student Name</TableHead>
                    <TableHead className="font-semibold text-foreground dark:text-slate-100">Subject</TableHead>
                    <TableHead className="text-right font-semibold text-foreground dark:text-slate-100">Grade</TableHead>
                    <TableHead className="text-right font-semibold text-foreground dark:text-slate-100">Quarter</TableHead>
                    <TableHead className="text-right font-semibold text-foreground dark:text-slate-100">Status</TableHead>
                    <TableHead className="text-right font-semibold text-foreground dark:text-slate-100">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedGrades.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No grades match the current filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedGrades.map((entry) => (
                      <TableRow key={entry.id} className="dark:hover:bg-slate-800">
                        <TableCell className="font-medium dark:text-slate-100">{entry.studentName}</TableCell>
                        <TableCell className="dark:text-slate-100">{entry.subject}</TableCell>
                        <TableCell className="text-right font-mono font-bold text-lg dark:text-slate-100">{entry.grade}</TableCell>
                        <TableCell className="text-right dark:text-slate-100">Q{entry.quarter}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            entry.grade >= 75 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}>
                           {entry.grade >= 75 ? "Passed" : "Failed"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(entry.id)}
                            className="text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
