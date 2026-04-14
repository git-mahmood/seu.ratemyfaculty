import { playLoginClick } from "@/lib/sounds";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { GraduationCap, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/Footer";

// Mini star field for auth page
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animFrameId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random(),
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.alpha += s.twinkleSpeed * s.twinkleDir;
        if (s.alpha >= 1) { s.alpha = 1; s.twinkleDir = -1; }
        if (s.alpha <= 0.1) { s.alpha = 0.1; s.twinkleDir = 1; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,220,255,${s.alpha})`;
        ctx.fill();
      });
      animFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animFrameId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none" }} />;
}

export default function AuthPage() {
  const { user, login, isLoggingIn } = useAuth();
  const [, setLocation] = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  if (user) {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect") || "/";
    setLocation(redirect);
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background:"hsl(220,30%,4%)" }}>
      <StarField />

      {/* Nebula blobs */}
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
        background:"radial-gradient(ellipse 60% 50% at 30% 40%,rgba(0,80,200,0.07) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 70% 60%,rgba(100,0,200,0.06) 0%,transparent 60%)" }} />

      {/* Grid */}
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
        backgroundImage:"linear-gradient(rgba(0,200,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,0.025) 1px,transparent 1px)",
        backgroundSize:"60px 60px" }} />

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center p-4" style={{ zIndex:1, position:"relative" }}>
        {/* Auth card */}
        <div
          style={{
            position:"relative", width:"100%", maxWidth:"420px",
            background:"rgba(2,10,25,0.9)",
            border:"1px solid rgba(0,200,255,0.2)",
            backdropFilter:"blur(20px)",
            boxShadow:"0 0 60px rgba(0,0,0,0.8),0 0 30px rgba(0,200,255,0.06)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition:"all 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Corner brackets */}
          <div style={{ position:"absolute",top:"-2px",left:"-2px",width:"16px",height:"16px",borderTop:"2px solid rgba(0,200,255,0.7)",borderLeft:"2px solid rgba(0,200,255,0.7)" }} />
          <div style={{ position:"absolute",top:"-2px",right:"-2px",width:"16px",height:"16px",borderTop:"2px solid rgba(0,200,255,0.7)",borderRight:"2px solid rgba(0,200,255,0.7)" }} />
          <div style={{ position:"absolute",bottom:"-2px",left:"-2px",width:"16px",height:"16px",borderBottom:"2px solid rgba(0,200,255,0.7)",borderLeft:"2px solid rgba(0,200,255,0.7)" }} />
          <div style={{ position:"absolute",bottom:"-2px",right:"-2px",width:"16px",height:"16px",borderBottom:"2px solid rgba(0,200,255,0.7)",borderRight:"2px solid rgba(0,200,255,0.7)" }} />

          {/* Top scanner line */}
          <div style={{ position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(0,200,255,0.8),transparent)" }} />

          {/* Header */}
          <div style={{ padding:"32px 32px 24px",textAlign:"center" }}>
            {/* Icon */}
            <div style={{
              width:"60px",height:"60px",margin:"0 auto 16px",
              display:"flex",alignItems:"center",justifyContent:"center",
              background:"rgba(0,200,255,0.08)",border:"1px solid rgba(0,200,255,0.3)",
              boxShadow:"0 0 20px rgba(0,200,255,0.15)",position:"relative",
            }}>
              <div style={{ position:"absolute",top:"-2px",left:"-2px",width:"8px",height:"8px",borderTop:"2px solid rgba(0,200,255,0.8)",borderLeft:"2px solid rgba(0,200,255,0.8)" }} />
              <div style={{ position:"absolute",bottom:"-2px",right:"-2px",width:"8px",height:"8px",borderBottom:"2px solid rgba(0,200,255,0.8)",borderRight:"2px solid rgba(0,200,255,0.8)" }} />
              <GraduationCap style={{ width:"28px",height:"28px",color:"rgba(0,200,255,0.9)" }} />
            </div>


            {/* Title */}
            <h1 style={{
              fontFamily:"var(--font-display)",fontSize:"1.5rem",fontWeight:800,
              letterSpacing:"0.1em",textTransform:"uppercase",
              background:"linear-gradient(135deg,#00e5ff 0%,#ffffff 50%,#a855f7 100%)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
              marginBottom:"10px",
            }}>
              Rate My Faculty
            </h1>

            <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.78rem",color:"rgba(0,200,255,0.5)",letterSpacing:"0.05em" }}>
              Enter credentials to access the system
            </p>
          </div>

          {/* Divider */}
          <div style={{ height:"1px",background:"linear-gradient(90deg,transparent,rgba(0,200,255,0.2),transparent)",margin:"0 32px" }} />

          {/* Form */}
          <div style={{ padding:"24px 32px 32px" }}>
            <LoginForm onSubmit={login} isLoading={isLoggingIn} />
          </div>

          {/* Card footer */}
          <div style={{
            borderTop:"1px solid rgba(0,200,255,0.08)",
            padding:"14px 32px",textAlign:"center",
          }}>
            <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.72rem",color:"rgba(0,200,255,0.45)",letterSpacing:"0.08em" }}>
              Only @seu.edu.bd emails are authorized
            </p>
          </div>
        </div>
      </div>

      {/* Page footer */}
      <div style={{ position:"relative",zIndex:1 }}>
        <Footer />
      </div>
    </div>
  );
}

function LoginForm({ onSubmit, isLoading }: { onSubmit: any; isLoading: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label style={{ fontFamily:"var(--font-mono)",fontSize:"0.85rem",letterSpacing:"0.15em",color:"rgba(0,200,255,0.9)",textTransform:"uppercase" }}>
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="yourID@seu.edu.bd"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label style={{ fontFamily:"var(--font-mono)",fontSize:"0.85rem",letterSpacing:"0.15em",color:"rgba(0,200,255,0.9)",textTransform:"uppercase" }}>
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.72rem",color:"rgba(0,200,255,0.45)",letterSpacing:"0.04em" }}>
          New user? Your password will be set on first login.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        onClick={() => playLoginClick()}
        className="w-full"
        style={{
          display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",
          padding:"12px",marginTop:"8px",
          background: isLoading ? "rgba(0,200,255,0.04)" : "rgba(0,200,255,0.1)",
          border:"1px solid rgba(0,200,255,0.4)",
          color: isLoading ? "rgba(0,200,255,0.3)" : "rgba(0,200,255,0.95)",
          fontFamily:"var(--font-display)",fontSize:"0.82rem",fontWeight:700,
          letterSpacing:"0.15em",textTransform:"uppercase",
          cursor: isLoading ? "not-allowed" : "pointer",
          transition:"all 0.3s ease",
          boxShadow: isLoading ? "none" : "0 0 15px rgba(0,200,255,0.1)",
        }}
        onMouseEnter={e => {
          if (!isLoading) {
            (e.currentTarget as HTMLElement).style.background = "rgba(0,200,255,0.15)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 25px rgba(0,200,255,0.25)";
          }
        }}
        onMouseLeave={e => {
          if (!isLoading) {
            (e.currentTarget as HTMLElement).style.background = "rgba(0,200,255,0.1)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 15px rgba(0,200,255,0.1)";
          }
        }}
      >
        <LogIn style={{ width:"16px",height:"16px" }} />
        {isLoading ? "Authenticating..." : "Login / Sign In"}
      </button>
    </form>
  );
}
