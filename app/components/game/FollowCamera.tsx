'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GUI } from 'dat.gui';
import useControls from './logics/Controls';
import { setupMoon } from './moon';

interface FollowCameraProps {
  targetRef: React.RefObject<THREE.Group | null>;
}

const FollowCamera = ({ targetRef }: FollowCameraProps) => {
  const { camera, scene } = useThree();
  const followRef = useRef({ enabled: true });
  const moonRef = useRef<THREE.Group | null>(null);
  const [firstPerson, setFirstPerson] = useState(false);
  const controls = useControls();

  const offsetNormal = useRef({ x: -1.2, y: 1.5, z: -10 });
  const offsetGrau = useRef({ x: -2.5, y: 2.0, z: 1 });
  const offsetFirstPerson = useRef({ x: 0, y: 1.8, z: 0.5 });

  const smoothingRef = useRef({ 
    thirdPerson: 0.02, 
    firstPerson: 0.1,
    rotationFactor: 0.05,
    positionDamping: 0.5,
    rotationDamping: 0.5
  });

  const currentVelocity = useRef(new THREE.Vector3());
  const currentRotVelocity = useRef(new THREE.Quaternion());
  const lastTargetPosition = useRef(new THREE.Vector3());
  const lastTargetRotation = useRef(new THREE.Quaternion());
  const lastToggleState = useRef(false);

  useEffect(() => {
    const gui = new GUI({ width: 300 });
    gui.add(followRef.current, 'enabled').name('Follow Camera');
    gui.add({ firstPerson }, 'firstPerson')
      .onChange((value) => setFirstPerson(value))
      .name('First Person');

    const normalFolder = gui.addFolder('Offset Normal');
    normalFolder.add(offsetNormal.current, 'x', -10, 10).step(0.1);
    normalFolder.add(offsetNormal.current, 'y', -10, 10).step(0.1);
    normalFolder.add(offsetNormal.current, 'z', -10, 10).step(0.1);
    normalFolder.open();

    const grauFolder = gui.addFolder('Offset Grau');
    grauFolder.add(offsetGrau.current, 'x', -10, 10).step(0.1);
    grauFolder.add(offsetGrau.current, 'y', -10, 10).step(0.1);
    grauFolder.add(offsetGrau.current, 'z', -10, 10).step(0.1);
    grauFolder.open();

    const firstPersonFolder = gui.addFolder('Offset First Person');
    firstPersonFolder.add(offsetFirstPerson.current, 'x', -3, 3).step(0.1);
    firstPersonFolder.add(offsetFirstPerson.current, 'y', 0, 3).step(0.1);
    firstPersonFolder.add(offsetFirstPerson.current, 'z', -3, 3).step(0.1);
    firstPersonFolder.open();

    const smoothingFolder = gui.addFolder('Smoothing Parameters');
    smoothingFolder.add(smoothingRef.current, 'thirdPerson', 0.001, 0.1).step(0.001).name('Third Person Lerp');
    smoothingFolder.add(smoothingRef.current, 'firstPerson', 0.001, 0.3).step(0.001).name('First Person Lerp');
    smoothingFolder.add(smoothingRef.current, 'rotationFactor', 0.001, 0.2).step(0.001).name('Rotation Factor');
    smoothingFolder.add(smoothingRef.current, 'positionDamping', 0.5, 0.99).step(0.01).name('Position Damping');
    smoothingFolder.add(smoothingRef.current, 'rotationDamping', 0.5, 0.99).step(0.01).name('Rotation Damping');
    smoothingFolder.open();

    moonRef.current = setupMoon();
    scene.add(moonRef.current);

    return () => {
      gui.destroy();
      if (moonRef.current) scene.remove(moonRef.current);
    };
  }, [scene]);

  useFrame(() => {
    if (!targetRef.current || !followRef.current.enabled) return;

    if (controls.toggleCamera && !lastToggleState.current) {
      setFirstPerson(!firstPerson);
    }
    lastToggleState.current = controls.toggleCamera;

    const target = targetRef.current;
    const targetPosition = target.position.clone();
    const targetQuaternion = target.quaternion.clone();

    if (!lastTargetPosition.current.equals(targetPosition)) {
      lastTargetPosition.current.copy(targetPosition);
      lastTargetRotation.current.copy(targetQuaternion);
    }

    if (firstPerson) {
      const fpOffset = new THREE.Vector3(
        offsetFirstPerson.current.x,
        offsetFirstPerson.current.y,
        offsetFirstPerson.current.z
      );

      const worldOffset = fpOffset.clone().applyQuaternion(target.quaternion);
      const desiredPosition = targetPosition.clone().add(worldOffset);

      const posDiff = desiredPosition.clone().sub(camera.position);
      currentVelocity.current.add(posDiff.multiplyScalar(smoothingRef.current.firstPerson));
      currentVelocity.current.multiplyScalar(smoothingRef.current.positionDamping);
      camera.position.add(currentVelocity.current);

      const correctedRotation = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          0,
          target.rotation.y + Math.PI,
          0
        )
      );

      camera.quaternion.slerp(correctedRotation, smoothingRef.current.rotationFactor);
    } else {
      const isGrau = target.rotation.x > 0.3;
      const currentOffset = isGrau
        ? new THREE.Vector3(offsetGrau.current.x, offsetGrau.current.y, offsetGrau.current.z)
        : new THREE.Vector3(offsetNormal.current.x, offsetNormal.current.y, offsetNormal.current.z);

      const worldOffset = currentOffset.clone();
      worldOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), target.rotation.y);
      const desiredPosition = targetPosition.clone().add(worldOffset);

      camera.position.lerp(desiredPosition, smoothingRef.current.thirdPerson);
      camera.lookAt(targetPosition);
    }

    // 🌕 Manter lua sempre ao fundo da visão da câmera
    if (moonRef.current) {
      const distance = -1000;
      const direction = camera.getWorldDirection(new THREE.Vector3());
      const moonPosition = camera.position.clone().add(direction.multiplyScalar(-distance));
      moonRef.current.position.copy(moonPosition);
    }
  });

  return null;
};

export default FollowCamera;