import { usePyqs, useUploadPyq } from "@/hooks/use-pyqs";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PyqListProps {
  teacherId: number;
}

export function PyqList({ teacherId }: PyqListProps) {
  const { data: pyqs, isLoading } = usePyqs(teacherId);
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  
  if (isLoading) return <div className="animate-pulse h-24 bg-muted rounded-lg"></div>;
  if (!pyqs) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Previous Year Questions
        </CardTitle>
        {user?.role === "admin" && (
          <UploadPyqDialog teacherId={teacherId} open={open} onOpenChange={setOpen} />
        )}
      </CardHeader>
      <CardContent>
        {pyqs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            No PYQs uploaded for this teacher yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pyqs.map((pyq) => (
              <a 
                key={pyq.id} 
                href={pyq.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-lg border hover:border-primary/50 hover:bg-accent transition-colors group"
              >
                <div className="bg-primary/10 p-2 rounded mr-3 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{pyq.subject}</p>
                  <p className="text-xs text-muted-foreground">{pyq.year}</p>
                </div>
                <Download className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
              </a>
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
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !subject || !year) {
      toast({ title: "Validation Error", description: "All fields are required", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("teacherId", teacherId.toString());
    formData.append("subject", subject);
    formData.append("year", year);
    formData.append("file", file);

    try {
      await uploadMutation.mutateAsync({ teacherId, formData });
      onOpenChange(false);
      setFile(null);
      setSubject("");
      setYear("");
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PYQ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input 
              placeholder="e.g. Data Structures" 
              value={subject} 
              onChange={e => setSubject(e.target.value)} 
            />
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
              accept=".pdf,.doc,.docx"
              onChange={e => setFile(e.target.files?.[0] || null)} 
            />
          </div>
          <Button type="submit" className="w-full" disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
