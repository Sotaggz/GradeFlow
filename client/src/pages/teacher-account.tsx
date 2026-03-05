import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Mail, Shield, LogOut, Clock, Inbox } from "lucide-react";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface SubjectSchedule {
  subject: string;
  time: string;
  day: string;
  section: string;
}

export default function TeacherAccount() {
  const { user, logout, changePassword } = useAuth();
  const { toast } = useToast();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [schedule] = useState<SubjectSchedule[]>([
    { subject: "General Mathematics", time: "09:00 AM", day: "Mon, Wed", section: "STEM 1" },
    { subject: "Physical Education", time: "11:00 AM", day: "Mon, Wed", section: "STEM 2"},
    { subject: "Contemporary Arts", time: "01:00 PM", day: "Mon, Wed", section: "A&D" },
    { subject: "Programming", time: "02:00 PM", day: "Tue, Thu", section: "ICT 1"},
    { subject: "Animation", time: "10:00 AM", day: "Tue, Thu", section: "ICT 2"},
    { subject: "Media Information Literacy", time: "03:00 PM", day: "Fri", section: "A&D"},
  ]);

  const handleChangePassword = () => {
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setPasswordError("New password and confirmation are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    const result = changePassword(currentPassword, newPassword);
    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
      setShowPasswordDialog(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordError(result.message || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full h-4"></div>
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
              <h1 className="text-xl font-bold">Account Settings</h1>
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

      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="rounded-lg border shadow">
          <div className="pb-1 rounded-t-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-blue-800 bg-trasnparent !:text-slate-900s flex items-center gap-2 font-semibold">
                <User className="h-5 w-5"/>
                Profile Information
              </h3>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Inbox className="h-4 w-4" />
                Inbox
              </Button>
            </div>
          </div>
          <div className="pt-6 bg-transparent dark:bg-slate-800 space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium dark:text-slate-100">Full Name</Label>
                <Input
                  id="name"
                  value={user?.email?.split("@")[0] || "Teacher"}
                  disabled
                  className="bg-slate-100 dark:bg-slate-800 dark:text-slate-100 disabled:text-slate-900 dark:disabled:text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium dark:text-slate-100">Email Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-slate-100 dark:bg-slate-800 dark:text-slate-100 disabled:text-slate-900 dark:disabled:text-slate-100"
                  />
                  <Mail className="h-5 w-5 text-muted-foreground mt-3" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium dark:text-slate-100">Role</Label>
              <div className="flex gap-2">
                <Input
                  id="role"
                  value="Teacher"
                  disabled
                  className="bg-slate-100 dark:bg-slate-800 dark:text-slate-100 disabled:text-slate-900 dark:disabled:text-slate-100"
                />
                <Shield className="h-5 w-5 text-muted-foreground mt-3" />
              </div>
            </div>
          </div>
        </div>

          <div className="rounded-lg border shadow">
          <div className="pb-1 rounded-t-lg p-6">
            <h3 className="text-green-800 bg-trasnparent !:text-slate-900s flex items-center gap-2 font-semibold">
              <User className="h-5 w-5"/>
              Teaching Schedule
            </h3>
          </div>
          <div className="pt-6 bg-transparent dark:bg-slate-800 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedule.map((item) => (
                <div
                  key={item.subject}
                  className="p-4 border-2 border-blue-300 dark:border-yellow-400 rounded-lg bg-blue-200"
                >
                  <div className="space-y-2">
                    <h3 className="font-semibold text-blue-900 dark:text-slate-200 line-clamp-2">
                      {item.subject}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-slate-300">
                      <Clock className="h-4 w-4" />
                      <span>{item.time}</span>
                    </div>
                    <div className="text-xs text-blue-700 dark:text-slate-400">
                      {item.day}
                      </div>
                    <div className="text-xs text-blue-700 dark:text-slate-400">
                      {item.section}
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border shadow">
          <div className="pb-1 rounded-t-lg p-6">
            <h3 className="text-purple-800 bg-trasnparent !:text-slate-900s flex items-center gap-2 font-semibold">
              <User className="h-5 w-5"/>
              Security Settings
            </h3>
          </div>
          <div className="pt-6 bg-transparent dark:bg-slate-800 p-6">
            <Button
              onClick={() => setShowPasswordDialog(true)}
              className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
            >
              Change Password
            </Button>

            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
              <DialogContent className="text-white dark:bg-slate-950 backdrop-blur-md">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current password and the new password you'd like to use.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                  {passwordError && (
                    <p className="text-sm text-destructive">{passwordError}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleChangePassword} className="bg-purple-600 hover:bg-purple-700">
                    Update Password
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
