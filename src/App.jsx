import React, { useState } from 'react'
import CityEmpire from './components/CityEmpire.jsx'
import MainMenu from './components/MainMenu.jsx'
import SnakesLaddersGame from './components/SnakesLaddersGame.jsx'
import './styles/global.css'

export default function App() {
  const [activeGame, setActiveGame] = useState(null);

  if (!activeGame) {
    return <MainMenu onSelectGame={setActiveGame} />;
  }

  const handleGoHome = () => setActiveGame(null);

  return (
    <>
      <button 
        onClick={handleGoHome}
        style={{
          position: 'fixed', top: '20px', left: '20px', zIndex: 1000,
          padding: '12px 20px', borderRadius: '15px', background: 'rgba(0,0,0,0.6)',
          color: 'white', border: '2px solid rgba(255,255,255,0.2)', cursor: 'pointer',
          fontSize: '14px', fontWeight: '900', backdropFilter: 'blur(5px)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)', transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        🏠 HUB
      </button>

      {activeGame === 'city-empire' && <CityEmpire />}
      {activeGame === 'snakes-ladders' && <SnakesLaddersGame />}
    </>
  );
}
