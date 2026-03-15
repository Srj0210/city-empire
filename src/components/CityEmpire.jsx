import { useState, useEffect, useRef } from "react";
import { TILES, GROUP_COLORS, GROUP_TEXT } from '../data/tiles.js';
import {
  rnd, initGame, checkWinner, calcNetWorth,
  canBuildHouse, canSellHouse, canMortgage, canUnmortgage,
  processLanding, processCard, moveTo, startAuction, liquidate,
} from '../utils/gameHelpers.js';

import Board            from './Board.jsx';
import Dice             from './Dice.jsx';
import AuctionPanel     from './AuctionPanel.jsx';
import TaxChoicePanel   from './TaxChoicePanel.jsx';
import PropertyManager  from './PropertyManager.jsx';
import SetupScreen      from './SetupScreen.jsx';
import WinnerScreen     from './WinnerScreen.jsx';

// ═══════════════════════════════════════════════════════════
// MAIN GAME COMPONENT
// ═══════════════════════════════════════════════════════════
export default function CityEmpire() {
  const [screen,     setScreen]  = useState("setup");
  const [numPlayers, setNum]     = useState(2);
  const [names,      setNames]   = useState(["Player 1", "Player 2", "Player 3", "Player 4"]);
  const [aiFlags,    setAiFlags] = useState([false, true, true, true]);
  const [G,          setG]       = useState(null);
  const [rolling,    setRolling] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [G?.log?.length]);

  // ── AI AUTO-PLAY ─────────────────────────────────────────
  useEffect(() => {
    if (!G || G.phase === "gameover") return;

    // AI bidding in auction
    if (G.phase === "auction" && G.auction) {
      const bidderPid = G.auction.order[G.auction.idx];
      if (bidderPid !== undefined && G.players[bidderPid]?.isAI) {
        const t = setTimeout(() => {
          const { auction } = G;
          const bidder = G.players[bidderPid];
          const tile = TILES[auction.tileId];
          const maxWilling = Math.min((tile.price || 200) * 0.85, bidder.money * 0.45);
          const minBid = auction.topBid + 10;
          if (minBid <= maxWilling && minBid <= bidder.money) {
            const bidAmt = Math.min(minBid + Math.floor(Math.random() * 20), Math.floor(maxWilling));
            if (bidAmt >= minBid) handleAuctionBid(bidAmt);
            else handleAuctionPass();
          } else {
            handleAuctionPass();
          }
        }, 900);
        return () => clearTimeout(t);
      }
      return;
    }

    const cp = G.players[G.turn];
    if (!cp || !cp.isAI || cp.bankrupt) return;

    const t = setTimeout(() => {
      if (G.phase === "roll") {
        if (cp.inJail) {
          if (cp.jailFreeCards > 0) handleJailCard();
          else if (cp.money >= 50 && cp.jailTurns < 2) handleJailPay();
          else handleRoll();
        } else {
          handleRoll();
        }
      } else if (G.phase === "buy") {
        handleBuy(true);
      } else if (G.phase === "incometax") {
        const { netWorth } = G.taxChoice;
        if (Math.floor(netWorth * 0.1) < 200) handleTaxPercent();
        else handleTaxFlat();
      } else if (G.phase === "card") {
        handleCard();
      } else if (G.phase === "endturn") {
        handleEndTurn();
      }
    }, 1000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [G?.phase, G?.turn, G?.auction?.idx, rolling]);

  const upd = (nG) => {
    const w = checkWinner(nG);
    setG(w ? { ...nG, phase: "gameover", winner: w } : nG);
  };

  // ── ROLL ─────────────────────────────────────────────────
  const handleRoll = () => {
    if (!G || G.phase !== "roll" || rolling) return;
    const player = G.players[G.turn];
    setRolling(true);
    setTimeout(() => {
      setRolling(false);
      const d1 = rnd(6), d2 = rnd(6), total = d1 + d2, doubles = d1 === d2;
      let nG = { ...G, dice: [d1, d2] };

      if (player.inJail) {
        if (doubles) {
          nG.players = nG.players.map((p, i) => i === G.turn ? { ...p, inJail: false, jailTurns: 0 } : p);
          nG.log = [...nG.log, `🔓 ${player.name} rolled doubles & escaped Jail!`];
        } else {
          const jt = player.jailTurns + 1;
          if (jt >= 3) {
            const fine = Math.min(50, nG.players[G.turn].money);
            nG.players = nG.players.map((p, i) => i === G.turn ? { ...p, inJail: false, jailTurns: 0, money: p.money - fine } : p);
            nG.log = [...nG.log, `🔓 ${player.name} forced out (paid ₹${fine}). Rolling ${d1}+${d2}=${total}.`];
          } else {
            nG.players = nG.players.map((p, i) => i === G.turn ? { ...p, jailTurns: jt } : p);
            nG.log = [...nG.log, `🔒 ${player.name} still in Jail (turn ${jt}/3). No doubles.`];
            upd({ ...nG, phase: "endturn" }); return;
          }
        }
      }

      const oldPos = nG.players[G.turn].pos;
      const newPos = (oldPos + total) % 40;
      nG = moveTo(nG, G.turn, newPos, newPos < oldPos);
      nG.log = [...nG.log, `🎲 ${player.name} rolled ${d1}+${d2}=${total} → ${TILES[newPos].name}`];

      if (doubles && !player.inJail) {
        const dc = (G.doublesCount || 0) + 1;
        if (dc >= 3) {
          nG.players = nG.players.map((p, i) => i === G.turn ? { ...p, inJail: true, jailTurns: 0, pos: 10 } : p);
          nG.log = [...nG.log, `🚔 ${player.name} rolled 3 doubles! Sent to Jail!`];
          upd({ ...nG, doublesCount: 0, phase: "endturn" }); return;
        }
        nG.doublesCount = dc;
      } else { nG.doublesCount = 0; }

      const landed = processLanding(nG, G.turn, newPos);
      if (doubles && !landed.players[G.turn].inJail && landed.phase === "endturn") {
        upd({ ...landed, phase: "roll" });
      } else { upd(landed); }
    }, 600);
  };

  // ── BUY ──────────────────────────────────────────────────
  const handleBuy = (buy) => {
    if (!G || G.phase !== "buy") return;
    const t = TILES[G.pendingBuy], pid = G.turn;
    if (buy) {
      const no = { ...G.owned, [G.pendingBuy]: pid };
      const np = G.players.map((p, i) => i === pid ? { ...p, money: p.money - t.price } : p);
      upd({ ...G, owned: no, players: np, pendingBuy: null, phase: "endturn", log: [...G.log, `✅ ${G.players[pid].name} bought ${t.name} for ₹${t.price}!`] });
    } else {
      upd(startAuction({ ...G, pendingBuy: null }, G.pendingBuy));
    }
  };

  // ── AUCTION ──────────────────────────────────────────────
  const handleAuctionBid = (amount) => {
    if (!G || G.phase !== "auction") return;
    const { auction } = G;
    const bidder = auction.order[auction.idx];
    if (amount <= auction.topBid || amount > G.players[bidder].money) return;
    const nextIdx = (auction.idx + 1) % auction.order.length;
    const nA = { ...auction, topBid: amount, topBidder: bidder, passCount: 0, idx: nextIdx };
    upd({ ...G, auction: nA, log: [...G.log, `💰 ${G.players[bidder].name} bids ₹${amount}!`] });
  };

  const handleAuctionPass = () => {
    if (!G || G.phase !== "auction") return;
    const { auction } = G;
    const bidder = auction.order[auction.idx];
    let newOrder = [...auction.order];
    let newIdx = auction.idx;
    newOrder.splice(newIdx, 1);
    if (newOrder.length === 0 || (newOrder.length === 1 && auction.topBidder !== null)) {
      const winner = auction.topBidder;
      if (winner !== null && auction.topBid > 0) {
        const no = { ...G.owned, [auction.tileId]: winner };
        const np = G.players.map((p, i) => i !== winner ? p : { ...p, money: p.money - auction.topBid });
        upd({ ...G, owned: no, players: np, auction: null, phase: "endturn", log: [...G.log, `🔨 ${G.players[winner].name} won auction for ${TILES[auction.tileId].name} at ₹${auction.topBid}!`] });
      } else {
        upd({ ...G, auction: null, phase: "endturn", log: [...G.log, `🔨 No bids — ${TILES[auction.tileId].name} stays with bank.`] });
      }
      return;
    }
    if (newOrder.length === 1 && auction.topBidder === newOrder[0]) {
      const w = newOrder[0];
      const no = { ...G.owned, [auction.tileId]: w };
      const np = G.players.map((p, i) => i !== w ? p : { ...p, money: p.money - auction.topBid });
      upd({ ...G, owned: no, players: np, auction: null, phase: "endturn", log: [...G.log, `🔨 ${G.players[w].name} won auction for ${TILES[auction.tileId].name} at ₹${auction.topBid}!`] });
      return;
    }
    newIdx = newIdx % newOrder.length;
    upd({ ...G, auction: { ...auction, order: newOrder, idx: newIdx, passCount: (auction.passCount || 0) + 1 }, log: [...G.log, `⏭️ ${G.players[bidder].name} passed.`] });
  };

  // ── INCOME TAX ───────────────────────────────────────────
  const handleTaxFlat = () => {
    if (!G || G.phase !== "incometax") return;
    const { pid } = G.taxChoice; const p = G.players[pid];
    const amt = Math.min(200, p.money);
    const np = G.players.map((x, i) => i !== pid ? x : { ...x, money: x.money - amt, bankrupt: x.money - amt <= 0 });
    let nG = { ...G, players: np, taxChoice: null, log: [...G.log, `💸 ${p.name} paid flat ₹${amt} Income Tax.`] };
    if (np[pid].bankrupt) { nG = liquidate(nG, pid, null); }
    upd({ ...nG, phase: "endturn" });
  };
  const handleTaxPercent = () => {
    if (!G || G.phase !== "incometax") return;
    const { pid, netWorth } = G.taxChoice; const p = G.players[pid];
    const amt = Math.min(Math.floor(netWorth * 0.1), p.money);
    const np = G.players.map((x, i) => i !== pid ? x : { ...x, money: x.money - amt, bankrupt: x.money - amt <= 0 });
    let nG = { ...G, players: np, taxChoice: null, log: [...G.log, `💸 ${p.name} paid 10% = ₹${amt} Income Tax.`] };
    if (np[pid].bankrupt) { nG = liquidate(nG, pid, null); }
    upd({ ...nG, phase: "endturn" });
  };

  // ── CARD ─────────────────────────────────────────────────
  const handleCard = () => { if (G && G.phase === "card") upd(processCard(G)); };

  // ── END TURN ─────────────────────────────────────────────
  const handleEndTurn = () => {
    if (!G || G.phase !== "endturn") return;
    let next = (G.turn + 1) % G.players.length, iter = 0;
    while (G.players[next].bankrupt && iter < G.players.length) { next = (next + 1) % G.players.length; iter++; }
    upd({ ...G, turn: next, phase: "roll", dice: null, doublesCount: 0, log: [...G.log, `🔄 ${G.players[next].name}'s turn.`] });
  };

  // ── JAIL ─────────────────────────────────────────────────
  const handleJailPay = () => {
    if (!G) return;
    const p = G.players[G.turn];
    const fine = Math.min(50, p.money);
    const np = G.players.map((x, i) => i !== G.turn ? x : { ...x, inJail: false, jailTurns: 0, money: x.money - fine });
    upd({ ...G, players: np, log: [...G.log, `💸 ${p.name} paid ₹${fine} fine — out of Jail!`] });
  };
  const handleJailCard = () => {
    if (!G) return;
    const p = G.players[G.turn];
    if (p.jailFreeCards < 1) return;
    const np = G.players.map((x, i) => i !== G.turn ? x : { ...x, inJail: false, jailTurns: 0, jailFreeCards: x.jailFreeCards - 1 });
    upd({ ...G, players: np, log: [...G.log, `🎫 ${p.name} used Jail-Free card!`] });
  };

  // ── PROPERTY MANAGEMENT ──────────────────────────────────
  const handleBuildHouse = (tid) => {
    if (!G) return;
    const t = TILES[tid]; const pid = G.turn; const p = G.players[pid];
    if (!canBuildHouse(G, tid, pid)) return;
    const nh = { ...G.houses, [tid]: (G.houses[tid] || 0) + 1 };
    const np = G.players.map((x, i) => i !== pid ? x : { ...x, money: x.money - t.houseCost });
    const what = (nh[tid] === 5) ? "🏨 hotel" : `🏠 house #${nh[tid]}`;
    upd({ ...G, houses: nh, players: np, log: [...G.log, `🏠 ${p.name} built ${what} on ${t.name} (₹${t.houseCost}).`] });
  };
  const handleSellHouse = (tid) => {
    if (!G) return;
    const t = TILES[tid]; const pid = G.turn; const p = G.players[pid];
    if (!canSellHouse(G, tid, pid)) return;
    const refund = Math.floor(t.houseCost / 2);
    const nh = { ...G.houses, [tid]: (G.houses[tid] || 1) - 1 };
    const np = G.players.map((x, i) => i !== pid ? x : { ...x, money: x.money + refund });
    const was = (G.houses[tid] || 1) === 5 ? "🏨 hotel" : "🏠 house";
    upd({ ...G, houses: nh, players: np, log: [...G.log, `🏚️ ${p.name} sold ${was} from ${t.name} (+₹${refund}).`] });
  };
  const handleMortgage = (tid) => {
    if (!G || !canMortgage(G, tid, G.turn)) return;
    const t = TILES[tid]; const pid = G.turn;
    const np = G.players.map((x, i) => i !== pid ? x : { ...x, money: x.money + (t.mortgage || 0) });
    const nm = { ...G.mortgaged, [tid]: true };
    upd({ ...G, mortgaged: nm, players: np, log: [...G.log, `🔒 ${G.players[pid].name} mortgaged ${t.name} (+₹${t.mortgage}).`] });
  };
  const handleUnmortgage = (tid) => {
    if (!G || !canUnmortgage(G, tid, G.turn)) return;
    const t = TILES[tid]; const pid = G.turn;
    const cost = Math.floor((t.mortgage || 0) * 1.1);
    const np = G.players.map((x, i) => i !== pid ? x : { ...x, money: x.money - cost });
    const nm = { ...G.mortgaged }; delete nm[tid];
    upd({ ...G, mortgaged: nm, players: np, log: [...G.log, `🔓 ${G.players[pid].name} lifted mortgage on ${t.name} (₹${cost}).`] });
  };

  // ── SETUP SCREEN ─────────────────────────────────────────
  if (screen === "setup") return (
    <SetupScreen
      numPlayers={numPlayers} setNum={setNum}
      names={names} setNames={setNames}
      aiFlags={aiFlags} setAiFlags={setAiFlags}
      onStart={() => { setG(initGame(numPlayers, names, aiFlags)); setScreen("game"); }}
    />
  );

  if (!G) return null;
  const cp = G.players[G.turn];
  const highlightTile = G.phase === "buy" ? G.pendingBuy : G.phase === "auction" ? G.auction?.tileId : null;
  const manageVisible = (G.phase === "roll" || G.phase === "endturn") && !cp.bankrupt && !cp.isAI;
  const nw = G.phase !== "gameover" ? calcNetWorth(G, G.turn) : 0;

  // ── GAME SCREEN ──────────────────────────────────────────
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 12, padding: 12,
      background: "#0d1f14", minHeight: "100vh",
      fontFamily: "'Georgia',serif", color: "white",
      justifyContent: "center", alignItems: "flex-start",
    }}>
      <style>{`
        ::-webkit-scrollbar { width:6px }
        ::-webkit-scrollbar-track { background:rgba(255,255,255,0.05) }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.2);border-radius:3px }
        .abtn:hover { filter:brightness(1.12);transform:translateY(-1px); }
        .abtn:active { transform:translateY(0); }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
        input[type=number] { -moz-appearance:textfield; }
      `}</style>

      {/* BOARD */}
      <Board G={G} highlightTile={highlightTile} />

      {/* SIDEBAR */}
      <div style={{ flex: 1, minWidth: 280, maxWidth: 420, display: "flex", flexDirection: "column", gap: 10 }}>

        {/* WINNER SCREEN */}
        {G.phase === "gameover" && <WinnerScreen G={G} onPlayAgain={() => setScreen("setup")} />}

        {/* CURRENT PLAYER CARD */}
        {G.phase !== "gameover" && (
          <div style={{
            background: `linear-gradient(135deg,${cp.color}22,${cp.color}11)`,
            border: `2px solid ${cp.color}88`, borderRadius: 16, padding: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: cp.color, boxShadow: `0 0 8px ${cp.color}` }} />
              <span style={{ fontWeight: 700, fontSize: 17 }}>{cp.isAI ? "🤖 " : "👤 "}{cp.name}'s Turn</span>
              {cp.inJail && <span style={{ background: "#C62828", padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700 }}>⛓️ JAIL (turn {cp.jailTurns + 1}/3)</span>}
              {G.doublesCount > 0 && <span style={{ background: "#F57F17", padding: "2px 8px", borderRadius: 6, fontSize: 10 }}>DOUBLES! Roll again</span>}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#FDD835", textShadow: "0 0 12px rgba(253,216,53,0.4)" }}>
                ₹{cp.money.toLocaleString()}
              </div>
              <div style={{ fontSize: 10, opacity: 0.5 }}>
                Net worth: ₹{nw.toLocaleString()}
                {cp.jailFreeCards > 0 && ` • 🎫×${cp.jailFreeCards}`}
              </div>
            </div>

            {/* Dice */}
            <div style={{ marginBottom: 12 }}>
              <Dice values={G.dice} rolling={rolling} />
              {G.dice && (
                <div style={{ textAlign: "center", fontSize: 11, opacity: 0.5, marginTop: 4 }}>
                  {G.dice[0]}+{G.dice[1]}={G.dice[0] + G.dice[1]}{G.dice[0] === G.dice[1] ? " (Doubles!)" : ""}
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

              {/* AI thinking indicator */}
              {cp.isAI && (G.phase === "roll" || G.phase === "endturn" || G.phase === "buy" || G.phase === "card" || G.phase === "incometax") && (
                <div style={{
                  padding: 14, borderRadius: 12, textAlign: "center",
                  background: "rgba(100,200,255,0.1)", border: "1px solid rgba(100,200,255,0.3)",
                  color: "#64C8FF", fontSize: 14, fontWeight: 700,
                  animation: "pulse 1s infinite",
                }}>🤖 AI is thinking...</div>
              )}

              {/* Roll button (human only) */}
              {G.phase === "roll" && !cp.inJail && !cp.isAI && (
                <button className="abtn" onClick={handleRoll} disabled={rolling} style={{
                  padding: 14, borderRadius: 12,
                  background: rolling ? "#555" : "linear-gradient(135deg,#FDD835,#F9A825)",
                  color: rolling ? "#aaa" : "#1B2820", border: "none", fontSize: 16, fontWeight: 900,
                  cursor: rolling ? "not-allowed" : "pointer", letterSpacing: 1,
                  boxShadow: rolling ? "none" : "0 4px 16px rgba(253,216,53,0.3)",
                }}>{rolling ? "🎲 Rolling..." : "🎲 Roll Dice"}</button>
              )}

              {/* Jail options (human only) */}
              {G.phase === "roll" && cp.inJail && !cp.isAI && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <button className="abtn" onClick={handleRoll} disabled={rolling} style={{
                    padding: 11, borderRadius: 10, background: "linear-gradient(135deg,#1976D2,#0D47A1)",
                    color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: rolling ? "not-allowed" : "pointer",
                  }}>{rolling ? "Rolling..." : "🎲 Roll for Doubles (Escape)"}</button>
                  {cp.jailTurns < 2 && (
                    <button className="abtn" onClick={handleJailPay} style={{
                      padding: 11, borderRadius: 10, background: "linear-gradient(135deg,#E53935,#B71C1C)",
                      color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer",
                    }}>💸 Pay ₹50 Fine</button>
                  )}
                  {cp.jailFreeCards > 0 && (
                    <button className="abtn" onClick={handleJailCard} style={{
                      padding: 11, borderRadius: 10, background: "linear-gradient(135deg,#7B1FA2,#4A148C)",
                      color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer",
                    }}>🎫 Use Jail-Free Card</button>
                  )}
                  {cp.jailTurns === 2 && (
                    <div style={{ fontSize: 10, color: "#E57373", textAlign: "center", padding: "4px 0" }}>
                      ⚠️ 3rd turn — must pay ₹50 when rolling!
                    </div>
                  )}
                </div>
              )}

              {/* Buy panel (human only) */}
              {G.phase === "buy" && G.pendingBuy !== null && !cp.isAI && (() => {
                const t = TILES[G.pendingBuy];
                return (
                  <>
                    <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px", fontSize: 13, textAlign: "center" }}>
                      <span style={{ color: "#FDD835", fontWeight: 700 }}>{t.name}</span>
                      {t.group && (
                        <span style={{ marginLeft: 6, padding: "2px 8px", borderRadius: 6, fontSize: 11, background: GROUP_COLORS[t.group], color: GROUP_TEXT[t.group], fontWeight: 700 }}>
                          {t.group.toUpperCase()}
                        </span>
                      )}
                      <br />
                      <span style={{ opacity: 0.7 }}>Price: </span>
                      <span style={{ fontWeight: 700, color: "#FDD835" }}>₹{t.price}</span>
                      {t.mortgage && <span style={{ opacity: 0.5, fontSize: 11 }}> • Mortgage: ₹{t.mortgage}</span>}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="abtn" onClick={() => handleBuy(true)} style={{
                        flex: 1, padding: 12, borderRadius: 10, background: "linear-gradient(135deg,#43A047,#1B5E20)",
                        color: "white", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer",
                      }}>✅ Buy</button>
                      <button className="abtn" onClick={() => handleBuy(false)} style={{
                        flex: 1, padding: 12, borderRadius: 10, background: "linear-gradient(135deg,#E53935,#B71C1C)",
                        color: "white", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer",
                      }}>🔨 Auction</button>
                    </div>
                  </>
                );
              })()}

              {/* Auction panel */}
              {G.phase === "auction" && <AuctionPanel G={G} onBid={handleAuctionBid} onPass={handleAuctionPass} />}

              {/* Income tax */}
              {G.phase === "incometax" && <TaxChoicePanel G={G} onFlat={handleTaxFlat} onPercent={handleTaxPercent} />}

              {/* Card panel */}
              {G.phase === "card" && G.activeCard && !cp.isAI && (
                <>
                  <div style={{
                    background: G.activeCard.type === "chance" ? "rgba(253,216,53,0.12)" : "rgba(33,150,243,0.12)",
                    border: `1px solid ${G.activeCard.type === "chance" ? "#FDD835" : "#42A5F5"}44`,
                    borderRadius: 12, padding: "14px 16px", fontSize: 13, textAlign: "center", lineHeight: 1.6,
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{G.activeCard.type === "chance" ? "🃏" : "📦"}</div>
                    <div style={{ fontWeight: 700, marginBottom: 4, color: G.activeCard.type === "chance" ? "#FDD835" : "#42A5F5" }}>
                      {G.activeCard.type === "chance" ? "CHANCE" : "COMMUNITY CHEST"}
                    </div>
                    <div style={{ opacity: 0.9 }}>{G.activeCard.card.text}</div>
                  </div>
                  <button className="abtn" onClick={handleCard} style={{
                    padding: 12, borderRadius: 10,
                    background: G.activeCard.type === "chance" ? "linear-gradient(135deg,#F57F17,#E65100)" : "linear-gradient(135deg,#1976D2,#0D47A1)",
                    color: "white", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer",
                  }}>OK — Apply Card Effect</button>
                </>
              )}

              {/* End turn (human only) */}
              {G.phase === "endturn" && !cp.isAI && (
                <button className="abtn" onClick={handleEndTurn} style={{
                  padding: 14, borderRadius: 12, background: "linear-gradient(135deg,#43A047,#1B5E20)",
                  color: "white", border: "none", fontSize: 16, fontWeight: 900, cursor: "pointer",
                  letterSpacing: 1, boxShadow: "0 4px 16px rgba(67,160,71,0.3)",
                }}>➡️ End Turn</button>
              )}
            </div>
          </div>
        )}

        {/* PROPERTY MANAGEMENT */}
        {manageVisible && (
          <PropertyManager
            G={G}
            onBuildHouse={handleBuildHouse}
            onSellHouse={handleSellHouse}
            onMortgage={handleMortgage}
            onUnmortgage={handleUnmortgage}
          />
        )}

        {/* ALL PLAYERS */}
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, opacity: 0.5, marginBottom: 10, fontWeight: 700 }}>ALL PLAYERS</div>
          {G.players.map((p, i) => {
            const pNw = calcNetWorth(G, i);
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
                opacity: p.bankrupt ? 0.3 : 1,
                padding: "8px 10px", borderRadius: 10,
                background: G.turn === i && !p.bankrupt ? "rgba(255,255,255,0.08)" : "transparent",
                border: G.turn === i && !p.bankrupt ? `1px solid ${p.color}44` : "1px solid transparent",
              }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: p.color, flexShrink: 0, boxShadow: G.turn === i && !p.bankrupt ? `0 0 8px ${p.color}` : "" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: G.turn === i ? 700 : 400, fontSize: 13 }}>
                    {p.isAI ? "🤖 " : "👤 "}{p.name}
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.5 }}>
                    {TILES[p.pos].name.slice(0, 14)}
                    {p.inJail ? " • ⛓️" : ""}{p.jailFreeCards > 0 ? ` • 🎫×${p.jailFreeCards}` : ""}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: "#FDD835", fontSize: 13 }}>₹{p.money.toLocaleString()}</div>
                  <div style={{ fontSize: 9, opacity: 0.45 }}>Net: ₹{pNw.toLocaleString()}</div>
                </div>
                {p.bankrupt && <span style={{ fontSize: 14 }}>💀</span>}
                {G.turn === i && !p.bankrupt && <span style={{ fontSize: 10, color: p.color }}>▶</span>}
              </div>
            );
          })}
        </div>

        {/* GAME LOG */}
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, opacity: 0.5, marginBottom: 8, fontWeight: 700 }}>GAME LOG</div>
          <div ref={logRef} style={{ maxHeight: 160, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {G.log.map((e, i) => (
              <div key={i} style={{
                fontSize: 11, lineHeight: 1.4, padding: "2px 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                color: i === G.log.length - 1 ? "white" : "rgba(255,255,255,0.5)",
              }}>{e}</div>
            ))}
          </div>
        </div>

        <button onClick={() => setScreen("setup")} style={{
          padding: 9, borderRadius: 10, background: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)",
          fontSize: 11, cursor: "pointer", letterSpacing: 1,
        }}>← Main Menu</button>
      </div>
    </div>
  );
}
