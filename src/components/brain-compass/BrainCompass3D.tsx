import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { brainRegions, type BrainRegion } from "@/data/brainRegions";

// ---------- Procedural anatomical brain ----------
// Builds a high-poly, gyrified hemisphere using layered 3D noise displacement.
// Returns a BufferGeometry that visually reads as cortical tissue.

function hash(n: number) {
  return ((Math.sin(n) * 43758.5453123) % 1 + 1) % 1;
}
function noise3(x: number, y: number, z: number) {
  // Cheap value-noise — sufficient for cortical sulci look
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const fade = (t: number) => t * t * (3 - 2 * t);
  const u = fade(xf), v = fade(yf), w = fade(zf);
  const n = (i: number, j: number, k: number) =>
    hash(i * 374761393 + j * 668265263 + k * 1442695040);
  const c000 = n(xi, yi, zi), c100 = n(xi + 1, yi, zi);
  const c010 = n(xi, yi + 1, zi), c110 = n(xi + 1, yi + 1, zi);
  const c001 = n(xi, yi, zi + 1), c101 = n(xi + 1, yi, zi + 1);
  const c011 = n(xi, yi + 1, zi + 1), c111 = n(xi + 1, yi + 1, zi + 1);
  const x00 = c000 * (1 - u) + c100 * u;
  const x10 = c010 * (1 - u) + c110 * u;
  const x01 = c001 * (1 - u) + c101 * u;
  const x11 = c011 * (1 - u) + c111 * u;
  const y0 = x00 * (1 - v) + x10 * v;
  const y1 = x01 * (1 - v) + x11 * v;
  return y0 * (1 - w) + y1 * w;
}
function fbm(x: number, y: number, z: number, octaves = 4) {
  let amp = 0.5, freq = 1, sum = 0, norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise3(x * freq, y * freq, z * freq);
    norm += amp;
    amp *= 0.55;
    freq *= 2.05;
  }
  return sum / norm;
}

function buildHemisphereGeometry(side: 1 | -1) {
  // Base ellipsoid shaped like a cerebral hemisphere
  const geom = new THREE.SphereGeometry(1, 160, 120);
  // Stretch into anatomical proportions: anterior-posterior longest
  geom.scale(1.55, 1.15, 1.0); // x: lateral, y: vertical, z: AP
  const pos = geom.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    // Cut the medial face flat (so two hemispheres meet cleanly)
    const medial = side === 1 ? Math.max(0, -v.x) : Math.max(0, v.x);
    if (medial > 0) {
      v.x = side === 1 ? 0.02 : -0.02;
    }
    // Sulci/gyri: layered fbm noise, stronger on top, suppressed near medial wall
    const n = fbm(v.x * 4 + 11.1, v.y * 4 + 7.3, v.z * 4 + 3.9, 5);
    const ridges = Math.abs(n - 0.5) * 2; // sharp ridge pattern
    const cortical = (1 - ridges) * 0.06;
    // Suppress displacement near medial cut to keep clean seam
    const medialFade = THREE.MathUtils.smoothstep(Math.abs(v.x), 0.02, 0.18);
    const disp = cortical * medialFade;
    v.addScaledVector(v.clone().normalize(), disp);
    // Slight frontal lobe expansion + occipital taper for shape
    const frontal = THREE.MathUtils.smoothstep(v.z, 0.4, 1.4);
    v.x *= 1 + frontal * 0.04 * side;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geom.computeVertexNormals();
  return geom;
}

function buildCerebellumGeometry() {
  const geom = new THREE.SphereGeometry(1, 96, 72);
  geom.scale(1.0, 0.55, 0.7);
  const pos = geom.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    // Tight horizontal foliations
    const fol = Math.sin(v.y * 38) * 0.012;
    v.addScaledVector(v.clone().normalize(), fol);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geom.computeVertexNormals();
  return geom;
}

function BrainAnatomy() {
  const left = useMemo(() => buildHemisphereGeometry(1), []);
  const right = useMemo(() => buildHemisphereGeometry(-1), []);
  const cerebellum = useMemo(() => buildCerebellumGeometry(), []);

  const tissue = (
    <meshPhysicalMaterial
      color="#d8b8b0"
      roughness={0.85}
      clearcoat={0.25}
      clearcoatRoughness={0.7}
      sheen={0.4}
      sheenColor="#f4d4cc"
      transparent
      opacity={0.55}
    />
  );

  return (
    <group>
      {/* Left hemisphere */}
      <mesh geometry={left} position={[0.02, 0, 0]} castShadow receiveShadow>
        {tissue}
      </mesh>
      {/* Right hemisphere */}
      <mesh geometry={right} position={[-0.02, 0, 0]} castShadow receiveShadow>
        {tissue}
      </mesh>
      {/* Longitudinal fissure shadow */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.005, 0.6, 2.4]} />
        <meshBasicMaterial color="#3a1f1c" transparent opacity={0.35} />
      </mesh>
      {/* Cerebellum */}
      <mesh geometry={cerebellum} position={[0, -0.78, -0.85]} castShadow>
        <meshPhysicalMaterial
          color="#c89a90"
          roughness={0.75}
          clearcoat={0.2}
          transparent
          opacity={0.55}
        />
      </mesh>
      {/* Brainstem */}
      <mesh position={[0, -1.05, -0.45]}>
        <cylinderGeometry args={[0.15, 0.18, 0.55, 32]} />
        <meshPhysicalMaterial color="#b58a82" roughness={0.7} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// ---------- Region markers (overlaid on anatomy) ----------

interface RegionMarkerProps {
  region: BrainRegion;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const RegionMarker = ({ region, isSelected, onSelect }: RegionMarkerProps) => {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!ref.current) return;
    const target = isSelected ? 1.0 : hovered ? 0.85 : 0.7;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
    const m = ref.current.material as THREE.MeshStandardMaterial;
    if (m && m.emissiveIntensity !== undefined) {
      const pulse = isSelected
        ? 1.0 + Math.sin(state.clock.elapsedTime * 3) * 0.3
        : hovered
        ? 0.6
        : 0.25;
      m.emissiveIntensity = pulse;
    }
  });

  return (
    <group position={region.position}>
      <mesh
        ref={ref}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(region.id);
        }}
      >
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial
          color={region.color}
          emissive={region.color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.95}
          roughness={0.3}
        />
      </mesh>
      {/* Halo */}
      {(isSelected || hovered) && (
        <mesh>
          <ringGeometry args={[0.22, 0.28, 48]} />
          <meshBasicMaterial
            color={region.color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      {(hovered || isSelected) && (
        <Html
          distanceFactor={8}
          position={[0, 0.4, 0]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div className="px-2.5 py-1 rounded-md bg-slate-950/95 border border-blue-400/40 text-blue-100 text-xs whitespace-nowrap shadow-lg backdrop-blur-sm">
            {region.label}
          </div>
        </Html>
      )}
    </group>
  );
};

// ---------- Canvas ----------

interface BrainCompass3DProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  fogDay?: boolean;
}

export const BrainCompass3D = ({ selectedId, onSelect, fogDay }: BrainCompass3DProps) => {
  return (
    <Canvas
      camera={{ position: [3.6, 1.4, 3.6], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      shadows
    >
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 2, -3]} intensity={0.4} color="#7dd3fc" />
      <pointLight position={[0, -2, 4]} intensity={0.5} color="#f59e0b" />
      <hemisphereLight args={["#bcd4ff", "#1a0d0a", 0.3]} />

      <Suspense fallback={null}>
        <BrainAnatomy />
        {brainRegions.map((region) => (
          <RegionMarker
            key={region.id}
            region={region}
            isSelected={selectedId === region.id}
            onSelect={onSelect}
          />
        ))}
      </Suspense>

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        autoRotate={!selectedId}
        autoRotateSpeed={fogDay ? 0.25 : 0.6}
        minDistance={3}
        maxDistance={9}
        enablePan={false}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
};
