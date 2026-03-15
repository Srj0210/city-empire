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
    if (bandSide >= 0) bandStyle[sides[bandSide]] = `7px solid ${bandColor}`;
  }

  return (
    <div style={{
      gridColumn: col, gridRow: row,
      background: isActive ? "#FFFDE7" : isMortgaged ? "#f5e6e6" : isCorner ? "#F0F4F8" : "white",
      border: "1px solid #9E9E9E",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", boxSizing: "border-box",
      ...bandStyle,
      outline: isActive ? "2px solid #FFC107" : "none",
    }}>
      {isCorner && <div style={{ fontSize: 20 }}>{CORNER_ICONS[tile.type] || ""}</div>}
      {!isCorner && SPECIAL_ICONS[tile.type] && <div style={{ fontSize: 11 }}>{SPECIAL_ICONS[tile.type]}</div>}
      <div style={{
        fontSize: tile.name.length > 9 ? 5.5 : tile.name.length > 6 ? 6.5 : 7.5,
        fontWeight: "700", textAlign: "center", lineHeight: 1.1,
        color: isMortgaged ? "#999" : "#1a1a1a", padding: "0 2px",
        fontFamily: "'Georgia',serif", maxWidth: "100%",
        textDecoration: isMortgaged ? "line-through" : "none",
      }}>
        {isCorner ? tile.name.toUpperCase() : tile.name}
      </div>
      {tile.price  && !isCorner && <div style={{ fontSize: 6, color: "#555",   fontWeight: 600 }}>₹{tile.price}</div>}
      {tile.amount && !isCorner && <div style={{ fontSize: 6, color: "#C62828", fontWeight: 600 }}>₹{tile.amount}</div>}
      {ownerId !== undefined && (
        <div style={{
          position: "absolute", top: 2, right: 2, width: 6, height: 6, borderRadius: "50%",
          background: G.players[ownerId]?.color || "gray", border: "1px solid white",
          opacity: isMortgaged ? 0.4 : 1,
        }} />
      )}
      {houses > 0 && (
        <div style={{ position: "absolute", bottom: 2, left: 2, fontSize: 7 }}>
          {houses === 5 ? "🏨" : "🏠".repeat(houses)}
        </div>
      )}
      {playersHere.length > 0 && (
        <div style={{
          position: "absolute", bottom: isCorner ? 8 : 3,
          display: "flex", gap: 2, zIndex: 5, flexWrap: "wrap", justifyContent: "center",
        }}>
          {playersHere.map(p => (
            <div key={p.id} style={{
              width: 10, height: 10, borderRadius: "50%", background: p.color,
              border: "1.5px solid white", boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
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
      gridTemplateColumns: "80px repeat(9,50px) 80px",
      gridTemplateRows: "80px repeat(9,50px) 80px",
      width: 610, height: 610, flexShrink: 0,
      border: "3px solid #2E7D32", background: "#2E7D32",
      boxShadow: "0 8px 40px rgba(0,0,0,0.6)", borderRadius: 4,
    }}>
      <div style={{
        gridColumn: "2/11", gridRow: "2/11",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg,#1B5E20,#2E7D32,#1B5E20)", userSelect: "none",
      }}>
        <div style={{ fontSize: 40, marginBottom: 4 }}>🏙️</div>
        <div style={{
          fontSize: 24, fontWeight: 900, color: "#FDD835", letterSpacing: 4,
          fontFamily: "'Georgia',serif", textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
        }}>CITY</div>
        <div style={{
          fontSize: 24, fontWeight: 900, color: "#FDD835", letterSpacing: 4,
          fontFamily: "'Georgia',serif", textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
        }}>EMPIRE</div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 2, marginTop: 4 }}>INDIA EDITION</div>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", maxWidth: 220 }}>
          {Object.entries(GROUP_COLORS).map(([g, c]) => (
            <div key={g} style={{ width: 16, height: 16, borderRadius: 3, background: c, border: "1px solid rgba(255,255,255,0.3)" }} />
          ))}
        </div>
      </div>
      {TILES.map(tile => (
        <BoardTile key={tile.id} tile={tile} G={G} isActive={highlightTile === tile.id} />
      ))}
    </div>
  );
}
