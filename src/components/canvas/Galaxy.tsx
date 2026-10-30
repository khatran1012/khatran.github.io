import { useEffect, useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { JourneyMotion } from '../../data/architectureJourney';

export const RGB_COLORS = {
  light: ['#b85b0f', '#087342', '#244fc0'],
  dark: ['#ff842e', '#50efab', '#739eff'],
};

export function Galaxy({ theme }: { theme: 'light' | 'dark' }) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    let seed = 71;
    const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 1600; i++) {
      const radius = 15 + random() * 105;
      const angle = random() * Math.PI * 2;
      positions.push(Math.cos(angle) * radius, (random() - 0.5) * 100, -45 + Math.sin(angle) * radius);
      const brightness = 0.45 + random() * 0.55;
      colors.push(brightness * 0.85, brightness * 0.9, brightness);
    }
    return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)).setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <group>
    {[0, 1, 2].map(layer => <mesh key={layer} position={[-15 + layer * 18, 10 - layer * 8, -105 + layer * 27]} rotation={[0, 0, -0.38 + layer * 0.2]} renderOrder={-3 + layer}>
      <planeGeometry args={[220 - layer * 45, 120 - layer * 25]} />
      <shaderMaterial transparent depthWrite={false} uniforms={{ tint: { value: new THREE.Color(theme === 'light' ? ['#787bb8', '#75b3c1', '#a9a0cf'][layer] : ['#403c86', '#145773', '#77509a'][layer]) }, strength: { value: theme === 'light' ? 0.12 : 0.35 } }}
        vertexShader={`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
        fragmentShader={`varying vec2 vUv; uniform vec3 tint; uniform float strength;
          float noise(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          float cloud(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(noise(i),noise(i+vec2(1,0)),f.x),mix(noise(i+vec2(0,1)),noise(i+1.),f.x),f.y);}
          void main(){vec2 p=(vUv-.5)*2.; float band=exp(-pow((p.y+.22*sin(p.x*5.))*5.,2.));
          float dust=.5*cloud(p*5.)+.3*cloud(p*12.)+.2*cloud(p*27.);
          float fade=1.-smoothstep(.2,1.,length(p)); gl_FragColor=vec4(tint,band*dust*fade*strength);}`}/>
    </mesh>)}
    <points geometry={geometry}>
      <shaderMaterial transparent depthWrite={false} vertexColors uniforms={{ tint: { value: new THREE.Color(theme === 'light' ? '#506680' : '#d1e3ff') }, strength: { value: theme === 'light' ? 0.36 : 0.7 } }}
        vertexShader={`varying vec3 vColor; void main(){vColor=color; vec4 p=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*p;gl_PointSize=clamp(110./max(1.,-p.z),1.1,2.6);}`}
        fragmentShader={`varying vec3 vColor; uniform vec3 tint; uniform float strength; void main(){float d=length(gl_PointCoord-.5);float a=1.-smoothstep(.12,.5,d);gl_FragColor=vec4(tint*vColor,a*strength);}`} />
    </points>
  </group>;
}

function orbitPoint(radius: number, angle: number) {
  return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.48, Math.sin(angle) * radius * 0.55).applyAxisAngle(new THREE.Vector3(0, 0, 1), -0.18);
}
export const LOGIC_POSITIONS = [[0, 0, 0], orbitPoint(2.3, 3.8).toArray(), orbitPoint(1.45, 0.5).toArray()] as [number, number, number][];
const LOCATIONS = LOGIC_POSITIONS;
const IDS = ['state', 'effects', 'rules'];

// Shared linear texture: directional machining marks, not a painted color layer.
export function titaniumFinish() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#bcbcbc';
  context.fillRect(0, 0, 512, 512);
  let seed = 93;
  const random = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < 1800; i++) {
    const shade = Math.floor(145 + random() * 100);
    context.strokeStyle = `rgba(${shade},${shade},${shade},${0.15 + random() * 0.4})`;
    context.lineWidth = 0.5;
    const x = random() * 512;
    const y = random() * 512;
    context.beginPath(); context.moveTo(x, y);
    context.lineTo(x + 12 + random() * 140, y + random() * 0.8);
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = 4;
  return texture;
}

export function LogicSculpture({ theme, motion, reducedMotion, active, onInspect }: {
  theme: 'light' | 'dark'; motion: MutableRefObject<JourneyMotion>; reducedMotion: boolean; active: boolean;
  onInspect: (board: number, node: string) => void;
}) {
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const root = useRef<THREE.Group>(null);
  const finish = useMemo(titaniumFinish, []);
  useEffect(() => () => finish.dispose(), [finish]);
  const time = useRef(0);
  const paths = useMemo(() => [1.45, 2.3].map(radius => {
    const curve = new THREE.CatmullRomCurve3(Array.from({ length: 96 }, (_, i) => orbitPoint(radius, i / 96 * Math.PI * 2)), true);
    return { curve, geometry: new THREE.TubeGeometry(curve, 128, 0.009, 5, true) };
  }), []);
  useEffect(() => () => paths.forEach(p => p.geometry.dispose()), [paths]);
  useFrame((_, delta) => {
    if (!active || document.hidden || reducedMotion || !root.current?.parent?.visible) return;
    time.current += Math.min(delta, 0.05) * 0.075;
    paths.forEach(({ curve }, i) => {
      const packet = packets.current[i];
      if (packet) curve.getPoint((time.current / (i + 1) + motion.current.progress * 0.6 + i * 0.37) % 1, packet.position);
    });
  });
  const ink = theme === 'light' ? '#28406a' : '#d9e8ff';
  const colors = RGB_COLORS[theme];
  const metal = '#8c969d';
  const titanium = theme === 'light' ? '#485762' : '#46545f';
  return <group ref={root} rotation={[-0.12, -0.1, 0.025]}>
    {paths.map(({ geometry }, i) => <group key={i}>
      <mesh geometry={geometry}><meshBasicMaterial color={ink} transparent opacity={theme === 'light' ? 0.35 : 0.25} /></mesh>
      <mesh ref={node => { packets.current[i] = node; }} position={paths[i].curve.getPoint(i * 0.17 % 1)}>
        <sphereGeometry args={[0.09, 20, 12]} /><meshStandardMaterial color={colors[i + 1]} metalness={0.3} roughness={0.25} />
      </mesh>
    </group>)}
    {LOCATIONS.map((position, i) => <group key={IDS[i]} name={`module:${IDS[i]}`} position={position}
      onClick={e => { e.stopPropagation(); if (e.delta <= 5) onInspect(1, IDS[i]); }}
      onPointerOver={e => { e.stopPropagation(); motion.current.hoveredNode = IDS[i]; motion.current.interactionAt = performance.now(); (e.nativeEvent.target as HTMLElement).style.cursor = 'pointer'; }}
      onPointerOut={e => { motion.current.hoveredNode = null; (e.nativeEvent.target as HTMLElement).style.cursor = ''; }}>
      <mesh name={`node:${IDS[i]}`}>
        {i === 0 ? <icosahedronGeometry args={[0.58, 2]} /> : i === 1 ? <torusKnotGeometry args={[0.27, 0.085, 112, 12]} /> : <octahedronGeometry args={[0.43]} />}
        <meshPhysicalMaterial color={titanium} emissive="#071318" emissiveIntensity={0.06}
          metalness={0.88} roughness={i === 1 ? 0.23 : 0.3} roughnessMap={finish}
          bumpMap={finish} bumpScale={0.009} envMapIntensity={2.1}
          anisotropy={0.45} clearcoat={0.15} clearcoatRoughness={0.24} flatShading={i !== 1} />
      </mesh>
      <mesh rotation={[0.35, 0.2, 0]}>
        <torusGeometry args={[i === 0 ? 0.59 : 0.39, 0.012, 6, 64]} />
        <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={theme === 'light' ? 0.7 : 1.6} toneMapped={false} />
      </mesh>
      {i === 0 && <>
        <mesh rotation={[Math.PI / 2.5, 0.2, 0]}><torusGeometry args={[0.65, 0.035, 10, 96]} /><meshStandardMaterial color={metal} metalness={0.7} roughness={0.24} /></mesh>
        <mesh rotation={[0.2, Math.PI / 2, 0.1]}><torusGeometry args={[0.61, 0.018, 8, 80]} /><meshStandardMaterial color={metal} metalness={0.6} roughness={0.3} /></mesh>
      </>}
      {i === 2 && <mesh rotation={[0, 0, Math.PI / 4]}><torusGeometry args={[0.48, 0.025, 8, 4]} /><meshStandardMaterial color={metal} metalness={0.7} roughness={0.3} /></mesh>}
    </group>)}
  </group>;
}
