import { TILES, GROUP_COLORS, GROUP_TEXT, GRID_POS, CORNER_ICONS, SPECIAL_ICONS } from '../data/tiles.js';
import { getBandSide } from '../utils/gameHelpers.js';

// ═══════════════════════════════════════════════════════════
// BOARD TILE
// ═══════════════════════════════════════════════════════════
function BoardTile({ tile, G, isActive }) {
  const [col, row] = GRID_POS[tile.id];
  const isCorner   = [0, 10, 20, 30].includes(tile.id);
  const bandSide   = getBandSide(tile.id);
  const bandColor  = tile.group ? GROUP_COLORS[tile.group] : null;
  const playersHere = G.players.filter(p => !p.bankrupt && p.pos === tile.id);
  const ownerId    = G.owned[tile.id];
  const houses     = G.houses[tile.id] || 0;
  const isMortgaged = G.mortgaged[tile.id];

  const bandStyle = {};
  if (bandColor) {
    const sides = ["borderTop", "borderRight", "borderBottom", "borderLeft"];
    if (bandSide >= 0) bandStyle[sides[bandSide]] = `8px solid ${bandColor}`;
  }

  return (
    <div style={{
      gridColumn: col, gridRow: row,
      background: isActive ? "#FFFDE7" : isMortgaged ? "#f5e6e6" : "white",
      border: "1.5px solid #ddd",
      borderRadius: isCorner ? "12px" : "8px",
      margin: "1px",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", boxSizing: "border-box",
      ...bandStyle,
      outline: isActive ? "3px solid var(--primary-yellow)" : "none",
      boxShadow: isActive ? "0 0 20px var(--primary-yellow)" : "0 2px 4px rgba(0,0,0,0.05)",
      zIndex: isActive ? 10 : 1,
      transition: "all 0.2s"
    }}>
      {isCorner && <div style={{ fontSize: 24, animation: "bounce 3s infinite" }}>{CORNER_ICONS[tile.type] || ""}</div>}
      {!isCorner && SPECIAL_ICONS[tile.type] && <div style={{ fontSize: 14, marginBottom: 2 }}>{SPECIAL_ICONS[tile.type]}</div>}
      <div style={{
        fontSize: tile.name.length > 9 ? 6 : tile.name.length > 6 ? 7 : 8.5,
        fontWeight: "900", textAlign: "center", lineHeight: 1.1,
        color: isMortgaged ? "#999" : "#1a1a1a", padding: "0 4px",
        fontFamily: "'Georgia', serif", maxWidth: "100%",
        textDecoration: isMortgaged ? "line-through" : "none",
        textTransform: "uppercase"
      }}>
        {tile.name}
      </div>
      {tile.price  && !isCorner && <div style={{ fontSize: 7, color: "#2E7D32", fontWeight: 900, marginTop: 2 }}>₹{tile.price}</div>}
      {tile.amount && !isCorner && <div style={{ fontSize: 7, color: "#C62828", fontWeight: 900, marginTop: 2 }}>₹{tile.amount}</div>}
      
      {ownerId !== undefined && (
        <div style={{
          position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%",
          background: G.players[ownerId]?.color || "gray", border: "2px solid white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          opacity: isMortgaged ? 0.4 : 1,
        }} />
      )}
      {houses > 0 && (
        <div style={{ position: "absolute", bottom: 4, left: 4, display: "flex", gap: 1 }}>
          {houses === 5 ? (
            <span style={{ fontSize: 10 }}>🏨</span>
          ) : (
            Array.from({ length: houses }).map((_, i) => (
              <span key={i} style={{ fontSize: 8 }}>🏠</span>
            ))
          )}
        </div>
      )}
      {playersHere.length > 0 && (
        <div style={{
          position: "absolute", bottom: isCorner ? 10 : 4,
          display: "flex", gap: 3, zIndex: 5, flexWrap: "wrap", justifyContent: "center",
        }}>
          {playersHere.map(p => (
            <div key={p.id} style={{
              width: 14, height: 14, borderRadius: "50%", background: p.color,
              border: "2px solid white", boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
              animation: "bounce 0.5s ease-out"
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN BOARD
// ═══════════════════════════════════════════════════════════
export default function Board({ G, highlightTile }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "90px repeat(9,55px) 90px",
      gridTemplateRows: "90px repeat(9,55px) 90px",
      width: 675, height: 675, flexShrink: 0,
      border: "8px solid #1b5e20", background: "#2E7D32",
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)", borderRadius: 20,
      padding: "5px",
    }}>
      <div style={{
        gridColumn: "2/11", gridRow: "2/11",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "radial-gradient(circle, #2e7d32 0%, #1b5e20 100%)", userSelect: "none",
        borderRadius: "10px", margin: "5px"
      }}>
        <div style={{ fontSize: 60, marginBottom: 10, animation: "bounce 4s infinite" }}>🏙️</div>
        <div style={{
          fontSize: 32, fontWeight: 900, color: "var(--primary-yellow)", letterSpacing: 6,
          fontFamily: "'Georgia', serif", textShadow: "3px 3px 0 rgba(0,0,0,0.3)",
        }}>CITY</div>
        <div style={{
          fontSize: 32, fontWeight: 900, color: "var(--primary-yellow)", letterSpacing: 6,
          fontFamily: "'Georgia', serif", textShadow: "3px 3px 0 rgba(0,0,0,0.3)",
        }}>EMPIRE</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 3, marginTop: 8, fontWeight: 900 }}>INDIA EDITION PRO</div>
      </div>
      {TILES.map(tile => (
        <BoardTile key={tile.id} tile={tile} G={G} isActive={highlightTile === tile.id} />
      ))}
    </div>
  );
}
