import { useState } from "react";
import { useRoute } from "wouter";
import { useTeacher } from "@/hooks/use-teachers";
import { useReviews } from "@/hooks/use-reviews";
import { Navbar } from "@/components/Navbar";
import { ReviewForm } from "@/components/ReviewForm";
import { PyqList, UploadPyqDialog } from "@/components/PyqList";
import {
  Building2, MapPin, BookOpen, User, Smile, Frown, Meh,
  GraduationCap, Pencil, Trash2, MessageSquarePlus, Zap
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

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
          FACULTY NOT FOUND
      </p>
    </div>
  );

  return (
    <div className="min-h-screen pb-20" style={{ background: "hsl(220,30%,4%)", color: "#E2E8F0" }}>
      <Navbar />
      
      {/* Global CSS for specialized animations */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        @keyframes titleShimmer {
          0% { left: -100%; }
          100% { left: 160%; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* ===== HEADER BANNER ===== */}
      <div style={{
        position: "relative",
        borderBottom: "1px solid rgba(0,200,255,0.2)",
        background: "rgba(2,8,20,0.95)",
        overflow: "hidden",
      }}>
        {/* Animated Background Layers */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(${teacher.photoUrl})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "blur(40px) brightness(0.15) saturate(0.5)",
          transform: "scale(1.1)",
        }} />
        
        {/* Dynamic Scanline Effect */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to bottom, transparent, rgba(0,251,255,0.05), transparent)",
          height: "20%", width: "100%",
          animation: "scanline 8s linear infinite",
          pointerEvents: "none",
        }} />

        <div className="container mx-auto px-4 py-12 relative" style={{ zIndex: 3 }}>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

            {/* ===== AVATAR — Cyberpunk Frame ===== */}
            <div style={{
              width: "140px", height: "140px", flexShrink: 0,
              border: "2px solid rgba(0,251,255,0.8)",
              boxShadow: "0 0 30px rgba(0,251,255,0.2)",
              position: "relative", padding: "4px",
              background: "rgba(0,0,0,0.5)"
            }}>
              <img src={teacher.photoUrl} alt={teacher.fullName} className="w-full h-full object-cover" />
              {/* Decorative Corner Accents */}
              <div style={{ position:"absolute",top:"-5px",left:"-5px",width:"15px",height:"15px",borderTop:"3px solid #00FBFF",borderLeft:"3px solid #00FBFF" }} />
              <div style={{ position:"absolute",bottom:"-5px",right:"-5px",width:"15px",height:"15px",borderBottom:"3px solid #00FBFF",borderRight:"3px solid #00FBFF" }} />
            </div>

            {/* ===== INFO ===== */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Zap size={12} className="text-cyan-400" />
                <span style={{ fontFamily:"var(--font-mono)",fontSize:"0.65rem",letterSpacing:"0.3em",color:"rgba(0,200,255,0.6)",textTransform:"uppercase" }}>
                  System.Faculty_Data
                </span>
              </div>
              
              <h1 style={{
                fontFamily:"var(--font-display)", fontWeight:900,
                fontSize:"clamp(1.8rem, 5vw, 2.5rem)", letterSpacing:"0.05em",
                textTransform:"uppercase", color:"#FFFFFF",
                position:"relative", display: "inline-block"
              }}>
                {teacher.fullName}
                <div style={{
                  position:"absolute", bottom: "-4px", left: 0, width: "100%", height: "2px",
                  background: "linear-gradient(90deg, #00FBFF, transparent)"
                }} />
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
                  <Building2 style={{ width:"16px",height:"16px",color:"#00FBFF" }} />
                  <span style={{ fontFamily:"var(--font-mono)",fontSize:"0.85rem",color:"rgba(200,230,255,0.8)" }}>
                    {teacher.department}
                  </span>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
                  <MapPin style={{ width:"16px",height:"16px",color:"rgba(0,200,255,0.5)" }} />
                  <span style={{ fontFamily:"var(--font-mono)",fontSize:"0.85rem",color:"rgba(200,230,255,0.6)" }}>
                    {teacher.university}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                {teacher.coursesTaught.map((course, i) => (
                  <span key={i} style={{
                    fontFamily:"var(--font-mono)",fontSize:"0.7rem",
                    color:"#00FBFF", background:"rgba(0,251,255,0.05)",
                    border:"1px solid rgba(0,251,255,0.3)", padding:"4px 12px",
                    display:"flex", alignItems:"center", gap:"6px",
                    clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0 100%)"
                  }}>
                    <BookOpen style={{ width:"12px",height:"12px" }} />
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-3 gap-10">

        {/* ===== REVIEWS COLUMN ===== */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-cyan-900/50 pb-4">
            <h2 style={{ fontFamily:"var(--font-display)",fontSize:"1.5rem",fontWeight:800,letterSpacing:"0.1em",color:"#FFFFFF",textTransform:"uppercase" }}>
              Public Archive
            </h2>
            <div className="flex items-center gap-4">
              {!!user && (user.role === "admin" || user.role === "moderator" || user.email === "2025100000379@seu.edu.bd") && (
                <UploadPyqDialog teacherId={teacherId} open={pyqDialogOpen} onOpenChange={setPyqDialogOpen} />
              )}
              <ReviewForm
                teacherId={teacherId}
                teacherName={teacher.fullName}
                coursesTaught={teacher.coursesTaught}
                trigger={
                  <button
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      fontFamily: "var(--font-mono)", fontSize: "0.75rem",
                      padding: "8px 20px",
                      background: "linear-gradient(135deg, rgba(0,200,255,0.1), transparent)",
                      border: "1px solid #00FBFF",
                      color: "#00FBFF",
                      cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 0 15px rgba(0,251,255,0.1)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 25px rgba(0,251,255,0.4)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(0,251,255,0.2)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 15px rgba(0,251,255,0.1)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(0,200,255,0.1)";
                    }}
                  >
                    <MessageSquarePlus style={{ width: "16px", height: "16px" }} />
                    INITIALIZE REVIEW
                  </button>
                }
              />
            </div>
          </div>

          {reviewsLoading ? (
            <div className="space-y-6">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse" style={{ height:"180px",background:"rgba(0,200,255,0.03)",border:"1px solid rgba(0,200,255,0.1)" }} />
              ))}
            </div>
          ) : reviews?.length === 0 ? (
            <div className="text-center py-20 border border-cyan-900/30 bg-cyan-950/5">
              <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.9rem",color:"rgba(0,200,255,0.4)" }}>
                [ SYSTEM STATUS: NO DATA FOUND ]
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {reviews?.map((review) => {
                const isAdmin = user?.email === "2025100000379@seu.edu.bd";
                const isOwner = user?.id === review.studentId;

                return (
                  <div key={review.id} style={{
                    background:"rgba(10,15,30,0.6)", border:"1px solid rgba(0,200,255,0.15)",
                    padding:"28px", position:"relative", transition:"0.4s ease"
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,251,255,0.5)";
                    (e.currentTarget as HTMLElement).style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.15)";
                    (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                  }}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div style={{
                          width:"45px",height:"45px",display:"flex",alignItems:"center",justifyContent:"center",
                          background:"rgba(0,251,255,0.05)",border:"1px solid rgba(0,251,255,0.2)"
                        }}>
                          <User style={{ width:"20px",height:"20px",color:"#00FBFF" }} />
                        </div>
                        <div>
                          <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.85rem",color:"#FFFFFF",fontWeight:600 }}>
                            {isAdmin ? review.studentUsername : "SECURE_USER"}
                          </p>
                          <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.7rem",color:"rgba(0,200,255,0.4)" }}>
                            TIMESTAMP: {new Date(review.createdAt).toLocaleDateString()}
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
                              <Button variant="ghost" size="icon" className="hover:bg-cyan-500/20">
                                <Pencil className="h-4 w-4 text-cyan-400" />
                              </Button>
                            }
                          />
                        )}
                        {(isOwner || isAdmin) && (
                          <Button variant="ghost" size="icon" className="hover:bg-red-500/20"
                            onClick={() => { if (confirm("Erase this record?")) deleteReviewMutation.mutate(review.id); }}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        )}
                        <div className="ml-2 opacity-80">{getPersonalityIcon(review.personality)}</div>
                      </div>
                    </div>

                    {review.comment && (
                      <div style={{ position: "relative", marginBottom: "25px" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: "2px", height: "100%", background: "#00FBFF" }} />
                        <p style={{
                          fontFamily:"var(--font-sans)",fontSize:"1rem",
                          color:"#CBD5E1",lineHeight:1.8, paddingLeft:"20px", fontStyle: "italic"
                        }}>
                          "{review.comment}"
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 border-t border-cyan-900/30 pt-6">
                      <Metric label="Module" value={review.courseTaken} />
                      <Metric label="Nature" value={review.personality} />
                      <Metric label="Strength" value={review.bestFor} />
                      <Metric label="Grading" value={review.markingStyle} />
                      <Metric label="Logic" value={review.questionDifficulty} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ===== SIDEBAR ===== */}
        <div className="space-y-6">
          <div style={{
            background:"rgba(7,15,30,0.8)", border:"2px solid rgba(0,200,255,0.1)",
            padding:"4px", position:"relative"
          }}>
            <div style={{ position:"absolute",top:"0",left:"0",width:"100%",height:"1px",background:"linear-gradient(90deg, transparent, #00FBFF, transparent)" }} />
            <PyqList teacherId={teacher.id} hideUpload={true} />
          </div>

          <div style={{
            background:"linear-gradient(180deg, rgba(0,251,255,0.05), transparent)",
            border:"1px solid rgba(0,251,255,0.1)", padding:"24px", position:"relative"
          }}>
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap style={{ width:"18px",height:"18px",color:"#00FBFF" }} />
              <span style={{ fontFamily:"var(--font-display)",fontSize:"0.8rem",letterSpacing:"0.2em",color:"#00FBFF",textTransform:"uppercase" }}>
                Tactical Advice
              </span>
            </div>
            <p style={{ fontFamily:"var(--font-sans)",fontSize:"0.85rem",color:"rgba(148,163,184,0.8)",lineHeight:1.7 }}>
              Cross-reference public archives with active syllabus modules. Historical patterns indicate 70% correlation in exam logic.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{
        fontFamily:"var(--font-mono)",fontSize:"0.6rem",
        letterSpacing:"0.15em",color:"rgba(0,200,255,0.5)",
        textTransform:"uppercase",marginBottom:"4px",
      }}>
        {label}
      </p>
      <p style={{
        fontFamily:"var(--font-mono)",fontSize:"0.8rem",
        color:"#FFFFFF", fontWeight:700,
      }}>
        {value}
      </p>
    </div>
  );
}

function getPersonalityIcon(type: string) {
  switch (type) {
    case "Friendly": return <Smile className="h-6 w-6" style={{ color:"#10B981" }} />;
    case "Strict":   return <Frown className="h-6 w-6" style={{ color:"#EF4444" }} />;
    default:         return <Meh   className="h-6 w-6" style={{ color:"#F59E0B" }} />;
  }
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen" style={{ background:"hsl(220,30%,4%)" }}>
      <Navbar />
      <div style={{ borderBottom:"1px solid rgba(0,200,255,0.1)",padding:"60px 0" }}>
        <div className="container mx-auto px-4 flex gap-8 items-center">
          <div className="animate-pulse" style={{ width:"140px",height:"140px",background:"rgba(0,200,255,0.05)",border:"1px solid rgba(0,200,255,0.1)" }} />
          <div className="flex-1 space-y-4">
            <div className="animate-pulse" style={{ height:"40px",width:"50%",background:"rgba(0,200,255,0.05)" }} />
            <div className="animate-pulse" style={{ height:"20px",width:"30%",background:"rgba(0,200,255,0.05)" }} />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {[1,2].map(i => <div key={i} className="animate-pulse" style={{ height:"200px",background:"rgba(0,200,255,0.03)",border:"1px solid rgba(0,200,255,0.05)" }} />)}
        </div>
        <div className="animate-pulse" style={{ height:"300px",background:"rgba(0,200,255,0.03)",border:"1px solid rgba(0,200,255,0.05)" }} />
      </div>
      <Footer/>
    </div>
  );
}
