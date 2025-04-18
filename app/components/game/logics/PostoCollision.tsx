'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MotoParts } from '../Moto';
import { useGameStore } from '../logics/useGameStore';

interface PostoCollisionProps {
  motoRef: React.RefObject<MotoParts | null>;
}

const collisionThreshold = 2; // Ajuste a distância para a colisão
const rechargeRate = 5;      // Unidades de fuel por segundo (ajuste conforme necessário)

const PostoCollision = ({ motoRef }: PostoCollisionProps) => {
  const { scene } = useThree();
  const lastRefuelTime = useRef(0);
  const isRefueling = useRef(false);
  const rechargeSound = useRef<HTMLAudioElement | null>(null);

  // Inicializar o áudio apenas no lado do cliente
  useEffect(() => {
    // Verificar se estamos no navegador
    if (typeof window !== 'undefined') {
      rechargeSound.current = new Audio('/audio/refuel.mp3');
    }
  }, []);

  useFrame((state, delta) => {
    if (!motoRef.current) return;
    const motoGroup = motoRef.current.motoGroup;
    if (!motoGroup) return;
    const motoPos = motoGroup.position;
    let colliding = false;

    // Percorre todos os objetos na cena
    scene.traverse((object) => {
      // Verifica se o objeto está marcado como POSTO (fuelStation)
      if (object.userData && object.userData.fuelStation === true) {
        const distance = object.position.distanceTo(motoPos);
        
        if (distance < collisionThreshold) {
          colliding = true;
          
          // Adicionar efeito visual ao posto quando estiver reabastecendo
          if (!isRefueling.current) {
            isRefueling.current = true;
            
            // Tocar som de reabastecimento apenas no cliente
            if (rechargeSound.current) {
              try {
                rechargeSound.current.currentTime = 0;
                rechargeSound.current.play().catch(e => console.log("Erro ao tocar som:", e));
              } catch (e) {
                console.log("Erro ao manipular áudio:", e);
              }
            }
            
            // Efeito visual - fazer o posto "pulsar"
            if (object instanceof THREE.Object3D) {
              const originalScale = object.scale.clone();
              const pulseAnimation = () => {
                const scale = 1 + Math.sin(Date.now() * 0.01) * 0.05;
                object.scale.set(
                  originalScale.x * scale,
                  originalScale.y * scale,
                  originalScale.z * scale
                );
                
                if (isRefueling.current) {
                  requestAnimationFrame(pulseAnimation);
                } else {
                  object.scale.copy(originalScale);
                }
              };
              pulseAnimation();
            }
          }
          
          // Recarrega o combustível usando a função do store
          const currentTime = state.clock.getElapsedTime();
          if (currentTime - lastRefuelTime.current > 0.1) { // Limitar a taxa de recarga
            useGameStore.getState().increaseFuel(rechargeRate * delta);
            lastRefuelTime.current = currentTime;
          }
        }
      }
    });

    if (!colliding && isRefueling.current) {
      isRefueling.current = false;
    }
  });

  return null;
};

export default PostoCollision;
