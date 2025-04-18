'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Environment({ motoRef }) {
  const { scene: posteModel } = useGLTF('/models/poste.glb');
  const { scene: postoModel } = useGLTF('/models/posto.glb');
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.Fog(0x000000, 30, 300);
  }, [scene]);

  const roadRef = useRef();
  const groundRef = useRef();
  const centerLineRef = useRef();
  const centerLines = useMemo(() => {
    const group = new THREE.Group();
    for (let i = 0; i < 500; i++) {
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const geometry = new THREE.BoxGeometry(0.2, 0.01, 2);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0.02, -i * 10);
      group.add(mesh);
    }
    return group;
  }, []);

  const postesRef = useRef();
  const postes = useMemo(() => {
    const group = new THREE.Group();
    const count = 100;
    for (let i = 0; i < count; i++) {
      const poste = posteModel.clone();
      poste.scale.set(0.2, 0.2, 0.2);
      poste.position.set(4, 0, -i * 30);
      poste.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      group.add(poste);
    }
    return group;
  }, [posteModel]);

  const postosRef = useRef();
  const postos = useMemo(() => {
    const group = new THREE.Group();
    const count = 30;
    for (let i = 0; i < count; i++) {
      const posto = postoModel.clone();
      posto.scale.set(0.1, 0.1, 0.1);
      const randomZ = -50 - Math.random() * 1800;
      posto.position.set(4, -0.01, randomZ);
      posto.userData.fuelStation = true;
      posto.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      group.add(posto);
    }
    return group;
  }, [postoModel]);

  useEffect(() => {
    if (postesRef.current) {
      scene.add(postesRef.current);
    } else {
      scene.add(postes);
    }
    if (postosRef.current) {
      scene.add(postosRef.current);
    } else {
      scene.add(postos);
    }
    return () => {
      if (postesRef.current) {
        scene.remove(postesRef.current);
      } else {
        scene.remove(postes);
      }
      if (postosRef.current) {
        scene.remove(postosRef.current);
      } else {
        scene.remove(postos);
      }
    };
  }, [scene, postes, postos]);

  return (
    <>
      <mesh ref={roadRef} receiveShadow rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <planeGeometry args={[8, 10000]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh ref={groundRef} receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.05, 0]}>
        <planeGeometry args={[200, 10000]} />
        <meshStandardMaterial color="#00710D" />
      </mesh>
      <group ref={centerLineRef}>
        {centerLines.children.map((child, idx) => (
          <primitive key={idx} object={child} />
        ))}
      </group>
    </>
  );
}
