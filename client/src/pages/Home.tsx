import { playKeyClick } from "@/lib/sounds";
import { useState, useEffect, useRef } from "react";
import { useTeachers } from "@/hooks/use-teachers";
import { Navbar } from "@/components/Navbar";
import { TeacherCard } from "@/components/TeacherCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Footer } from "@/components/Footer";

// Animated star field canvas
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.3 + 0.05,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
    }));

    const shootingStars: {
      x: number; y: number; len: number;
      speed: number; alpha: number; active: boolean; angle: number;
    }[] = Array.from({ length: 5 }, () => ({
      x: 0, y: 0, len: 0, speed: 0, alpha: 0, active: false, angle: 0,
    }));

    let frame = 0;

    const spawnShootingStar = (s: typeof shootingStars[0]) => {
      s.x = Math.random() * window.innerWidth;
      s.y = Math.random() * window.innerHeight * 0.5;
      s.len = Math.random() * 120 + 60;
      s.speed = Math.random() * 8 + 6;
      s.alpha = 1;
      s.active = true;
      s.angle = Math.PI / 6 + Math.random() * Math.PI / 8;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        s.alpha += s.twinkleSpeed * s.twinkleDir;
        if (s.alpha >= 1) { s.alpha = 1; s.twinkleDir = -1; }
        if (s.alpha <= 0.1) { s.alpha = 0.1; s.twinkleDir = 1; }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 220, 255, ${s.alpha})`;
        ctx.fill();

        if (s.r > 1.2) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 200, 255, ${s.alpha * 0.15})`;
          ctx.fill();
        }
      });

      frame++;
      shootingStars.forEach((s, i) => {
        if (!s.active && frame % 120 === i * 24) spawnShootingStar(s);
        if (!s.active) return;

        const dx = Math.cos(s.angle) * s.speed;
        const dy = Math.sin(s.angle) * s.speed;
        s.x += dx;
        s.y += dy;
        s.alpha -= 0.015;

        if (s.alpha <= 0 || s.x > canvas.width || s.y > canvas.height) {
          s.active = false;
          return;
        }

        const grad = ctx.createLinearGradient(
          s.x, s.y,
          s.x - Math.cos(s.angle) * s.len,
          s.y - Math.sin(s.angle) * s.len
        );
        grad.addColorStop(0, `rgba(0, 220, 255, ${s.alpha})`);
        grad.addColorStop(1, "rgba(0, 220, 255, 0)");

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0, pointerEvents: "none",
      }}
    />
  );
}

export default function Home() {
  const { data: teachers, isLoading, error } = useTeachers();
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const filteredTeachers = teachers?.filter(t =>
    t.fullName.toLowerCase().includes(search.toLowerCase()) ||
    t.department.toLowerCase().includes(search.toLowerCase()) ||
    t.university.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "hsl(220, 30%, 4%)" }}>
      <StarField />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">

        {/* Hero Section */}
        <div
          className="max-w-3xl mx-auto text-center mb-14 space-y-6"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Main title */}
          <div className="relative">
            <h1
              className="animate-flicker"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: "linear-gradient(135deg, #00e5ff 0%, #ffffff 40%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
                lineHeight: 1.1,
              }}
            >
              Rate My Faculty
            </h1>
            {/* Glow layer */}
            <h1
              aria-hidden
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "transparent",
                position: "absolute",
                top: 0, left: 0, right: 0,
                textAlign: "center",
                filter: "blur(20px)",
                background: "linear-gradient(135deg, #00e5ff, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                opacity: 0.4,
                lineHeight: 1.1,
              }}
            >
              Rate My Faculty
            </h1>
          </div>

          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1.1rem",
            color: "rgba(150, 210, 255, 0.7)",
            letterSpacing: "0.05em",
            fontWeight: 400,
          }}>
            Honest reviews · Past year questions · Faculty profiles
          </p>

          {/* Search bar */}
          <div
            className="relative max-w-xl mx-auto mt-6 corner-brackets"
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.8s ease 0.3s",
            }}
          >
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: "rgba(0, 200, 255, 0.5)", zIndex: 2 }}
            />
            <Input
              placeholder="SEARCH FACULTY NAME · DEPT · UNIVERSITY"
              onKeyDown={() => playKeyClick()}
              className="pl-12 py-6 rounded-none"
              style={{
                background: "rgba(0, 15, 30, 0.8)",
                border: "1px solid rgba(0, 200, 255, 0.25)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                color: "rgba(0, 200, 255, 0.9)",
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Faculty count only */}
          {teachers && (
            <div className="text-center pt-2" style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 0.4s" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "rgba(0, 220, 255, 0.9)", fontWeight: 700 }}>
                {teachers.length}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "rgba(100, 160, 200, 0.6)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Faculty
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hud-line mb-8 opacity-40" />

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-sm animate-pulse"
                style={{ background: "rgba(0, 200, 255, 0.05)", border: "1px solid rgba(0, 200, 255, 0.1)" }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20" style={{ color: "rgba(255, 80, 80, 0.8)" }}>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              // CONNECTION FAILED
            </h2>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              Unable to retrieve faculty data. Retry later.
            </p>
          </div>
        ) : filteredTeachers?.length === 0 ? (
          <div className="text-center py-20">
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.2rem",
              color: "rgba(0, 200, 255, 0.5)",
              letterSpacing: "0.1em",
            }}>
              // NO RESULTS FOUND
            </h2>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "rgba(100, 150, 200, 0.5)",
              marginTop: "0.5rem",
            }}>
              Adjust your search parameters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {filteredTeachers?.map((teacher, i) => (
              <div
                key={teacher.id}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(16px)",
                  transition: `all 0.5s ease ${Math.min(i * 0.05, 0.5)}s`,
                }}
              >
                <TeacherCard teacher={teacher} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
