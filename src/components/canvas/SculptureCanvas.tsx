import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Monolithic abstract architectural core forming from modular blocks
const ArchitecturalSculpture: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!rootGroupRef.current) return;

    if (!reducedMotion) {
      // Magnetic cursor tracking with smooth lerp
      const targetY = (state.pointer.x * Math.PI) / 6;
      const targetX = (-state.pointer.y * Math.PI) / 10 + 0.1;

      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.y,
        targetY,
        0.04
      );
      rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.x,
        targetX,
        0.04
      );

      // Slow orbital precession
      if (ringRef.current) {
        ringRef.current.rotation.z += 0.003;
        ringRef.current.rotation.x += 0.001;
      }

      // Breathing assembly pulse
      if (coreRef.current) {
        coreRef.current.rotation.y += 0.005;
      }
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]} scale={1.15}>
      {/* Central Monolithic Polyhedron */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <octahedronGeometry args={[1.35, 0]} />
        <meshPhysicalMaterial
          color="#161a1d"
          roughness={0.25}
          metalness={0.85}
          clearcoat={0.6}
          clearcoatRoughness={0.15}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe Outline of Core */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[1.36, 0]} />
        <meshBasicMaterial
          color="#32a895"
          wireframe={true}
          transparent={true}
          opacity={0.35}
        />
      </mesh>

      {/* Interlocking Structural Floating Slabs */}
      {/* Slab Top: Design & Surface */}
      <group position={[0, 1.45, 0]}>
        <mesh rotation={[0.2, 0.4, 0]}>
          <boxGeometry args={[1.8, 0.08, 1.8]} />
          <meshStandardMaterial color="#1a2024" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh rotation={[0.2, 0.4, 0]}>
          <boxGeometry args={[1.81, 0.09, 1.81]} />
          <meshBasicMaterial color="#32a895" wireframe={true} transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Slab Mid-Lower: Logic & State */}
      <group position={[0.4, -0.6, 0.2]}>
        <mesh rotation={[-0.15, 0.8, 0.1]}>
          <boxGeometry args={[1.5, 0.07, 1.5]} />
          <meshStandardMaterial color="#1f262a" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh rotation={[-0.15, 0.8, 0.1]}>
          <boxGeometry args={[1.51, 0.08, 1.51]} />
          <meshBasicMaterial color="#c47a53" wireframe={true} transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Slab Bottom: Persistence & Substrate */}
      <group position={[-0.2, -1.5, -0.1]}>
        <mesh rotation={[0.1, -0.5, -0.05]}>
          <boxGeometry args={[2.0, 0.08, 2.0]} />
          <meshStandardMaterial color="#15191c" roughness={0.4} metalness={0.9} />
        </mesh>
        <mesh rotation={[0.1, -0.5, -0.05]}>
          <boxGeometry args={[2.02, 0.09, 2.02]} />
          <meshBasicMaterial color="#32a895" wireframe={true} transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Architectural Dashed Construction Orbits */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[2.4, 2.42, 64]} />
          <meshBasicMaterial color="#32a895" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
          <ringGeometry args={[2.8, 2.82, 64]} />
          <meshBasicMaterial color="#c47a53" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Subtle Coordinate Crosshair Nodes */}
      {[
        [-1.6, 0.8, 0.5],
        [1.7, -0.9, -0.4],
        [0.2, 1.9, -0.8],
        [-0.8, -1.8, 0.9],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial color={idx % 2 === 0 ? '#32a895' : '#c47a53'} />
        </mesh>
      ))}

      {/* Architectural Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 4]} intensity={1.8} color="#f5f2eb" />
      <pointLight position={[-4, -3, -2]} intensity={1.2} color="#32a895" />
      <pointLight position={[3, -4, 3]} intensity={1.0} color="#c47a53" />
    </group>
  );
};

export const SculptureCanvas: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    // Test WebGL support safely
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '440px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Architectural Drafting Watermark Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(50, 168, 149, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Telemetry Coordinate Badges */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-tertiary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.2rem',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <span>COORD // 10.77°N, 106.69°E</span>
        <span style={{ color: 'var(--copper-patina)' }}>STRUCTURE // MONOLITHIC</span>
        <span>STATUS // FORMING</span>
      </div>

      {hasWebGL ? (
        <Canvas
          camera={{ position: [0, 0, 5.8], fov: 42 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <Float
              speed={reducedMotion ? 0 : 1.5}
              rotationIntensity={reducedMotion ? 0 : 0.3}
              floatIntensity={reducedMotion ? 0 : 0.5}
            >
              <ArchitecturalSculpture reducedMotion={reducedMotion} />
            </Float>
          </Suspense>
        </Canvas>
      ) : (
        /* Accessible 2D Architectural Monolith Fallback */
        <div
          style={{
            width: '260px',
            height: '260px',
            borderRadius: '16px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--copper-patina-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              border: '2px solid var(--copper-patina)',
              transform: 'rotate(45deg)',
              background: 'var(--copper-patina-subtle)',
            }}
          />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            [ARCHITECTURAL CORE]
          </div>
        </div>
      )}
    </div>
  );
};
