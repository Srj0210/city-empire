import { useState } from "react";
import { TILES, GROUP_COLORS, GROUP_TEXT } from '../data/tiles.js';

// ═══════════════════════════════════════════════════════════
// AUCTION PANEL
// ═══════════════════════════════════════════════════════════
export default function AuctionPanel({ G, onBid, onPass }) {
  const [bidInput, setBidInput] = useState("");
  const { auction } = G;
  if (!auction) return null;
  const t = TILES[auction.tileId];
  const currBidder = G.players[auction.order[auction.idx]];
  const minBid = auction.topBid + 10;

  return (
    <div style={{
      background: "linear-gradient(135deg,#B8860B22,#DAA52022)",
      border: "2px solid #DAA520", borderRadius: 16, padding: 16,
    }}>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 22, marginBottom: 4 }}>🔨</div>
        <div style={{ fontWeight: 900, fontSize: 16, color: "#FDD835" }}>AUCTION</div>
        <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2 }}>{t.name}</div>
        {t.group && (
          <span style={{
            padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700,
            background: GROUP_COLORS[t.group], color: GROUP_TEXT[t.group],
          }}>{t.group.toUpperCase()}</span>
        )}
        <div style={{ marginTop: 8, fontSize: 13 }}>
          {auction.topBidder !== null
            ? <span>Top Bid: <span style={{ color: "#FDD835", fontWeight: 700 }}>₹{auction.topBid}</span> by <span style={{ color: G.players[auction.topBidder].color, fontWeight: 700 }}>{G.players[auction.topBidder].name}</span></span>
            : <span style={{ opacity: 0.6 }}>No bids yet</span>
          }
        </div>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 12,
        padding: "8px 10px", borderRadius: 10, background: "rgba(255,255,255,0.06)",
      }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: currBidder.color }} />
        <span style={{ fontWeight: 700, fontSize: 13 }}>{currBidder.isAI ? "🤖 " : ""}{currBidder.name}'s bid</span>
        <span style={{ fontSize: 11, opacity: 0.5, marginLeft: "auto" }}>₹{currBidder.money} available</span>
      </div>
      {!currBidder.isAI && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              type="number" value={bidInput}
              onChange={e => setBidInput(e.target.value)}
              placeholder={`Min ₹${minBid}`}
              style={{
                flex: 1, padding: "9px 12px", borderRadius: 10,
                border: "1.5px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.08)", color: "white", fontSize: 14,
                fontFamily: "'Georgia',serif", boxSizing: "border-box", outline: "none",
              }}
            />
            <button onClick={() => {
              const b = parseInt(bidInput) || 0;
              if (b >= minBid && b <= currBidder.money) { onBid(b); setBidInput(""); }
            }} style={{
              padding: "9px 16px", borderRadius: 10,
              background: "linear-gradient(135deg,#43A047,#1B5E20)",
              color: "white", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13,
            }}>Bid</button>
          </div>
          <button onClick={() => onPass()} style={{
            width: "100%", padding: 9, borderRadius: 10,
            background: "rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)",
            fontSize: 13, cursor: "pointer", fontWeight: 600,
          }}>Pass (Skip)</button>
        </>
      )}
      {currBidder.isAI && (
        <div style={{
          padding: 12, borderRadius: 10, textAlign: "center",
          background: "rgba(100,200,255,0.08)", color: "#64C8FF", fontSize: 13, fontWeight: 700,
        }}>🤖 AI is deciding bid...</div>
      )}
      {auction.order.length > 1 && (
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
          {auction.order.map((pid, i) => (
            <div key={pid} style={{
              fontSize: 9, padding: "2px 6px", borderRadius: 5,
              background: i === auction.idx ? "rgba(253,216,53,0.2)" : "rgba(255,255,255,0.05)",
              border: i === auction.idx ? "1px solid #FDD835" : "1px solid rgba(255,255,255,0.1)",
              color: i === auction.idx ? "#FDD835" : "rgba(255,255,255,0.4)",
            }}>{G.players[pid].isAI ? "🤖" : "👤"} {G.players[pid].name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
