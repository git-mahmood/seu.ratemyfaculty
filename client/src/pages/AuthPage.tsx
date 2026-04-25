import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { GraduationCap } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function AuthPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/";
      setLocation(redirect);
    }
  }, [user]);

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  // Check for error in URL
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: "hsl(220,30%,4%)" }}>

      {/* Nebula blobs */}
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
        background:"radial-gradient(ellipse 60% 50% at 30% 40%,rgba(0,80,200,0.07) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 70% 60%,rgba(100,0,200,0.06) 0%,transparent 60%)" }} />

      {/* Grid */}
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
        backgroundImage:"linear-gradient(rgba(0,200,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,0.025) 1px,transparent 1px)",
        backgroundSize:"60px 60px" }} />

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center p-4" style={{ zIndex:1, position:"relative" }}>
        <div style={{
          position:"relative", width:"100%", maxWidth:"420px",
          background:"rgba(2,10,25,0.9)",
          border:"1px solid rgba(0,200,255,0.2)",
          backdropFilter:"blur(20px)",
          boxShadow:"0 0 60px rgba(0,0,0,0.8),0 0 30px rgba(0,200,255,0.06)",
          padding:"40px 32px",
          textAlign:"center",
        }}>
          {/* Corner brackets */}
          <div style={{ position:"absolute",top:"-2px",left:"-2px",width:"16px",height:"16px",borderTop:"2px solid rgba(0,200,255,0.7)",borderLeft:"2px solid rgba(0,200,255,0.7)" }} />
          <div style={{ position:"absolute",top:"-2px",right:"-2px",width:"16px",height:"16px",borderTop:"2px solid rgba(0,200,255,0.7)",borderRight:"2px solid rgba(0,200,255,0.7)" }} />
          <div style={{ position:"absolute",bottom:"-2px",left:"-2px",width:"16px",height:"16px",borderBottom:"2px solid rgba(0,200,255,0.7)",borderLeft:"2px solid rgba(0,200,255,0.7)" }} />
          <div style={{ position:"absolute",bottom:"-2px",right:"-2px",width:"16px",height:"16px",borderBottom:"2px solid rgba(0,200,255,0.7)",borderRight:"2px solid rgba(0,200,255,0.7)" }} />

          {/* Top scanner line */}
          <div style={{ position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(0,200,255,0.8),transparent)" }} />

          {/* Icon */}
          <div style={{
            width:"64px",height:"64px",margin:"0 auto 20px",
            display:"flex",alignItems:"center",justifyContent:"center",
            background:"rgba(0,200,255,0.08)",border:"1px solid rgba(0,200,255,0.3)",
            boxShadow:"0 0 20px rgba(0,200,255,0.15)",position:"relative",
          }}>
            <div style={{ position:"absolute",top:"-2px",left:"-2px",width:"8px",height:"8px",borderTop:"2px solid rgba(0,200,255,0.8)",borderLeft:"2px solid rgba(0,200,255,0.8)" }} />
            <div style={{ position:"absolute",bottom:"-2px",right:"-2px",width:"8px",height:"8px",borderBottom:"2px solid rgba(0,200,255,0.8)",borderRight:"2px solid rgba(0,200,255,0.8)" }} />
            <GraduationCap style={{ width:"30px",height:"30px",color:"rgba(0,200,255,0.9)" }} />
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily:"var(--font-display)",fontSize:"1.5rem",fontWeight:800,
            letterSpacing:"0.1em",textTransform:"uppercase",
            background:"linear-gradient(135deg,#00e5ff 0%,#ffffff 50%,#a855f7 100%)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
            marginBottom:"8px",
          }}>
            Rate My Faculty
          </h1>

          <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.78rem",color:"rgba(0,200,255,0.5)",letterSpacing:"0.05em",marginBottom:"32px" }}>
            Sign in with your SEU Google account
          </p>

          {/* Error message */}
          {error === "not_seu_email" && (
            <div style={{
              background:"rgba(255,80,80,0.1)",border:"1px solid rgba(255,80,80,0.3)",
              padding:"10px 16px",marginBottom:"20px",
              fontFamily:"var(--font-mono)",fontSize:"0.72rem",color:"rgba(255,80,80,0.9)",
              letterSpacing:"0.05em",
            }}>
              ⚠ Only @seu.edu.bd emails are allowed
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            style={{
              display:"flex",alignItems:"center",justifyContent:"center",gap:"12px",
              width:"100%",padding:"14px",
              background:"rgba(255,255,255,0.05)",
              border:"1px solid rgba(0,200,255,0.3)",
              color:"rgba(220,240,255,0.9)",
              fontFamily:"var(--font-mono)",fontSize:"0.82rem",
              letterSpacing:"0.08em",textTransform:"uppercase",
              cursor:"pointer",transition:"all 0.3s ease",
              boxShadow:"0 0 15px rgba(0,200,255,0.08)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(0,200,255,0.1)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 25px rgba(0,200,255,0.2)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.6)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 15px rgba(0,200,255,0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.3)";
            }}
          >
            {/* Google Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Footer note */}
          <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"rgba(0,200,255,0.3)",letterSpacing:"0.08em",marginTop:"24px" }}>
            Only @seu.edu.bd emails are authorized
          </p>
        </div>
      </div>

      <div style={{ position:"relative",zIndex:1 }}>
        <Footer />
      </div>
    </div>
  );
}
