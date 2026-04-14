import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogIn, LogOut, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(2, 8, 20, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0, 200, 255, 0.15)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(0, 200, 255, 0.1)",
      }}
    >
      {/* Top scanner line */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.8), transparent)",
      }} />

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" style={{ textDecoration: "none" }}>
          <div
            className="relative flex items-center justify-center"
            style={{
              width: "38px",
              height: "38px",
              border: "1px solid rgba(0, 200, 255, 0.4)",
              background: "rgba(0, 200, 255, 0.05)",
              transition: "all 0.3s ease",
            }}
          >
            {/* Corner accents */}
            <div style={{
              position: "absolute", top: "-2px", left: "-2px",
              width: "6px", height: "6px",
              borderTop: "2px solid rgba(0, 200, 255, 0.8)",
              borderLeft: "2px solid rgba(0, 200, 255, 0.8)",
            }} />
            <div style={{
              position: "absolute", bottom: "-2px", right: "-2px",
              width: "6px", height: "6px",
              borderBottom: "2px solid rgba(0, 200, 255, 0.8)",
              borderRight: "2px solid rgba(0, 200, 255, 0.8)",
            }} />
            <GraduationCap className="h-5 w-5" style={{ color: "rgba(0, 200, 255, 0.9)" }} />
          </div>
          <div className="hidden sm:block">
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.95rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(0, 200, 255, 0.9)",
              lineHeight: 1,
            }}>
              Rate My Faculty
            </div>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {/* Teachers nav link */}
          <Link href="/">
            <button
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "6px 14px",
                border: location === "/" ? "1px solid rgba(0, 200, 255, 0.5)" : "1px solid rgba(0, 200, 255, 0.15)",
                background: location === "/" ? "rgba(0, 200, 255, 0.08)" : "transparent",
                color: location === "/" ? "rgba(0, 200, 255, 0.9)" : "rgba(0, 200, 255, 0.4)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: location === "/" ? "0 0 12px rgba(0, 200, 255, 0.15)" : "none",
              }}
            >
              Faculty
            </button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <Avatar
                    className="h-9 w-9"
                    style={{
                      border: "1px solid rgba(0, 200, 255, 0.4)",
                      boxShadow: "0 0 12px rgba(0, 200, 255, 0.2)",
                    }}
                  >
                    <AvatarFallback style={{
                      background: "rgba(0, 200, 255, 0.08)",
                      color: "rgba(0, 200, 255, 0.9)",
                      fontFamily: "var(--font-display)",
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                    }}>
                      {user.email.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="end"
                forceMount
                style={{
                  background: "rgba(2, 10, 25, 0.95)",
                  border: "1px solid rgba(0, 200, 255, 0.2)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 0 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 200, 255, 0.05)",
                }}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      color: "rgba(0, 200, 255, 0.8)",
                      letterSpacing: "0.05em",
                    }}>{user.email}</p>
                    <p style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      color: "rgba(0, 200, 255, 0.4)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}>
                      ◈ {user.role} Access
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator style={{ background: "rgba(0, 200, 255, 0.1)" }} />
                {user.role === "admin" && (
                  <Link href="/admin">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "rgba(0, 200, 255, 0.8)", letterSpacing: "0.05em" }}
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="cursor-pointer"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "rgba(255, 80, 80, 0.8)", letterSpacing: "0.05em" }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "7px 16px",
                  border: "1px solid rgba(0, 200, 255, 0.5)",
                  background: "rgba(0, 200, 255, 0.08)",
                  color: "rgba(0, 200, 255, 0.9)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 0 12px rgba(0, 200, 255, 0.1)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(0, 200, 255, 0.3)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(0, 200, 255, 0.15)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px rgba(0, 200, 255, 0.1)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(0, 200, 255, 0.08)";
                }}
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
