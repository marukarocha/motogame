'use client';

import { Canvas } from '@react-three/fiber';
import { useState, useRef, useMemo } from 'react';
import * as THREE from 'three';
import React from 'react';
import Moto, { MotoParts } from './Moto';
import Environment from './Environment';
import FollowCamera from './FollowCamera';
import Lights from './Lights';
import GameLogic from './logics/GameLogic';
import CarsDemage from './parts/CarsDemage';
import HUD from './parts/hud';
import GameOverScreen from './parts/GameOverScreen';
import PostoCollision from './logics/PostoCollision';
import { useGameStore } from './logics/useGameStore';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import MusicPlayer from '../MusicPlayer';
import GamePoints from './parts/GamePoints';
import DynamicBuildings from './parts/DynamicBuild';

export default function Game() {
  const motoRef = useRef<MotoParts>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleRestart = () => {
    if (!motoRef.current) return;
    const motoGroup = motoRef.current.motoGroup;
    if (!motoGroup) return;
    motoGroup.position.set(0, 5, 6.6);
    motoGroup.rotation.set(0, Math.PI, 0);
    useGameStore.getState().reset();
    setScore(0);
    setGameOver(false);
  };

  const motoGroupRef = useMemo(() => {
    return {
      get current() {
        return motoRef.current?.motoGroup ?? null;
      }
    } as React.RefObject<THREE.Group>;
  }, [motoRef.current?.motoGroup]);

  return (
    <>
      <Canvas shadows
       camera={{ position: [0, 2, 8], fov: 60, near: 0.1, far: 1000 }} // 👈 far deve ser maior que 500
       
       >
        <Lights />
        <Moto ref={motoRef} />
        <DynamicBuildings motoRef={motoRef} />

        <Environment />
        
        <FollowCamera targetRef={motoGroupRef} />
        <GameLogic motoRef={motoRef} />
        <CarsDemage motoRef={motoRef} paused={false} />
        <GamePoints motoRef={motoRef} />
        <PostoCollision motoRef={motoRef} />

        {/* Pós-processamento: brilho da lua */}
        <EffectComposer>
           <Bloom
            intensity={1.8}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.75}
          />
        </EffectComposer>
      </Canvas>
      <MusicPlayer />

      <HUD />
      {gameOver && <GameOverScreen onRestart={handleRestart} />}
    </>
  );
}
