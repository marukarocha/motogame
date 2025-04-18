'use client';

import { useState, useEffect } from 'react';

interface ControlsState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  space: boolean;
  toggleCamera: boolean; // Novo estado para alternar câmera
}

export default function useControls(): ControlsState {
  const [keys, setKeys] = useState<ControlsState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    space: false,
    toggleCamera: false, // Inicializado como falso
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          setKeys((prev) => ({ ...prev, forward: true }));
          break;
        case 'ArrowDown':
        case 'KeyS':
          setKeys((prev) => ({ ...prev, backward: true }));
          break;
        case 'ArrowLeft':
        case 'KeyA':
          setKeys((prev) => ({ ...prev, left: true }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setKeys((prev) => ({ ...prev, right: true }));
          break;
        case 'Space':
          setKeys((prev) => ({ ...prev, space: true }));
          break;
        case 'KeyC': // Adicionando o caso para a tecla C
          setKeys((prev) => ({ ...prev, toggleCamera: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          setKeys((prev) => ({ ...prev, forward: false }));
          break;
        case 'ArrowDown':
        case 'KeyS':
          setKeys((prev) => ({ ...prev, backward: false }));
          break;
        case 'ArrowLeft':
        case 'KeyA':
          setKeys((prev) => ({ ...prev, left: false }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setKeys((prev) => ({ ...prev, right: false }));
          break;
        case 'Space':
          setKeys((prev) => ({ ...prev, space: false }));
          break;
        case 'KeyC': // Adicionando o caso para a tecla C
          setKeys((prev) => ({ ...prev, toggleCamera: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}
