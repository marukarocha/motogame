// components/game/SpeedEffects.ts
import * as THREE from 'three';

export function setupSpeedEffects(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'SpeedEffects';
  
  const geometry = new THREE.PlaneGeometry(5, 5);
  const material = new THREE.MeshBasicMaterial({
    color: 'white',
    transparent: true,
    opacity: 0.5,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(0, 0, -5);
  plane.name = 'SpeedEffectPlane';
  
  group.add(plane);

  (group as any).update = (delta: number) => {
    plane.material.opacity = 0.5 + 0.5 * Math.abs(Math.sin(Date.now() * 0.005));
  };

  return group;
}
