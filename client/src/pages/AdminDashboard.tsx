import { useAuth } from "@/hooks/use-auth";
import { useTeachers } from "@/hooks/use-teachers";
import { Navbar } from "@/components/Navbar";
import { TeacherForm } from "@/components/TeacherForm";
import { useLocation } from "wouter";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, LayoutDashboard, Users, Shield } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const sciFiPanel = {
  background: "rgba(2,10,25,0.85)",
  border: "1px solid rgba(0,200,255,0.15)",
  backdropFilter: "blur(12px)",
  position: "relative" as const,
};

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
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete teacher");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.teachers.list.path] });
      queryClient.refetchQueries({ queryKey: [api.teachers.list.path] });
      toast({ title: "Teacher deleted" });
    },
  });

  if (authLoading) return (
    <div className="flex h-screen items-center justify-center" style={{ background: "hsl(220,30%,4%)" }}>
      <Loader2 className="animate-spin" style={{ color: "rgba(0,200,255,0.7)" }} />
    </div>
  );

  if (!user || (!isAdmin && !isModerator)) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(220,30%,4%)" }}>
      <Navbar />

      {/* Top glow line */}
      <div style={{ height:"1px", background:"linear-gradient(90deg,transparent,rgba(0,200,255,0.4),transparent)" }} />

      <main className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div style={{
              width:"48px", height:"48px", display:"flex", alignItems:"center", justifyContent:"center",
              background:"rgba(0,200,255,0.08)", border:"1px solid rgba(0,200,255,0.3)",
              boxShadow:"0 0 15px rgba(0,200,255,0.15)", position:"relative",
            }}>
              <div style={{ position:"absolute",top:"-1px",left:"-1px",width:"6px",height:"6px",borderTop:"2px solid rgba(0,200,255,0.8)",borderLeft:"2px solid rgba(0,200,255,0.8)" }} />
              <div style={{ position:"absolute",bottom:"-1px",right:"-1px",width:"6px",height:"6px",borderBottom:"2px solid rgba(0,200,255,0.8)",borderRight:"2px solid rgba(0,200,255,0.8)" }} />
              <LayoutDashboard style={{ width:"22px", height:"22px", color:"rgba(0,200,255,0.9)" }} />
            </div>
            <div>
              <div style={{ fontFamily:"var(--font-mono)",fontSize:"0.55rem",letterSpacing:"0.2em",color:"rgba(0,200,255,0.4)",textTransform:"uppercase",marginBottom:"2px" }}>
                // Control Panel
              </div>
              <h1 style={{ fontFamily:"var(--font-display)",fontSize:"1.6rem",fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(200,230,255,0.95)" }}>
                Dashboard
              </h1>
              <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"rgba(0,200,255,0.4)",letterSpacing:"0.05em" }}>
                Manage faculty and platform content
              </p>
            </div>
          </div>
          <TeacherForm />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="teachers" className="space-y-6">
          <TabsList style={{
            background:"rgba(0,10,25,0.8)",border:"1px solid rgba(0,200,255,0.15)",
            borderRadius:0, padding:"4px", gap:"4px",
          }}>
            <TabsTrigger
              value="teachers"
              style={{ fontFamily:"var(--font-mono)",fontSize:"0.7rem",letterSpacing:"0.1em",textTransform:"uppercase",borderRadius:0 }}
            >
              Faculty
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger
                value="roles"
                style={{ fontFamily:"var(--font-mono)",fontSize:"0.7rem",letterSpacing:"0.1em",textTransform:"uppercase",borderRadius:0 }}
              >
                User Roles
              </TabsTrigger>
            )}
          </TabsList>

          {/* Teachers Tab */}
          <TabsContent value="teachers">
            <div style={sciFiPanel}>
              {/* Corner brackets */}
              <div style={{ position:"absolute",top:"-1px",left:"-1px",width:"10px",height:"10px",borderTop:"2px solid rgba(0,200,255,0.5)",borderLeft:"2px solid rgba(0,200,255,0.5)" }} />
              <div style={{ position:"absolute",bottom:"-1px",right:"-1px",width:"10px",height:"10px",borderBottom:"2px solid rgba(0,200,255,0.5)",borderRight:"2px solid rgba(0,200,255,0.5)" }} />

              <Table>
                <TableHeader>
                  <TableRow style={{ borderBottom:"1px solid rgba(0,200,255,0.1)" }}>
                    {["Name","Department","University","Reviews","Actions"].map((h, i) => (
                      <TableHead key={i} style={{ fontFamily:"var(--font-mono)",fontSize:"0.6rem",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(0,200,255,0.5)",padding:"14px 16px" }}>
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachersLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" style={{ color:"rgba(0,200,255,0.5)" }} />
                      </TableCell>
                    </TableRow>
                  ) : teachers?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12" style={{ fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"rgba(0,200,255,0.3)",letterSpacing:"0.1em" }}>
                        // NO FACULTY FOUND
                      </TableCell>
                    </TableRow>
                  ) : (
                    [...(teachers ?? [])].sort((a, b) => a.fullName.localeCompare(b.fullName)).map((teacher) => (
                      <TableRow
                        key={teacher.id}
                        style={{ borderBottom:"1px solid rgba(0,200,255,0.06)", transition:"background 0.2s ease" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(0,200,255,0.03)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                      >
                        <TableCell style={{ fontFamily:"var(--font-sans)",fontWeight:600,fontSize:"0.85rem",color:"rgba(200,230,255,0.9)",padding:"12px 16px" }}>
                          {teacher.fullName}
                        </TableCell>
                        <TableCell style={{ fontFamily:"var(--font-mono)",fontSize:"0.72rem",color:"rgba(0,200,255,0.6)",letterSpacing:"0.03em",padding:"12px 16px" }}>
                          {teacher.department}
                        </TableCell>
                        <TableCell style={{ fontFamily:"var(--font-mono)",fontSize:"0.72rem",color:"rgba(0,200,255,0.4)",letterSpacing:"0.03em",padding:"12px 16px" }}>
                          {teacher.university}
                        </TableCell>
                        <TableCell style={{ padding:"12px 16px" }}>
                          <span style={{
                            fontFamily:"var(--font-mono)",fontSize:"0.65rem",letterSpacing:"0.1em",
                            color:"rgba(0,200,255,0.8)",background:"rgba(0,200,255,0.08)",
                            border:"1px solid rgba(0,200,255,0.2)",padding:"2px 10px",
                          }}>
                            {teacher.reviewCount}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-1" style={{ padding:"12px 16px" }}>
                          <TeacherForm
                            teacher={teacher}
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="h-4 w-4" style={{ color:"rgba(0,200,255,0.6)" }} />
                              </Button>
                            }
                          />
                          {isAdmin && (
                            <Button
                              variant="ghost" size="icon" className="h-8 w-8"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this teacher?")) {
                                  deleteMutation.mutate(teacher.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" style={{ color:"rgba(255,80,80,0.7)" }} />
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

          {/* Roles Tab */}
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
    },
  });

  return (
    <div style={{ ...sciFiPanel, maxWidth:"480px", padding:"24px" }}>
      {/* Corner brackets */}
      <div style={{ position:"absolute",top:"-1px",left:"-1px",width:"10px",height:"10px",borderTop:"2px solid rgba(0,200,255,0.5)",borderLeft:"2px solid rgba(0,200,255,0.5)" }} />
      <div style={{ position:"absolute",bottom:"-1px",right:"-1px",width:"10px",height:"10px",borderBottom:"2px solid rgba(0,200,255,0.5)",borderRight:"2px solid rgba(0,200,255,0.5)" }} />

      <div className="flex items-center gap-3 mb-6">
        <Users style={{ width:"18px",height:"18px",color:"rgba(0,200,255,0.7)" }} />
        <div>
          <div style={{ fontFamily:"var(--font-mono)",fontSize:"0.55rem",letterSpacing:"0.2em",color:"rgba(0,200,255,0.4)",textTransform:"uppercase" }}>
            // Access Control
          </div>
          <h2 style={{ fontFamily:"var(--font-display)",fontSize:"1rem",fontWeight:700,letterSpacing:"0.08em",color:"rgba(200,230,255,0.9)",textTransform:"uppercase" }}>
            User Roles
          </h2>
        </div>
      </div>

      <div style={{ height:"1px",background:"linear-gradient(90deg,rgba(0,200,255,0.3),transparent)",marginBottom:"20px" }} />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label style={{ fontFamily:"var(--font-mono)",fontSize:"0.6rem",letterSpacing:"0.15em",color:"rgba(0,200,255,0.5)",textTransform:"uppercase" }}>
            User Email
          </Label>
          <Input
            id="user-email"
            placeholder="student@seu.edu.bd"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label style={{ fontFamily:"var(--font-mono)",fontSize:"0.6rem",letterSpacing:"0.15em",color:"rgba(0,200,255,0.5)",textTransform:"uppercase" }}>
            Role
          </Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ background:"rgba(2,10,25,0.95)",border:"1px solid rgba(0,200,255,0.2)" }}>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button
          className="w-full"
          disabled={roleMutation.isPending || !email}
          onClick={() => roleMutation.mutate({ email, role })}
          style={{
            display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",
            padding:"10px",marginTop:"8px",
            background: roleMutation.isPending || !email ? "rgba(0,200,255,0.03)" : "rgba(0,200,255,0.08)",
            border:"1px solid rgba(0,200,255,0.3)",
            color: roleMutation.isPending || !email ? "rgba(0,200,255,0.3)" : "rgba(0,200,255,0.9)",
            fontFamily:"var(--font-mono)",fontSize:"0.7rem",letterSpacing:"0.12em",textTransform:"uppercase",
            cursor: roleMutation.isPending || !email ? "not-allowed" : "pointer",
            transition:"all 0.3s ease",
          }}
        >
          <Shield style={{ width:"14px",height:"14px" }} />
          {roleMutation.isPending ? "Updating..." : "Save Role"}
        </button>
      </div>
    </div>
  );
}
