// CarsDemage.tsx
'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MotoParts } from '../Moto';
import { useGameStore } from '../logics/useGameStore';

interface CarsDemageProps {
  motoRef: React.RefObject<MotoParts | null>;
  paused: boolean;
}

const MAX_CARS = 40;
const SPAWN_INTERVAL = 100;
const ROAD_WIDTH = 3.5;

export default function CarsDemage({ motoRef, paused }: CarsDemageProps) {
  const carsGroupRef = useRef<THREE.Group>(null);
  const frameCount = useRef(0);
  const collisionHandled = useRef(false);
  const damagePerCollision = 20;

  const reduceHealth = useGameStore((state) => state.reduceHealth);

  const { scene: car1 } = useGLTF('/models/cars/car1.glb');
  const { scene: car2 } = useGLTF('/models/cars/car2.glb');
  const { scene: car3 } = useGLTF('/models/cars/car3.glb');

  const carModels = useMemo(() => [car1, car2, car3], [car1, car2, car3]);
  const cars = useMemo(() => [], []);

  const spawnCar = () => {
    const model = carModels[Math.floor(Math.random() * carModels.length)].clone();
    model.scale.set(1.5, 1.5, 1.5);
    model.position.set(
      (Math.random() - 0.5) * ROAD_WIDTH * 2, // mais distribuído
      0,
      motoRef.current?.motoGroup.position.z - 200 || -200
    );
    model.rotation.y = Math.PI;
    model.userData.speed = 12 + Math.random() * 8; // mais rápido
    cars.push(model);
    carsGroupRef.current?.add(model);
  };

  useFrame((_, delta) => {
    if (!carsGroupRef.current || !motoRef.current) return;
    const motoGroup = motoRef.current.motoGroup;
    const motoZ = motoGroup.position.z;

    frameCount.current++;
    if (frameCount.current % SPAWN_INTERVAL === 0 && cars.length < MAX_CARS) {
      spawnCar();
    }

    for (let i = cars.length - 1; i >= 0; i--) {
      const car = cars[i];
      car.position.z += car.userData.speed * delta;

      if (car.position.z > motoZ + 40) {
        carsGroupRef.current.remove(car);
        cars.splice(i, 1);
      } else {
        const distance = car.position.distanceTo(motoGroup.position);
        if (distance < 1.5 && !collisionHandled.current && !paused) {
          collisionHandled.current = true;
          console.log('Colisão detectada. Damage:', damagePerCollision);
          reduceHealth(damagePerCollision);
          setTimeout(() => {
            collisionHandled.current = false;
          }, 500);
        }
      }
    }
  });

  return <group ref={carsGroupRef} />;
}
