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
          <span style={{ color: "#00FBFF", fontWeight: 700, letterSpacing: "0.15em" }}>MAHMUD</span>
          {" "} SEU RATE MY FACULTY v1.0
        </span>
      </div>
    </footer>
  );
}
