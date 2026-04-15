import { useEffect, useRef } from "react";

function GlitchText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";
    let timeout: ReturnType<typeof setTimeout>;

    const glitch = () => {
      const el = ref.current;
      if (!el) return;

      let iterations = 0;
      const interval = setInterval(() => {
        el.innerText = text
          .split("")
          .map((char, i) => i < iterations ? char : chars[Math.floor(Math.random() * chars.length)])
          .join("");
        iterations += 0.5;
        if (iterations >= text.length) {
          el.innerText = text;
          clearInterval(interval);
        }
      }, 40);

      // Schedule next glitch
      timeout = setTimeout(glitch, 3000 + Math.random() * 2000);
    };

    timeout = setTimeout(glitch, 1500);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <span
      ref={ref}
      style={{
        color: "#00FBFF",
        fontWeight: 700,
        letterSpacing: "0.15em",
        textShadow: "0 0 8px rgba(0,251,255,0.6), 0 0 20px rgba(0,251,255,0.3)",
      }}
    >
      {text}
    </span>
  );
}

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(0,200,255,0.1)", marginTop: "auto", background: "rgba(2,8,20,0.4)" }}>
      {/* Top Accent Line */}
      <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,rgba(0,200,255,0.3),transparent)", marginBottom: "32px" }} />
      
      <div className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Column 1: System Status */}
          <div className="flex flex-col gap-2 opacity-60">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-cyan-400 uppercase">System Status</h4>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              NODE_ACTIVE: SEU_SERVER_01
            </div>
            <p className="text-[10px] font-mono text-slate-500">ENCRYPTION: AES-256-GCM</p>
          </div>

          {/* Column 2: Center Credit (Your Glitch Text) */}
          <div className="text-center py-4 md:py-0">
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.82rem",
              color: "rgba(0,200,255,0.6)",
              letterSpacing: "0.12em",
            }}>
              ENGINEERED BY <GlitchText text="MAHMUD" />
            </span>
            <div className="mt-2 text-[9px] font-mono text-slate-600 tracking-widest uppercase">
              SEU Faculty Archive v2.4
            </div>
          </div>

          {/* Column 3: Terminal Info */}
          <div className="md:text-right flex flex-col md:items-end gap-2 opacity-60">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-cyan-400 uppercase">Protocol</h4>
            <a href="https://github.com/git-mahmood/seu.ratemyfaculty" 
               target="_blank" 
               className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 transition-colors">
              VIEW_SOURCE_CODE.sh
            </a>
            <p className="text-[10px] font-mono text-slate-500">EST. TWENTY TWENTY SIX</p>
          </div>

        </div>
      </div>
    </footer>
  );
}
