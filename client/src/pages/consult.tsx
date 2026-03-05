import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Consult() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Sent",
      description: "Your teacher has been notified and will respond shortly.",
    });
  };
  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/student-dashboard">
            <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <ThemeToggle />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Consult a Teacher</h1> 
          <p className="text-muted-foreground">Have a question? Reach out directly to your instructors.</p>
        </div>

        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle>New Consultation Request</CardTitle>
            <CardDescription>Fill out the form below to start a conversation.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="teacher">Select Teacher</Label>
                      <Select required>
                        <SelectTrigger
                          id="teacher"
                          className="!text-foreground shadow-md rounded-md"
                          style={{ backgroundColor: 'var(--color-background)', opacity: 1, borderRadius: '0.75rem', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}
                        >
                          <SelectValue placeholder="Choose an instructor" />
                        </SelectTrigger>
                        <SelectContent
                          className="!text-foreground"
                          style={{ backgroundColor: 'var(--color-background)', opacity: 1 }}
                        >
                          <SelectItem value="anderson">Prof. Anderson (Math)</SelectItem>
                          <SelectItem value="smith">Dr. Smith (Physics)</SelectItem>
                          <SelectItem value="davis">Mrs. Davis (History)</SelectItem>
                        </SelectContent>
                      </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What is this regarding?" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Type your question or request here..." 
                  className="min-h-[150px]"
                  required 
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
