import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import LowPolyCharacter from './LowPolyCharacter';

const INK = '#26241f';
const RED = '#ed1b57';
const BLUE = '#2d1aff';
const MINT = '#6adca2';
const PAPER = '#fdf8ec';

/* Concentric rings emanating from below the character — flat print target */
function RingFloor() {
  const rings = [2.2, 3.4, 4.8, 6.4, 8.2, 10.2];
  return (
    <group position={[0, -1.14, 0]}>
      {/* ground disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[16, 48]} />
        <meshStandardMaterial color={PAPER} roughness={1} />
      </mesh>
      {rings.map((r, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[r, r + 0.06, 64]} />
          <meshBasicMaterial color={INK} transparent opacity={i % 2 === 0 ? 0.55 : 0.22} />
        </mesh>
      ))}
      {/* triad dashes on the outer ring */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + 0.5;
        const colors = [RED, BLUE, MINT];
        return (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[Math.cos(a) * 10.2, 0.001, -Math.sin(a) * 10.2]}
          >
            <ringGeometry args={[0.28, 0.42, 6]} />
            <meshBasicMaterial color={colors[i]} />
          </mesh>
        );
      })}
    </group>
  );
}

function Pedestal() {
  return (
    <group position={[0, -1.13, 0]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[1.5, 1.62, 0.18, 24]} />
        <meshStandardMaterial color="#efe8d3" roughness={0.9} flatShading />
      </mesh>
      {/* ink outline ring on top edge */}
      <mesh position={[0, 0.092, 0]}>
        <torusGeometry args={[1.5, 0.025, 6, 48]} />
        <meshBasicMaterial color={INK} />
      </mesh>
      <mesh position={[0, -0.09, 0]}>
        <torusGeometry args={[1.62, 0.02, 6, 48]} />
        <meshBasicMaterial color={INK} />
      </mesh>
      {/* tick marks around the rim */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 1.35, 0.095, Math.sin(a) * 1.35]}
            rotation={[-Math.PI / 2, 0, -a]}
          >
            <planeGeometry args={[0.05, 0.12]} />
            <meshBasicMaterial color={i % 8 === 0 ? RED : INK} />
          </mesh>
        );
      })}
    </group>
  );
}

/* Floating triad shapes — tetra, cube, icosahedron like tossed toy blocks */
function ToyBlocks() {
  const blocks: {
    pos: [number, number, number];
    color: string;
    size: number;
    geo: 'tetra' | 'box' | 'ico' | 'octa';
  }[] = [
    { pos: [-3.4, 1.6, -2.2], color: RED, size: 0.42, geo: 'tetra' },
    { pos: [3.6, 2.4, -2.6], color: BLUE, size: 0.4, geo: 'box' },
    { pos: [-2.6, 3.4, -3.6], color: MINT, size: 0.34, geo: 'ico' },
    { pos: [3.1, 0.9, -1.4], color: MINT, size: 0.26, geo: 'octa' },
    { pos: [-4.2, 2.6, -0.8], color: BLUE, size: 0.3, geo: 'tetra' },
    { pos: [4.4, 3.4, -4.2], color: RED, size: 0.5, geo: 'octa' },
  ];
  return (
    <>
      {blocks.map((b, i) => (
        <Float key={i} speed={1.4 + i * 0.25} rotationIntensity={1.2} floatIntensity={1.4}>
          <mesh position={b.pos}>
            {b.geo === 'tetra' && <tetrahedronGeometry args={[b.size]} />}
            {b.geo === 'box' && <boxGeometry args={[b.size, b.size, b.size]} />}
            {b.geo === 'ico' && <icosahedronGeometry args={[b.size]} />}
            {b.geo === 'octa' && <octahedronGeometry args={[b.size]} />}
            <meshStandardMaterial color={b.color} roughness={0.6} flatShading />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.8, 4.4], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[PAPER]} />
      <fog attach="fog" args={[PAPER, 11, 24]} />

      <ambientLight intensity={0.75} />
      <directionalLight
        position={[4, 7, 4]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 3, -3]} intensity={0.35} color="#ffd9b0" />

      <group position={[0, -1.0, 0]}>
        <LowPolyCharacter />
        <Pedestal />
        <RingFloor />
        <ContactShadows
          position={[0, -1.13, 0]}
          opacity={0.35}
          scale={6}
          blur={2}
          far={3}
          color="#26241f"
        />
      </group>

      <ToyBlocks />

      <OrbitControls
        enablePan={false}
        minDistance={2.2}
        maxDistance={8}
        maxPolarAngle={Math.PI / 1.9}
        target={[0, 0.35, 0]}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </Canvas>
  );
}
