# Low Poly Forge

An interactive 3D low-poly character creator for web games. Built with React Three Fiber, wrapped in a flat paper-print UI with an RGB triad accent system — no gradients, no glow, just ink outlines and hard shadows.

## Features

- **Real-time 3D character** — chunky low-poly geometry, flat shading, squash-and-stretch
- **Full customization** — skin tone, hair color, 6 hair styles, shirt / pants / shoes, 4 accessories (cap, glasses, horns, crown)
- **6 animations** — idle, wave, walk, jump, spin, dance
- **Randomize** — one click, instant combos
- **Mobile-first** — bottom-sheet editor + floating action button on phones, side panel on desktop
- **Orbit + zoom** — mouse drag / scroll, touch drag / pinch

## Stack

- React 19 + TypeScript + Vite
- three.js, @react-three/fiber, @react-three/drei
- zustand (state), Tailwind CSS
- Fonts: Unbounded (display) + Work Sans (body)

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build to dist/
npm run preview  # serve the build
```

## Project layout

```
src/
  main.tsx                  entry
  App.tsx                   layout + HUD
  store.ts                  character config (zustand)
  components/
    Scene.tsx               canvas, lights, pedestal, ring floor, toy blocks
    LowPolyCharacter.tsx    procedural character + animation state machine
    CreatorPanel.tsx        editor UI (desktop panel / mobile bottom sheet)
```
