import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { brainRegions, type BrainRegion, type RegionCategory } from "@/data/brainRegions";

// ---------- Procedural anatomical brain ----------
// Layered value-noise gives convincing cortical sulci/gyri without external assets.

function hash(n: number) {
  return ((Math.sin(n) * 43758.5453123) % 1 + 1) % 1;
}
function noise3(x: number, y: number, z: number) {
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
function fbm(x: number, y: number, z: number, octaves = 6) {
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
  const geom = new THREE.SphereGeometry(1, 200, 140);
  // Anatomical proportions: AP > lateral > vertical
  geom.scale(1.0, 1.1, 1.45);
  const pos = geom.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // Flat medial wall
    if ((side === 1 && v.x < 0) || (side === -1 && v.x > 0)) {
      v.x = side === 1 ? 0.015 : -0.015;
    }

    // Sharp ridge pattern: sulci/gyri
    const n1 = fbm(v.x * 5.5 + 11.1, v.y * 5.5 + 7.3, v.z * 5.5 + 3.9, 6);
    const n2 = fbm(v.x * 11 + 41.1, v.y * 11 + 17.3, v.z * 11 + 23.9, 4);
    const ridge = Math.abs(n1 - 0.5) * 2; // sharp
    const fine = Math.abs(n2 - 0.5) * 2;
    const cortical = -((1 - ridge) * 0.07 + (1 - fine) * 0.02);

    // Suppress displacement near medial cut so the seam is clean
    const medialFade = THREE.MathUtils.smoothstep(Math.abs(v.x), 0.02, 0.22);
    const disp = cortical * medialFade;

    v.addScaledVector(v.clone().normalize(), disp);

    // Frontal pole bulge + occipital pole taper for true brain silhouette
    const frontal = THREE.MathUtils.smoothstep(v.z, 0.5, 1.5);
    const occip = THREE.MathUtils.smoothstep(-v.z, 0.6, 1.4);
    v.y *= 1 + frontal * 0.04 - occip * 0.05;
    v.x *= 1 + frontal * 0.02 * side;

    // Temporal pole drop on the lateral-inferior surface
    const lateralInferior =
      THREE.MathUtils.smoothstep(Math.abs(v.x), 0.5, 1.0) *
      THREE.MathUtils.smoothstep(-v.y, 0.0, 0.6) *
      THREE.MathUtils.smoothstep(v.z, -0.2, 0.8);
    v.y -= lateralInferior * 0.08;

    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geom.computeVertexNormals();
  return geom;
}

function buildCerebellumGeometry() {
  const geom = new THREE.SphereGeometry(1, 128, 96);
  geom.scale(1.15, 0.55, 0.8);
  const pos = geom.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    // Tight horizontal foliations
    const fol = Math.sin(v.y * 44) * 0.014;
    // Vermis dip in the middle
    const vermis = -Math.exp(-v.x * v.x * 80) * 0.04;
    v.addScaledVector(v.clone().normalize(), fol + vermis);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geom.computeVertexNormals();
  return geom;
}

// ---------- Brain anatomy meshes ----------

interface BrainAnatomyProps {
  deepView: boolean;
}

function BrainAnatomy({ deepView }: BrainAnatomyProps) {
  const left = useMemo(() => buildHemisphereGeometry(1), []);
  const right = useMemo(() => buildHemisphereGeometry(-1), []);
  const cerebellum = useMemo(() => buildCerebellumGeometry(), []);

  // In deep view, fade cortex significantly to reveal subcortical markers
  const cortexOpacity = deepView ? 0.18 : 0.62;
  const transparent = true;

  return (
    <group rotation={[0, 0, 0]}>
      {/* Right hemisphere (positive X — anatomical right) */}
      <mesh geometry={left} position={[0, 0, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#dcb6ad"
          roughness={0.78}
          clearcoat={0.35}
          clearcoatRoughness={0.55}
          sheen={0.5}
          sheenColor="#f6d2c8"
          transparent={transparent}
          opacity={cortexOpacity}
          depthWrite={!deepView}
        />
      </mesh>
      {/* Left hemisphere */}
      <mesh geometry={right} position={[0, 0, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#dcb6ad"
          roughness={0.78}
          clearcoat={0.35}
          clearcoatRoughness={0.55}
          sheen={0.5}
          sheenColor="#f6d2c8"
          transparent={transparent}
          opacity={cortexOpacity}
          depthWrite={!deepView}
        />
      </mesh>
      {/* Longitudinal fissure shadow */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.006, 0.7, 2.6]} />
        <meshBasicMaterial color="#3a1f1c" transparent opacity={deepView ? 0.15 : 0.4} />
      </mesh>
      {/* Cerebellum */}
      <mesh geometry={cerebellum} position={[0, -0.85, -0.95]} castShadow>
        <meshPhysicalMaterial
          color="#c89a90"
          roughness={0.7}
          clearcoat={0.25}
          transparent
          opacity={deepView ? 0.3 : 0.7}
          depthWrite={!deepView}
        />
      </mesh>
      {/* Brainstem */}
      <mesh position={[0, -1.05, -0.55]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.6, 32]} />
        <meshPhysicalMaterial
          color="#b58a82"
          roughness={0.65}
          transparent
          opacity={deepView ? 0.45 : 0.7}
        />
      </mesh>
      {/* Subtle ambient halo (replaces skull) */}
      <mesh>
        <sphereGeometry args={[1.85, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.025} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// ---------- Region markers ----------

export type AffectedSeverity = "mild" | "moderate" | "severe" | "unknown";
export interface AffectedHighlight {
  severity: AffectedSeverity;
  source?: string | null;
}

const SEVERITY_COLOR: Record<AffectedSeverity, string> = {
  mild: "#34d399",      // emerald
  moderate: "#fbbf24",  // amber
  severe: "#f43f5e",    // rose
  unknown: "#94a3b8",   // slate
};

interface AffectedRingProps {
  radius: number;
  color: string;
}

const AffectedRing = ({ radius, color }: AffectedRingProps) => {
  const inner = useRef<THREE.Mesh>(null);
  const outer = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 2.4) * 0.18;
    if (inner.current) {
      inner.current.scale.setScalar(pulse);
      const m = inner.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.55 + Math.sin(t * 2.4) * 0.2;
    }
    if (outer.current) {
      outer.current.scale.setScalar(1 + Math.sin(t * 2.4 + 0.9) * 0.28);
      const m = outer.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.28 + Math.sin(t * 2.4 + 0.9) * 0.18;
      outer.current.rotation.z = t * 0.4;
    }
  });
  return (
    <group renderOrder={4}>
      <mesh ref={inner}>
        <ringGeometry args={[radius * 1.55, radius * 1.85, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={outer}>
        <ringGeometry args={[radius * 2.0, radius * 2.25, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

interface RegionMarkerProps {
  region: BrainRegion;
  isSelected: boolean;
  isDimmed: boolean;
  deepView: boolean;
  affected?: AffectedHighlight | null;
  onSelect: (id: string) => void;
}

const RegionMarker = ({ region, isSelected, isDimmed, deepView, affected, onSelect }: RegionMarkerProps) => {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Hide deep markers when not in deep view (unless selected)
  const visible = region.deep ? deepView || isSelected : true;
  const radius = (region.size?.[0] ?? 0.15) * (deepView && region.deep ? 0.85 : 1);

  useFrame((state) => {
    if (!ref.current) return;
    const baseScale = isDimmed ? 0.55 : 1.0;
    const target = (isSelected ? 1.25 : hovered ? 1.05 : 0.85) * baseScale;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
    const m = ref.current.material as THREE.MeshStandardMaterial;
    if (m && m.emissiveIntensity !== undefined) {
      const pulse = isSelected
        ? 1.1 + Math.sin(state.clock.elapsedTime * 3) * 0.35
        : hovered
        ? 0.7
        : isDimmed
        ? 0.15
        : 0.35;
      m.emissiveIntensity = pulse;
      m.opacity = isDimmed ? 0.5 : 0.95;
    }
  });

  if (!visible) return null;

  const affectedColor = affected ? SEVERITY_COLOR[affected.severity] : null;

  return (
    <group position={region.position}>
      {affectedColor && <AffectedRing radius={radius} color={affectedColor} />}
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
        renderOrder={2}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={region.color}
          emissive={region.color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.95}
          roughness={0.3}
          depthTest={!region.deep || deepView}
        />
      </mesh>
      {(isSelected || hovered) && (
        <mesh renderOrder={3}>
          <ringGeometry args={[radius * 1.35, radius * 1.7, 48]} />
          <meshBasicMaterial
            color={region.color}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            depthTest={false}
          />
        </mesh>
      )}
      {(hovered || isSelected) && (
        <Html
          distanceFactor={8}
          position={[0, radius + 0.15, 0]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div className="px-2.5 py-1 rounded-md bg-slate-950/95 border border-blue-400/40 text-blue-100 text-xs whitespace-nowrap shadow-lg backdrop-blur-sm flex items-center gap-1.5">
            {affectedColor && (
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: affectedColor, boxShadow: `0 0 6px ${affectedColor}` }}
              />
            )}
            {region.shortLabel || region.label}
            {affected && (
              <span className="opacity-70 capitalize">· {affected.severity}</span>
            )}
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
  deepView: boolean;
  categoryFilter: RegionCategory | "all";
  affectedMap?: Record<string, AffectedHighlight>;
}

export const BrainCompass3D = ({
  selectedId,
  onSelect,
  fogDay,
  deepView,
  categoryFilter,
  affectedMap,
}: BrainCompass3DProps) => {
  return (
    <Canvas
      camera={{ position: [3.8, 1.4, 3.8], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      shadows
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 2, -3]} intensity={0.45} color="#7dd3fc" />
      <pointLight position={[0, -2, 4]} intensity={0.55} color="#f59e0b" />
      <hemisphereLight args={["#bcd4ff", "#1a0d0a", 0.35]} />

      <Suspense fallback={null}>
        <BrainAnatomy deepView={deepView} />
        {brainRegions.map((region) => {
          const inFilter = categoryFilter === "all" || region.category === categoryFilter;
          const isDimmed = !inFilter && selectedId !== region.id;
          const affected = affectedMap?.[region.id] ?? null;
          return (
            <RegionMarker
              key={region.id}
              region={region}
              isSelected={selectedId === region.id}
              isDimmed={isDimmed}
              deepView={deepView}
              affected={affected}
              onSelect={onSelect}
            />
          );
        })}
      </Suspense>

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        autoRotate={!selectedId}
        autoRotateSpeed={fogDay ? 0.2 : 0.5}
        minDistance={3}
        maxDistance={9}
        enablePan={false}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
};
