import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// 3D Futuristic Laptop Model constructed procedurally with Three.js meshes
const FuturisticLaptop: React.FC<{ isMobile: boolean; reducedMotion: boolean }> = ({
  isMobile,
  reducedMotion,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const screenGlowRef = useRef<THREE.PointLight>(null);
  const codeLinesRef = useRef<THREE.Group>(null);

  // Mouse tilt & float animation
  useFrame((state) => {
    if (!groupRef.current) return;

    if (!reducedMotion) {
      // Smooth mouse rotation lerp
      const targetRotY = (state.pointer.x * Math.PI) / 7;
      const targetRotX = (-state.pointer.y * Math.PI) / 12 + 0.15;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        0.05
      );

      // Subtle breathing float
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08 - 0.2;
    }

    // Pulse screen glow light
    if (screenGlowRef.current) {
      screenGlowRef.current.intensity =
        1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }
  });

  return (
    <group ref={groupRef} scale={isMobile ? 0.72 : 1.05} position={[0, -0.2, 0]}>
      {/* LAPTOP BASE (Bottom Chassis) */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[3.2, 0.1, 2.2]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* Cyber edge glow trim on base */}
      <mesh position={[0, -0.05, 1.11]}>
        <boxGeometry args={[3.22, 0.02, 0.02]} />
        <meshBasicMaterial color="#00f5a0" />
      </mesh>

      {/* KEYBOARD RECESS */}
      <mesh position={[0, 0.005, -0.15]}>
        <boxGeometry args={[2.7, 0.01, 1.3]} />
        <meshStandardMaterial color="#050811" roughness={0.7} />
      </mesh>

      {/* KEYBOARD KEYS (Simulated glowing chiclet matrix) */}
      {[-0.5, -0.3, -0.1, 0.1, 0.3].map((z, rowIdx) => (
        <group key={rowIdx} position={[0, 0.02, z]}>
          {[-1.1, -0.7, -0.3, 0.1, 0.5, 0.9].map((x, colIdx) => (
            <mesh key={colIdx} position={[x, 0, 0]}>
              <boxGeometry args={[0.3, 0.02, 0.15]} />
              <meshStandardMaterial
                color="#1e293b"
                emissive="#00f5a0"
                emissiveIntensity={0.08}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* TRACKPAD */}
      <mesh position={[0, 0.006, 0.7]}>
        <boxGeometry args={[1.0, 0.005, 0.65]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      {/* Trackpad glowing border line */}
      <mesh position={[0, 0.01, 0.7]}>
        <boxGeometry args={[1.02, 0.002, 0.67]} />
        <meshBasicMaterial color="#3b82f6" wireframe />
      </mesh>

      {/* LAPTOP HINGE */}
      <mesh position={[0, 0.04, -1.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 2.9, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* LAPTOP SCREEN (Lid tilted backwards at ~105 deg) */}
      <group position={[0, 0.04, -1.05]} rotation={[-Math.PI / 8, 0, 0]}>
        {/* Lid Backing */}
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[3.2, 2.1, 0.08]} />
          <meshStandardMaterial
            color="#090d16"
            metalness={0.88}
            roughness={0.18}
          />
        </mesh>

        {/* Back Logo (KT Cyber Monogram glowing on lid back) */}
        <mesh position={[0, 1.05, -0.045]}>
          <circleGeometry args={[0.22, 32]} />
          <meshBasicMaterial color="#00f5a0" />
        </mesh>

        {/* SCREEN BEZEL & DISPLAY */}
        <mesh position={[0, 1.05, 0.045]}>
          <planeGeometry args={[3.0, 1.9]} />
          <meshBasicMaterial color="#020408" />
        </mesh>

        {/* GLOWING TERMINAL DISPLAY CONTENT */}
        <mesh position={[0, 1.05, 0.048]}>
          <planeGeometry args={[2.85, 1.75]} />
          <meshBasicMaterial color="#050a14" />
        </mesh>

        {/* Terminal Header Bar */}
        <mesh position={[0, 1.82, 0.05]}>
          <planeGeometry args={[2.85, 0.12]} />
          <meshBasicMaterial color="#0b1322" />
        </mesh>

        {/* Terminal window buttons (Red, Yellow, Green) */}
        <mesh position={[-1.25, 1.82, 0.052]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[-1.15, 1.82, 0.052]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[-1.05, 1.82, 0.052]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>

        {/* SIMULATED CODE LINES IN TERMINAL */}
        <group ref={codeLinesRef} position={[-1.2, 1.65, 0.052]}>
          {/* Prompt: khatran@fullstack-dev:~$ */}
          <mesh position={[0.45, 0, 0]}>
            <planeGeometry args={[0.9, 0.04]} />
            <meshBasicMaterial color="#00f5a0" />
          </mesh>

          {/* Code line 1: package main (Golang Gin IoT) */}
          <mesh position={[0.6, -0.12, 0]}>
            <planeGeometry args={[1.2, 0.035]} />
            <meshBasicMaterial color="#3b82f6" />
          </mesh>

          {/* Code line 2: mqtt.NewClient(&mqtt.ClientOptions{ ... }) */}
          <mesh position={[0.85, -0.24, 0]}>
            <planeGeometry args={[1.7, 0.035]} />
            <meshBasicMaterial color="#a78bfa" />
          </mesh>

          {/* Code line 3: redis.SetNX(ctx, "turnstile_lock", token) */}
          <mesh position={[0.75, -0.36, 0]}>
            <planeGeometry args={[1.5, 0.035]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          {/* Code line 4: const [state, setState] = useState<SystemState>() */}
          <mesh position={[0.95, -0.48, 0]}>
            <planeGeometry args={[1.9, 0.035]} />
            <meshBasicMaterial color="#f472b6" />
          </mesh>

          {/* Code line 5: <TurnstileGate status="ACTIVE_OFFLINE_SYNC" /> */}
          <mesh position={[0.8, -0.6, 0]}>
            <planeGeometry args={[1.6, 0.035]} />
            <meshBasicMaterial color="#34d399" />
          </mesh>

          {/* Code line 6: // 100% Turnstile Hardware Uptime Guaranteed */}
          <mesh position={[0.7, -0.72, 0]}>
            <planeGeometry args={[1.4, 0.03]} />
            <meshBasicMaterial color="#64748b" />
          </mesh>

          {/* Blinking Cursor */}
          <mesh position={[0.08, -0.84, 0]}>
            <planeGeometry args={[0.06, 0.05]} />
            <meshBasicMaterial color="#00f5a0" />
          </mesh>
        </group>

        {/* Screen glow light casting onto keyboard and viewer */}
        <pointLight
          ref={screenGlowRef}
          position={[0, 1.05, 0.6]}
          color="#00f5a0"
          intensity={1.2}
          distance={4}
        />
        <pointLight
          position={[0, 0.6, 0.4]}
          color="#3b82f6"
          intensity={0.8}
          distance={3}
        />
      </group>

      {/* FLOATING HOLOGRAPHIC TECH PILLS ORBITING THE LAPTOP */}
      {!reducedMotion && (
        <group>
          {/* React Hologram */}
          <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
            <mesh position={[-2.4, 0.8, 0.5]}>
              <boxGeometry args={[0.7, 0.25, 0.05]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive="#38bdf8"
                emissiveIntensity={0.4}
                roughness={0.2}
              />
            </mesh>
            {/* Cyan accent ring */}
            <mesh position={[-2.4, 0.8, 0.5]} rotation={[0.4, 0.6, 0]}>
              <torusGeometry args={[0.35, 0.015, 8, 32]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </Float>

          {/* Golang Microservices Hologram */}
          <Float speed={2.5} rotationIntensity={0.5} floatIntensity={0.8}>
            <mesh position={[2.3, 1.2, 0.2]}>
              <boxGeometry args={[0.75, 0.25, 0.05]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive="#00add8"
                emissiveIntensity={0.4}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[2.3, 1.2, 0.2]} rotation={[-0.4, 0.4, 0]}>
              <torusGeometry args={[0.38, 0.015, 8, 32]} />
              <meshBasicMaterial color="#00f5a0" />
            </mesh>
          </Float>

          {/* MQTT IoT Gateway Hologram */}
          <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh position={[1.9, -0.4, 1.1]}>
              <boxGeometry args={[0.8, 0.25, 0.05]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive="#a855f7"
                emissiveIntensity={0.4}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[1.9, -0.4, 1.1]} rotation={[0.2, -0.4, 0.5]}>
              <torusGeometry args={[0.36, 0.015, 8, 32]} />
              <meshBasicMaterial color="#a855f7" />
            </mesh>
          </Float>

          {/* PostgreSQL & Redis Integrity Hologram */}
          <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.7}>
            <mesh position={[-2.0, -0.3, 1.0]}>
              <boxGeometry args={[0.85, 0.25, 0.05]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive="#10b981"
                emissiveIntensity={0.4}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[-2.0, -0.3, 1.0]} rotation={[-0.2, 0.5, -0.3]}>
              <torusGeometry args={[0.4, 0.015, 8, 32]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
          </Float>
        </group>
      )}

      {/* Cyber Desk Surface Grid Plane beneath laptop */}
      <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial
          color="#040711"
          metalness={0.9}
          roughness={0.4}
        />
      </mesh>
      {/* Grid Wireframe on Desk */}
      <mesh position={[0, -0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 6, 20, 16]} />
        <meshBasicMaterial color="#00f5a0" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
};

export const WorkspaceCanvas: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);
    window.addEventListener('resize', checkViewport);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: isMobile ? '380px' : '520px',
        position: 'relative',
        cursor: 'grab',
      }}
      aria-label="Interactive 3D Developer Workspace"
    >
      <Canvas
        camera={{
          position: [0, 1.2, isMobile ? 4.8 : 3.8],
          fov: 45,
        }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Ambient & Directional Lights */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 6, 4]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-4, 3, -2]} intensity={0.6} color="#00f5a0" />
        <pointLight position={[4, 2, -2]} intensity={0.5} color="#3b82f6" />

        {/* 3D Laptop Model */}
        <FuturisticLaptop isMobile={isMobile} reducedMotion={reducedMotion} />
      </Canvas>

      {/* Subtle Hint HUD */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '16px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'none',
          fontFamily: "'Fira Code', monospace",
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#00f5a0',
            boxShadow: '0 0 8px #00f5a0',
          }}
        />
        <span>Interactive 3D • Drag / Move Mouse</span>
      </div>
    </div>
  );
};
