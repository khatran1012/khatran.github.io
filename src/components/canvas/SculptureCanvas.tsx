import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

const CREST_URL = './manchester-united.svg?finish=metallic';

const ManchesterUnitedCrest: React.FC<{ rotation: [number, number, number] }> = ({ rotation }) => {
  const svg = useLoader(SVGLoader, CREST_URL);
  const invalidate = useThree((state) => state.invalidate);
  const parts = useMemo(() => svg.paths
    .filter((path) => (path.userData?.style as { fill?: string } | undefined)?.fill !== 'none')
    .flatMap((path, index) => {
      const node = path.userData?.node as Element | undefined;
      const finish = node?.getAttribute('data-metal');
      const reliefHeight = node?.getAttribute('data-relief') === 'raised' ? 4 : 0;
      return path.toShapes().map((shape) => ({
        geometry: new THREE.ExtrudeGeometry(shape, {
          depth: 32 + index * 0.3 + reliefHeight,
          bevelEnabled: true,
          bevelSize: 0.65,
          bevelThickness: 0.8,
          bevelSegments: 2,
          curveSegments: 20,
          steps: 1,
        }),
        color: finish === 'silver' ? '#d6d4c5' : finish === 'rim' ? '#aa7621' : '#c9a348',
        roughness: finish === 'silver' ? 0.28 : 0.22,
      }));
    }), [svg]);

  useEffect(() => { invalidate(); }, [invalidate, parts]);
  useEffect(() => () => parts.forEach(({ geometry }) => geometry.dispose()), [parts]);

  return (
    <group rotation={rotation} scale={[0.012, -0.012, 0.012]}>
      <group position={[-148.07167, -150, -22]}>
        {parts.map(({ geometry, color, roughness }, index) => (
          <mesh key={index} geometry={geometry}>
            <meshPhysicalMaterial attach="material-0" color={color} metalness={0.75} roughness={roughness} clearcoat={0.15} clearcoatRoughness={0.25} envMapIntensity={0.7} side={THREE.DoubleSide} />
            <meshStandardMaterial attach="material-1" color="#99701d" metalness={0.75} roughness={0.32} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export const SculptureCanvas: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [rotation, setRotation] = useState<[number, number, number]>([-0.36, -0.48, -0.08]);
  const drag = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const rotateWithKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    setRotation(([x, y, z]) => [
      Math.max(-Math.PI / 3, Math.min(Math.PI / 3, x + (event.key === 'ArrowUp' ? -0.15 : event.key === 'ArrowDown' ? 0.15 : 0))),
      y + (event.key === 'ArrowLeft' ? -0.15 : event.key === 'ArrowRight' ? 0.15 : 0),
      z,
    ]);
  };

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const updateMobile = () => setMobile(media.matches);
    updateMobile();
    media.addEventListener('change', updateMobile);
    try {
      const gl = document.createElement('canvas').getContext('webgl2');
      setHasWebGL(Boolean(gl));
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      setHasWebGL(false);
    }
    return () => media.removeEventListener('change', updateMobile);
  }, []);

  return (
    <div className="club-crest-viewer">
      {hasWebGL ? (
        <Canvas
          camera={{ position: [0, 0, 6.5], fov: 42 }}
          dpr={mobile ? 1 : [1, 1.5]}
          frameloop="demand"
          gl={{ antialias: true, alpha: true }}
          aria-label="Manchester United 3D crest. Drag to rotate, or use the arrow keys when focused."
          tabIndex={0}
          onKeyDown={rotateWithKeyboard}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[-3, 5, 6]} intensity={1.8} color="#fff2d0" />
          <directionalLight position={[4, -1, 3]} intensity={0.8} color="#ffffff" />
          <Suspense fallback={null}>
            <Environment resolution={128} frames={1}>
              <color attach="background" args={['#d5c7a4']} />
              <Lightformer position={[-3, 4, 5]} scale={[5, 3, 1]} intensity={1.3} color="#ffe3a3" />
              <Lightformer position={[4, 1, 3]} scale={[2, 5, 1]} intensity={1} color="#ffffff" />
              <Lightformer position={[0, -4, 2]} scale={[4, 1, 1]} intensity={1} color="#cfa955" />
            </Environment>
            <ManchesterUnitedCrest rotation={rotation} />
          </Suspense>
          <OrbitControls makeDefault enablePan={false} enableZoom={false} enableDamping={false} />
        </Canvas>
      ) : (
        <div
          className="club-crest-fallback"
          tabIndex={0}
          role="group"
          aria-label="Manchester United 3D crest. Drag to rotate, or use the arrow keys when focused."
          onKeyDown={rotateWithKeyboard}
          onDragStart={(event) => event.preventDefault()}
          onPointerDown={(event) => {
            if (event.button !== 0 || drag.current) return;
            event.preventDefault();
            event.currentTarget.focus();
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
          }}
          onPointerMove={(event) => {
            const previous = drag.current;
            if (!previous || previous.pointerId !== event.pointerId) return;
            const dx = event.clientX - previous.x;
            const dy = event.clientY - previous.y;
            drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
            setRotation(([x, y, z]) => [
              Math.max(-Math.PI / 3, Math.min(Math.PI / 3, x - dy * 0.01)),
              y + dx * 0.01,
              z,
            ]);
          }}
          onPointerUp={(event) => {
            if (drag.current?.pointerId !== event.pointerId) return;
            drag.current = null;
            event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={() => { drag.current = null; }}
          onLostPointerCapture={() => { drag.current = null; }}
        >
          <div className="club-crest-css-model" style={{ transform: `rotateX(${rotation[0]}rad) rotateY(${rotation[1]}rad)` }}>
            {Array.from({ length: 33 }, (_, index) => (
              <img key={index} src={CREST_URL} alt="" aria-hidden="true" draggable={false}
                style={{ transform: `translateZ(calc(${index - 16} * var(--crest-layer-step)))`, filter: index > 0 && index < 32 ? 'sepia(0.7) saturate(1.4) brightness(0.72)' : undefined }} />
            ))}
          </div>
        </div>
      )}
      <p className="club-crest-caption">MANCHESTER UNITED <span>Drag to rotate · Arrow keys supported</span></p>
    </div>
  );
};
