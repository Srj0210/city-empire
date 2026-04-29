// src/utils/slHelpers.js

export const SL_SNAKES = {
  17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78
};

export const SL_LADDERS = {
  4: 14, 9: 31, 20: 38, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100
};

export const initSLGame = (n, names, aiFlags) => ({
  players: Array.from({ length: n }, (_, i) => ({
    id: i,
    name: names[i] || `Player ${i + 1}`,
    color: ["#E53935", "#1976D2", "#388E3C", "#F57C00"][i],
    pos: 1, // Start at 1
    isAI: aiFlags[i] || false,
    winner: false
  })),
  turn: 0,
  dice: null,
  rolling: false,
  log: ["🎲 Snakes & Ladders started!"],
  phase: "roll",
  winner: null
});

export const processSLMove = (G, pid, roll) => {
  let nG = { ...G };
  const p = nG.players[pid];
  let newPos = p.pos + roll;

  if (newPos > 100) {
    nG.log = [...nG.log, `🚫 ${p.name} needs exact roll to reach 100.`];
    return { ...nG, phase: "endturn" };
  }

  nG.log = [...nG.log, `🎲 ${p.name} rolled ${roll} → ${newPos}`];
  
  // Check for snakes or ladders
  if (SL_SNAKES[newPos]) {
    const end = SL_SNAKES[newPos];
    nG.log = [...nG.log, `🐍 OOPS! ${p.name} bitten by a snake! ${newPos} → ${end}`];
    newPos = end;
  } else if (SL_LADDERS[newPos]) {
    const end = SL_LADDERS[newPos];
    nG.log = [...nG.log, `🪜 YAY! ${p.name} climbed a ladder! ${newPos} → ${end}`];
    newPos = end;
  }

  nG.players = nG.players.map((x, i) => i === pid ? { ...x, pos: newPos } : x);

  if (newPos === 100) {
    nG.winner = nG.players[pid];
    nG.phase = "gameover";
    nG.log = [...nG.log, `🏆 ${p.name} WINS!`];
  } else {
    nG.phase = "endturn";
  }

  return nG;
};
