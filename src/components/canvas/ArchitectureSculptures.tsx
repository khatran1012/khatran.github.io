import { useEffect, useMemo, useRef } from 'react';
import type { MutableRefObject, ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { JOURNEY_NODES } from '../../data/architectureJourney';
import type { JourneyMotion, JourneyPoint } from '../../data/architectureJourney';
import { LOGIC_POSITIONS, titaniumFinish, RGB_COLORS } from './Galaxy';

export const SCULPTURE_POSITIONS: JourneyPoint[][] = [
  [[0, 0.25, 0], [-1.65, -0.65, 0.4], [1.65, -0.3, -0.2]],
  LOGIC_POSITIONS,
  [[0, 0.15, 0], [-1.7, -0.45, 0.4], [1.7, -0.2, -0.3]],
  [[0, 0.2, 0], [-1.65, -0.55, 0.45], [1.7, -0.25, -0.3]],
  [[-1.65, -0.4, 0.3], [0, 0.1, 0], [1.7, -0.15, -0.4]],
];

type Finish = { body: THREE.MeshPhysicalMaterial; trim: THREE.MeshStandardMaterial; led: THREE.MeshStandardMaterial; inset: THREE.MeshStandardMaterial };
function Box({ size, position = [0, 0, 0], material }: { size: JourneyPoint; position?: JourneyPoint; material: THREE.Material }) {
  const [x, y, z] = size;
  const geometry = useMemo(() => new RoundedBoxGeometry(x, y, z, 2, Math.min(x, y, z, 0.15) * 0.2), [x, y, z]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh position={position} geometry={geometry} material={material} />;
}
function Ring({ radius, material, position = [0, 0, 0], rotation = [0, 0, 0], width = 0.012 }: {
  radius: number; material: THREE.Material; position?: JourneyPoint; rotation?: JourneyPoint; width?: number;
}) {
  return <mesh position={position} rotation={rotation} material={material}><torusGeometry args={[radius, width, 8, 64]} /></mesh>;
}
function Disc({ radius, height, y, material }: { radius: number; height: number; y: number; material: THREE.Material }) {
  return <mesh position={[0, y, 0]} material={material}><cylinderGeometry args={[radius, radius, height, 48]} /></mesh>;
}

function Design({ node, f }: { node: number; f: Finish }) {
  if (node === 0) return <group rotation={[0.08, -0.25, 0]}>
    {[0, 1, 2].map(i => <group key={i} position={[i * 0.13, i * 0.2, -i * 0.32]}>
      <Box size={[1.35, 0.86, 0.12]} material={f.trim} />
      <Box size={[1.27, 0.78, 0.13]} material={f.body} />
      <Box size={[1.05, 0.025, 0.025]} position={[0, 0.29, 0.085]} material={f.led} />
      {[-0.32, 0.32].map(x => <Box key={x} size={[0.45, 0.35, 0.04]} position={[x, -0.03, 0.09]} material={f.inset} />)}
    </group>)}
    <Box size={[0.025, 0.5, 0.025]} position={[0, -0.62, 0]} material={f.trim} />
    <Box size={[0.85, 0.025, 0.025]} position={[0, -0.86, 0]} material={f.trim} />
    {[-0.43, 0.43].map(x => <Box key={x} size={[0.3, 0.2, 0.18]} position={[x, -0.93, 0]} material={f.body} />)}
  </group>;
  if (node === 1) return <group rotation={[-0.25, 0.2, 0]}>
    <Box size={[0.95, 0.65, 0.24]} material={f.body} />
    {[0.15, -0.05].map(y => <Box key={y} size={[0.7, 0.1, 0.04]} position={[0, y, 0.14]} material={f.trim} />)}
    <Box size={[0.27, 0.055, 0.05]} position={[0.22, -0.23, 0.15]} material={f.led} />
  </group>;
  return <group>
    <Ring radius={0.43} material={f.trim} width={0.055} />
    <Ring radius={0.48} material={f.led} />
    <Box size={[0.62, 0.23, 0.13]} position={[0, -0.02, 0]} material={f.body} />
    {[-0.19, 0, 0.19].map(x => <Box key={x} size={[0.12, 0.12, 0.03]} position={[x, 0, 0.09]} material={f.trim} />)}
  </group>;
}

function Bridge({ node, f }: { node: number; f: Finish }) {
  if (node === 0) return <group rotation={[0, -0.18, 0]}>
    {[-0.55, 0.55].map(x => <group key={x}>
      <Box size={[0.25, 1.45, 0.6]} position={[x, 0, 0]} material={f.body} />
      <Box size={[0.035, 1.32, 0.035]} position={[x, 0, 0.32]} material={f.led} />
    </group>)}
    {[-0.75, 0.75].map(y => <Box key={y} size={[1.4, 0.16, 0.64]} position={[0, y, 0]} material={f.trim} />)}
    {[-1, 1].map(direction => <group key={direction} position={[0, direction * 0.22, 0.12]} rotation={[0, 0, -direction * Math.PI / 2]}>
      <mesh material={f.led}><coneGeometry args={[0.1, 0.22, 4]} /></mesh>
      <Box size={[0.045, 0.34, 0.045]} position={[0, -0.24, 0]} material={f.trim} />
    </group>)}
  </group>;
  if (node === 1) return <group>
    <mesh material={f.body}><cylinderGeometry args={[0.42, 0.42, 0.65, 6]} /></mesh>
    <Ring radius={0.45} material={f.led} rotation={[Math.PI / 2, 0, 0]} />
    {[0, 1, 2].map(i => <mesh key={i} position={[Math.cos(i * Math.PI * 2 / 3) * 0.65, 0, Math.sin(i * Math.PI * 2 / 3) * 0.65]} material={f.trim}><sphereGeometry args={[0.1, 16, 10]} /></mesh>)}
  </group>;
  return <group rotation={[0.15, -0.4, 0]}>
    {[-1, 1].map(side => <group key={side} position={[side * 0.22, 0, 0]} rotation={[0, side * 0.35, 0]}>
      <Box size={[0.24, 0.8, 0.55]} material={f.body} />
      <Box size={[0.025, 0.65, 0.025]} position={[0, 0, 0.3]} material={f.led} />
    </group>)}
    <Box size={[0.38, 0.14, 0.18]} material={f.trim} />
  </group>;
}

function Persistence({ node, f }: { node: number; f: Finish }) {
  if (node === 0) return <group>
    {[-0.55, -0.15, 0.25, 0.65].map(y => <group key={y}>
      <Disc radius={0.62} height={0.27} y={y} material={f.body} />
      <Disc radius={0.64} height={0.045} y={y + 0.13} material={f.trim} />
      <Ring radius={0.625} position={[0, y - 0.06, 0]} rotation={[Math.PI / 2, 0, 0]} material={f.led} />
    </group>)}
    <Box size={[0.16, 1.35, 0.13]} position={[0, 0.1, 0.62]} material={f.trim} />
    <Box size={[0.035, 0.25, 0.04]} position={[0, 0.1, 0.7]} material={f.led} />
  </group>;
  if (node === 1) return <group rotation={[0, -0.3, 0]}>
    {[-0.3, 0, 0.3].map(y => <group key={y}>
      <Box size={[0.8, 0.18, 0.65]} position={[0, y, 0]} material={f.body} />
      <Box size={[0.63, 0.025, 0.03]} position={[0, y, 0.34]} material={f.led} />
    </group>)}
  </group>;
  return <group>
    <Box size={[0.95, 0.08, 0.36]} position={[0, -0.3, 0]} material={f.trim} />
    {[-0.3, 0, 0.3].map((x, i) => <group key={x} position={[x, i * 0.1 - 0.04, 0]}>
      <Box size={[0.22, 0.32, 0.25]} material={f.body} />
      <Box size={[0.14, 0.025, 0.03]} position={[0, 0.08, 0.14]} material={f.led} />
    </group>)}
  </group>;
}

function System({ node, f, rotor }: { node: number; f: Finish; rotor: MutableRefObject<THREE.Group | null> }) {
  if (node === 0) return <group rotation={[0, -0.2, 0]}>
    <Box size={[0.9, 0.55, 0.7]} material={f.body} />
    {[-0.28, -0.14, 0, 0.14, 0.28].map(x => <Box key={x} size={[0.055, 0.1, 0.58]} position={[x, 0.32, 0]} material={f.trim} />)}
    <Box size={[0.57, 0.03, 0.04]} position={[0, -0.12, 0.37]} material={f.led} />
  </group>;
  if (node === 1) return <group rotation={[0, -0.3, 0]}>
    <Box size={[1.5, 0.12, 0.85]} position={[0, -0.8, 0]} material={f.trim} />
    {[-0.58, 0.58].map(x => <group key={x} position={[x, 0, 0]}>
      <Box size={[0.28, 1.5, 0.65]} material={f.body} />
      <Box size={[0.3, 0.1, 0.67]} position={[0, 0.7, 0]} material={f.trim} />
      <Box size={[0.025, 1.3, 0.025]} position={[0.13, 0, 0.34]} material={f.led} />
      <group position={[0, 0.84, 0.1]} rotation={[-0.35, 0, 0]}>
        <Box size={[0.22, 0.3, 0.12]} material={f.body} />
        <Box size={[0.14, 0.16, 0.025]} position={[0, 0.03, 0.07]} material={f.led} />
      </group>
    </group>)}
    <group ref={rotor} position={[-0.37, -0.05, 0.14]} rotation={[0, 0, 0.3]}>
      <mesh material={f.body}><sphereGeometry args={[0.14, 24, 16]} /></mesh>
      {[0, 1, 2].map(i => <group key={i} rotation={[0, 0, i * Math.PI * 2 / 3]}>
        <Box size={[0.065, 0.55, 0.065]} position={[0, 0.28, 0]} material={f.trim} />
      </group>)}
    </group>
  </group>;
  return <group>
    <Box size={[0.6, 0.45, 0.5]} material={f.body} />
    <Ring radius={0.48} material={f.trim} rotation={[0.3, 0.4, 0]} width={0.035} />
    <Ring radius={0.54} material={f.led} rotation={[0.3, 0.4, 0]} />
    <Box size={[0.03, 0.4, 0.03]} position={[0, 0.4, 0]} material={f.trim} />
  </group>;
}

export function ArchitectureSculpture({ index, theme, motion, active, reducedMotion, onInspect }: {
  index: number; theme: 'light' | 'dark'; motion: MutableRefObject<JourneyMotion>; active: boolean; reducedMotion: boolean;
  onInspect: (board: number, node: string) => void;
}) {
  const rotor = useRef<THREE.Group>(null);
  const satellite = useRef<THREE.Mesh>(null);
  const root = useRef<THREE.Group>(null);
  const time = useRef(0);
  const orbit = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(Array.from({ length: 96 }, (_, i) => {
      const angle = i / 96 * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * 2.45, Math.sin(angle) * 0.8 - 0.05, Math.sin(angle) * 0.85 - 0.3);
    }), true);
    return new THREE.TubeGeometry(curve, 96, 0.007, 5, true);
  }, []);
  useEffect(() => () => orbit.dispose(), [orbit]);
  const texture = useMemo(titaniumFinish, []);
  useEffect(() => () => texture.dispose(), [texture]);
  const f = useMemo(() => {
    return {
      texture,
      body: new THREE.MeshPhysicalMaterial({ color: theme === 'light' ? '#485762' : '#46545f', metalness: 0.88, roughness: 0.32, roughnessMap: texture, bumpMap: texture, bumpScale: 0.008, envMapIntensity: 2, clearcoat: 0.2, clearcoatRoughness: 0.24 }),
      trim: new THREE.MeshStandardMaterial({ color: '#93999c', metalness: 0.95, roughness: 0.21, envMapIntensity: 1.6 }),
      leds: RGB_COLORS[theme].map(color => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: theme === 'light' ? 0.7 : 1.6, toneMapped: false })),
      inset: new THREE.MeshStandardMaterial({ color: '#080f17', metalness: 0.35, roughness: 0.24 }),
    };
  }, [theme, texture]);
  useEffect(() => () => { f.body.dispose(); f.trim.dispose(); f.leds.forEach(material => material.dispose()); f.inset.dispose(); }, [f]);
  useFrame((_, delta) => {
    if (!active || document.hidden || !root.current?.parent?.visible) return;
    f.leds.forEach((material, i) => {
      const selected = motion.current.selectedNode === JOURNEY_NODES[index][i].id || motion.current.hoveredNode === JOURNEY_NODES[index][i].id;
      material.emissiveIntensity = (theme === 'light' ? 0.7 : 1.6) * (selected ? 2 : 1);
    });
    if (reducedMotion) return;
    time.current += Math.min(delta, 0.05) * 0.25;
    const angle = time.current + motion.current.progress * 2;
    satellite.current?.position.set(Math.cos(angle) * 2.45, Math.sin(angle) * 0.8 - 0.05, Math.sin(angle) * 0.85 - 0.3);
    if (rotor.current) rotor.current.rotation.z = 0.3 + motion.current.progress * Math.PI * 2;
  });
  const ink = theme === 'light' ? '#21334c' : '#d1deeb';
  return <group ref={root} rotation={[-0.12, index % 2 ? -0.1 : 0.1, index % 2 ? 0.025 : -0.025]}>
    <mesh geometry={orbit}><meshBasicMaterial color={ink} transparent opacity={0.24} /></mesh>
    <mesh ref={satellite} position={[2.45, -0.05, -0.3]} material={f.leds[0]}><sphereGeometry args={[0.045, 12, 8]} /></mesh>
    {JOURNEY_NODES[index].map((node, i) => {
      const nodeFinish = { ...f, led: f.leds[i] };
      let content: ReactNode;
      if (index === 0) content = <Design node={i} f={nodeFinish} />;
      else if (index === 2) content = <Bridge node={i} f={nodeFinish} />;
      else if (index === 3) content = <Persistence node={i} f={nodeFinish} />;
      else content = <System node={i} f={nodeFinish} rotor={rotor} />;
      return <group key={node.id} name={`module:${node.id}`} position={SCULPTURE_POSITIONS[index][i]}
        onClick={e => { e.stopPropagation(); if (e.delta <= 5) onInspect(index, node.id); }}
        onPointerOver={e => { e.stopPropagation(); motion.current.hoveredNode = node.id; motion.current.interactionAt = performance.now(); (e.nativeEvent.target as HTMLElement).style.cursor = 'pointer'; }}
        onPointerOut={e => { motion.current.hoveredNode = null; (e.nativeEvent.target as HTMLElement).style.cursor = ''; }}>
        {content}
      </group>;
    })}
  </group>;
}
