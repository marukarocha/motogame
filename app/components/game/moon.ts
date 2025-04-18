import * as THREE from 'three';

export function setupMoon(): THREE.Group {
  const moonGroup = new THREE.Group();

  // geometria grande, mas não exagerada
  const geometry = new THREE.SphereGeometry(300, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 1,
    color: new THREE.Color(0xddddff),
    roughness: 0.4,
    metalness: 0.1,
    fog: false,

  });

  const moonMesh = new THREE.Mesh(geometry, material);
  moonMesh.castShadow = false;
  moonMesh.receiveShadow = false;

  // ponto de luz que intensifica o efeito de Bloom
  const pointLight = new THREE.PointLight(0xffffff, 0, 800);
  moonGroup.add(pointLight);

  // brilho externo
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide,
  });
  const glowMesh = new THREE.Mesh(
    new THREE.SphereGeometry(110, 64, 64),
    glowMaterial
  );

  moonGroup.add(moonMesh);
  moonGroup.add(glowMesh);

  return moonGroup;
}
