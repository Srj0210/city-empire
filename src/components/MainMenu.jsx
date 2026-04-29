import React from 'react';
import { Button3D, Card3D } from './UIElements';

export default function MainMenu({ onSelectGame }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0d1f14 0%, #1b5e20 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      color: "white",
      padding: "20px"
    }}>
      <div style={{ animation: "fadeIn 0.8s ease-out", textAlign: "center" }}>
        <h1 style={{
          fontSize: "60px",
          fontWeight: 900,
          margin: "0 0 10px",
          color: "var(--primary-yellow)",
          textShadow: "0 0 30px rgba(253,216,53,0.5), 3px 4px 0 rgba(0,0,0,0.5)",
          letterSpacing: "4px"
        }}>
          BOARD GAMES HUB
        </h1>
        <p style={{ opacity: 0.6, letterSpacing: "2px", marginBottom: "40px" }}>PRO EDITION • SELECT YOUR CHALLENGE</p>
        
        <div style={{
          display: "flex",
          gap: "30px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "900px"
        }}>
          {/* City Empire Card */}
          <Card3D style={{ width: "320px", cursor: "pointer", transition: "transform 0.2s" }} className="menu-card">
            <div style={{ fontSize: "80px", marginBottom: "20px" }}>🏙️</div>
            <h2 style={{ color: "var(--primary-yellow)", marginBottom: "15px" }}>CITY EMPIRE</h2>
            <p style={{ fontSize: "14px", opacity: 0.8, marginBottom: "25px", minHeight: "60px" }}>
              The ultimate Indian Monopoly experience. Build your empire across Mumbai, Delhi, and more!
            </p>
            <Button3D onClick={() => onSelectGame('city-empire')} style={{ width: "100%" }}>
              PLAY NOW
            </Button3D>
          </Card3D>

          {/* Snakes & Ladders Card */}
          <Card3D style={{ width: "320px", cursor: "pointer" }} className="menu-card">
            <div style={{ fontSize: "80px", marginBottom: "20px" }}>🐍</div>
            <h2 style={{ color: "var(--primary-yellow)", marginBottom: "15px" }}>SNAKES & LADDERS</h2>
            <p style={{ fontSize: "14px", opacity: 0.8, marginBottom: "25px", minHeight: "60px" }}>
              A professional twist on the classic. Race to 100 with amazing 3D visuals and AI!
            </p>
            <Button3D onClick={() => onSelectGame('snakes-ladders')} color="green" style={{ width: "100%" }}>
              START RACE
            </Button3D>
          </Card3D>
        </div>
        
        <div style={{ marginTop: "50px", opacity: 0.4, fontSize: "12px" }}>
          © 2026 CITY EMPIRE STUDIOS • MADE FOR CHAMPIONS
        </div>
      </div>

      <style>{`
        .menu-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: var(--primary-yellow);
        }
      `}</style>
    </div>
  );
}
