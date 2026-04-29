import React, { useState, useEffect, useRef } from 'react';
import { initSLGame, processSLMove, SL_SNAKES, SL_LADDERS } from '../utils/slHelpers';
import { Button3D, Card3D } from './UIElements';
import Dice from './Dice';
import WinnerScreen from './WinnerScreen';

export default function SnakesLaddersGame() {
  const [G, setG] = useState(null);
  const [numPlayers, setNum] = useState(2);
  const [names, setNames] = useState(["Player 1", "Player 2", "Player 3", "Player 4"]);
  const [aiFlags, setAiFlags] = useState([false, true, true, true]);
  const [screen, setScreen] = useState("setup");
  const [rolling, setRolling] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [G?.log?.length]);

  // AI Logic
  useEffect(() => {
    if (!G || G.phase === "gameover") return;
    const cp = G.players[G.turn];
    if (cp.isAI && G.phase === "roll") {
      const t = setTimeout(handleRoll, 1000);
      return () => clearTimeout(t);
    }
    if (cp.isAI && G.phase === "endturn") {
      const t = setTimeout(handleEndTurn, 1000);
      return () => clearTimeout(t);
    }
  }, [G?.phase, G?.turn]);

  const handleRoll = () => {
    if (rolling || G.phase !== "roll") return;
    setRolling(true);
    setTimeout(() => {
      const roll = Math.ceil(Math.random() * 6);
      const nextG = processSLMove({ ...G, dice: [roll, 0] }, G.turn, roll);
      setG(nextG);
      setRolling(false);
    }, 600);
  };

  const handleEndTurn = () => {
    let next = (G.turn + 1) % G.players.length;
    setG({ ...G, turn: next, phase: "roll", dice: null });
  };

  if (screen === "setup") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--dark-bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <Card3D style={{ maxWidth: "440px", textAlign: "center" }}>
          <h1 style={{ color: "var(--primary-yellow)", marginBottom: "30px" }}>SNAKES & LADDERS</h1>
          {/* Reuse setup logic from CityEmpire if possible, but keep it simple here for now */}
          <div style={{ marginBottom: "20px" }}>
             <div style={{ fontSize: "11px", opacity: 0.6, marginBottom: "10px" }}>PLAYERS</div>
             <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
               {[2, 3, 4].map(n => (
                 <button key={n} onClick={() => setNum(n)} style={{
                   width: "50px", height: "50px", borderRadius: "10px",
                   background: numPlayers === n ? "var(--primary-yellow)" : "rgba(255,255,255,0.1)",
                   color: numPlayers === n ? "#000" : "#fff", border: "none", fontWeight: "bold"
                 }}>{n}</button>
               ))}
             </div>
          </div>
          <Button3D onClick={() => { setG(initSLGame(numPlayers, names, aiFlags)); setScreen("game"); }} style={{ width: "100%" }}>
            START RACE
          </Button3D>
        </Card3D>
      </div>
    );
  }

  const cp = G.players[G.turn];

  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 20, padding: 20,
      background: "#0d1f14", minHeight: "100vh", color: "white",
      justifyContent: "center", alignItems: "flex-start"
    }}>
      {/* SL BOARD */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 50px)",
        gridTemplateRows: "repeat(10, 50px)",
        gap: "2px",
        background: "rgba(255,255,255,0.1)",
        padding: "10px",
        borderRadius: "15px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
      }}>
        {Array.from({ length: 100 }, (_, i) => {
          const num = 100 - i;
          // Grid zigzag logic
          const row = Math.floor((100 - num) / 10);
          const col = row % 2 === 0 ? (num - 1) % 10 : 9 - ((num - 1) % 10);
          const playersHere = G.players.filter(p => p.pos === num);
          const isSnake = SL_SNAKES[num];
          const isLadder = SL_LADDERS[num];

          return (
            <div key={num} style={{
              width: "50px", height: "50px",
              background: num % 2 === 0 ? "#2e7d32" : "#1b5e20",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", position: "relative", borderRadius: "4px"
            }}>
              <span style={{ opacity: 0.3 }}>{num}</span>
              {isSnake && <span style={{ position: "absolute", fontSize: "20px" }}>🐍</span>}
              {isLadder && <span style={{ position: "absolute", fontSize: "20px" }}>🪜</span>}
              
              <div style={{ position: "absolute", display: "flex", gap: "2px", flexWrap: "wrap", justifyContent: "center" }}>
                {playersHere.map(p => (
                  <div key={p.id} style={{
                    width: "12px", height: "12px", borderRadius: "50%",
                    background: p.color, border: "1.5px solid white",
                    animation: "bounce 0.5s infinite"
                  }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* SIDEBAR */}
      <div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "15px" }}>
        {G.phase === "gameover" && <WinnerScreen G={G} onPlayAgain={() => setScreen("setup")} />}
        
        <Card3D>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ color: cp.color }}>{cp.name}'s Turn</h3>
            <div style={{ margin: "20px 0" }}>
              <Dice values={G.dice ? [G.dice[0], 0] : null} rolling={rolling} />
            </div>
            {G.phase === "roll" && !cp.isAI && (
              <Button3D onClick={handleRoll} disabled={rolling} style={{ width: "100%" }}>
                {rolling ? "ROLLING..." : "ROLL DICE"}
              </Button3D>
            )}
            {G.phase === "endturn" && !cp.isAI && (
              <Button3D onClick={handleEndTurn} color="green" style={{ width: "100%" }}>
                NEXT PLAYER
              </Button3D>
            )}
            {cp.isAI && <div style={{ color: "var(--ai-blue)", fontWeight: "bold", animation: "bounce 1s infinite" }}>🤖 AI is playing...</div>}
          </div>
        </Card3D>

        <Card3D style={{ maxHeight: "200px", overflowY: "auto" }}>
          <div style={{ fontSize: "10px", opacity: 0.5, marginBottom: "10px" }}>GAME LOG</div>
          <div ref={logRef} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {G.log.map((l, i) => (
              <div key={i} style={{ fontSize: "11px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "2px" }}>
                {l}
              </div>
            ))}
          </div>
        </Card3D>
      </div>
    </div>
  );
}
