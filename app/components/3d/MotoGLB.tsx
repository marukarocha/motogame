'use client';

import { useLoader, useFrame } from '@react-three/fiber';
//@ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface MotoGLBProps {
  corBoneco: string;
  corCapacete: string;
  texturaCapacete: File | null;
  brilhoCapacete: number;
  metalCapacete: number;
  emissiveCapacete: string;
  brilhoBoneco: number;
  metalBoneco: number;
  emissiveBoneco: string;
  tamanhoCapacete: string;
}

export default function MotoGLB({
  corBoneco,
  corCapacete,
  texturaCapacete,
  brilhoCapacete,
  metalCapacete,
  emissiveCapacete,
  brilhoBoneco,
  metalBoneco,
  emissiveBoneco,
  tamanhoCapacete,
}: MotoGLBProps) {
  const gltf = useLoader(GLTFLoader, '/models/moto2.glb');
  const motoRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Estado para tamanho da moto
  const [motoScale, setMotoScale] = useState(1);

  // Atualizar propriedades
  useEffect(() => {
    if (!gltf) return;

    const boneco = gltf.scene.getObjectByName('Boneco') as THREE.Mesh;
    const capacete = gltf.scene.getObjectByName('Capacete') as THREE.Mesh;

    if (boneco?.material) {
      const mat = boneco.material as THREE.MeshStandardMaterial;
      mat.color.set(corBoneco);
      mat.roughness = brilhoBoneco;
      mat.metalness = metalBoneco;
      mat.emissive.set(emissiveBoneco);
    }

    if (capacete?.material) {
      const mat = capacete.material as THREE.MeshStandardMaterial;
      mat.color.set(corCapacete);
      mat.roughness = brilhoCapacete;
      mat.metalness = metalCapacete;
      mat.emissive.set(emissiveCapacete);

      if (texturaCapacete) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            const texture = new TextureLoader().load(e.target.result as string);
            mat.map = texture;
            mat.needsUpdate = true;
          }
        };
        reader.readAsDataURL(texturaCapacete);
      }
    }

    // Atualizar escala do capacete
    if (capacete) {
      switch (tamanhoCapacete) {
        case 'pequeno':
          capacete.scale.set(0.8, 0.8, 0.8);
          break;
        case 'normal':
          capacete.scale.set(1, 1, 1);
          break;
        case 'grande':
          capacete.scale.set(1.2, 1.2, 1.2);
          break;
        case 'gigante':
          capacete.scale.set(1.5, 1.5, 1.5);
          break;
      }
    }

  }, [
    gltf,
    corBoneco,
    corCapacete,
    texturaCapacete,
    brilhoCapacete,
    metalCapacete,
    emissiveCapacete,
    brilhoBoneco,
    metalBoneco,
    emissiveBoneco,
    tamanhoCapacete,
  ]);

  // Animações (rotação e luz girando)
  useFrame((state, delta) => {
    if (motoRef.current) {
      motoRef.current.rotation.y += delta * 0.1; // Rotação lenta no Y
    }
    if (lightRef.current) {
      const time = state.clock.getElapsedTime();
      lightRef.current.position.x = Math.sin(time) * 5;
      lightRef.current.position.z = Math.cos(time) * 5;
    }
  });

  return (
    <>
      {/* Luz dinâmica girando */}
      <pointLight ref={lightRef} intensity={10} position={[5, 5, 5]} />

      {/* Moto */}
      <primitive
        ref={motoRef}
        object={gltf.scene}
        scale={motoScale}
        position={[0, -1, 0]}
      />

      {/* 🔥 Botões para alterar o tamanho da moto */}
      <Html position={[0, -2, 0]} center>
        <div className="flex gap-2 bg-gray p-2 rounded">
          <button
            className="px-3 py-1 bg-yellow-400 text-black rounded"
            onClick={() => setMotoScale(0.8)}
          >
            Pequena
          </button>
          <button
            className="px-3 py-1 bg-yellow-400 text-black rounded"
            onClick={() => setMotoScale(1)}
          >
            Normal
          </button>
          <button
            className="px-3 py-1 bg-yellow-400 text-black rounded"
            onClick={() => setMotoScale(1.3)}
          >
            Grande
          </button>
        </div>
      </Html>
    </>
  );
}
