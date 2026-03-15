import { calcNetWorth } from '../utils/gameHelpers.js';

// ═══════════════════════════════════════════════════════════
// WINNER / GAME OVER SCREEN
// ═══════════════════════════════════════════════════════════
export default function WinnerScreen({ G, onPlayAgain }) {
  return (
    <div style={{
      background: "linear-gradient(135deg,#B8860B,#DAA520,#FFD700)",
      borderRadius: 18, padding: 28, textAlign: "center", color: "#1a1a1a",
      boxShadow: "0 8px 40px rgba(218,165,32,0.5)",
    }}>
      <style>{`
        @keyframes trophy   { 0%,100%{transform:scale(1) rotate(-5deg)} 50%{transform:scale(1.2) rotate(5deg)} }
        @keyframes confetti { 0%{opacity:1;transform:translateY(0) rotate(0)} 100%{opacity:0;transform:translateY(60px) rotate(720deg)} }
      `}</style>

      <div style={{ fontSize: 64, marginBottom: 8, display: "inline-block", animation: "trophy 1.2s ease-in-out infinite" }}>🏆</div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 8, fontSize: 22 }}>
        {"🎉🥳🎊🎈".split("").map((e, i) => (
          <span key={i} style={{ display: "inline-block", animation: `confetti ${0.8 + i * 0.2}s ease-out ${i * 0.1}s infinite` }}>{e}</span>
        ))}
      </div>

      <h2 style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 900, letterSpacing: 2 }}>
        {G.winner?.isAI ? "🤖" : "👤"} {G.winner ? `${G.winner.name} Wins!` : "Game Over!"}
      </h2>
      <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, opacity: 0.8 }}>
        {G.winner?.isAI ? "The AI dominated the board!" : "A human champion prevails! 🙌"}
      </p>
      {G.winner && (
        <p style={{ margin: "0 0 16px", fontSize: 13, opacity: 0.75 }}>
          Cash: ₹{G.winner.money.toLocaleString()} &nbsp;|&nbsp;
          Net worth: ₹{calcNetWorth(G, G.winner.id).toLocaleString()}
        </p>
      )}

      {/* Bankrupt players */}
      {G.players.filter(p => p.bankrupt).length > 0 && (
        <div style={{
          marginBottom: 16, padding: "8px 12px", borderRadius: 10,
          background: "rgba(0,0,0,0.15)", fontSize: 11,
        }}>
          {G.players.filter(p => p.bankrupt).map(p => (
            <div key={p.id}>💀 {p.isAI ? "🤖" : "👤"} {p.name} went bankrupt</div>
          ))}
        </div>
      )}

      <button onClick={onPlayAgain} style={{
        padding: "10px 28px", borderRadius: 12, background: "#1B5E20", color: "white",
        border: "none", fontSize: 15, cursor: "pointer", fontWeight: 700, letterSpacing: 1,
      }}>🔄 Play Again</button>
    </div>
  );
}
