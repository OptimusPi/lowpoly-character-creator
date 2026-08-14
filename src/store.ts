import { create } from 'zustand';

export const SKIN_TONES = ['#f5d0a9', '#e8b48c', '#c98d5f', '#9c6b43', '#6f4a2e', '#8fd0a9'];
export const HAIR_COLORS = ['#2b2b2b', '#5a3a1e', '#a5692b', '#d9a441', '#e8e3d8', '#c0392b', '#7d3c98', '#2e86c1'];
export const OUTFIT_COLORS = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#ff6b9d', '#3d3d3d'];

export type HairStyle = 'none' | 'flat' | 'spiky' | 'mohawk' | 'bun' | 'twin';
export type Accessory = 'none' | 'cap' | 'glasses' | 'horns' | 'crown';
export type AnimationId = 'idle' | 'wave' | 'walk' | 'jump' | 'spin' | 'dance';

interface CreatorState {
  skin: string;
  hairColor: string;
  shirt: string;
  pants: string;
  shoes: string;
  hairStyle: HairStyle;
  accessory: Accessory;
  animation: AnimationId;
  name: string;
  set: (patch: Partial<CreatorState>) => void;
  randomize: () => void;
}

const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const HAIR_STYLES: HairStyle[] = ['none', 'flat', 'spiky', 'mohawk', 'bun', 'twin'];
const ACCESSORIES: Accessory[] = ['none', 'cap', 'glasses', 'horns', 'crown'];

export const useCreator = create<CreatorState>((set) => ({
  skin: SKIN_TONES[1],
  hairColor: HAIR_COLORS[1],
  shirt: OUTFIT_COLORS[4],
  pants: OUTFIT_COLORS[7],
  shoes: '#5b4a3a',
  hairStyle: 'spiky',
  accessory: 'none',
  animation: 'idle',
  name: 'HERO-01',
  set: (patch) => set(patch),
  randomize: () =>
    set({
      skin: pick(SKIN_TONES),
      hairColor: pick(HAIR_COLORS),
      shirt: pick(OUTFIT_COLORS),
      pants: pick(OUTFIT_COLORS),
      shoes: pick(OUTFIT_COLORS),
      hairStyle: pick(HAIR_STYLES),
      accessory: pick(ACCESSORIES),
    }),
}));
