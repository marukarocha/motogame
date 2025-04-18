'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../logics/useGameStore';

const POINT_COUNT = 50;
const SPAWN_DISTANCE = 2000;

export default function GamePoints({ motoRef }) {
  const { scene } = useGLTF('/models/bag.glb');
  const pointsGroup = useRef<THREE.Group>(null);
  const collectedRef = useRef<Set<number>>(new Set());
  const addScore = useGameStore((state) => state.addScore);

  const audioBufferRef = useRef<THREE.AudioBuffer | null>(null);

  useEffect(() => {
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('/audio/point.mp3', (buffer) => {
      audioBufferRef.current = buffer;
    });
  }, []);

  const points = useMemo(() => {
    const group = new THREE.Group();
    for (let i = 0; i < POINT_COUNT; i++) {
      const bag = scene.clone();
      bag.scale.set(0.4, 0.4, 0.4);
      bag.position.set(
        (Math.random() - 0.5) * 6,
        0.1,
        -Math.random() * SPAWN_DISTANCE
      );

      // Apenas rotação inicial em Y
      bag.rotation.y = Math.random() * Math.PI;

      // Apenas rotação contínua no eixo Y
      bag.userData.rotationSpeed = new THREE.Vector3(0, (Math.random() * 0.02) + 0.01, 0);

      group.add(bag);
    }
    return group;
  }, [scene]);

  useEffect(() => {
    if (pointsGroup.current) {
      for (const point of points.children) {
        pointsGroup.current.add(point);
      }
    }
  }, [points]);

  useFrame(() => {
    if (!motoRef.current) return;
    const motoPos = motoRef.current.motoGroup.position;

    pointsGroup.current?.children.forEach((obj, index) => {
      const rot = obj.userData.rotationSpeed;
      if (rot) {
        obj.rotation.y += rot.y;
      }

      if (!collectedRef.current.has(index)) {
        const dist = obj.position.distanceTo(motoPos);
        if (dist < 1.2) {
          collectedRef.current.add(index);
          obj.visible = false;
          addScore(10);

          if (audioBufferRef.current) {
            const listener = new THREE.AudioListener();
            const sound = new THREE.Audio(listener);
            sound.setBuffer(audioBufferRef.current);
            sound.setVolume(0.5);
            sound.play();
          }
        }
      }
    });
  });

  return <group ref={pointsGroup} />;
}
