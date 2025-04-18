'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MAX_BUILDINGS = 100;
const SPAWN_DISTANCE = 150;
const BUILDING_SPACING = 15;
const ROAD_HALF = 4; // Metade da largura da pista

export default function DynamicBuildings({ motoRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const buildings = useRef<THREE.Mesh[]>([]);
  const initialized = useRef(false);

  const generateBuilding = (z: number) => {
    // Randomiza dimensões
    const height = 5 + Math.random() * 20;
    const width = 2 + Math.random() * 4;
    const depth = 2 + Math.random() * 4;
    // Cor aleatória
    const color = new THREE.Color().setHSL(Math.random(), 0.5, 0.5);

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ color, wireframe: true });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Posiciona lateralmente fora da pista
    const side = Math.random() > 0.5 ? 1 : -1;
    const xPos = side * (ROAD_HALF + width / 2 + Math.random() * 2 + 1);
    mesh.position.set(xPos, height / 2, z);

    mesh.rotation.y = Math.random() * 0.2;
    return mesh;
  };

  useFrame(() => {
    if (!motoRef?.current || !groupRef.current) return;
    const motoZ = motoRef.current.motoGroup.position.z;

    // Inicializa a geração
    if (!initialized.current) {
      for (let i = 0; i < MAX_BUILDINGS; i++) {
        const z = motoZ - SPAWN_DISTANCE - i * BUILDING_SPACING;
        const b = generateBuilding(z);
        groupRef.current.add(b);
        buildings.current.push(b);
      }
      initialized.current = true;
      return;
    }

    // Remove prédios atrás da moto
    for (let i = buildings.current.length - 1; i >= 0; i--) {
      if (buildings.current[i].position.z > motoZ + BUILDING_SPACING) {
        groupRef.current.remove(buildings.current[i]);
        buildings.current.splice(i, 1);
      }
    }

    // Mantém contagem de prédios
    while (buildings.current.length < MAX_BUILDINGS) {
      const last = buildings.current[buildings.current.length - 1];
      const lastZ = last ? last.position.z : motoZ - SPAWN_DISTANCE;
      const z = lastZ - BUILDING_SPACING;
      const b = generateBuilding(z);
      groupRef.current.add(b);
      buildings.current.push(b);
    }
  });

  return <group ref={groupRef} />;
}
