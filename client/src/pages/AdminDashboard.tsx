import { useAuth } from "@/hooks/use-auth";
import { useTeachers, useUpdateTeacher } from "@/hooks/use-teachers";
import { Navbar } from "@/components/Navbar";
import { TeacherForm } from "@/components/TeacherForm";
import { useLocation } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: teachers, isLoading: teachersLoading } = useTeachers();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.teachers.delete.path, { id });
      await fetch(url, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.teachers.list.path] });
      toast({ title: "Teacher deleted" });
    },
  });

  if (authLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage teachers and platform content.</p>
          </div>
          <TeacherForm />
        </div>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachersLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Loading teachers...</TableCell>
                </TableRow>
              ) : teachers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">No teachers found.</TableCell>
                </TableRow>
              ) : (
                teachers?.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.fullName}</TableCell>
                    <TableCell>{teacher.department}</TableCell>
                    <TableCell>{teacher.university}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{teacher.reviewCount}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <TeacherForm 
                        teacher={teacher} 
                        trigger={
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this teacher?")) {
                            deleteMutation.mutate(teacher.id);
                          }
                        }}
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
      </main>
    </div>
  );
}
