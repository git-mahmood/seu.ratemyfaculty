import { useState } from "react";
import { useRoute } from "wouter";
import { useTeacher } from "@/hooks/use-teachers";
import { useReviews } from "@/hooks/use-reviews";
import { Navbar } from "@/components/Navbar";
import { ReviewForm } from "@/components/ReviewForm";
import { PyqList, UploadPyqDialog } from "@/components/PyqList";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  MapPin,
  BookOpen,
  User,
  Smile,
  Frown,
  Meh,
  GraduationCap,
  Pencil,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function TeacherProfile() {
  const [, params] = useRoute("/teacher/:id");
  const teacherId = parseInt(params?.id || "0");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [pyqDialogOpen, setPyqDialogOpen] = useState(false);

  const { data: teacher, isLoading: teacherLoading, error: teacherError } = useTeacher(teacherId);
  const { data: reviews, isLoading: reviewsLoading } = useReviews(teacherId);

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(buildUrl(api.reviews.delete.path, { id }), { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reviews.list.path, teacherId] });
      toast({ title: "Review deleted" });
    },
  });

  if (teacherLoading) return <ProfileSkeleton />;
  if (teacherError || !teacher) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(220,30%,4%)" }}>
      <Navbar />
      <p style={{ fontFamily: "var(--font-mono)", color: "rgba(255,80,80,0.8)", letterSpacing: "0.1em" }}>
        // FACULTY NOT FOUND
      </p>
    </div>
  );

  return (
    <div className="min-h-screen pb-20" style={{ background: "hsl(220,30%,4%)" }}>
      <Navbar />

      {/* Header Banner */}
      <div style={{
        position: "relative",
        borderBottom: "1px solid rgba(0,200,255,0.15)",
        background: "rgba(2,8,20,0.9)",
        overflow: "hidden",
      }}>
        {/* Background image blur */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(${teacher.photoUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(24px) brightness(0.15) saturate(0.5)",
          transform: "scale(1.1)",
        }} />
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(0,200,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,0.03) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        {/* Top glow line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px", zIndex: 2,
          background: "linear-gradient(90deg,transparent,rgba(0,200,255,0.6),transparent)",
        }} />

        <div className="container mx-auto px-4 py-6 relative" style={{ zIndex: 3 }}>
          <div className="flex flex-col md:flex-row gap-4 items-center">

            {/* Photo */}
            <div style={{
              width: "80px", height: "80px", flexShrink: 0,
              border: "1px solid rgba(0,200,255,0.4)",
              boxShadow: "0 0 20px rgba(0,200,255,0.2)",
              overflow: "hidden",
              position: "relative",
            }}>
              <img src={teacher.photoUrl} alt={teacher.fullName} className="w-full h-full object-cover" style={{ filter: "saturate(0.8)" }} />
              {/* Corner brackets */}
              <div style={{ position:"absolute",top:"-1px",left:"-1px",width:"8px",height:"8px",borderTop:"2px solid rgba(0,200,255,0.8)",borderLeft:"2px solid rgba(0,200,255,0.8)" }} />
              <div style={{ position:"absolute",bottom:"-1px",right:"-1px",width:"8px",height:"8px",borderBottom:"2px solid rgba(0,200,255,0.8)",borderRight:"2px solid rgba(0,200,255,0.8)" }} />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2 text-center md:text-left">
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                letterSpacing: "0.2em", color: "rgba(0,200,255,0.5)", textTransform: "uppercase",
              }}>
                // Faculty Profile
              </div>
              <h1 style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "clamp(1.2rem,3vw,1.8rem)", letterSpacing: "0.08em",
                textTransform: "uppercase", color: "rgba(220,240,255,0.95)",
                textShadow: "0 0 30px rgba(0,200,255,0.3)",
              }}>
                {teacher.fullName}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div style={{ display:"flex",alignItems:"center",gap:"6px" }}>
                  <Building2 style={{ width:"12px",height:"12px",color:"rgba(0,200,255,0.6)" }} />
                  <span style={{ fontFamily:"var(--font-mono)",fontSize:"0.7rem",color:"rgba(0,200,255,0.6)",letterSpacing:"0.05em" }}>
                    {teacher.department}
                  </span>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:"6px" }}>
                  <MapPin style={{ width:"12px",height:"12px",color:"rgba(0,200,255,0.4)" }} />
                  <span style={{ fontFamily:"var(--font-mono)",fontSize:"0.7rem",color:"rgba(0,200,255,0.4)",letterSpacing:"0.05em" }}>
                    {teacher.university}
                  </span>
                </div>
              </div>
              {/* Course badges */}
              <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                {teacher.coursesTaught.map((course, i) => (
                  <span key={i} style={{
                    fontFamily:"var(--font-mono)",fontSize:"0.6rem",letterSpacing:"0.06em",
                    color:"rgba(0,200,255,0.7)",background:"rgba(0,200,255,0.08)",
                    border:"1px solid rgba(0,200,255,0.2)",padding:"2px 8px",
                    display:"flex",alignItems:"center",gap:"4px",
                  }}>
                    <BookOpen style={{ width:"9px",height:"9px" }} />
                    {course}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <ReviewForm teacherId={teacherId} teacherName={teacher.fullName} coursesTaught={teacher.coursesTaught} />
              {!!user && (user.role === "admin" || user.role === "moderator" || user.email === "2025100000379@seu.edu.bd") && (
                <UploadPyqDialog teacherId={teacherId} open={pyqDialogOpen} onOpenChange={setPyqDialogOpen} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">

        {/* Reviews column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontFamily:"var(--font-mono)",fontSize:"0.6rem",letterSpacing:"0.2em",color:"rgba(0,200,255,0.4)",textTransform:"uppercase",marginBottom:"4px" }}>
                // Student Feedback
              </div>
              <h2 style={{ fontFamily:"var(--font-display)",fontSize:"1.2rem",fontWeight:700,letterSpacing:"0.08em",color:"rgba(200,230,255,0.9)",textTransform:"uppercase" }}>
                Reviews
              </h2>
            </div>
            <span style={{
              fontFamily:"var(--font-mono)",fontSize:"0.7rem",letterSpacing:"0.1em",
              color:"rgba(0,200,255,0.8)",background:"rgba(0,200,255,0.08)",
              border:"1px solid rgba(0,200,255,0.25)",padding:"4px 12px",
            }}>
              {teacher.reviewCount} Total
            </span>
          </div>

          {/* Divider */}
          <div style={{ height:"1px",background:"linear-gradient(90deg,rgba(0,200,255,0.4),transparent)" }} />

          {reviewsLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse" style={{ height:"140px",background:"rgba(0,200,255,0.04)",border:"1px solid rgba(0,200,255,0.08)" }} />
              ))}
            </div>
          ) : reviews?.length === 0 ? (
            <div className="text-center py-12" style={{ border:"1px dashed rgba(0,200,255,0.15)",background:"rgba(0,200,255,0.02)" }}>
              <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.8rem",color:"rgba(0,200,255,0.4)",letterSpacing:"0.1em" }}>
                // No reviews yet. Be the first!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews?.map((review) => {
                const isAdmin = user?.email === "2025100000379@seu.edu.bd";
                const isOwner = user?.id === review.studentId;

                return (
                  <div key={review.id} style={{
                    background:"rgba(2,10,25,0.8)",border:"1px solid rgba(0,200,255,0.12)",
                    backdropFilter:"blur(12px)",padding:"20px",position:"relative",
                    transition:"all 0.3s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.3)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(0,200,255,0.06)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.12)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                  >
                    {/* Corner brackets */}
                    <div style={{ position:"absolute",top:"-1px",left:"-1px",width:"8px",height:"8px",borderTop:"1px solid rgba(0,200,255,0.5)",borderLeft:"1px solid rgba(0,200,255,0.5)" }} />
                    <div style={{ position:"absolute",bottom:"-1px",right:"-1px",width:"8px",height:"8px",borderBottom:"1px solid rgba(0,200,255,0.5)",borderRight:"1px solid rgba(0,200,255,0.5)" }} />

                    {/* Review header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div style={{
                          width:"36px",height:"36px",display:"flex",alignItems:"center",justifyContent:"center",
                          background:"rgba(0,200,255,0.08)",border:"1px solid rgba(0,200,255,0.2)",flexShrink:0,
                        }}>
                          <User style={{ width:"16px",height:"16px",color:"rgba(0,200,255,0.7)" }} />
                        </div>
                        <div>
                          <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"rgba(0,200,255,0.8)",letterSpacing:"0.05em" }}>
                            {isAdmin ? review.studentUsername : "Anonymous Student"}
                          </p>
                          <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"rgba(0,200,255,0.35)",letterSpacing:"0.05em" }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isOwner && (
                          <ReviewForm
                            teacherId={teacher.id}
                            teacherName={teacher.fullName}
                            coursesTaught={teacher.coursesTaught}
                            review={review}
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="h-4 w-4" style={{ color:"rgba(0,200,255,0.6)" }} />
                              </Button>
                            }
                          />
                        )}
                        {(isOwner || isAdmin) && (
                          <Button
                            variant="ghost" size="icon" className="h-8 w-8"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this review?")) {
                                deleteReviewMutation.mutate(review.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" style={{ color:"rgba(255,80,80,0.7)" }} />
                          </Button>
                        )}
                        {getPersonalityIcon(review.personality)}
                      </div>
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <p style={{
                        fontFamily:"var(--font-sans)",fontSize:"0.9rem",
                        color:"rgba(180,220,255,0.8)",lineHeight:1.7,
                        marginBottom:"16px",
                        borderLeft:"2px solid rgba(0,200,255,0.2)",
                        paddingLeft:"12px",
                      }}>
                        "{review.comment}"
                      </p>
                    )}

                    {/* Metrics */}
                    <div style={{ borderTop:"1px solid rgba(0,200,255,0.08)",paddingTop:"12px" }}>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <Metric label="Course" value={review.courseTaken} />
                        <Metric label="Personality" value={review.personality} />
                        <Metric label="Best For" value={review.bestFor} />
                        <Metric label="Marking" value={review.markingStyle} />
                        <Metric label="Difficulty" value={review.questionDifficulty} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PyqList teacherId={teacher.id} />

          {/* Pro tip */}
          <div style={{
            background:"rgba(2,10,25,0.8)",border:"1px solid rgba(0,200,255,0.12)",
            backdropFilter:"blur(12px)",padding:"20px",position:"relative",
          }}>
            <div style={{ position:"absolute",top:"-1px",left:"-1px",width:"8px",height:"8px",borderTop:"1px solid rgba(0,200,255,0.5)",borderLeft:"1px solid rgba(0,200,255,0.5)" }} />
            <div style={{ position:"absolute",bottom:"-1px",right:"-1px",width:"8px",height:"8px",borderBottom:"1px solid rgba(0,200,255,0.5)",borderRight:"1px solid rgba(0,200,255,0.5)" }} />
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap style={{ width:"18px",height:"18px",color:"rgba(0,200,255,0.7)" }} />
              <span style={{ fontFamily:"var(--font-display)",fontSize:"0.75rem",letterSpacing:"0.1em",color:"rgba(0,200,255,0.8)",textTransform:"uppercase" }}>
                Pro Tip
              </span>
            </div>
            <p style={{ fontFamily:"var(--font-sans)",fontSize:"0.85rem",color:"rgba(150,200,240,0.6)",lineHeight:1.6 }}>
              Always check the syllabus along with past year questions to ensure you're studying relevant topics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.55rem",letterSpacing:"0.15em",color:"rgba(0,200,255,0.35)",textTransform:"uppercase",marginBottom:"4px" }}>
        {label}
      </p>
      <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.72rem",color:"rgba(0,200,255,0.8)",letterSpacing:"0.05em",fontWeight:600 }}>
        {value}
      </p>
    </div>
  );
}

function getPersonalityIcon(type: string) {
  switch (type) {
    case "Friendly": return <Smile className="h-5 w-5" style={{ color:"rgba(0,255,150,0.7)" }} />;
    case "Strict": return <Frown className="h-5 w-5" style={{ color:"rgba(255,80,80,0.7)" }} />;
    default: return <Meh className="h-5 w-5" style={{ color:"rgba(255,200,0,0.7)" }} />;
  }
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen" style={{ background:"hsl(220,30%,4%)" }}>
      <Navbar />
      <div style={{ borderBottom:"1px solid rgba(0,200,255,0.1)",padding:"24px 0" }}>
        <div className="container mx-auto px-4 flex gap-6">
          <div style={{ width:"80px",height:"80px",background:"rgba(0,200,255,0.05)",border:"1px solid rgba(0,200,255,0.1)",animation:"pulse 2s infinite" }} />
          <div className="flex-1 space-y-3">
            <div style={{ height:"24px",width:"60%",background:"rgba(0,200,255,0.05)",animation:"pulse 2s infinite" }} />
            <div style={{ height:"16px",width:"40%",background:"rgba(0,200,255,0.05)",animation:"pulse 2s infinite" }} />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[1,2].map(i => <div key={i} style={{ height:"140px",background:"rgba(0,200,255,0.04)",border:"1px solid rgba(0,200,255,0.08)",animation:"pulse 2s infinite" }} />)}
        </div>
        <div style={{ height:"200px",background:"rgba(0,200,255,0.04)",border:"1px solid rgba(0,200,255,0.08)",animation:"pulse 2s infinite" }} />
      </div>
    </div>
  );
}
