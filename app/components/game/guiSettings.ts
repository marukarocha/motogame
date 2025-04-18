'use client';

export const motoSettings = {
    position: { x: 0, y: 0.5, z: 0 },
    rotation: { x: 0, y:0, z: 0 }, // 90° para frente
    scale: 0.5, // Escala uniforme (meio metro)
};

export const lightSettings = {
  omni: {
    intensity: 0.5,
  },
  spot: {
    intensity: 1,
    position: { x: 5, y: 10, z: 5 },
  },
};
