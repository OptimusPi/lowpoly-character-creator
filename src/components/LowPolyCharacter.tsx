import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCreator } from '../store';

function Mat({ color, roughness = 0.9 }: { color: string; roughness?: number }) {
  return <meshStandardMaterial color={color} roughness={roughness} flatShading />;
}

export default function LowPolyCharacter() {
  const s = useCreator();

  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const anim = s.animation;

    // reset baseline
    const R = root.current, B = body.current, H = head.current;
    const AL = armL.current, AR = armR.current, LL = legL.current, LR = legR.current;
    if (!R || !B || !H || !AL || !AR || !LL || !LR) return;

    R.position.y = 0;
    R.rotation.y = 0;
    B.rotation.z = 0;
    B.position.y = 0;
    H.rotation.set(0, 0, 0);
    AL.rotation.set(0, 0, 0.12);
    AR.rotation.set(0, 0, -0.12);
    LL.rotation.x = 0;
    LR.rotation.x = 0;

    switch (anim) {
      case 'idle': {
        B.position.y = Math.sin(t * 2) * 0.03;
        H.rotation.y = Math.sin(t * 0.6) * 0.15;
        AL.rotation.z = 0.12 + Math.sin(t * 2) * 0.05;
        AR.rotation.z = -0.12 - Math.sin(t * 2) * 0.05;
        break;
      }
      case 'wave': {
        B.position.y = Math.sin(t * 2) * 0.02;
        H.rotation.z = Math.sin(t * 4) * 0.1;
        AR.rotation.z = -2.4 + Math.sin(t * 8) * 0.5;
        AL.rotation.z = 0.2;
        break;
      }
      case 'walk': {
        LL.rotation.x = Math.sin(t * 6) * 0.7;
        LR.rotation.x = -Math.sin(t * 6) * 0.7;
        AL.rotation.x = -Math.sin(t * 6) * 0.5;
        AR.rotation.x = Math.sin(t * 6) * 0.5;
        B.position.y = Math.abs(Math.sin(t * 6)) * 0.06;
        break;
      }
      case 'jump': {
        const ph = (t * 1.6) % 1;
        const h = Math.sin(ph * Math.PI) * 0.9;
        R.position.y = h;
        const stretch = 1 + h * 0.15;
        B.scale.set(1 / Math.sqrt(stretch), stretch, 1 / Math.sqrt(stretch));
        if (h < 0.05) B.scale.set(1, 1, 1);
        AL.rotation.z = 0.12 + h * 1.6;
        AR.rotation.z = -0.12 - h * 1.6;
        break;
      }
      case 'spin': {
        R.rotation.y = t * 3;
        R.position.y = Math.abs(Math.sin(t * 3)) * 0.15;
        AL.rotation.z = 1.2;
        AR.rotation.z = -1.2;
        break;
      }
      case 'dance': {
        B.position.y = Math.abs(Math.sin(t * 4)) * 0.1;
        B.rotation.z = Math.sin(t * 4) * 0.15;
        H.rotation.z = -Math.sin(t * 4) * 0.2;
        AL.rotation.z = 0.5 + Math.sin(t * 8) * 0.9;
        AR.rotation.z = -0.5 + Math.sin(t * 8 + Math.PI) * 0.9;
        LL.rotation.x = Math.max(0, Math.sin(t * 4)) * 0.5;
        LR.rotation.x = Math.max(0, -Math.sin(t * 4)) * 0.5;
        break;
      }
    }
  });

  const eyeWhite = '#ffffff';
  const pupil = '#1a1a2e';

  return (
    <group ref={root}>
      <group ref={body}>
        {/* ===== LEGS ===== */}
        <group position={[0.22, 0.75, 0]} ref={legL}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.32, 0.6, 0.36]} />
            <Mat color={s.pants} />
          </mesh>
          {/* shoe */}
          <mesh position={[0, -0.68, 0.06]} castShadow>
            <boxGeometry args={[0.36, 0.2, 0.5]} />
            <Mat color={s.shoes} />
          </mesh>
        </group>
        <group position={[-0.22, 0.75, 0]} ref={legR}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.32, 0.6, 0.36]} />
            <Mat color={s.pants} />
          </mesh>
          <mesh position={[0, -0.68, 0.06]} castShadow>
            <boxGeometry args={[0.36, 0.2, 0.5]} />
            <Mat color={s.shoes} />
          </mesh>
        </group>

        {/* ===== TORSO ===== */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[0.85, 0.85, 0.5]} />
          <Mat color={s.shirt} />
        </mesh>
        {/* belt */}
        <mesh position={[0, 0.86, 0]}>
          <boxGeometry args={[0.87, 0.1, 0.52]} />
          <Mat color="#3a2f28" />
        </mesh>

        {/* ===== ARMS ===== */}
        <group position={[0.55, 1.6, 0]} ref={armL}>
          <mesh position={[0, -0.35, 0]} castShadow>
            <boxGeometry args={[0.26, 0.7, 0.3]} />
            <Mat color={s.shirt} />
          </mesh>
          <mesh position={[0, -0.78, 0]} castShadow>
            <dodecahedronGeometry args={[0.16, 0]} />
            <Mat color={s.skin} />
          </mesh>
        </group>
        <group position={[-0.55, 1.6, 0]} ref={armR}>
          <mesh position={[0, -0.35, 0]} castShadow>
            <boxGeometry args={[0.26, 0.7, 0.3]} />
            <Mat color={s.shirt} />
          </mesh>
          <mesh position={[0, -0.78, 0]} castShadow>
            <dodecahedronGeometry args={[0.16, 0]} />
            <Mat color={s.skin} />
          </mesh>
        </group>

        {/* ===== HEAD ===== */}
        <group position={[0, 2.05, 0]} ref={head}>
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.62, 0.62]} />
            <Mat color={s.skin} />
          </mesh>
          {/* eyes */}
          <mesh position={[0.16, 0.05, 0.315]}>
            <boxGeometry args={[0.14, 0.16, 0.02]} />
            <Mat color={eyeWhite} roughness={0.4} />
          </mesh>
          <mesh position={[-0.16, 0.05, 0.315]}>
            <boxGeometry args={[0.14, 0.16, 0.02]} />
            <Mat color={eyeWhite} roughness={0.4} />
          </mesh>
          <mesh position={[0.16, 0.04, 0.33]}>
            <boxGeometry args={[0.06, 0.09, 0.02]} />
            <Mat color={pupil} roughness={0.3} />
          </mesh>
          <mesh position={[-0.16, 0.04, 0.33]}>
            <boxGeometry args={[0.06, 0.09, 0.02]} />
            <Mat color={pupil} roughness={0.3} />
          </mesh>
          {/* blush */}
          <mesh position={[0.28, -0.1, 0.312]}>
            <boxGeometry args={[0.08, 0.05, 0.01]} />
            <Mat color="#ff9d9d" />
          </mesh>
          <mesh position={[-0.28, -0.1, 0.312]}>
            <boxGeometry args={[0.08, 0.05, 0.01]} />
            <Mat color="#ff9d9d" />
          </mesh>
          {/* mouth */}
          <mesh position={[0, -0.15, 0.315]}>
            <boxGeometry args={[0.12, 0.04, 0.02]} />
            <Mat color="#7c4a3a" />
          </mesh>

          {/* ===== HAIR ===== */}
          {s.hairStyle === 'flat' && (
            <mesh position={[0, 0.36, 0]} castShadow>
              <boxGeometry args={[0.74, 0.18, 0.66]} />
              <Mat color={s.hairColor} />
            </mesh>
          )}
          {s.hairStyle === 'spiky' && (
            <group position={[0, 0.34, 0]}>
              {[-0.24, -0.08, 0.08, 0.24].map((x, i) => (
                <mesh key={i} position={[x, 0.08, 0]} rotation={[0, 0, (i - 1.5) * 0.25]} castShadow>
                  <coneGeometry args={[0.11, 0.3, 4]} />
                  <Mat color={s.hairColor} />
                </mesh>
              ))}
              <mesh position={[0, -0.04, 0]}>
                <boxGeometry args={[0.72, 0.12, 0.64]} />
                <Mat color={s.hairColor} />
              </mesh>
            </group>
          )}
          {s.hairStyle === 'mohawk' && (
            <group position={[0, 0.36, 0]}>
              {[-0.22, -0.11, 0, 0.11, 0.22].map((z, i) => (
                <mesh key={i} position={[0, 0.1, z]} castShadow>
                  <coneGeometry args={[0.09, 0.32, 4]} />
                  <Mat color={s.hairColor} />
                </mesh>
              ))}
            </group>
          )}
          {s.hairStyle === 'bun' && (
            <group>
              <mesh position={[0, 0.36, 0]} castShadow>
                <boxGeometry args={[0.74, 0.18, 0.66]} />
                <Mat color={s.hairColor} />
              </mesh>
              <mesh position={[0, 0.5, -0.15]} castShadow>
                <icosahedronGeometry args={[0.16, 0]} />
                <Mat color={s.hairColor} />
              </mesh>
            </group>
          )}
          {s.hairStyle === 'twin' && (
            <group>
              <mesh position={[0, 0.36, 0]} castShadow>
                <boxGeometry args={[0.74, 0.18, 0.66]} />
                <Mat color={s.hairColor} />
              </mesh>
              <mesh position={[0.42, 0.1, 0]} castShadow>
                <boxGeometry args={[0.14, 0.5, 0.2]} />
                <Mat color={s.hairColor} />
              </mesh>
              <mesh position={[-0.42, 0.1, 0]} castShadow>
                <boxGeometry args={[0.14, 0.5, 0.2]} />
                <Mat color={s.hairColor} />
              </mesh>
            </group>
          )}

          {/* ===== ACCESSORIES ===== */}
          {s.accessory === 'cap' && (
            <group position={[0, 0.34, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.4, 0.42, 0.22, 8]} />
                <Mat color={s.shirt} />
              </mesh>
              <mesh position={[0, -0.06, 0.45]}>
                <boxGeometry args={[0.5, 0.05, 0.3]} />
                <Mat color={s.shirt} />
              </mesh>
            </group>
          )}
          {s.accessory === 'glasses' && (
            <group position={[0, 0.05, 0.33]}>
              <mesh position={[0.16, 0, 0]}>
                <torusGeometry args={[0.11, 0.02, 4, 8]} />
                <Mat color="#222222" roughness={0.3} />
              </mesh>
              <mesh position={[-0.16, 0, 0]}>
                <torusGeometry args={[0.11, 0.02, 4, 8]} />
                <Mat color="#222222" roughness={0.3} />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.12, 0.03, 0.03]} />
                <Mat color="#222222" />
              </mesh>
            </group>
          )}
          {s.accessory === 'horns' && (
            <group>
              <mesh position={[0.3, 0.42, 0]} rotation={[0, 0, -0.4]} castShadow>
                <coneGeometry args={[0.08, 0.3, 4]} />
                <Mat color="#e8e3d8" />
              </mesh>
              <mesh position={[-0.3, 0.42, 0]} rotation={[0, 0, 0.4]} castShadow>
                <coneGeometry args={[0.08, 0.3, 4]} />
                <Mat color="#e8e3d8" />
              </mesh>
            </group>
          )}
          {s.accessory === 'crown' && (
            <group position={[0, 0.42, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.3, 0.34, 0.16, 6, 1, true]} />
                <Mat color="#f1c40f" roughness={0.3} />
              </mesh>
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const a = (i / 6) * Math.PI * 2;
                return (
                  <mesh key={i} position={[Math.cos(a) * 0.31, 0.13, Math.sin(a) * 0.31]}>
                    <coneGeometry args={[0.05, 0.14, 4]} />
                    <Mat color="#f1c40f" roughness={0.3} />
                  </mesh>
                );
              })}
            </group>
          )}
        </group>
      </group>
    </group>
  );
}
