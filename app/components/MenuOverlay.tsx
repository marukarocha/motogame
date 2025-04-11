'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function MenuOverlay() {
  const [menuVisible, setMenuVisible] = useState(true);
  const [currentBg, setCurrentBg] = useState(0);

  const backgrounds = [
    '/images/back1.jpg',
    '/images/back2.jpg',
    '/images/back3.jpg',
    '/images/back4.jpg',
    '/images/back5.jpg',
    '/images/back6.jpg',
    '/images/back7.jpg',
    '/images/back8.jpg',
  ];

  const handlePlay = () => {
    setMenuVisible(false); // Esconde o menu
  };

  const handleScore = () => {
    alert('Tela de Score (implementar)');
  };

  const handleSettings = () => {
    alert('Tela de Configurações (implementar)');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000); // Troca a cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  if (!menuVisible) return null;

  return (
    <div
      id="menuOverlay"
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        background: `url(${backgrounds[currentBg]}) no-repeat center center/cover`,
        transition: 'background 1s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        color: '#fff',
        fontFamily: 'Bebas Neue, sans-serif',
        textAlign: 'center',
      }}
    >
      {/* 🔥 Logo */}
      <Image src="/images/logo.png" alt="Moto Diário Logo" width={250} height={150} />

      <h1 style={{ fontSize: '4rem', margin: '2rem 0' }}>Moto Diário</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button onClick={handlePlay} style={botaoStyle}>Play</button>
        <button onClick={handleScore} style={botaoStyle}>Score</button>
        <button onClick={handleSettings} style={botaoStyle}>Configurações</button>
      </div>
    </div>
  );
}

const botaoStyle = {
  padding: '1rem 2rem',
  fontSize: '1.5rem',
  backgroundColor: '#ffef00',
  border: 'none',
  borderRadius: '10px',
  color: '#000',
  cursor: 'pointer',
};
