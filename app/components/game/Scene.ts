'use client';

import * as THREE from 'three';

export function setupScene() {
  const scene = new THREE.Scene();

  // Fundo escuro tipo GTA Vice City vibe com tom mais azulado para combinar com os prédios wireframe
  scene.background = new THREE.Color('#050a1f'); 

  // Neblina para dar profundidade - ajustada para combinar com os prédios wireframe
  scene.fog = new THREE.Fog('#050a1f', 20, 150);

  return scene;
}
