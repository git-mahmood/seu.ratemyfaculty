import { usePyqs, useUploadPyq } from "@/hooks/use-pyqs";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, UploadCloud, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PyqListProps {
  teacherId: number;
}

export function PyqList({ teacherId }: PyqListProps) {
  const { data: pyqs, isLoading } = usePyqs(teacherId);
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  
  const groupedPyqs = useMemo(() => {
    if (!pyqs) return {};
    return pyqs.reduce((acc: any, pyq) => {
      const code = pyq.courseCode;
      if (!acc[code]) acc[code] = [];
      acc[code].push(pyq);
      return acc;
    }, {});
  }, [pyqs]);

  if (isLoading) return <div className="animate-pulse h-24 bg-muted rounded-lg"></div>;
  if (!pyqs) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Previous Year Questions
        </CardTitle>
        {(user?.role === "admin" || user?.email === "2025100000379@seu.edu.bd") && (
          <UploadPyqDialog teacherId={teacherId} open={open} onOpenChange={setOpen} />
        )}
      </CardHeader>
      <CardContent>
        {pyqs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            No PYQs uploaded for this teacher yet.
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPyqs).map(([courseCode, items]: [string, any]) => (
              <div key={courseCode} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
                    Course Code: {courseCode}
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2 pl-4">
                  {items.map((pyq: any) => (
                    <a 
                      key={pyq.id} 
                      href={pyq.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg border bg-card hover:border-primary/50 hover:bg-accent transition-all group shadow-sm"
                    >
                      <div className="bg-primary/10 p-2 rounded mr-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {pyq.examType} {pyq.year}
                        </p>
                        <p className="text-xs text-muted-foreground">{pyq.semester}</p>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                        <span className="text-xs font-medium hidden sm:inline">Download</span>
                        <Download className="h-4 w-4" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function UploadPyqDialog({ teacherId, open, onOpenChange }: { teacherId: number, open: boolean, onOpenChange: (open: boolean) => void }) {
  const uploadMutation = useUploadPyq();
  const [file, setFile] = useState<File | null>(null);
  const [courseCode, setCourseCode] = useState("");
  const [semester, setSemester] = useState("Spring");
  const [examType, setExamType] = useState("Mid");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !courseCode || !semester || !examType || !year) {
      toast({ title: "Validation Error", description: "All fields are required", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("teacherId", teacherId.toString());
    formData.append("courseCode", courseCode);
    formData.append("semester", semester);
    formData.append("examType", examType);
    formData.append("year", year);
    formData.append("file", file);

    try {
      await uploadMutation.mutateAsync({ teacherId, formData });
      onOpenChange(false);
      setFile(null);
      setCourseCode("");
      setSemester("Spring");
      setExamType("Mid");
      setYear(new Date().getFullYear().toString());
    } catch (err) {
      // handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <UploadCloud className="h-4 w-4" />
          Upload PYQ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload PYQ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Course Code</Label>
              <Input 
                placeholder="e.g. CSE-101" 
                value={courseCode} 
                onChange={e => setCourseCode(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                  <SelectItem value="Fall">Fall</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Exam Type</Label>
              <Select value={examType} onValueChange={setExamType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mid">Mid</SelectItem>
                  <SelectItem value="Final">Final</SelectItem>
                  <SelectItem value="Quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Input 
                type="number"
                placeholder="e.g. 2023" 
                value={year} 
                onChange={e => setYear(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>File (PDF)</Label>
              <Input 
                type="file" 
                accept=".pdf"
                className="cursor-pointer"
                onChange={e => setFile(e.target.files?.[0] || null)} 
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? "Uploading..." : "Upload Question"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
