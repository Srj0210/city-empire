import { GROUP_COLORS, GROUP_TEXT, PLAYER_COLORS } from '../data/tiles.js';
import { initGame } from '../utils/gameHelpers.js';

// ═══════════════════════════════════════════════════════════
// SETUP SCREEN
// ═══════════════════════════════════════════════════════════
export default function SetupScreen({ numPlayers, setNum, names, setNames, aiFlags, setAiFlags, onStart }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#0d2b1a 0%,#1B5E20 50%,#0d2b1a 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Georgia',serif", color: "white", padding: 20,
    }}>
      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .sbtn:hover { transform:scale(1.03)!important; }
        .nbtn:hover { background:rgba(253,216,53,0.2)!important; }
        input:focus  { outline:none!important; border-color:#FDD835!important; }
      `}</style>
      <div style={{ animation: "fadeIn 0.6s ease", textAlign: "center", maxWidth: 440 }}>
        <div style={{ fontSize: 70, animation: "pulse 2s infinite", marginBottom: 6 }}>🏙️</div>
        <h1 style={{
          fontSize: 50, fontWeight: 900, margin: "0 0 2px", letterSpacing: 6,
          color: "#FDD835", textShadow: "0 0 30px rgba(253,216,53,0.5),2px 3px 0 rgba(0,0,0,0.5)",
        }}>CITY EMPIRE</h1>
        <p style={{ fontSize: 12, letterSpacing: 4, opacity: 0.5, margin: "0 0 32px" }}>
          INDIA EDITION — OFFICIAL MONOPOLY RULES
        </p>

        <div style={{
          background: "rgba(255,255,255,0.07)", backdropFilter: "blur(16px)",
          borderRadius: 20, padding: "28px 32px", border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>
          {/* Number of players */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.6, marginBottom: 10 }}>NUMBER OF PLAYERS</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              {[2, 3, 4].map(n => (
                <button key={n} className="nbtn" onClick={() => setNum(n)} style={{
                  width: 64, height: 64, borderRadius: 14, cursor: "pointer",
                  border: numPlayers === n ? "2.5px solid #FDD835" : "1.5px solid rgba(255,255,255,0.2)",
                  background: numPlayers === n ? "rgba(253,216,53,0.15)" : "rgba(255,255,255,0.05)",
                  color: numPlayers === n ? "#FDD835" : "rgba(255,255,255,0.7)",
                  fontSize: 26, fontWeight: "bold", transition: "all 0.2s",
                }}>{n}</button>
              ))}
            </div>
          </div>

          {/* Player names + AI/Human toggle */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.6, marginBottom: 10 }}>PLAYER SETUP</div>
            {Array.from({ length: numPlayers }, (_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: PLAYER_COLORS[i], flexShrink: 0 }} />
                <input
                  value={names[i]}
                  onChange={e => { const n = [...names]; n[i] = e.target.value; setNames(n); }}
                  placeholder={`Player ${i + 1}`}
                  style={{
                    flex: 1, padding: "9px 14px", borderRadius: 10,
                    border: "1.5px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.08)", color: "white",
                    fontSize: 14, fontFamily: "'Georgia',serif", transition: "border-color 0.2s",
                  }}
                />
                {/* AI / Human toggle */}
                <div style={{
                  display: "flex", borderRadius: 8, overflow: "hidden",
                  border: "1.5px solid rgba(255,255,255,0.2)", flexShrink: 0,
                }}>
                  <button onClick={() => { const f = [...aiFlags]; f[i] = false; setAiFlags(f); }} style={{
                    padding: "7px 10px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
                    background: !aiFlags[i] ? "rgba(253,216,53,0.3)" : "rgba(255,255,255,0.05)",
                    color: !aiFlags[i] ? "#FDD835" : "rgba(255,255,255,0.4)", transition: "all 0.15s",
                  }} title="Human Player">👤</button>
                  <button onClick={() => { const f = [...aiFlags]; f[i] = true; setAiFlags(f); }} style={{
                    padding: "7px 10px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
                    background: aiFlags[i] ? "rgba(100,200,255,0.25)" : "rgba(255,255,255,0.05)",
                    color: aiFlags[i] ? "#64C8FF" : "rgba(255,255,255,0.4)", transition: "all 0.15s",
                  }} title="AI Player">🤖</button>
                </div>
              </div>
            ))}
            <div style={{ fontSize: 10, opacity: 0.45, textAlign: "center", marginTop: 4 }}>
              👤 Human &nbsp;|&nbsp; 🤖 AI (plays automatically)
            </div>
          </div>

          {/* Rules summary */}
          <div style={{
            background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "10px 14px",
            marginBottom: 20, textAlign: "left", fontSize: 10, lineHeight: 1.8, opacity: 0.7,
          }}>
            ✅ Auction when property declined &nbsp; ✅ Mortgage system (+10% interest)<br />
            ✅ Even building rule &nbsp; ✅ Income Tax: ₹200 flat or 10% net worth<br />
            ✅ Houses/Hotels sell at half price &nbsp; ✅ Mortgaged = no rent<br />
            ✅ 3-turn jail system &nbsp; ✅ Bankruptcy liquidation<br />
            🤖 AI plays automatically &nbsp; 🏆 Last player standing wins!
          </div>

          <button className="sbtn" onClick={onStart} style={{
            width: "100%", padding: 16, borderRadius: 14,
            background: "linear-gradient(135deg,#FDD835,#F57F17)",
            color: "#1B2820", border: "none", fontSize: 18, fontWeight: 900,
            cursor: "pointer", letterSpacing: 3, transition: "all 0.2s",
            boxShadow: "0 4px 20px rgba(253,216,53,0.35)",
          }}>🎲 START GAME</button>
        </div>

        {/* Color legend */}
        <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center" }}>
          {Object.entries(GROUP_COLORS).map(([g, c]) => (
            <div key={g} style={{
              padding: "3px 8px", borderRadius: 6, background: c,
              color: GROUP_TEXT[g], fontSize: 10, fontWeight: 700, letterSpacing: 1,
            }}>{g.toUpperCase()}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
