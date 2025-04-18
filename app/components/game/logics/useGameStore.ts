// useGameStore.ts
import { create } from 'zustand';

interface GameState {
  health: number;
  fuel: number;
  score: number;
  grauMeter: number; // medidor do grau, máximo de 7 agora
  speed: number;
  reduceHealth: (amount: number) => void;
  reduceFuel: (amount: number) => void;
  increaseFuel: (amount: number) => void;
  addScore: (points: number) => void;
  decreaseGrau: (amount: number) => void;
  increaseGrau: (amount: number) => void;
  setSpeed: (value: number) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  health: 100,
  fuel: 100,
  score: 0,
  grauMeter: 7, // máximo agora 7
  speed: 0,
  reduceHealth: (amount: number) =>
    set((state) => ({ health: Math.max(state.health - amount, 0) })),
  reduceFuel: (amount: number) =>
    set((state) => ({ fuel: Math.max(state.fuel - amount, 0) })),
  increaseFuel: (amount: number) =>
    set((state) => ({ fuel: Math.min(state.fuel + amount, 100) })),
  addScore: (points: number) =>
    set((state) => ({ score: state.score + points })),
  decreaseGrau: (amount: number) =>
    set((state) => ({ grauMeter: Math.max(state.grauMeter - amount, 0) })),
  increaseGrau: (amount: number) =>
    set((state) => ({ grauMeter: Math.min(state.grauMeter + amount, 7) })), // máximo 7
  setSpeed: (value: number) => set({ speed: value }),
  reset: () => set({ health: 100, fuel: 100, score: 0, grauMeter: 7, speed: 0 }),
}));
