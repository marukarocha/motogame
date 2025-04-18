'use client';

interface GameOverScreenProps {
  onRestart: () => void;
}

export default function GameOverScreen({ onRestart }: GameOverScreenProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(210, 114, 114, 0.8)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        fontSize: '2rem',
        zIndex: 20,
      }}
    >
      <div>💥 Game Over 💥</div>
      <button
        onClick={onRestart}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '1.2rem',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: 'white',
          color: 'black',
          cursor: 'pointer',
        }}
      >
        Tentar novamente
      </button>
    </div>
  );
}
