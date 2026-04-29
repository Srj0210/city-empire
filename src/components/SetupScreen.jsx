import { GROUP_COLORS, GROUP_TEXT, PLAYER_COLORS } from '../data/tiles.js';
import { initGame } from '../utils/gameHelpers.js';
import { Button3D, Card3D } from './UIElements.jsx';

export default function SetupScreen({ numPlayers, setNum, names, setNames, aiFlags, setAiFlags, onStart }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0d1f14 0%, #1b5e20 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Georgia', serif", color: "white", padding: 20,
    }}>
      <div style={{ animation: "fadeIn 0.6s ease", textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 70, animation: "bounce 2s infinite", marginBottom: 6 }}>🏙️</div>
        <h1 style={{
          fontSize: 50, fontWeight: 900, margin: "0 0 2px", letterSpacing: 4,
          color: "var(--primary-yellow)", textShadow: "0 0 30px rgba(253,216,53,0.5), 2px 3px 0 rgba(0,0,0,0.5)",
        }}>CITY EMPIRE</h1>
        <p style={{ fontSize: 12, letterSpacing: 3, opacity: 0.5, margin: "0 0 32px" }}>
          INDIA EDITION — PRO BOARD
        </p>

        <Card3D style={{ padding: "32px" }}>
          {/* Number of players */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.6, marginBottom: 15 }}>NUMBER OF PLAYERS</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              {[2, 3, 4].map(n => (
                <button key={n} onClick={() => setNum(n)} style={{
                  width: 64, height: 64, borderRadius: 16, cursor: "pointer",
                  border: numPlayers === n ? "3px solid #FDD835" : "2px solid rgba(255,255,255,0.1)",
                  background: numPlayers === n ? "rgba(253,216,53,0.2)" : "rgba(255,255,255,0.05)",
                  color: numPlayers === n ? "#FDD835" : "rgba(255,255,255,0.5)",
                  fontSize: 26, fontWeight: "900", transition: "all 0.2s",
                  boxShadow: numPlayers === n ? "0 0 15px rgba(253,216,53,0.3)" : "none"
                }}>{n}</button>
              ))}
            </div>
          </div>

          {/* Player names + AI/Human toggle */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.6, marginBottom: 15 }}>PLAYER SETUP</div>
            {Array.from({ length: numPlayers }, (_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: PLAYER_COLORS[i], flexShrink: 0, border: "2px solid white" }} />
                <input
                  value={names[i]}
                  onChange={e => { const n = [...names]; n[i] = e.target.value; setNames(n); }}
                  placeholder={`Player ${i + 1}`}
                  style={{
                    flex: 1, padding: "12px 15px", borderRadius: 12,
                    border: "2px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)", color: "white",
                    fontSize: 14, fontFamily: "'Georgia', serif", outline: "none"
                  }}
                />
                <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)" }}>
                  <button onClick={() => { const f = [...aiFlags]; f[i] = false; setAiFlags(f); }} style={{
                    padding: "8px 12px", border: "none", cursor: "pointer",
                    background: !aiFlags[i] ? "rgba(253,216,53,0.3)" : "rgba(255,255,255,0.05)",
                    color: !aiFlags[i] ? "#FDD835" : "rgba(255,255,255,0.3)",
                  }}>👤</button>
                  <button onClick={() => { const f = [...aiFlags]; f[i] = true; setAiFlags(f); }} style={{
                    padding: "8px 12px", border: "none", cursor: "pointer",
                    background: aiFlags[i] ? "rgba(100,200,255,0.3)" : "rgba(255,255,255,0.05)",
                    color: aiFlags[i] ? "#64C8FF" : "rgba(255,255,255,0.3)",
                  }}>🤖</button>
                </div>
              </div>
            ))}
          </div>

          <Button3D onClick={onStart} style={{ width: "100%", height: "60px", fontSize: "20px" }}>
            🎲 START GAME
          </Button3D>
        </Card3D>

        <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", opacity: 0.7 }}>
          {Object.entries(GROUP_COLORS).map(([g, c]) => (
            <div key={g} style={{
              padding: "4px 10px", borderRadius: 8, background: c,
              color: GROUP_TEXT[g], fontSize: 9, fontWeight: 900,
            }}>{g.toUpperCase()}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
