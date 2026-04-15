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
    <footer style={{ borderTop: "1px solid rgba(0,200,255,0.1)", marginTop: "auto" }}>
      <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,rgba(0,200,255,0.3),transparent)", marginBottom: "16px" }} />
      <div className="container mx-auto px-4 pb-6 text-center">
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.82rem",
          color: "rgba(0,200,255,0.6)",
          letterSpacing: "0.12em",
        }}>
          ENGINEERED WITH{" "}
          <span style={{ fontSize: "1rem" }}>❤️</span>
          {" "}BY{" "}
          <GlitchText text="MAHMUD" />
          {" "} 
        </span>
      </div>
    </footer>
  );
}
