'use client';

import React from 'react';
import Speedometer from 'react-d3-speedometer';
import { useGameStore } from '../logics/useGameStore';

const maxSpeedValue = 80;

export default function HUD() {
  const fuel = useGameStore((state) => state.fuel);
  const health = useGameStore((state) => state.health);
  const score = useGameStore((state) => state.score);
  const grauMeter = useGameStore((state) => state.grauMeter);
  const speed = useGameStore((state) => state.speed);

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '20px',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        background: 'rgba(0,0,0,0.7)',
        padding: '10px',
        borderRadius: '10px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '1rem',
        zIndex: 10,
        minWidth: '180px',
      }}
    >
      <div>
        ⛽ Combustível:
        <div style={{ background: 'grey', width: '100%', height: '10px', borderRadius: '5px', marginTop: '4px' }}>
          <div style={{ background: 'lime', width: `${fuel}%`, height: '10px', borderRadius: '5px' }} />
        </div>
      </div>
      <div>
        ❤️ Vida:
        <div style={{ background: 'grey', width: '100%', height: '10px', borderRadius: '5px', marginTop: '4px' }}>
          <div style={{ background: 'red', width: `${health}%`, height: '10px', borderRadius: '5px' }} />
        </div>
      </div>
      <div>🏁 Pontos: {score}</div>
      <div>
        ⚡ Grau:
        <div style={{ background: 'grey', width: '100%', height: '10px', borderRadius: '5px', marginTop: '4px' }}>
          <div style={{ background: 'yellow', width: `${(grauMeter / 7) * 100}%`, height: '10px', borderRadius: '5px' }} />
        </div>
      </div>
      <div>
        🚀 Velocidade:
        <Speedometer
          value={Math.abs(speed)}
          maxValue={maxSpeedValue}
          angle={180}
          fontFamily="squada-one"
          width={180}
          height={120}
          needleColor="red"
          startColor="green"
          segments={10}
          endColor="red"
        />
      </div>
    </div>
  );
}
