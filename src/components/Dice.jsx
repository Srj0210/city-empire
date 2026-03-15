// ═══════════════════════════════════════════════════════════
// DICE
// ═══════════════════════════════════════════════════════════
export default function Dice({ values, rolling }) {
  const faces = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center" }}>
      {[0, 1].map(i => (
        <div key={i} style={{
          width: 50, height: 50, borderRadius: 10, background: "white",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          transform: rolling ? "rotate(720deg)" : "none",
          transition: rolling ? "transform 0.5s ease" : "none",
          border: "2px solid #E0E0E0",
        }}>
          {values ? faces[values[i]] : "🎲"}
        </div>
      ))}
    </div>
  );
}
