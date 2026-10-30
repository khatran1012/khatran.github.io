import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Galaxy, LogicSculpture } from './Galaxy';
import { ArchitectureSculpture, SCULPTURE_POSITIONS } from './ArchitectureSculptures';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EXHIBITION_LAYERS } from '../../data/cvData';
import { ASSEMBLED_POSITIONS, BOARD_POSITIONS, OVERVIEW_POSITIONS, JOURNEY_CONNECTIONS, JOURNEY_NODES, JOURNEY_SCROLL_STEPS, journeyTravel } from '../../data/architectureJourney';
import type { JourneyMotion, JourneyPoint } from '../../data/architectureJourney';

interface SceneProps {
  motion: MutableRefObject<JourneyMotion>;
  wake: MutableRefObject<() => void>;
  active: boolean;
  reducedMotion: boolean;
  theme: 'light' | 'dark';
  markers: MutableRefObject<(HTMLButtonElement | null)[]>;
  onInspect: (board: number, node: string) => void;
  onReady: () => void;
  onUnavailable: () => void;
}

const BOARD_ROTATIONS: JourneyPoint[] = BOARD_POSITIONS.map((_, index) => [-0.12, index % 2 ? -0.1 : 0.1, index % 2 ? 0.025 : -0.025]);
const CAMERA_STOPS: JourneyPoint[] = [[1.1, 2.2, 15], ...BOARD_POSITIONS.map(([x, y, z]): JourneyPoint => [x + 0.45, y + 1, z + 5]), [9, 6, 14]];
const LOOK_STOPS: JourneyPoint[] = [[0, 0.1, -0.5], [-2.8, 0, 0], [2.8, 0.35, -4.8], [-2.8, -0.2, -9.6], [2.8, 0.15, -14.4], [-2.8, 0.8, -19.2], [0, 0, -3.5]];
const NODE_TARGETS = new Map(JOURNEY_NODES.flatMap((nodes, board) => nodes.map((node) => [node.id, { node, board }] as const)));

function port(board: number, node: number, positions: JourneyPoint[]) {
  return new THREE.Vector3(...SCULPTURE_POSITIONS[board][node])
    .applyEuler(new THREE.Euler(...BOARD_ROTATIONS[board]))
    .add(new THREE.Vector3(...positions[board]));
}

function signalCurve(from: number, fromNode: number, to: number, toNode: number, positions: JourneyPoint[]) {
  const start = port(from, fromNode, positions);
  const end = port(to, toNode, positions);
  const returnOffset = from > to ? 3 : 0;
  return new THREE.CatmullRomCurve3([start, start.clone().add(new THREE.Vector3(returnOffset, 0.8, -1.3)), end.clone().add(new THREE.Vector3(returnOffset, 0.8, 1.3)), end], false, 'centripetal');
}

function HardwareWorld({ motion, wake, active, reducedMotion, theme, markers, onInspect, onReady, onUnavailable, onSlowFrames }: SceneProps & { onSlowFrames: () => void }) {
  const { camera, scene, gl, invalidate, size, viewport } = useThree();
  const assembly = useRef<THREE.Group>(null);
  const rim = useRef<THREE.PointLight>(null);
  const sunlight = useRef<THREE.DirectionalLight>(null);
  const sunTarget = useMemo(() => new THREE.Object3D(), []);
  const nodeLeds = useRef<THREE.Mesh[]>([]);
  const compiled = useRef(false);
  const slowFrames = useRef(0);
  const boards = useRef<(THREE.Group | null)[]>([]);
  const trails = useRef<(THREE.Mesh | null)[]>([]);
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const progress = useRef(motion.current.progress);
  const velocity = useRef(0);
  const look = useRef(new THREE.Vector3(...LOOK_STOPS[0]));
  const position = useRef(new THREE.Vector3(...CAMERA_STOPS[0]));
  const view = useRef({ yaw: 0, pitch: 0, panX: 0, panY: 0, distance: 3.6 });
  const signalTime = useRef(0);
  // Opt-in, bounded diagnostics for local viewport/scroll verification.
  const profiling = useMemo(() => new URLSearchParams(location.search).has('profile3d'), []);
  const samples = useRef<Record<string, { frames: number[]; calls: number; triangles: number }>>({});
  const lastFrameAt = useRef(0);
  const wasAnimating = useRef(false);
  const scratch = useMemo(() => ({ camera: new THREE.Vector3(), look: new THREE.Vector3(), start: new THREE.Vector3(), end: new THREE.Vector3(), normal: new THREE.Vector3(), marker: new THREE.Vector3(), right: new THREE.Vector3(), up: new THREE.Vector3(), target: new THREE.Vector3(), orbit: new THREE.Spherical(), rotation: new THREE.Euler(), color: new THREE.Color(), mood: new THREE.Color() }), []);
  const signals = useMemo(() => JOURNEY_CONNECTIONS.map((connection) => {
    const path = signalCurve(connection.from, connection.fromNode, connection.to, connection.toNode, BOARD_POSITIONS);
    const endPath = signalCurve(connection.from, connection.fromNode, connection.to, connection.toNode, ASSEMBLED_POSITIONS);
    const overviewPath = signalCurve(connection.from, connection.fromNode, connection.to, connection.toNode, OVERVIEW_POSITIONS);
    const geometry = new THREE.TubeGeometry(path, 48, 0.018, 5, false);
    const assembled = new THREE.TubeGeometry(endPath, 48, 0.018, 5, false);
    const overview = new THREE.TubeGeometry(overviewPath, 48, 0.018, 5, false);
    geometry.morphAttributes.position = [assembled.attributes.position.clone(), overview.attributes.position.clone()];
    geometry.morphAttributes.normal = [assembled.attributes.normal.clone(), overview.attributes.normal.clone()];
    assembled.dispose();
    overview.dispose();
    return { path, endPath, overviewPath, geometry, connection };
  }), []);
  useLayoutEffect(() => {
    nodeLeds.current = [];
    assembly.current?.traverse((object) => { if (object instanceof THREE.Mesh && object.name.startsWith('node:')) nodeLeds.current.push(object); });
  }, []);
  useEffect(() => () => signals.forEach((signal) => signal.geometry.dispose()), [signals]);
  useEffect(() => {
    let cancelled = false;
    compiled.current = false;
    const room = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(gl);
    const environment = generator.fromScene(room, 0.04, 0.1, 100, { size: 64 });
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.45;
    room.dispose();
    generator.dispose();
    gl.compileAsync(scene, camera).then(() => { if (!cancelled) { compiled.current = true; invalidate(); onReady(); } }).catch(() => { if (!cancelled) onUnavailable(); });
    const lost = (event: Event) => { event.preventDefault(); onUnavailable(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => { cancelled = true; gl.domElement.removeEventListener('webglcontextlost', lost); scene.environment = null; environment.dispose(); };
  }, [gl, scene, camera, invalidate, onReady, onUnavailable]);
  useEffect(() => {
    wake.current = () => { if (active && !document.hidden) invalidate(); };
    wake.current();
    const resume = () => wake.current();
    document.addEventListener('visibilitychange', resume);
    return () => { wake.current = () => {}; document.removeEventListener('visibilitychange', resume); };
  }, [wake, active, invalidate, reducedMotion, theme]);

  useFrame((_, rawDelta) => {
    if (!active || document.hidden || !assembly.current || !compiled.current) return;
    if (viewport.dpr > 1 && rawDelta > 0) {
      slowFrames.current = rawDelta > 1 / 40 ? slowFrames.current + 1 : Math.max(0, slowFrames.current - 1);
      if (slowFrames.current >= 18) { slowFrames.current = 0; onSlowFrames(); }
    }
    const delta = Math.min(rawDelta, 0.1);
    const input = motion.current;
    const targetProgress = reducedMotion ? Math.round(input.progress * JOURNEY_SCROLL_STEPS) / JOURNEY_SCROLL_STEPS : input.progress;
    progress.current = reducedMotion ? targetProgress : THREE.MathUtils.damp(progress.current, targetProgress, 5, delta);
    if (Math.abs(progress.current - targetProgress) < 0.0001) progress.current = targetProgress;
    const freshVelocity = performance.now() - input.updatedAt < 100 ? input.velocity : 0;
    velocity.current = reducedMotion ? 0 : THREE.MathUtils.damp(velocity.current, freshVelocity, 8, delta);
    if (Math.abs(velocity.current) < 0.0005) velocity.current = 0;
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    const travel = journeyTravel(p);
    const phase = Math.min(5, Math.round(travel));
    const step = Math.min(JOURNEY_SCROLL_STEPS - 1, Math.floor(travel));
    const closing = THREE.MathUtils.smoothstep(travel, 5.5, JOURNEY_SCROLL_STEPS);
    const opening = 1 - THREE.MathUtils.smoothstep(travel, 0, 0.8);
    const blend = step === 5 ? closing : travel - step;
    if (rim.current) {
      rim.current.position.fromArray(BOARD_POSITIONS[Math.max(0, step - 1)])
        .lerp(scratch.end.fromArray(BOARD_POSITIONS[Math.min(4, step)]), blend).add(scratch.start.set(1.8, 0.8, 1.5));
    }
    scratch.camera.fromArray(CAMERA_STOPS[step]).lerp(scratch.end.fromArray(CAMERA_STOPS[step + 1]), blend);
    scratch.look.fromArray(LOOK_STOPS[step]).lerp(scratch.end.fromArray(LOOK_STOPS[step + 1]), blend);
    if (!reducedMotion && step > 0 && step < 5) {
      scratch.camera.x += Math.sin(blend * Math.PI) * 1.15;
      scratch.camera.y += Math.sin(blend * Math.PI) * 0.45;
    }
    const focus = input.selectedNode ? NODE_TARGETS.get(input.selectedNode) : undefined;
    if (focus && Math.abs(travel - focus.board - 1) < 0.15) {
      const { node: focusNode, board: focusBoard } = focus;
      scratch.rotation.fromArray(BOARD_ROTATIONS[focusBoard]);
      scratch.look.fromArray(SCULPTURE_POSITIONS[focusBoard][JOURNEY_NODES[focusBoard].indexOf(focusNode)]);
      scratch.look.applyEuler(scratch.rotation);
      scratch.look.add(scratch.start.fromArray(BOARD_POSITIONS[focusBoard]).lerp(scratch.end.fromArray(ASSEMBLED_POSITIONS[focusBoard]), closing));
      scratch.look.applyEuler(assembly.current.rotation);
      scratch.normal.set(0, 0, 1).applyEuler(scratch.rotation).applyEuler(assembly.current.rotation);
      scratch.camera.copy(scratch.look).addScaledVector(scratch.normal, 3.6);
    }
    if (!focus) {
      const fit = Math.max(1, 1.6 / (size.width / Math.max(1, size.height)));
      scratch.normal.subVectors(scratch.camera, scratch.look).multiplyScalar(fit);
      scratch.camera.copy(scratch.look).add(scratch.normal);
    }
    if (!reducedMotion && !focus && input.yaw === 0 && input.pitch === 0 && input.panX === 0 && input.panY === 0) {
      scratch.camera.x += input.pointerX * 0.12;
      scratch.camera.y += input.pointerY * 0.08;
    }
    if (reducedMotion) { position.current.copy(scratch.camera); look.current.copy(scratch.look); }
    else { position.current.lerp(scratch.camera, 1 - Math.exp(-8 * delta)); look.current.lerp(scratch.look, 1 - Math.exp(-8 * delta)); }
    // Damp angles before positioning the camera so an orbit follows an arc, not a chord through the model.
    const yawDelta = Math.atan2(Math.sin(input.yaw - view.current.yaw), Math.cos(input.yaw - view.current.yaw));
    view.current.yaw = reducedMotion ? input.yaw : THREE.MathUtils.damp(view.current.yaw, view.current.yaw + yawDelta, 10, delta);
    view.current.pitch = reducedMotion ? input.pitch : THREE.MathUtils.damp(view.current.pitch, input.pitch, 10, delta);
    view.current.panX = reducedMotion ? input.panX : THREE.MathUtils.damp(view.current.panX, input.panX, 10, delta);
    view.current.panY = reducedMotion ? input.panY : THREE.MathUtils.damp(view.current.panY, input.panY, 10, delta);
    view.current.distance = reducedMotion ? input.focusDistance : THREE.MathUtils.damp(view.current.distance, input.focusDistance, 10, delta);
    scratch.orbit.setFromVector3(scratch.normal.subVectors(position.current, look.current));
    scratch.orbit.theta += view.current.yaw;
    scratch.orbit.phi = THREE.MathUtils.clamp(scratch.orbit.phi + view.current.pitch, 0.12, Math.PI - 0.12);
    scratch.orbit.radius *= view.current.distance / 3.6;
    scratch.normal.setFromSpherical(scratch.orbit);
    scratch.up.set(0, 1, 0);
    scratch.right.crossVectors(scratch.up, scratch.normal).normalize();
    scratch.up.crossVectors(scratch.normal, scratch.right).normalize();
    scratch.target.copy(look.current).addScaledVector(scratch.right, view.current.panX).addScaledVector(scratch.up, view.current.panY);
    camera.position.copy(scratch.target).add(scratch.normal);
    camera.lookAt(scratch.target);
    sunTarget.position.copy(scratch.target);
    sunlight.current?.position.set(9, 7, 5).applyQuaternion(camera.quaternion).add(scratch.target);
    input.panScale = 2 * scratch.orbit.radius * Math.tan(THREE.MathUtils.degToRad(42) / 2) / Math.max(1, size.height);
    camera.rotateZ(velocity.current * 0.014);
    const yaw = reducedMotion || focus ? 0 : velocity.current * 0.035;
    const pitch = 0;
    assembly.current.rotation.y = THREE.MathUtils.damp(assembly.current.rotation.y, yaw, 8, delta);
    assembly.current.rotation.x = THREE.MathUtils.damp(assembly.current.rotation.x, pitch, 8, delta);
    boards.current.forEach((board, index) => {
      board?.position.fromArray(BOARD_POSITIONS[index]).lerp(scratch.end.fromArray(ASSEMBLED_POSITIONS[index]), closing);
      board?.position.lerp(scratch.end.fromArray(OVERVIEW_POSITIONS[index]), opening);
      // Keep only the departing/arriving sculptures during travel, not all five.
      if (board) board.visible = travel < 0.8 || closing > 0 || index === Math.max(0, step - 1) || blend > 0.08 && index === Math.min(4, step);
    });
    scratch.color.set(EXHIBITION_LAYERS[Math.max(0, step - 1)].color).lerp(scratch.mood.set(EXHIBITION_LAYERS[Math.min(4, step)].color), blend);
    scratch.mood.set(theme === 'light' ? '#f4f6fa' : '#070b18').lerp(scratch.color, theme === 'light' ? 0.012 : 0.004);
    const fog = scene.fog as THREE.FogExp2;
    fog.color.lerp(scratch.mood, reducedMotion ? 1 : 1 - Math.exp(-4 * delta));
    const energy = reducedMotion ? 0 : THREE.MathUtils.clamp((input.interactionAt + 1800 - performance.now()) / 1800, 0, 1);
    signalTime.current += delta * (0.65 + Math.abs(velocity.current) * 0.65);
    signals.forEach(({ path, endPath, overviewPath }, index) => {
      const trail = trails.current[index];
      if (trail?.morphTargetInfluences) { trail.morphTargetInfluences[0] = closing; trail.morphTargetInfluences[1] = opening; }
      const packet = packets.current[index];
      if (!packet) return;
      const relevant = (phase === 0 || closing > 0) && index === Math.floor(signalTime.current / 2) % signals.length;
      packet.visible = relevant && energy > 0 && Math.abs(travel - 2) > 0.45;
      const t = (signalTime.current + index * 0.19) % 1;
      if (packet.visible) {
        path.getPointAt(t, scratch.start);
        endPath.getPointAt(t, scratch.end);
        scratch.start.lerp(scratch.end, closing);
        overviewPath.getPointAt(t, scratch.end);
        packet.position.copy(scratch.start.lerp(scratch.end, opening));
      }
      packet.scale.setScalar(0.75 + energy * 0.5);
      const material = packet.material as THREE.MeshBasicMaterial;
      material.opacity = energy;
      if (trail) {
        trail.visible = relevant;
        (trail.material as THREE.MeshBasicMaterial).opacity = 0.35 * THREE.MathUtils.smoothstep(Math.abs(travel - 2), 0.45, 0.85);
      }
    });
    nodeLeds.current.forEach((object) => {
      const selected = object.name.slice(5) === input.selectedNode || object.name.slice(5) === input.hoveredNode;
      (object.material as THREE.MeshStandardMaterial).emissiveIntensity = selected ? 0.25 : 0.06;
      object.scale.setScalar(selected ? 1.08 : 1);
    });
    camera.updateMatrixWorld();
    markers.current.forEach((element, index) => {
      if (!element) return;
      const layerMarker = index < 5;
      const board = layerMarker ? index : Math.floor((index - 5) / 3);
      const nodeIndex = (index - 5) % 3;
      const show = layerMarker ? travel < 0.35 || closing > 0.85 : phase === board + 1 && Math.abs(travel - phase) < 0.35 && closing === 0
        && (!input.selectedNode || input.selectedNode === JOURNEY_NODES[board][nodeIndex].id);
      if (!show || !boards.current[board]?.visible) { if (!element.hidden) element.hidden = true; return; }
      if (layerMarker) scratch.marker.set(0, -1.6, 0);
      else {
        scratch.marker.fromArray(SCULPTURE_POSITIONS[board][nodeIndex]);
        scratch.marker.y -= nodeIndex === (board === 4 ? 1 : 0) ? 1.3 : 0.85;
        scratch.marker.z += 0.4;
      }
      scratch.marker.applyEuler(scratch.rotation.fromArray(BOARD_ROTATIONS[board]));
      scratch.marker.add(boards.current[board]!.position).applyEuler(assembly.current!.rotation).project(camera);
      const selected = !layerMarker && input.selectedNode === JOURNEY_NODES[board][nodeIndex].id;
      const inView = scratch.marker.z > -1 && scratch.marker.z < 1 && (selected || Math.abs(scratch.marker.x) < 0.98 && Math.abs(scratch.marker.y) < 0.98);
      if (element.hidden !== !inView) element.hidden = !inView;
      if (!inView) return;
      const margin = size.width < 500 ? 52 : 75;
      const x = Math.max(margin, Math.min(size.width - margin, (scratch.marker.x + 1) * size.width / 2));
      const y = Math.max(size.width < 500 ? 70 : 100, Math.min(size.height - 100, (1 - scratch.marker.y) * size.height / 2));
      const transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,0)`;
      if (element.style.transform !== transform) element.style.transform = transform;
    });
    const moving = progress.current !== targetProgress || position.current.distanceToSquared(scratch.camera) > 0.000001 || look.current.distanceToSquared(scratch.look) > 0.000001
      || Math.abs(yawDelta) > 0.0001 || Math.abs(view.current.pitch - input.pitch) > 0.0001
      || Math.abs(view.current.panX - input.panX) > 0.0001 || Math.abs(view.current.panY - input.panY) > 0.0001 || Math.abs(view.current.distance - input.focusDistance) > 0.0001
      || Math.abs(assembly.current.rotation.y - yaw) > 0.0001 || Math.abs(assembly.current.rotation.x - pitch) > 0.0001
      || velocity.current !== 0 || energy > 0 || Math.abs(fog.color.r - scratch.mood.r)
        + Math.abs(fog.color.g - scratch.mood.g) + Math.abs(fog.color.b - scratch.mood.b) > 0.0001;
    if (moving && !reducedMotion) invalidate();
    gl.render(scene, camera);
    if (profiling) {
      const now = performance.now();
      const elapsed = now - lastFrameAt.current;
      lastFrameAt.current = now;
      if (wasAnimating.current && elapsed > 0 && phase > 0) {
        const key = `${theme}:${size.width}x${size.height}:${phase}`;
        const entry = samples.current[key] ??= { frames: [], calls: 0, triangles: 0 };
        entry.frames.push(elapsed);
        if (entry.frames.length > 240) entry.frames.shift();
        entry.calls = Math.max(entry.calls, gl.info.render.calls);
        entry.triangles = Math.max(entry.triangles, gl.info.render.triangles);
        if (entry.frames.length % 20 === 0) {
          if (entry.frames.length >= 60) gl.domElement.dataset.profileReady = key;
          gl.domElement.dataset.profile3d = JSON.stringify(Object.fromEntries(Object.entries(samples.current).map(([name, value]) => {
            const sorted = [...value.frames].sort((a, b) => a - b);
            return [name, { frames: sorted.length, medianMs: sorted[Math.floor(sorted.length / 2)], p95Ms: sorted[Math.floor(sorted.length * 0.95)], calls: value.calls, triangles: value.triangles, dpr: viewport.dpr }];
          })));
        }
      }
      wasAnimating.current = moving && !reducedMotion;
    }
  }, 1);

  return (
    <>
      <fogExp2 attach="fog" args={[theme === 'light' ? '#f4f6fa' : '#070b18', 0.003]} />
      <ambientLight intensity={0.2} />
      <primitive object={sunTarget} />
      <directionalLight ref={sunlight} name="galaxy-sunlight" target={sunTarget} position={[9, 7, 5]} intensity={2.8} color="#ffd09a" />
      <directionalLight position={[-8, 2, -8]} intensity={2} color="#9cbfff" />
      <pointLight ref={rim} color="#4ff5e9" intensity={9} distance={7} decay={2} />
      <Galaxy theme={theme} />
      <group ref={assembly}>
        {EXHIBITION_LAYERS.map((layer, index) => (
          <group key={layer.id} name={`layer:${layer.id}`} ref={(node) => { boards.current[index] = node; }} position={OVERVIEW_POSITIONS[index]}>
            {index === 1 ? <LogicSculpture theme={theme} motion={motion} reducedMotion={reducedMotion} active={active} onInspect={onInspect} /> : <ArchitectureSculpture index={index} theme={theme} motion={motion} active={active} reducedMotion={reducedMotion} onInspect={onInspect} />}
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
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio, matchMedia('(pointer: coarse)').matches ? 1.25 : 1.5));
  const reduceResolution = useCallback(() => setDpr(current => Math.max(1, current - 0.25)), []);
  return (
    <Canvas className="journey-canvas" camera={{ position: CAMERA_STOPS[0], fov: 42, near: 0.1, far: 210 }} frameloop={props.active ? 'demand' : 'never'} dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      fallback={<p>Explore the architecture using the stage tabs.</p>}>
      <HardwareWorld {...props} onSlowFrames={reduceResolution} />
    </Canvas>
  );
}
