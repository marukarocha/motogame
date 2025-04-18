'use client';

import { useGLTF } from '@react-three/drei';
import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface MotoParts {
  motoGroup: THREE.Group;
  rodaDianteira: THREE.Object3D | null;
  rodaTraseira: THREE.Object3D | null;
  tampaBau: THREE.Object3D | null;
  boneco: THREE.Object3D | null;
  capacete: THREE.Object3D | null;
}

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const Moto = forwardRef<MotoParts>((props, ref) => {
  const motoRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/moto2.glb');

  useImperativeHandle(ref, () => ({
    motoGroup: motoRef.current as THREE.Group,
    rodaDianteira: scene.getObjectByName('Roda_dianteira') || null,
    rodaTraseira: scene.getObjectByName('Roda_traseira') || null,
    tampaBau: scene.getObjectByName('tampa_bau') || null,
    boneco: scene.getObjectByName('Boneco') || null,
    capacete: scene.getObjectByName('Capacete') || null,
  }));

  useEffect(() => {
    if (motoRef.current) {
      motoRef.current.add(scene);
      // Aplica valores iniciais
      motoRef.current.position.set(0, 0, 6.6);
      motoRef.current.rotation.set(0, degToRad(180), 0);
      motoRef.current.scale.setScalar(0.7);
    }
  }, [scene]);

  useFrame(() => {
    // Aqui a moto pode ser animada se necessário
  });

  return (
    <group ref={motoRef}>
      <primitive object={scene} />
    </group>
  );
});

Moto.displayName = 'Moto';

export default Moto;
