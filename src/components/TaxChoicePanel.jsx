// ═══════════════════════════════════════════════════════════
// INCOME TAX CHOICE PANEL
// ═══════════════════════════════════════════════════════════
export default function TaxChoicePanel({ G, onFlat, onPercent }) {
  const { taxChoice } = G;
  if (!taxChoice) return null;
  const p = G.players[taxChoice.pid];
  const tenPercent = Math.floor(taxChoice.netWorth * 0.1);

  return (
    <div style={{
      background: "rgba(198,40,40,0.15)", border: "2px solid #E53935",
      borderRadius: 16, padding: 16, textAlign: "center",
    }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>💸</div>
      <div style={{ fontWeight: 900, color: "#E57373", fontSize: 15, marginBottom: 4 }}>INCOME TAX</div>
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 12 }}>
        {p.name}, choose your payment option.<br />
        Net Worth: <span style={{ color: "#FDD835", fontWeight: 700 }}>₹{taxChoice.netWorth.toLocaleString()}</span>
      </div>
      {!p.isAI && (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onFlat} style={{
            flex: 1, padding: 12, borderRadius: 10,
            background: "linear-gradient(135deg,#E53935,#B71C1C)",
            color: "white", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13,
          }}>
            Pay Flat<br />
            <span style={{ fontSize: 18, fontWeight: 900 }}>₹200</span>
          </button>
          <button onClick={onPercent} style={{
            flex: 1, padding: 12, borderRadius: 10,
            background: `linear-gradient(135deg,${tenPercent > 200 ? "#E53935" : "#43A047"},${tenPercent > 200 ? "#B71C1C" : "#1B5E20"})`,
            color: "white", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13,
          }}>
            Pay 10%<br />
            <span style={{ fontSize: 18, fontWeight: 900 }}>₹{tenPercent}</span>
          </button>
        </div>
      )}
      {p.isAI && (
        <div style={{ padding: 10, color: "#64C8FF", fontSize: 13, fontWeight: 700 }}>🤖 AI is choosing...</div>
      )}
      <div style={{ marginTop: 8, fontSize: 10, opacity: 0.5 }}>
        {tenPercent < 200 ? "💡 10% is cheaper for you!" : "💡 Flat ₹200 is cheaper!"}
      </div>
    </div>
  );
}
