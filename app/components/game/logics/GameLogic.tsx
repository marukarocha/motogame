'use client';

import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import * as THREE from 'three';
import useControls from '../logics/Controls';
import { MotoParts } from '../Moto';
import { useGameStore } from '../logics/useGameStore';

interface GameLogicProps {
  motoRef: React.RefObject<MotoParts | null>;
}

// Parâmetros para a velocidade interna (em unidades internas que variam de 0 a 10)
const maxSpeed = 2;           // Velocidade máxima interna (representa 80 km/h)
const maxReverseSpeed = 2;     // Velocidade máxima em ré
const acceleration = 20;       // Aceleração normal
const deceleration = 10;       // Desaceleração
const lateralSpeed = 5;        // Velocidade lateral
const grauForce = 0.6;         // Força base do grau (empinar)
const boostAcceleration = 40;  // Aceleração extra no grau

let currentSpeed = 0;          // Velocidade interna (0 a 10)
let elapsedTime = 0;           // Tempo para animações

const consumptionRate = 0.3;       // Consumo de combustível
const grauConsumptionRate = 1;     // Consumo do medidor do grau
const grauRechargeRate = 0.4;      // Recarrega o medidor do grau
const minSpeedForGrau = 0.5;       // Velocidade mínima para permitir o boost do grau
const minGrauToActivate = 0.8;     // Mínimo do medidor para ativar o grau (20% do máximo, se máximo é 7)

// Fator de conversão para exibição no HUD (se 10 unidades internas = 80 km/h, fator = 8)
const conversionFactor = 8;

// Limita a velocidade com boost para 120 km/h (valor interno correspondente: 120 / conversionFactor = 15)
const boostMaxDisplaySpeed = 120;

const GameLogic = ({ motoRef }: GameLogicProps) => {
  const keys = useControls();

  // Captura os setters do store uma única vez (referências estáveis)
  const increaseGrauFn = useGameStore((state) => state.increaseGrau);
  const decreaseGrauFn = useGameStore((state) => state.decreaseGrau);
  const reduceFuelFn = useGameStore((state) => state.reduceFuel);
  const setSpeedFn = useGameStore((state) => state.setSpeed);

  useFrame((state, delta) => {
    if (!motoRef.current) return;
    const { motoGroup, rodaDianteira, rodaTraseira, tampaBau } = motoRef.current;
    if (!motoGroup) return;

    elapsedTime += delta;
    const isGrauAtivo = keys.space;

    // Obtemos os valores atuais de fuel e do medidor do grau diretamente do store
    const fuelAtual = useGameStore.getState().fuel;
    const grauAtual = useGameStore.getState().grauMeter;

    // Se não houver combustível, força a desaceleração
    if (fuelAtual <= 0) {
      if (currentSpeed > 0) {
        currentSpeed -= deceleration * delta;
        currentSpeed = Math.max(currentSpeed, 0);
      }
    } else {
      // Se houver combustível:
      if (isGrauAtivo && currentSpeed > minSpeedForGrau && grauAtual >= minGrauToActivate) {
        // Aplica boost extra durante o grau
        currentSpeed += boostAcceleration * 1.5 * delta;
        // Limita a velocidade com boost (em valor interno, que deve corresponder à velocidade máxima de 120 km/h)
        if (currentSpeed * conversionFactor > boostMaxDisplaySpeed) {
          currentSpeed = boostMaxDisplaySpeed / conversionFactor;
        }
        decreaseGrauFn(grauConsumptionRate * delta);
      } else {
        if (keys.forward) {
          currentSpeed += acceleration * delta;
        } else if (keys.backward) {
          // Para recuo: desaceleração até zero e depois aceleração negativa
          if (currentSpeed > 0) {
            currentSpeed -= deceleration * delta;
            if (currentSpeed < 0) currentSpeed = 0;
          } else {
            currentSpeed -= acceleration * delta;
          }
        } else {
          if (currentSpeed > 0) {
            currentSpeed -= deceleration * delta;
            currentSpeed = Math.max(currentSpeed, 0);
          } else if (currentSpeed < 0) {
            currentSpeed += deceleration * delta;
            currentSpeed = Math.min(currentSpeed, 0);
          }
        }
        // Recarrega o medidor se a moto estiver se movendo
        if (currentSpeed > 0) {
          increaseGrauFn(grauRechargeRate * delta);
        }
      }
    }

    // Limitar a velocidade interna sem boost (para a aceleração normal, máxima 100 km/h)
    if (currentSpeed > 0) {
      currentSpeed = Math.min(currentSpeed, maxSpeed);
    } else {
      currentSpeed = Math.max(currentSpeed, -maxReverseSpeed);
    }

    // Atualiza a posição da moto usando a velocidade convertida para "movimentação real"
    // Aqui, multiplicamos o valor interno pela escala de conversão para simular a distância percorrida
    const movementSpeed = currentSpeed * conversionFactor * delta;
    motoGroup.position.z -= movementSpeed;
    if (keys.left) {
      motoGroup.position.x -= lateralSpeed * delta;
    }
    if (keys.right) {
      motoGroup.position.x += lateralSpeed * delta;
    }

    // Inclinação lateral (lean)
    let targetLean = 0;
    if (keys.left) targetLean = -0.3;
    else if (keys.right) targetLean = 0.3;
    motoGroup.rotation.z = THREE.MathUtils.lerp(motoGroup.rotation.z, targetLean, 0.1);

    // Grau (empinar)
    if (isGrauAtivo && currentSpeed > minSpeedForGrau && grauAtual >= minGrauToActivate) {
      motoGroup.rotation.x = THREE.MathUtils.lerp(motoGroup.rotation.x, grauForce, 0.1);
    } else {
      motoGroup.rotation.x = THREE.MathUtils.lerp(motoGroup.rotation.x, 0, 0.1);
    }

    // Giro das rodas
    if (rodaDianteira && rodaTraseira) {
      const rotationSpeed = currentSpeed * 4;
      rodaDianteira.rotation.x -= rotationSpeed * delta;
      rodaTraseira.rotation.x -= rotationSpeed * delta;
    }

    // Animação do baú
    if (tampaBau) {
      if (isGrauAtivo && currentSpeed > minSpeedForGrau && grauAtual >= minGrauToActivate) {
        tampaBau.rotation.x = THREE.MathUtils.lerp(tampaBau.rotation.x, THREE.MathUtils.degToRad(30), 0.1);
        tampaBau.rotation.z = Math.sin(elapsedTime * 20) * 0.1;
      } else {
        tampaBau.rotation.x = THREE.MathUtils.lerp(tampaBau.rotation.x, 0, 0.1);
        tampaBau.rotation.z = THREE.MathUtils.lerp(tampaBau.rotation.z, 0, 0.1);
      }
    }

    // Consumo de combustível: se avançando e houver fuel
    if (currentSpeed > 0 && fuelAtual > 0) {
      const fuelConsumed = consumptionRate * currentSpeed * delta;
      useGameStore.getState().reduceFuel(fuelConsumed);
    }
    
    // Atualiza a velocidade (em km/h) no store para o HUD: convertemos currentSpeed interno para km/h
    const displaySpeed = currentSpeed * conversionFactor;
    setSpeedFn(displaySpeed);
  });

  return null;
};

export default GameLogic;
