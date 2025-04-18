'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Lights = () => {
  const omniRef = useRef<THREE.AmbientLight>(null);
  const spotRef = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    const { GUI } = require('dat.gui');
  
    const gui = new GUI();
    const lightSettings = {
      omniIntensity: 0.5,
      spotIntensity: 1.0,
    };
  
    gui.add(lightSettings, 'omniIntensity', 0, 2).onChange((value: number) => {
      if (omniRef.current) omniRef.current.intensity = value;
    });
  
    gui.add(lightSettings, 'spotIntensity', 0, 5).onChange((value: number) => {
      if (spotRef.current) spotRef.current.intensity = value;
    });
  
    return () => {
      gui.destroy();
    };
  }, []);
  

  return (
    <>
      <ambientLight ref={omniRef} intensity={0.5} />
      <spotLight
        ref={spotRef}
        position={[0, 5, 5]}
        angle={0.5}
        penumbra={0.5}
        castShadow
        intensity={0.1}
      />
    </>
  );
};

export default Lights;
