import { playClick, playDropdown, playKeyClick } from "@/lib/sounds";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { GraduationCap, LogOut, ShieldCheck, Search, LogIn, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  search?: string;
  onSearch?: (value: string) => void;
}

export function Navbar({ search = "", onSearch }: NavbarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(2,8,20,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,200,255,0.15)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.5),0 1px 0 rgba(0,200,255,0.1)",
      }}
    >
      {/* Top scanner line */}
      <div style={{ position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(0,200,255,0.8),transparent)" }} />

      <div className="container mx-auto px-4 h-16 flex items-center gap-4">

        {/* ── Logo ── */}
        <Link href="/" style={{ textDecoration:"none",flexShrink:0 }}>
          <div className="flex items-center gap-3">
            <div style={{
              width:"38px",height:"38px",display:"flex",alignItems:"center",justifyContent:"center",
              border:"1px solid rgba(0,200,255,0.4)",background:"rgba(0,200,255,0.05)",
              position:"relative",flexShrink:0,
            }}>
              <div style={{ position:"absolute",top:"-2px",left:"-2px",width:"6px",height:"6px",borderTop:"2px solid rgba(0,200,255,0.8)",borderLeft:"2px solid rgba(0,200,255,0.8)" }} />
              <div style={{ position:"absolute",bottom:"-2px",right:"-2px",width:"6px",height:"6px",borderBottom:"2px solid rgba(0,200,255,0.8)",borderRight:"2px solid rgba(0,200,255,0.8)" }} />
              <GraduationCap className="h-5 w-5" style={{ color:"rgba(0,200,255,0.9)" }} />
            </div>
            <div className="hidden sm:block">
              <div style={{ fontFamily:"var(--font-display)",fontSize:"0.95rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(0,200,255,0.9)",lineHeight:1 }}>
                Rate My Faculty
              </div>
              <div style={{ fontFamily:"var(--font-mono)",fontSize:"0.48rem",letterSpacing:"0.14em",color:"rgba(0,200,255,0.4)",textTransform:"uppercase",marginTop:"2px" }}>
                Faculty Reviews & Previous Year Questions
              </div>
            </div>
          </div>
        </Link>

        {/* ── Search bar (center, grows) ── */}
        {onSearch && (
          <div className="flex-1 relative max-w-xl mx-auto hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color:"rgba(0,200,255,0.5)",zIndex:2 }} />
            <input
              type="text"
              placeholder="SEARCH FACULTY NAME · FACULTY INITIAL · COURSE TITLE"
              value={search}
              onChange={e => onSearch(e.target.value)}
              onKeyDown={() => playKeyClick()}
              style={{
                width:"100%",
                paddingLeft:"32px",paddingRight:"12px",paddingTop:"8px",paddingBottom:"8px",
                background:"rgba(0,15,30,0.8)",
                border:"1px solid rgba(0,200,255,0.2)",
                fontFamily:"var(--font-mono)",fontSize:"0.72rem",
                letterSpacing:"0.06em",color:"rgba(0,200,255,0.9)",
                outline:"none",transition:"all 0.3s ease",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "rgba(0,200,255,0.5)"; e.currentTarget.style.boxShadow = "0 0 12px rgba(0,200,255,0.15)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "rgba(0,200,255,0.2)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>
        )}

        {/* ── Right: hamburger menu ── */}
        <div className="ml-auto flex items-center gap-3 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={() => playDropdown()}
                style={{
                  display:"flex",alignItems:"center",justifyContent:"center",
                  width:"38px",height:"38px",
                  border:"1px solid rgba(0,200,255,0.3)",
                  background:"rgba(0,200,255,0.05)",
                  cursor:"pointer",transition:"all 0.3s ease",
                  color:"rgba(0,200,255,0.8)",
                  flexShrink:0,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(0,200,255,0.1)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px rgba(0,200,255,0.2)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(0,200,255,0.05)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <Menu className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              forceMount
              style={{
                background:"rgba(2,10,25,0.97)",
                border:"1px solid rgba(0,200,255,0.2)",
                backdropFilter:"blur(20px)",
                boxShadow:"0 0 40px rgba(0,0,0,0.9),0 0 20px rgba(0,200,255,0.05)",
                minWidth:"220px",
              }}
            >
              {user ? (
                <>
                  {/* User info */}
                  <DropdownMenuLabel className="font-normal px-3 py-3">
                    <div className="flex flex-col gap-1">
                      <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.72rem",color:"rgba(0,200,255,0.85)",letterSpacing:"0.04em",wordBreak:"break-all" }}>
                        {user.email}
                      </p>
                      <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"rgba(0,200,255,0.4)",letterSpacing:"0.12em",textTransform:"uppercase" }}>
                        ◈ {user.role} Access
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator style={{ background:"rgba(0,200,255,0.1)" }} />

                  {/* Admin Dashboard */}
                  {(user.role === "admin" || user.role === "moderator") && (
                    <Link href="/admin">
                      <DropdownMenuItem
                        className="cursor-pointer px-3 py-2"
                        onClick={() => playClick()}
                        style={{ fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"rgba(0,200,255,0.8)",letterSpacing:"0.05em" }}
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </Link>
                  )}

                  {/* Disconnect */}
                  <DropdownMenuItem
                    onClick={() => { playClick(); logout(); }}
                    className="cursor-pointer px-3 py-2"
                    style={{ fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"rgba(255,80,80,0.85)",letterSpacing:"0.05em" }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="font-normal px-3 py-3">
                    <p style={{ fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"rgba(0,200,255,0.45)",letterSpacing:"0.1em",textTransform:"uppercase" }}>
                      Not signed in
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator style={{ background:"rgba(0,200,255,0.1)" }} />
                  <Link href="/auth">
                    <DropdownMenuItem
                      className="cursor-pointer px-3 py-2"
                      onClick={() => playClick()}
                      style={{ fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"rgba(0,200,255,0.85)",letterSpacing:"0.05em" }}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Continue with Google
                    </DropdownMenuItem>
                  </Link>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search */}
      {onSearch && (
        <div className="sm:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color:"rgba(0,200,255,0.5)",zIndex:2 }} />
            <input
              type="text"
              placeholder="Search faculty, course..."
              value={search}
              onChange={e => onSearch(e.target.value)}
              onKeyDown={() => playKeyClick()}
              style={{
                width:"100%",paddingLeft:"32px",paddingRight:"12px",paddingTop:"8px",paddingBottom:"8px",
                background:"rgba(0,15,30,0.8)",border:"1px solid rgba(0,200,255,0.2)",
                fontFamily:"var(--font-mono)",fontSize:"0.72rem",
                letterSpacing:"0.06em",color:"rgba(0,200,255,0.9)",outline:"none",
              }}
            />
          </div>
        </div>
      )}
    </nav>
  );
}
