// components/game/Camera.ts
import * as THREE from 'three';

export function setupCamera(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'CameraSetup';

  // Cria uma câmera auxiliar (para debug ou referências)
  const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
  );
  camera.position.set(0, 2, 0);
  camera.lookAt(0, 0, 0);
  group.add(camera);

  return group;
}
