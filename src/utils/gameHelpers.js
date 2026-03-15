import { TILES, PLAYER_COLORS, PLAYER_NAMES_DEF } from '../data/tiles.js';
import { CHANCE_CARDS, COMMUNITY_CARDS } from '../data/cards.js';

// ═══════════════════════════════════════════════════════════
// PURE HELPERS
// ═══════════════════════════════════════════════════════════
export const rnd  = (n) => Math.ceil(Math.random() * n);
export const shuf = (a) => [...a].sort(() => Math.random() - 0.5);

export const getBandSide = (id) => {
  if (id >= 1  && id <= 9)  return 0;
  if (id >= 11 && id <= 19) return 3;
  if (id >= 21 && id <= 29) return 2;
  if (id >= 31 && id <= 39) return 1;
  return -1;
};

export const calcNetWorth = (G, pid) => {
  const p = G.players[pid];
  let w = p.money;
  TILES.forEach(t => {
    if (G.owned[t.id] === pid) {
      w += t.mortgage || Math.floor((t.price || 0) / 2);
      if (!G.mortgaged[t.id] && t.price) w += t.mortgage || 0;
    }
  });
  Object.entries(G.houses || {}).forEach(([tid, h]) => {
    if (G.owned[tid] === pid && h > 0) {
      w += h * (TILES[tid].houseCost || 0);
    }
  });
  return w;
};

// ── PROPERTY RULES ────────────────────────────────────────
export const canBuildHouse = (G, tid, pid) => {
  const t = TILES[tid];
  if (!t.group || t.type !== "property") return false;
  const grp = TILES.filter(x => x.group === t.group && x.type === "property");
  if (!grp.every(x => G.owned[x.id] === pid && !G.mortgaged[x.id])) return false;
  const h = G.houses[tid] || 0;
  if (h >= 5) return false;
  const minH = Math.min(...grp.map(x => G.houses[x.id] || 0));
  if (h > minH) return false;
  return G.players[pid].money >= t.houseCost;
};

export const canSellHouse = (G, tid, pid) => {
  const t = TILES[tid];
  if (!t.group || t.type !== "property") return false;
  if (G.owned[tid] !== pid) return false;
  const h = G.houses[tid] || 0;
  if (h <= 0) return false;
  const grp = TILES.filter(x => x.group === t.group && x.type === "property");
  const maxH = Math.max(...grp.map(x => G.houses[x.id] || 0));
  return h === maxH;
};

export const canMortgage = (G, tid, pid) => {
  if (G.owned[tid] !== pid) return false;
  if (G.mortgaged[tid]) return false;
  const t = TILES[tid];
  if (!t.mortgage) return false;
  if (t.group) {
    const grp = TILES.filter(x => x.group === t.group && x.type === "property");
    if (grp.some(x => (G.houses[x.id] || 0) > 0)) return false;
  }
  return true;
};

export const canUnmortgage = (G, tid, pid) => {
  if (G.owned[tid] !== pid) return false;
  if (!G.mortgaged[tid]) return false;
  const t = TILES[tid];
  const cost = Math.floor((t.mortgage || 0) * 1.1);
  return G.players[pid].money >= cost;
};

export const getRent = (G, tid, diceSum) => {
  const t = TILES[tid];
  if (G.mortgaged[tid]) return 0;
  if (t.type === "railroad") {
    const n = TILES.filter(x => x.type === "railroad" && G.owned[x.id] === G.owned[tid]).length;
    return [25, 50, 100, 200][Math.min(n - 1, 3)];
  }
  if (t.type === "utility") {
    const n = TILES.filter(x => x.type === "utility" && G.owned[x.id] === G.owned[tid]).length;
    return diceSum * (n === 2 ? 10 : 4);
  }
  const h = G.houses[tid] || 0;
  let r = t.rent[h];
  if (h === 0) {
    const grp = TILES.filter(x => x.group === t.group && x.type === "property");
    if (grp.every(x => G.owned[x.id] === G.owned[tid] && !G.mortgaged[x.id])) r *= 2;
  }
  return r;
};

// ── GAME STATE ────────────────────────────────────────────
export const initGame = (n, names, aiFlags = []) => ({
  players: Array.from({ length: n }, (_, i) => ({
    id: i,
    name: names[i] || PLAYER_NAMES_DEF[i],
    color: PLAYER_COLORS[i],
    pos: 0,
    money: 1500,
    inJail: false,
    jailTurns: 0,
    jailFreeCards: 0,
    bankrupt: false,
    isAI: aiFlags[i] || false,
  })),
  owned: {}, houses: {}, mortgaged: {},
  turn: 0, phase: "roll", dice: null, doublesCount: 0,
  log: ["🏙️ City Empire started! Player 1 goes first."],
  chanceDeck: shuf([...Array(CHANCE_CARDS.length).keys()]),
  communityDeck: shuf([...Array(COMMUNITY_CARDS.length).keys()]),
  chanceIdx: 0, commIdx: 0,
  activeCard: null, pendingBuy: null,
  auction: null,
  taxChoice: null,
  winner: null,
});

export const checkWinner = (G) => {
  const alive = G.players.filter(p => !p.bankrupt);
  return alive.length === 1 && G.players.length > 1 ? alive[0] : null;
};

export const liquidate = (G, pid, creditorPid) => {
  let nG = { ...G };
  let refund = 0;
  const nh = { ...nG.houses };
  Object.entries(nh).forEach(([tid, h]) => {
    if (nG.owned[tid] === pid && h > 0) {
      refund += h * Math.floor((TILES[tid].houseCost || 0) / 2);
      nh[tid] = 0;
    }
  });
  nG.houses = nh;
  const np = [...nG.players];
  const totalCash = np[pid].money + refund;
  if (creditorPid !== null && creditorPid !== undefined) {
    np[creditorPid] = { ...np[creditorPid], money: np[creditorPid].money + totalCash };
    const no = { ...nG.owned };
    Object.keys(no).forEach(k => { if (no[k] === pid) no[k] = creditorPid; });
    nG.owned = no;
  } else {
    const no = { ...nG.owned };
    const nm = { ...nG.mortgaged };
    Object.keys(no).forEach(k => { if (no[k] === pid) { delete no[k]; delete nm[k]; } });
    nG.owned = no; nG.mortgaged = nm;
  }
  np[pid] = { ...np[pid], money: 0, bankrupt: true };
  nG.players = np;
  return nG;
};

export const moveTo = (G, pid, newPos, collectGo = true) => {
  const p = G.players[pid];
  let addMoney = 0; let logs = [];
  if (collectGo && newPos < p.pos && p.pos !== 30) {
    addMoney = 200;
    logs.push(`✈️ ${p.name} passed GO! +₹200`);
  }
  const np = G.players.map((x, i) => i === pid ? { ...x, pos: newPos, money: x.money + addMoney } : x);
  return { ...G, players: np, log: [...G.log, ...logs] };
};

export const startAuction = (G, tileId) => {
  const order = G.players
    .filter(p => !p.bankrupt)
    .map(p => p.id);
  const rotated = [...order.slice(G.turn + 1), ...order.slice(0, G.turn + 1)]
    .filter(id => !G.players[id].bankrupt);
  return {
    ...G,
    phase: "auction",
    auction: { tileId, order: rotated, idx: 0, topBid: 0, topBidder: null, passCount: 0 },
    log: [...G.log, `🔨 ${TILES[tileId].name} goes to AUCTION! Starting bid: ₹0`],
  };
};

export const processLanding = (G, pid, tid) => {
  const t = TILES[tid], p = G.players[pid];
  if (t.type === "go")         return { ...G, phase: "endturn", log: [...G.log, `✅ ${p.name} landed on GO! +₹200`] };
  if (t.type === "jail")       return { ...G, phase: "endturn", log: [...G.log, `👀 ${p.name} just visiting Jail.`] };
  if (t.type === "freeparking")return { ...G, phase: "endturn", log: [...G.log, `🅿️ ${p.name} on Free Parking. No reward.`] };

  if (t.type === "gotojail") {
    const np = G.players.map((x, i) => i === pid ? { ...x, inJail: true, jailTurns: 0, pos: 10 } : x);
    return { ...G, players: np, phase: "endturn", log: [...G.log, `🚔 ${p.name} sent to Jail!`] };
  }

  if (t.type === "tax") {
    if (tid === 4) {
      const nw = calcNetWorth(G, pid);
      return { ...G, phase: "incometax", taxChoice: { pid, netWorth: nw }, log: [...G.log, `💸 ${p.name} landed on Income Tax.`] };
    }
    const amt = Math.min(t.amount, p.money);
    const np = G.players.map((x, i) => i !== pid ? x : { ...x, money: x.money - amt, bankrupt: x.money - amt <= 0 });
    let logs = [`💸 ${p.name} paid ₹${amt} ${t.name}.`];
    if (np[pid].bankrupt) {
      logs.push(`💥 ${p.name} went bankrupt!`);
      const nG = liquidate({ ...G, players: np, log: [...G.log, ...logs] }, pid, null);
      const w = checkWinner(nG);
      return w ? { ...nG, phase: "gameover", winner: w } : { ...nG, phase: "endturn" };
    }
    return { ...G, players: np, log: [...G.log, ...logs], phase: "endturn" };
  }

  if (t.type === "chance") {
    const ci = G.chanceDeck[G.chanceIdx % G.chanceDeck.length];
    const card = CHANCE_CARDS[ci];
    return { ...G, phase: "card", activeCard: { type: "chance", card, pid }, chanceIdx: G.chanceIdx + 1, log: [...G.log, `🃏 ${p.name}: "${card.text}"`] };
  }
  if (t.type === "community") {
    const ci = G.communityDeck[G.commIdx % G.communityDeck.length];
    const card = COMMUNITY_CARDS[ci];
    return { ...G, phase: "card", activeCard: { type: "community", card, pid }, commIdx: G.commIdx + 1, log: [...G.log, `📦 ${p.name}: "${card.text}"`] };
  }

  if (t.type === "property" || t.type === "railroad" || t.type === "utility") {
    const oid = G.owned[tid];
    if (oid === undefined) {
      if (p.money >= t.price)
        return { ...G, phase: "buy", pendingBuy: tid, log: [...G.log, `🏙️ ${p.name} on ${t.name} (₹${t.price}). Buy or Auction?`] };
      return startAuction(G, tid);
    }
    if (oid === pid) return { ...G, phase: "endturn", log: [...G.log, `🏠 ${p.name} owns ${t.name}.`] };
    if (G.mortgaged[tid]) return { ...G, phase: "endturn", log: [...G.log, `🔒 ${TILES[tid].name} is mortgaged — no rent.`] };
    const rent = getRent(G, tid, G.dice ? G.dice[0] + G.dice[1] : 7);
    const paid = Math.min(rent, p.money);
    let np = G.players.map((x, i) => {
      if (i === pid) return { ...x, money: x.money - paid, bankrupt: x.money - paid <= 0 };
      if (i === oid) return { ...x, money: x.money + paid };
      return x;
    });
    let logs = [`💰 ${p.name} paid ₹${paid} rent to ${G.players[oid].name}.`];
    if (np[pid].bankrupt) {
      logs.push(`💥 ${p.name} bankrupt! Assets → ${G.players[oid].name}.`);
      const nG = liquidate({ ...G, players: np, log: [...G.log, ...logs] }, pid, oid);
      const w = checkWinner(nG);
      return w ? { ...nG, phase: "gameover", winner: w } : { ...nG, phase: "endturn" };
    }
    return { ...G, players: np, log: [...G.log, ...logs], phase: "endturn" };
  }
  return { ...G, phase: "endturn" };
};

export const processCard = (G) => {
  const { activeCard } = G;
  if (!activeCard) return { ...G, phase: "endturn" };
  const { card, pid } = activeCard;
  const p = G.players[pid];
  let nG = { ...G, activeCard: null };

  if (card.action === "goto") {
    nG = moveTo(nG, pid, card.value, card.value <= p.pos);
    return processLanding(nG, pid, card.value);
  }
  if (card.action === "money") {
    const v = card.value;
    const np = nG.players.map((x, i) => i !== pid ? x : { ...x, money: x.money + v, bankrupt: x.money + v <= 0 });
    nG = { ...nG, players: np, log: [...nG.log, v > 0 ? `💵 ${p.name} +₹${v}.` : `💸 ${p.name} -₹${-v}.`] };
    if (np[pid].bankrupt) {
      const lg = { ...nG, log: [...nG.log, `💥 ${p.name} bankrupt!`] };
      const liq = liquidate(lg, pid, null);
      const w = checkWinner(liq);
      return w ? { ...liq, phase: "gameover", winner: w } : { ...liq, phase: "endturn" };
    }
    return { ...nG, phase: "endturn" };
  }
  if (card.action === "jail") {
    const np = nG.players.map((x, i) => i === pid ? { ...x, inJail: true, jailTurns: 0, pos: 10 } : x);
    return { ...nG, players: np, phase: "endturn", log: [...nG.log, `🚔 ${p.name} sent to Jail!`] };
  }
  if (card.action === "jailcard") {
    const np = nG.players.map((x, i) => i === pid ? { ...x, jailFreeCards: x.jailFreeCards + 1 } : x);
    return { ...nG, players: np, phase: "endturn", log: [...nG.log, `🎫 ${p.name} got Jail-Free card!`] };
  }
  if (card.action === "back") {
    const np2 = (p.pos - (card.value || 3) + 40) % 40;
    nG = moveTo(nG, pid, np2, false);
    return processLanding(nG, pid, np2);
  }
  if (card.action === "collect") {
    const amt = card.value;
    const others = nG.players.filter((_, i) => i !== pid && !nG.players[i].bankrupt);
    let total = 0;
    const np = [...nG.players.map(x => ({ ...x }))];
    others.forEach(o => { const paid = Math.min(amt, np[o.id].money); np[o.id].money -= paid; total += paid; });
    np[pid].money += total;
    return { ...nG, players: np, phase: "endturn", log: [...nG.log, `🎂 ${p.name} collected ₹${total}.`] };
  }
  if (card.action === "repairs") {
    const hc = Object.entries(nG.houses || {}).filter(([k, v]) => nG.owned[k] === pid && v < 5).reduce((s, [, v]) => s + v, 0);
    const htc = Object.entries(nG.houses || {}).filter(([k, v]) => nG.owned[k] === pid && v === 5).length;
    const fee = hc * (card.house || 40) + htc * (card.hotel || 115);
    const np = nG.players.map((x, i) => i !== pid ? x : { ...x, money: x.money - Math.min(fee, x.money), bankrupt: x.money - fee <= 0 });
    return { ...nG, players: np, phase: "endturn", log: [...nG.log, `🔧 ${p.name} paid ₹${Math.min(fee, p.money)} repairs.`] };
  }
  if (card.action === "nearestRR") {
    const rrs = [5, 15, 25, 35];
    const nearest = rrs.reduce((a, b) => ((b - p.pos + 40) % 40) < ((a - p.pos + 40) % 40) ? b : a);
    nG = moveTo(nG, pid, nearest, nearest < p.pos);
    return processLanding(nG, pid, nearest);
  }
  if (card.action === "nearestUtil") {
    const utils = [12, 28];
    const nearest = utils.reduce((a, b) => ((b - p.pos + 40) % 40) < ((a - p.pos + 40) % 40) ? b : a);
    nG = moveTo(nG, pid, nearest, nearest < p.pos);
    return processLanding(nG, pid, nearest);
  }
  return { ...nG, phase: "endturn" };
};
