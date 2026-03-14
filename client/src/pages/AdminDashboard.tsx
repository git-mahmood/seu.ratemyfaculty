import { useAuth } from "@/hooks/use-auth";
import { useTeachers } from "@/hooks/use-teachers";
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
import { Loader2, Pencil, Trash2, LayoutDashboard, Users } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: teachers, isLoading: teachersLoading } = useTeachers();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const isAdmin = user?.role === "admin";
  const isModerator = user?.role === "moderator";

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

  if (!user || (!isAdmin && !isModerator)) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">Dashboard</h1>
              <p className="text-muted-foreground">Manage teachers and platform content.</p>
            </div>
          </div>
          <TeacherForm />
        </div>

        <Tabs defaultValue="teachers" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            {isAdmin && <TabsTrigger value="roles">User Roles</TabsTrigger>}
          </TabsList>

          <TabsContent value="teachers">
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
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : teachers?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No teachers found.
                      </TableCell>
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
                          {isAdmin && (
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
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="roles">
              <UserRolesPanel />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}

function UserRolesPanel() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("student");
  const { toast } = useToast();

  const roleMutation = useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      const res = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update role");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Role updated successfully" });
      setEmail("");
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  return (
    <div className="bg-card rounded-xl border shadow-sm p-6 max-w-md">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">User Roles</h2>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user-email">User Email</Label>
          <Input 
            id="user-email" 
            placeholder="student@example.com" 
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-role">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          className="w-full" 
          onClick={() => roleMutation.mutate({ email, role })}
          disabled={roleMutation.isPending || !email}
        >
          {roleMutation.isPending ? "Saving..." : "Save Role"}
        </Button>
      </div>
    </div>
  );
}
