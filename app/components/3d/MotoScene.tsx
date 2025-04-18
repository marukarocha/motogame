'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import { setupCamera } from '../game/camera';
import { setupLights } from '../game/lights';
import { createRoad, createBuildings } from '../game/environment';
import { setupControls } from '../game/logics/Controls';
import { loadMoto } from '../game/moto';

export default function MotoScene() {
  return (
    <Canvas
      camera={{ position: [0, 5, 10], fov: 60 }}
      style={{ width: '100%', height: '100vh', background: '#111' }}
    >
      {/* Luzes da cena */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Carregar moto e ambiente dentro de Suspense */}
      <Suspense fallback={null}>
        {/* Estrada, prédios e ambiente */}
        {/* Aqui futuramente podemos chamar createRoad(), createBuildings(), etc. */}

        {/* Moto GLB carregada */}
        {/* <MotoGLB /> */}

      </Suspense>

      {/* Controle de câmera, se precisar */}
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
