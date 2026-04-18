import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { brainRegions, type BrainRegion } from "@/data/brainRegions";

interface RegionMeshProps {
  region: BrainRegion;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const RegionMesh = ({ region, isSelected, onSelect }: RegionMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;
    const target = isSelected ? 1.08 : hovered ? 1.04 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
  });

  const emissiveIntensity = isSelected ? 0.7 : hovered ? 0.35 : 0.1;
  const opacity = isSelected ? 0.95 : hovered ? 0.8 : 0.55;

  return (
    <mesh
      ref={meshRef}
      position={region.position}
      scale={region.size}
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
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={region.color}
        emissive={region.color}
        emissiveIntensity={emissiveIntensity}
        transparent
        opacity={opacity}
        roughness={0.4}
        metalness={0.1}
      />
      {(hovered || isSelected) && (
        <Html
          distanceFactor={8}
          position={[0, 1.2, 0]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div className="px-2 py-1 rounded-md bg-slate-950/90 border border-blue-400/40 text-blue-100 text-xs whitespace-nowrap shadow-lg backdrop-blur-sm">
            {region.label}
          </div>
        </Html>
      )}
    </mesh>
  );
};

const SkullOverlay = () => (
  <mesh>
    <sphereGeometry args={[2.1, 48, 48]} />
    <meshStandardMaterial
      color="#94a3b8"
      transparent
      opacity={0.06}
      wireframe
    />
  </mesh>
);

interface BrainCompass3DProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  fogDay?: boolean;
}

export const BrainCompass3D = ({ selectedId, onSelect, fogDay }: BrainCompass3DProps) => {
  return (
    <Canvas
      camera={{ position: [3.2, 1.6, 3.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 5, 5]} intensity={0.9} />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#3b82f6" />
      <pointLight position={[5, -3, 5]} intensity={0.3} color="#f59e0b" />

      <Suspense fallback={null}>
        <SkullOverlay />
        {brainRegions.map((region) => (
          <RegionMesh
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
        autoRotateSpeed={fogDay ? 0.3 : 0.8}
        minDistance={3}
        maxDistance={8}
        enablePan={false}
      />
    </Canvas>
  );
};
