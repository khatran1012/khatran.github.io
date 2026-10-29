import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EXHIBITION_LAYERS } from '../../data/cvData';
import { ASSEMBLED_POSITIONS, BOARD_POSITIONS, JOURNEY_CONNECTIONS, JOURNEY_NODES } from '../../data/architectureJourney';
import type { JourneyMotion, JourneyPoint } from '../../data/architectureJourney';

interface SceneProps {
  motion: MutableRefObject<JourneyMotion>;
  wake: MutableRefObject<() => void>;
  active: boolean;
  reducedMotion: boolean;
  theme: 'light' | 'dark';
  onInspect: (board: number, node: string) => void;
  onReady: () => void;
  onUnavailable: () => void;
}

const BOARD_ROTATIONS: JourneyPoint[] = BOARD_POSITIONS.map((_, index) => [-0.12, index % 2 ? -0.1 : 0.1, index % 2 ? 0.025 : -0.025]);
const CAMERA_STOPS: JourneyPoint[] = [[13, 8, 13], [-2.7, 1.05, 5.8], [2.6, 1.3, 0.95], [-2.5, 0.9, -3.85], [2.6, 1.2, -8.65], [9, 6, 14]];
const LOOK_STOPS: JourneyPoint[] = [[0, 0, -8], [-2.8, 0, 0], [2.8, 0.35, -4.8], [-2.8, -0.2, -9.6], [2.8, 0.15, -14.4], [0, 0, -3.5]];
const PCB_EXTRUSION = { depth: 0.14, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.035, bevelThickness: 0.025, curveSegments: 4 };

function labelTexture(title: string, subtitle: string, small = false) {
  const canvas = document.createElement('canvas');
  canvas.width = small ? 256 : 512;
  canvas.height = small ? 128 : 256;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Architecture labels could not be created');
  context.fillStyle = small ? '#172723' : '#dce4df';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.textAlign = 'center';
  context.fillStyle = small ? '#e6f4ed' : '#172a27';
  context.font = `600 ${small ? 33 : title.length > 9 ? 42 : 56}px "Space Grotesk", sans-serif`;
  context.fillText(title, canvas.width / 2, small ? 77 : 128);
  if (!small) {
    context.font = '18px "Fira Code", monospace';
    context.fillText('KT / SOFTWARE ARCHITECTURE', 256, 49);
    context.font = '21px "Fira Code", monospace';
    context.fillText(subtitle, 256, 188);
    context.strokeStyle = '#8a9f95';
    context.strokeRect(12, 12, 488, 232);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function PCB({ index, motion, onInspect }: Pick<SceneProps, 'motion' | 'onInspect'> & { index: number }) {
  const layer = EXHIBITION_LAYERS[index];
  const pins = useRef<THREE.InstancedMesh>(null);
  const nodes = JOURNEY_NODES[index];
  const textures = useMemo(() => [labelTexture(layer.slabLabel, layer.chipCaption), ...nodes.map((node) => labelTexture(node.label, '', true))], [layer, nodes]);
  useEffect(() => () => textures.forEach((texture) => texture.dispose()), [textures]);
  const shape = useMemo(() => {
    const path = new THREE.Shape();
    path.moveTo(-1.9, -1.3);
    path.lineTo(1.9, -1.3); path.quadraticCurveTo(2, -1.3, 2, -1.2);
    path.lineTo(2, 1.2); path.quadraticCurveTo(2, 1.3, 1.9, 1.3);
    path.lineTo(-1.9, 1.3); path.quadraticCurveTo(-2, 1.3, -2, 1.2);
    path.lineTo(-2, -1.2); path.quadraticCurveTo(-2, -1.3, -1.9, -1.3);
    return path;
  }, []);
  const traces = useMemo(() => {
    const points: number[] = [];
    const wire = (coordinates: number[][]) => {
      for (let i = 1; i < coordinates.length; i++) points.push(...coordinates[i - 1], 0.17, ...coordinates[i], 0.17);
    };
    nodes.forEach(({ position: [x, y] }) => wire([[x, y], [x * 0.55, y], [x * 0.55, 0.05], [0.1, 0.05]]));
    for (let i = 0; i < 10; i++) {
      const x = -1.65 + i * 0.35;
      wire([[x, 1.14], [x, 0.97], [x + 0.12, 0.85], [x + 0.12, 0.7]]);
      wire([[x, -1.14], [x, -0.98], [x - 0.1, -0.83], [x - 0.1, -0.72]]);
    }
    return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  }, [nodes]);
  useLayoutEffect(() => {
    if (!pins.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 96; i++) {
      const side = Math.floor(i / 16);
      const along = (i % 16 - 7.5) * 0.2;
      dummy.position.set(side < 2 ? along : side === 2 ? -1.82 : 1.82, side < 2 ? side === 0 ? -1.13 : 1.13 : along * 0.65, 0.18);
      dummy.scale.set(side < 2 ? 0.08 : 0.14, side < 2 ? 0.14 : 0.06, 0.07);
      if (i >= 64) {
        const chipSide = Math.floor((i - 64) / 8);
        const inset = (i % 8 - 3.5) * 0.18;
        dummy.position.set(chipSide < 2 ? 0.1 + inset : chipSide === 2 ? -0.78 : 0.98, chipSide < 2 ? chipSide === 0 ? -0.51 : 0.61 : 0.05 + inset * 0.6, 0.17);
        dummy.scale.set(chipSide < 2 ? 0.055 : 0.15, chipSide < 2 ? 0.15 : 0.04, 0.045);
      }
      dummy.updateMatrix();
      pins.current.setMatrixAt(i, dummy.matrix);
    }
    pins.current.instanceMatrix.needsUpdate = true;
  }, []);
  const hover = (node: string | null, element: HTMLElement) => {
    motion.current.hoveredNode = node;
    motion.current.interactionAt = performance.now();
    element.style.cursor = node ? 'pointer' : '';
  };
  return (
    <group rotation={BOARD_ROTATIONS[index]}>
      <mesh position={[0, 0, -0.07]}>
        <extrudeGeometry args={[shape, PCB_EXTRUSION]} />
        <meshStandardMaterial color="#071f18" metalness={0.18} roughness={0.7} envMapIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[3.9, 2.5, 0.025]} />
        <meshStandardMaterial color="#ba9260" metalness={0.7} roughness={0.35} />
      </mesh>
      <lineSegments geometry={traces}>
        <lineBasicMaterial color="#c29a58" toneMapped={false} />
      </lineSegments>
      <instancedMesh ref={pins} args={[undefined, undefined, 96]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#b18b4f" metalness={0.85} roughness={0.28} envMapIntensity={0.7} />
      </instancedMesh>
      {[-1, 1].flatMap((x) => [-1, 1].map((y) => (
        <mesh key={`${x}-${y}`} position={[x * 1.75, y * 1.03, 0.12]}>
          <torusGeometry args={[0.08, 0.025, 5, 12]} />
          <meshStandardMaterial color="#d5bd88" metalness={0.7} roughness={0.3} />
        </mesh>
      )))}
      <mesh position={[0.1, 0.05, 0.19]}>
        <boxGeometry args={[1.62, 1, 0.23]} />
        <meshStandardMaterial color="#18201f" metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[0.1, 0.05, 0.31]}>
        <planeGeometry args={[1.45, 0.83]} />
        <meshBasicMaterial map={textures[0]} toneMapped={false} />
      </mesh>
      <mesh position={[0, -1.21, 0.18]}>
        <boxGeometry args={[1.6, 0.2, 0.22]} />
        <meshStandardMaterial color="#202927" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0.2, 0.96, 0.17]}>
        <boxGeometry args={[1.45, 0.22, 0.14]} />
        <meshStandardMaterial color="#19241e" metalness={0.4} roughness={0.35} />
      </mesh>
      {Array.from({ length: 7 }, (_, item) => (
        <mesh key={item} position={[-1.5 + item * 0.46, -0.96, 0.18]}>
          <boxGeometry args={[0.19, 0.12, 0.12]} />
          <meshStandardMaterial color={item % 2 ? '#777c71' : '#282f2d'} metalness={0.3} roughness={0.5} />
        </mesh>
      ))}
      {nodes.map((node, nodeIndex) => (
        <group key={node.id} position={[...node.position, 0.26]}
          onPointerOver={(event) => { event.stopPropagation(); hover(node.id, event.nativeEvent.target as HTMLElement); }}
          onPointerOut={(event) => { hover(null, event.nativeEvent.target as HTMLElement); }}
          onClick={(event) => { event.stopPropagation(); if (event.delta <= 5) onInspect(index, node.id); }}>
          <mesh>
            <boxGeometry args={[0.58, 0.4, 0.2]} />
            <meshStandardMaterial color="#202b28" metalness={0.45} roughness={0.32} />
          </mesh>
          <mesh position={[0, 0, 0.105]}>
            <planeGeometry args={[0.52, 0.3]} />
            <meshBasicMaterial map={textures[nodeIndex + 1]} />
          </mesh>
          <mesh position={[0, 0.28, 0.025]} name={`node:${node.id}`}>
            <sphereGeometry args={[0.055, 10, 6]} />
            <meshStandardMaterial color={layer.color} emissive={layer.color} emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function port(board: number, node: number, assembled: boolean) {
  const position = JOURNEY_NODES[board][node].position;
  return new THREE.Vector3(position[0], position[1] + 0.28, 0.285)
    .applyEuler(new THREE.Euler(...BOARD_ROTATIONS[board]))
    .add(new THREE.Vector3(...(assembled ? ASSEMBLED_POSITIONS[board] : BOARD_POSITIONS[board])));
}

function signalCurve(from: number, fromNode: number, to: number, toNode: number, assembled: boolean) {
  const start = port(from, fromNode, assembled);
  const end = port(to, toNode, assembled);
  return new THREE.CatmullRomCurve3([start, start.clone().add(new THREE.Vector3(0, 0.8, -1.3)), end.clone().add(new THREE.Vector3(0, 0.8, 1.3)), end], false, 'centripetal');
}

function HardwareWorld({ motion, wake, active, reducedMotion, theme, onInspect, onReady }: SceneProps) {
  const { camera, scene, gl, invalidate, size } = useThree();
  const assembly = useRef<THREE.Group>(null);
  const boards = useRef<(THREE.Group | null)[]>([]);
  const trails = useRef<(THREE.Mesh | null)[]>([]);
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const progress = useRef(motion.current.progress);
  const velocity = useRef(0);
  const look = useRef(new THREE.Vector3(...LOOK_STOPS[0]));
  const signalTime = useRef(0);
  const scratch = useMemo(() => ({ camera: new THREE.Vector3(), look: new THREE.Vector3(), start: new THREE.Vector3(), end: new THREE.Vector3(), color: new THREE.Color(), mood: new THREE.Color() }), []);
  const signals = useMemo(() => JOURNEY_CONNECTIONS.map((connection) => {
    const path = signalCurve(connection.from, connection.fromNode, connection.to, connection.toNode, false);
    const endPath = signalCurve(connection.from, connection.fromNode, connection.to, connection.toNode, true);
    const geometry = new THREE.TubeGeometry(path, 48, 0.018, 5, false);
    const assembled = new THREE.TubeGeometry(endPath, 48, 0.018, 5, false);
    geometry.morphAttributes.position = [assembled.attributes.position.clone()];
    geometry.morphAttributes.normal = [assembled.attributes.normal.clone()];
    assembled.dispose();
    return { path, endPath, geometry, connection };
  }), []);
  useEffect(() => {
    const room = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(gl);
    const environment = generator.fromScene(room, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.45;
    room.dispose();
    generator.dispose();
    onReady();
    return () => { scene.environment = null; environment.dispose(); };
  }, [gl, scene, onReady]);
  useEffect(() => {
    wake.current = () => { if (active && !document.hidden) invalidate(); };
    wake.current();
    const resume = () => wake.current();
    document.addEventListener('visibilitychange', resume);
    return () => { wake.current = () => {}; document.removeEventListener('visibilitychange', resume); };
  }, [wake, active, invalidate, reducedMotion, theme]);

  useFrame((_, rawDelta) => {
    if (!active || document.hidden || !assembly.current) return;
    const delta = Math.min(rawDelta, 0.05);
    const input = motion.current;
    const targetProgress = reducedMotion ? Math.round(input.progress * 5) / 5 : input.progress;
    progress.current = reducedMotion ? targetProgress : THREE.MathUtils.damp(progress.current, targetProgress, 6, delta);
    if (Math.abs(progress.current - targetProgress) < 0.0001) progress.current = targetProgress;
    const freshVelocity = performance.now() - input.updatedAt < 100 ? input.velocity : 0;
    velocity.current = reducedMotion ? 0 : THREE.MathUtils.damp(velocity.current, freshVelocity, 8, delta);
    if (Math.abs(velocity.current) < 0.0005) velocity.current = 0;
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    const step = Math.min(4, Math.floor(p * 5));
    const blend = THREE.MathUtils.smoothstep(p * 5 - step, 0, 1);
    scratch.camera.fromArray(CAMERA_STOPS[step]).lerp(scratch.end.fromArray(CAMERA_STOPS[step + 1]), blend);
    scratch.look.fromArray(LOOK_STOPS[step]).lerp(scratch.end.fromArray(LOOK_STOPS[step + 1]), blend);
    if (size.width < 600) scratch.camera.z += 1.2;
    if (!reducedMotion) {
      scratch.camera.x += input.pointerX * 0.12;
      scratch.camera.y += input.pointerY * 0.08;
    }
    if (reducedMotion) { camera.position.copy(scratch.camera); look.current.copy(scratch.look); }
    else { camera.position.lerp(scratch.camera, 1 - Math.exp(-8 * delta)); look.current.lerp(scratch.look, 1 - Math.exp(-8 * delta)); }
    camera.lookAt(look.current);
    camera.rotateZ(velocity.current * 0.014);
    const overviewWeight = 1 - THREE.MathUtils.smoothstep(p, 0.02, 0.18) + THREE.MathUtils.smoothstep(p, 0.9, 1);
    const yaw = reducedMotion ? 0 : input.yaw * overviewWeight + velocity.current * 0.035;
    const pitch = reducedMotion ? 0 : input.pitch * overviewWeight;
    assembly.current.rotation.y = THREE.MathUtils.damp(assembly.current.rotation.y, yaw, 8, delta);
    assembly.current.rotation.x = THREE.MathUtils.damp(assembly.current.rotation.x, pitch, 8, delta);
    const closing = THREE.MathUtils.smoothstep(p, 0.82, 1);
    boards.current.forEach((board, index) => {
      board?.position.fromArray(BOARD_POSITIONS[index]).lerp(scratch.end.fromArray(ASSEMBLED_POSITIONS[index]), closing);
    });
    scratch.color.set(EXHIBITION_LAYERS[Math.max(0, step - 1)].color).lerp(scratch.mood.set(EXHIBITION_LAYERS[Math.min(4, step)].color), blend);
    scratch.mood.set(theme === 'light' ? '#e5eeea' : '#071115').lerp(scratch.color, theme === 'light' ? 0.09 : 0.035);
    (scene.background as THREE.Color).lerp(scratch.mood, reducedMotion ? 1 : 1 - Math.exp(-4 * delta));
    const fog = scene.fog as THREE.FogExp2;
    fog.color.copy(scene.background as THREE.Color);
    const energy = reducedMotion ? 0 : THREE.MathUtils.clamp((input.interactionAt + 1800 - performance.now()) / 1800, 0, 1);
    signalTime.current += delta * (0.65 + Math.abs(velocity.current) * 0.65);
    signals.forEach(({ path, endPath, connection }, index) => {
      const trail = trails.current[index];
      if (trail?.morphTargetInfluences) trail.morphTargetInfluences[0] = closing;
      const packet = packets.current[index];
      if (!packet) return;
      packet.visible = energy > 0;
      const t = (signalTime.current + index * 0.19) % 1;
      path.getPointAt(t, scratch.start);
      endPath.getPointAt(t, scratch.end);
      packet.position.copy(scratch.start.lerp(scratch.end, closing));
      packet.scale.setScalar(0.75 + energy * 0.5);
      const material = packet.material as THREE.MeshBasicMaterial;
      material.opacity = energy;
      if (trail) (trail.material as THREE.MeshBasicMaterial).opacity = Math.round(p * 5) === 0 || Math.round(p * 5) === 5 || connection.from === Math.round(p * 5) - 1 ? 0.85 : 0.25;
    });
    assembly.current.traverse((object) => {
      if (!(object instanceof THREE.Mesh) || !object.name.startsWith('node:')) return;
      const selected = object.name.slice(5) === input.selectedNode || object.name.slice(5) === input.hoveredNode;
      (object.material as THREE.MeshStandardMaterial).emissiveIntensity = selected ? 3 + energy : 0.9 + energy * 0.4;
      object.scale.setScalar(selected ? 1.5 : 1);
    });
    const moving = progress.current !== targetProgress || camera.position.distanceToSquared(scratch.camera) > 0.000001 || look.current.distanceToSquared(scratch.look) > 0.000001
      || Math.abs(assembly.current.rotation.y - yaw) > 0.0001 || Math.abs(assembly.current.rotation.x - pitch) > 0.0001
      || velocity.current !== 0 || energy > 0 || Math.abs((scene.background as THREE.Color).r - scratch.mood.r)
        + Math.abs((scene.background as THREE.Color).g - scratch.mood.g) + Math.abs((scene.background as THREE.Color).b - scratch.mood.b) > 0.0001;
    if (moving && !reducedMotion) invalidate();
  });

  return (
    <>
      <color attach="background" args={[theme === 'light' ? '#e5eeea' : '#071115']} />
      <fogExp2 attach="fog" args={[theme === 'light' ? '#e5eeea' : '#071115', theme === 'light' ? 0.025 : 0.03]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 8, 10]} intensity={1.8} color="#fff0da" />
      <directionalLight position={[-8, -1, -8]} intensity={1.2} color="#92dfcf" />
      <mesh position={[0, -3.1, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[64, 64]} />
        <meshStandardMaterial color={theme === 'light' ? '#d8e4de' : '#0b191b'} roughness={0.85} metalness={0.1} />
      </mesh>
      <gridHelper args={[64, 64, theme === 'light' ? '#8baca0' : '#31574e', theme === 'light' ? '#a9bfb4' : '#244139']} position={[0, -3.08, -8]} material-transparent material-opacity={0.3} />
      <group ref={assembly}>
        {EXHIBITION_LAYERS.map((layer, index) => (
          <group key={layer.id} ref={(node) => { boards.current[index] = node; }} position={BOARD_POSITIONS[index]}>
            <PCB index={index} motion={motion} onInspect={onInspect} />
          </group>
        ))}
        {signals.map(({ geometry, connection }, index) => (
          <group key={connection.label}>
            <mesh ref={(node) => { trails.current[index] = node; }} args={[geometry]}>
              <meshBasicMaterial color={EXHIBITION_LAYERS[connection.from].color} transparent opacity={0.8} toneMapped={false} />
            </mesh>
            <mesh ref={(node) => { packets.current[index] = node; }}>
              <sphereGeometry args={[0.06, 10, 6]} />
              <meshBasicMaterial color="#d9fff4" transparent toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}

export default function DepthJourneyScene(props: SceneProps) {
  return (
    <Canvas camera={{ position: CAMERA_STOPS[0], fov: 42, near: 0.1, far: 85 }} frameloop="demand" dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: 'low-power' }}
      fallback={<p>Explore the architecture using the stage tabs.</p>}
      onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', props.onUnavailable, { once: true }); }}>
      <HardwareWorld {...props} />
    </Canvas>
  );
}
