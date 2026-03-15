import { TILES, GROUP_COLORS } from '../data/tiles.js';
import { canBuildHouse, canSellHouse, canMortgage, canUnmortgage } from '../utils/gameHelpers.js';

// ═══════════════════════════════════════════════════════════
// PROPERTY MANAGER (Mortgage / Build-Sell Houses)
// ═══════════════════════════════════════════════════════════
export default function PropertyManager({ G, onMortgage, onUnmortgage, onBuildHouse, onSellHouse }) {
  const pid = G.turn;
  const owned = TILES.filter(t => G.owned[t.id] === pid);

  if (owned.length === 0) return (
    <div style={{
      background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 12,
      border: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{ fontSize: 10, letterSpacing: 2, opacity: 0.5, marginBottom: 6, fontWeight: 700 }}>MY PROPERTIES</div>
      <div style={{ fontSize: 11, opacity: 0.35 }}>No properties owned.</div>
    </div>
  );

  const groups = {};
  owned.forEach(t => {
    const key = t.group || t.type;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 12,
      border: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{ fontSize: 10, letterSpacing: 2, opacity: 0.5, marginBottom: 10, fontWeight: 700 }}>
        MY PROPERTIES & MANAGEMENT
      </div>
      {Object.entries(groups).map(([grp, tiles]) => (
        <div key={grp} style={{ marginBottom: 10 }}>
          {tiles.map(t => {
            const h = G.houses[t.id] || 0;
            const mortgaged = G.mortgaged[t.id];
            const canBuild  = canBuildHouse(G, t.id, pid);
            const canSell   = canSellHouse(G, t.id, pid);
            const canMort   = canMortgage(G, t.id, pid);
            const canUnmort = canUnmortgage(G, t.id, pid);
            const unmortgageCost = Math.floor((t.mortgage || 0) * 1.1);
            return (
              <div key={t.id} style={{
                display: "flex", alignItems: "center", gap: 6, marginBottom: 6,
                padding: "6px 8px", borderRadius: 8,
                background: mortgaged ? "rgba(198,40,40,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${t.group ? GROUP_COLORS[t.group] + "44" : "rgba(255,255,255,0.08)"}`,
              }}>
                {t.group && <div style={{ width: 8, height: 20, borderRadius: 2, background: GROUP_COLORS[t.group], flexShrink: 0 }} />}
                {!t.group && <span style={{ fontSize: 12 }}>{t.type === "railroad" ? "🚂" : "⚡"}</span>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700,
                    textDecoration: mortgaged ? "line-through" : "none",
                    opacity: mortgaged ? 0.5 : 1, lineHeight: 1.2,
                  }}>
                    {t.name}
                    {h > 0 && <span style={{ marginLeft: 4, fontSize: 9 }}>{h === 5 ? "🏨" : "🏠".repeat(h)}</span>}
                  </div>
                  {mortgaged  && <div style={{ fontSize: 8, color: "#E57373" }}>Mortgaged — unmortgage: ₹{unmortgageCost}</div>}
                  {!mortgaged && t.mortgage && <div style={{ fontSize: 8, opacity: 0.4 }}>Mortgage: ₹{t.mortgage}</div>}
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {canBuild  && <button onClick={() => onBuildHouse(t.id)} style={{ padding: "3px 7px", borderRadius: 6, background: "#388E3C", border: "none", color: "white", fontSize: 10, cursor: "pointer", fontWeight: 700 }}>+🏠 ₹{t.houseCost}</button>}
                  {canSell   && <button onClick={() => onSellHouse(t.id)}  style={{ padding: "3px 7px", borderRadius: 6, background: "#F57C00", border: "none", color: "white", fontSize: 10, cursor: "pointer", fontWeight: 700 }}>-🏠 ₹{Math.floor(t.houseCost / 2)}</button>}
                  {canMort   && <button onClick={() => onMortgage(t.id)}   style={{ padding: "3px 7px", borderRadius: 6, background: "#616161", border: "none", color: "white", fontSize: 10, cursor: "pointer", fontWeight: 700 }}>Mort ₹{t.mortgage}</button>}
                  {canUnmort && <button onClick={() => onUnmortgage(t.id)} style={{ padding: "3px 7px", borderRadius: 6, background: "#1565C0", border: "none", color: "white", fontSize: 10, cursor: "pointer", fontWeight: 700 }}>Lift ₹{unmortgageCost}</button>}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
