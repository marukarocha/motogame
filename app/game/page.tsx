'use client';

import Game from '../components/game/Game';

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Game /> {/* ✅ Game já inclui o Canvas e o HUD corretamente */}
    </div>
  );
}
