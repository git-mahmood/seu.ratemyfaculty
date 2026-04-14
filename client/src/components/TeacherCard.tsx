import { playHover, playClick } from "@/lib/sounds";
import { Link } from "wouter";
import { type TeacherWithReviewCount } from "@shared/schema";
import { Star, Building2, BookOpen, MapPin } from "lucide-react";

interface TeacherCardProps {
  teacher: TeacherWithReviewCount;
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden"
      style={{
        background: "rgba(2, 10, 25, 0.8)",
        border: "1px solid rgba(0, 200, 255, 0.15)",
        backdropFilter: "blur(12px)",
        transition: "all 0.35s ease",
        cursor: "pointer",
      }}
      onMouseEnter={e => {
        playHover();
        const el = e.currentTarget as HTMLElement;
        el.style.border = "1px solid rgba(0, 200, 255, 0.5)";
        el.style.boxShadow = "0 0 25px rgba(0, 200, 255, 0.12), inset 0 0 25px rgba(0, 200, 255, 0.03)";
        el.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = "1px solid rgba(0, 200, 255, 0.15)";
        el.style.boxShadow = "none";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Corner brackets */}
      <div style={{
        position: "absolute", top: "-1px", left: "-1px",
        width: "10px", height: "10px",
        borderTop: "2px solid rgba(0, 200, 255, 0.6)",
        borderLeft: "2px solid rgba(0, 200, 255, 0.6)",
        zIndex: 2, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-1px", right: "-1px",
        width: "10px", height: "10px",
        borderBottom: "2px solid rgba(0, 200, 255, 0.6)",
        borderRight: "2px solid rgba(0, 200, 255, 0.6)",
        zIndex: 2, pointerEvents: "none",
      }} />

      {/* Photo */}
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          src={teacher.photoUrl || "https://images.unsplash.com/photo-1544531320-9854b5098cf4?w=800&auto=format&fit=crop&q=60"}
          alt={teacher.fullName}
          className="h-full w-full object-cover"
          style={{ transition: "transform 0.5s ease", filter: "brightness(0.85) saturate(0.8)" }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(2,8,20,0.95) 0%, rgba(2,8,20,0.4) 50%, transparent 100%)",
        }} />
        {/* Scan line effect */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
          pointerEvents: "none",
        }} />

        {/* Name overlay on photo */}
        <div style={{ position: "absolute", bottom: "6px", left: "6px", right: "6px" }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(0.6rem, 1.5vw, 0.75rem)",
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "rgba(255, 255, 255, 0.95)",
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textTransform: "uppercase",
          }}>
            {teacher.fullName}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
            <Building2 style={{ width: "11px", height: "11px", color: "rgba(0, 200, 255, 0.7)", flexShrink: 0 }} />
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "rgba(0, 200, 255, 0.7)",
              letterSpacing: "0.05em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {teacher.department}
            </span>
          </div>
        </div>
      </div>

      {/* Info section */}
      <div style={{ padding: "10px", flexGrow: 1, display: "flex", flexDirection: "column", gap: "7px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <MapPin style={{ width: "11px", height: "11px", color: "rgba(0, 200, 255, 0.4)", flexShrink: 0 }} />
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "rgba(0, 200, 255, 0.4)",
            letterSpacing: "0.05em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {teacher.university}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Star style={{ width: "11px", height: "11px", color: "rgba(0, 200, 255, 0.7)", flexShrink: 0 }} />
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "rgba(0, 200, 255, 0.7)",
            letterSpacing: "0.05em",
          }}>
            {teacher.reviewCount} Reviews
          </span>
        </div>

        {/* Course badge */}
        {teacher.coursesTaught.length > 0 && (
          <div className="hidden sm:block">
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.05em",
              color: "rgba(0, 200, 255, 0.5)",
              background: "rgba(0, 200, 255, 0.06)",
              border: "1px solid rgba(0, 200, 255, 0.15)",
              padding: "2px 8px",
              display: "inline-block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}>
              {teacher.coursesTaught[0]}
            </span>
          </div>
        )}
      </div>

      {/* View button */}
      <Link href={`/teacher/${teacher.id}`} className="w-full" style={{ textDecoration: "none" }}>
        <button
          className="w-full"
          onClick={() => playClick()}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "8px",
            background: "rgba(0, 200, 255, 0.06)",
            border: "none",
            borderTop: "1px solid rgba(0, 200, 255, 0.12)",
            color: "rgba(0, 200, 255, 0.7)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(0, 200, 255, 0.12)";
            el.style.color = "rgba(0, 200, 255, 1)";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(0, 200, 255, 0.06)";
            el.style.color = "rgba(0, 200, 255, 0.7)";
          }}
        >
          <BookOpen style={{ width: "11px", height: "11px" }} />
          View Profile
        </button>
      </Link>
    </div>
  );
}
