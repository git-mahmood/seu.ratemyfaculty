import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { useTeacher } from "@/hooks/use-teachers";
import { useReviews } from "@/hooks/use-reviews";
import { Navbar } from "@/components/Navbar";
import { ReviewForm } from "@/components/ReviewForm";
import { PyqList, UploadPyqDialog } from "@/components/PyqList";
import {
  Building2, MapPin, BookOpen, User, Smile, Frown, Meh,
  GraduationCap, Pencil, Trash2, MessageSquarePlus,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

// ── Mechanical keyboard click (Web Audio API, no file needed) ──────────────
function playKeyClick() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.value = 0.18;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    setTimeout(() => ctx.close(), 200);
  } catch {}
}

// ── Subtle whoosh for review entry ────────────────────────────────────────
function playWhoosh() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.18, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.06));
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 0.5;
    const gain = ctx.createGain();
    gain.gain.value = 0.09;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    setTimeout(() => ctx.close(), 400);
  } catch {}
}

// ── Typing name component ─────────────────────────────────────────────────
function TypingName({ name }: { name: string }) {
  const [displayed, setDisplayed] = useState("");
  const [cursorPhase, setCursorPhase] = useState<"typing" | "blinking" | "hidden">("typing");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    setCursorPhase("typing");

    const interval = setInterval(() => {
      if (indexRef.current < name.length) {
        setDisplayed(name.slice(0, indexRef.current + 1));
        playKeyClick();
        indexRef.current++;
      } else {
        clearInterval(interval);
        setCursorPhase("blinking");
        // Blink for ~2s then fade out
        setTimeout(() => setCursorPhase("hidden"), 2200);
      }
    }, 68);

    return () => clearInterval(interval);
  }, [name]);

  return (
    <span style={{ position: "relative" }}>
      {displayed}
      <span style={{
        display: "inline-block",
        width: "3px",
        height: "1em",
        background: "#00FBFF",
        marginLeft: "3px",
        verticalAlign: "text-bottom",
        boxShadow: "0 0 8px rgba(0,251,255,0.8)",
        animation: cursorPhase === "blinking" ? "cursorBlink 0.5s step-end infinite" : "none",
        opacity: cursorPhase === "hidden" ? 0 : 1,
        transition: cursorPhase === "hidden" ? "opacity 0.4s ease" : "none",
      }} />
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </span>
  );
}

// ── Animated review card ──────────────────────────────────────────────────
function AnimatedReview({ children, index }: { children: React.ReactNode; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delay = index * 120; // cascade: 120ms apart
    const t = setTimeout(() => {
      setVisible(true);
      playWhoosh();
    }, delay);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </div>
  );
}

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
  /* This 'flex flex-col' makes the page a vertical stack */
  <div className="min-h-screen flex flex-col" style={{ background: "hsl(220,30%,4%)" }}>
    <Navbar />
    {/* This 'flex-1' grows to fill all empty space, pushing the footer down */}
    <main className="flex-1">

      {/* ===== HEADER BANNER ===== */}
      <div style={{
        position: "relative",
        borderBottom: "1px solid rgba(0,200,255,0.15)",
        background: "rgba(2,8,20,0.92)",
        overflow: "hidden",
      }}>
        {/* Blurred bg image */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(${teacher.photoUrl})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "blur(28px) brightness(0.12) saturate(0.4)",
          transform: "scale(1.1)",
        }} />
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(0,200,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,0.03) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        {/* Top scanner line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", zIndex: 2, background: "linear-gradient(90deg,transparent,rgba(0,200,255,0.7),transparent)" }} />

        <div className="container mx-auto px-4 py-8 relative" style={{ zIndex: 3 }}>
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

            {/* ===== AVATAR ===== */}
            <div style={{
              width: "112px", height: "112px", flexShrink: 0,
              border: "2px solid #00FBFF",
              boxShadow: "0 0 24px rgba(0,251,255,0.5), 0 0 48px rgba(0,251,255,0.2)",
              overflow: "hidden", position: "relative",
            }}>
              <img src={teacher.photoUrl} alt={teacher.fullName} className="w-full h-full object-cover"
                style={{ filter: "saturate(0.85)" }} />
              <div style={{ position:"absolute",top:"-2px",left:"-2px",width:"10px",height:"10px",borderTop:"2px solid #00FBFF",borderLeft:"2px solid #00FBFF" }} />
              <div style={{ position:"absolute",bottom:"-2px",right:"-2px",width:"10px",height:"10px",borderBottom:"2px solid #00FBFF",borderRight:"2px solid #00FBFF" }} />
            </div>

            {/* ===== INFO ===== */}
            <div className="flex-1 space-y-3 text-center md:text-left">
              {/* Label */}
              
              {/* Name — typing effect */}
              <h1 style={{
                fontFamily:"var(--font-display)",fontWeight:800,
                fontSize:"clamp(1.4rem,3.5vw,2rem)",letterSpacing:"0.08em",
                textTransform:"uppercase",color:"rgba(224,240,255,0.97)",
                textShadow:"0 0 32px rgba(0,200,255,0.35)",lineHeight:1.1,
                minHeight: "2.2rem",
              }}>
                <TypingName name={teacher.fullName} />
              </h1>
              {/* Dept + Uni */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div style={{ display:"flex",alignItems:"center",gap:"6px" }}>
                  <Building2 style={{ width:"14px",height:"14px",color:"rgba(0,200,255,0.65)" }} />
                  <span style={{ fontFamily:"var(--font-mono)",fontSize:"0.82rem",color:"rgba(0,200,255,0.65)",letterSpacing:"0.04em" }}>
                    {teacher.department}
                  </span>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:"6px" }}>
                  <MapPin style={{ width:"14px",height:"14px",color:"rgba(0,200,255,0.45)" }} />
                  <span style={{ fontFamily:"var(--font-mono)",fontSize:"0.82rem",color:"rgba(0,200,255,0.45)",letterSpacing:"0.04em" }}>
                    {teacher.university}
                  </span>
                </div>
              </div>
              {/* Course chips — entry animation */}
<div className="flex flex-wrap justify-center md:justify-start gap-2">
  {teacher.coursesTaught.map((course, i) => (
    <span key={i} style={{
      fontFamily:"var(--font-mono)",fontSize:"0.78rem",letterSpacing:"0.06em",fontWeight:500,
      color:"#00FBFF",background:"rgba(0,251,255,0.08)",
      border:"1px solid rgba(0,251,255,0.4)",padding:"5px 14px",
      display:"flex",alignItems:"center",gap:"6px",
      boxShadow:"0 0 8px rgba(0,251,255,0.1)",
      opacity: 0,
      animation: `chipFadeIn 0.5s ease forwards`,
      animationDelay: `${0.3 + i * 0.15}s`,
    }}>
      <BookOpen style={{ width:"11px",height:"11px" }} />
      {course}
      <style>{`
        @keyframes chipFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </span>
  ))}
</div>
            </div>

            {/* ===== ACTION BUTTONS ===== */}
            <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0">
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">

        {/* ===== REVIEWS COLUMN ===== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 style={{ fontFamily:"var(--font-display)",fontSize:"1.4rem",fontWeight:800,letterSpacing:"0.1em",color:"rgba(200,232,255,0.95)",textTransform:"uppercase" }}>
                Reviews
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {/* Heart favorite button */}
              <div className="relative group/fav">
                <button
                  onClick={() => {
                    if (!user) { window.location.href = "/auth"; return; }
                    isFavorite ? removeFavorite.mutate(teacherId) : addFavorite.mutate(teacherId);
                  }}
                  style={{
                    display:"flex",alignItems:"center",justifyContent:"center",
                    width:"36px",height:"36px",
                    border:`1px solid ${isFavorite ? "rgba(255,80,120,0.6)" : "rgba(0,200,255,0.3)"}`,
                    background: isFavorite ? "rgba(255,80,120,0.1)" : "rgba(0,200,255,0.05)",
                    cursor:"pointer",transition:"all 0.3s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(255,80,120,0.3)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,80,120,0.6)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.borderColor = isFavorite ? "rgba(255,80,120,0.6)" : "rgba(0,200,255,0.3)";
                  }}
                >
                  <Heart className="h-4 w-4" style={{ color: isFavorite ? "rgba(255,80,120,0.9)" : "rgba(0,200,255,0.6)", fill: isFavorite ? "rgba(255,80,120,0.9)" : "none" }} />
                </button>
                <div style={{
                  position:"absolute",bottom:"-28px",left:"50%",transform:"translateX(-50%)",
                  background:"rgba(2,10,25,0.95)",border:"1px solid rgba(0,200,255,0.2)",
                  padding:"3px 8px",whiteSpace:"nowrap",
                  fontFamily:"var(--font-mono)",fontSize:"0.58rem",color:"rgba(0,200,255,0.8)",
                  opacity:0,transition:"opacity 0.2s ease",pointerEvents:"none",zIndex:10,
                }} className="group-hover/fav:opacity-100">
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </div>
              </div>
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
                      display: "flex", alignItems: "center", gap: "6px",
                      fontFamily: "var(--font-mono)", fontSize: "0.7rem",
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      padding: "6px 14px",
                      border: "1px solid rgba(0,200,255,0.4)",
                      background: "rgba(0,200,255,0.08)",
                      color: "rgba(0,200,255,0.9)",
                      cursor: "pointer", transition: "all 0.3s ease",
                      boxShadow: "0 0 10px rgba(0,200,255,0.1)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 18px rgba(0,200,255,0.35)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(0,200,255,0.15)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.8)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 10px rgba(0,200,255,0.1)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(0,200,255,0.08)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.4)";
                    }}
                  >
                    <MessageSquarePlus style={{ width: "14px", height: "14px" }} />
                    Write a Review
                  </button>
                }
              />
              <span style={{
                fontFamily:"var(--font-mono)",fontSize:"0.72rem",letterSpacing:"0.1em",
                color:"rgba(0,200,255,0.85)",background:"rgba(0,200,255,0.08)",
                border:"1px solid rgba(0,200,255,0.28)",padding:"5px 14px",
              }}>
                {teacher.reviewCount} Total
              </span>
            </div>
          </div>
          <div style={{ height:"1px",background:"linear-gradient(90deg,rgba(0,200,255,0.4),transparent)" }} />

          {/* Review list */}
          {reviewsLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse" style={{ height:"160px",background:"rgba(0,200,255,0.04)",border:"1px solid rgba(0,200,255,0.08)" }} />
              ))}
            </div>
          ) : reviews?.length === 0 ? (
            <div className="text-center py-16" style={{ border:"1px dashed rgba(0,200,255,0.15)",background:"rgba(0,200,255,0.02)" }}>
              <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.82rem",color:"rgba(0,200,255,0.4)",letterSpacing:"0.1em" }}>
                 No reviews yet. Be the first!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews?.map((review, index) => {
                const isAdmin = user?.email === "2025100000379@seu.edu.bd";
                const isOwner = user?.id === review.studentId;

                return (
                  <AnimatedReview key={review.id} index={index}>
                    <div style={{
                      background:"rgba(2,10,25,0.82)",border:"1px solid rgba(0,200,255,0.12)",
                      backdropFilter:"blur(12px)",padding:"24px",position:"relative",
                      transition:"border-color 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.28)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(0,200,255,0.06)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.12)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                    >
                      {/* Corner brackets */}
                      <div style={{ position:"absolute",top:"-1px",left:"-1px",width:"9px",height:"9px",borderTop:"1px solid rgba(0,200,255,0.5)",borderLeft:"1px solid rgba(0,200,255,0.5)" }} />
                      <div style={{ position:"absolute",bottom:"-1px",right:"-1px",width:"9px",height:"9px",borderBottom:"1px solid rgba(0,200,255,0.5)",borderRight:"1px solid rgba(0,200,255,0.5)" }} />

                      {/* Review header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div style={{
                            width:"40px",height:"40px",display:"flex",alignItems:"center",justifyContent:"center",
                            background:"rgba(0,200,255,0.08)",border:"1px solid rgba(0,200,255,0.2)",flexShrink:0,
                          }}>
                            <User style={{ width:"18px",height:"18px",color:"rgba(0,200,255,0.7)" }} />
                          </div>
                          <div>
                            <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.8rem",color:"rgba(0,200,255,0.85)",letterSpacing:"0.04em",fontWeight:500 }}>
                              {isAdmin ? review.studentUsername : "Anonymous Student"}
                            </p>
                            <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"rgba(0,200,255,0.35)",letterSpacing:"0.04em",marginTop:"2px" }}>
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
                            <Button variant="ghost" size="icon" className="h-8 w-8"
                              onClick={() => { if (confirm("Delete this review?")) deleteReviewMutation.mutate(review.id); }}
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
                          fontFamily:"var(--font-sans)",fontSize:"0.95rem",fontWeight:500,
                          color:"#E2E8F0",lineHeight:1.7,
                          marginBottom:"20px",
                          borderLeft:"2px solid rgba(0,200,255,0.25)",
                          paddingLeft:"14px",
                        }}>
                          "{review.comment}"
                        </p>
                      )}

                      {/* Metrics */}
                      <div style={{ borderTop:"1px solid rgba(0,200,255,0.08)",paddingTop:"14px" }}>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <Metric label="Course" value={review.courseTaken} />
                          <Metric label="Personality" value={review.personality} />
                          <Metric label="Best For" value={review.bestFor} />
                          <Metric label="Marking" value={review.markingStyle} />
                          <Metric label="Difficulty" value={review.questionDifficulty} />
                        </div>
                      </div>
                    </div>
                  </AnimatedReview>
                );
              })}
            </div>
          )}
        </div>

        {/* ===== SIDEBAR ===== */}
        <div className="space-y-5">

          {/* PYQ */}
          <div style={{
            background:"rgba(2,10,25,0.82)",border:"1px solid rgba(0,200,255,0.12)",
            backdropFilter:"blur(12px)",position:"relative",overflow:"hidden",
          }}>
            <div style={{ position:"absolute",top:"-1px",left:"-1px",width:"8px",height:"8px",borderTop:"1px solid rgba(0,200,255,0.5)",borderLeft:"1px solid rgba(0,200,255,0.5)" }} />
            <div style={{ position:"absolute",bottom:"-1px",right:"-1px",width:"8px",height:"8px",borderBottom:"1px solid rgba(0,200,255,0.5)",borderRight:"1px solid rgba(0,200,255,0.5)" }} />
            <PyqList teacherId={teacher.id} hideUpload={true} />
          </div>

          {/* Pro tip */}
          <div style={{
            background:"rgba(2,10,25,0.82)",border:"1px solid rgba(0,200,255,0.1)",
            backdropFilter:"blur(12px)",padding:"16px",position:"relative",
          }}>
            <div style={{ position:"absolute",top:"-1px",left:"-1px",width:"8px",height:"8px",borderTop:"1px solid rgba(0,200,255,0.4)",borderLeft:"1px solid rgba(0,200,255,0.4)" }} />
            <div style={{ position:"absolute",bottom:"-1px",right:"-1px",width:"8px",height:"8px",borderBottom:"1px solid rgba(0,200,255,0.4)",borderRight:"1px solid rgba(0,200,255,0.4)" }} />
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap style={{ width:"14px",height:"14px",color:"rgba(0,200,255,0.65)" }} />
              <span style={{ fontFamily:"var(--font-display)",fontSize:"0.68rem",letterSpacing:"0.12em",color:"rgba(0,200,255,0.7)",textTransform:"uppercase" }}>
                Pro Tip
              </span>
            </div>
            <p style={{ fontFamily:"var(--font-sans)",fontSize:"0.8rem",color:"rgba(150,200,240,0.55)",lineHeight:1.6 }}>
              Always check the syllabus along with past year questions to ensure you're studying relevant topics.
            </p>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{
        fontFamily:"var(--font-mono)",fontSize:"0.62rem",
        letterSpacing:"0.18em",color:"rgba(0,200,255,0.55)",
        textTransform:"uppercase",marginBottom:"5px",
      }}>
        {label}
      </p>
      <p style={{
        fontFamily:"var(--font-mono)",fontSize:"0.78rem",
        color:"rgba(0,220,255,0.9)",letterSpacing:"0.04em",fontWeight:600,
      }}>
        {value}
      </p>
    </div>
  );
}

function getPersonalityIcon(type: string) {
  switch (type) {
    case "Friendly": return <Smile className="h-5 w-5" style={{ color:"rgba(0,255,150,0.75)" }} />;
    case "Strict":   return <Frown className="h-5 w-5" style={{ color:"rgba(255,80,80,0.75)" }} />;
    default:         return <Meh   className="h-5 w-5" style={{ color:"rgba(255,200,0,0.75)" }} />;
  }
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background:"hsl(220,30%,4%)" }}>
      <Navbar />
      <div className="flex-1">
        <div style={{ borderBottom:"1px solid rgba(0,200,255,0.1)",padding:"32px 0" }}>
          <div className="container mx-auto px-4 flex gap-6">
            <div style={{ width:"112px",height:"112px",background:"rgba(0,200,255,0.05)",border:"1px solid rgba(0,200,255,0.1)",animation:"pulse 2s infinite" }} />
            <div className="flex-1 space-y-3">
              <div style={{ height:"28px",width:"60%",background:"rgba(0,200,255,0.05)",animation:"pulse 2s infinite" }} />
              <div style={{ height:"18px",width:"40%",background:"rgba(0,200,255,0.05)",animation:"pulse 2s infinite" }} />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1,2].map(i => <div key={i} style={{ height:"160px",background:"rgba(0,200,255,0.04)",border:"1px solid rgba(0,200,255,0.08)",animation:"pulse 2s infinite" }} />)}
          </div>
          <div style={{ height:"200px",background:"rgba(0,200,255,0.04)",border:"1px solid rgba(0,200,255,0.08)",animation:"pulse 2s infinite" }} />
        </div>
      </div>
      <Footer/>
    </div>
  );
}
