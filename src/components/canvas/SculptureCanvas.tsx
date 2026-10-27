import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

const CREST_URL = './manchester-united.svg';

const ManchesterUnitedCrest: React.FC<{ rotation: [number, number, number] }> = ({ rotation }) => {
  const svg = useLoader(SVGLoader, CREST_URL);
  // Keep image and vector loader cache keys distinct.
  const texture = useLoader(THREE.TextureLoader, `${CREST_URL}?texture`);
  const geometries = useMemo(() => svg.paths
    .filter((path) => (path.userData?.style as { fill?: string } | undefined)?.fill !== 'none')
    .flatMap((path) => path.toShapes())
    .map((shape) => {
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 9,
        bevelEnabled: false,
        curveSegments: 20,
        steps: 1,
      });
      // Project the original crest onto both faces; the rim has its own material.
      const positions = geometry.getAttribute('position');
      const uv = geometry.getAttribute('uv');
      for (let index = 0; index < positions.count; index++) {
        uv.setXY(index, positions.getX(index) / 296.14334, 1 - positions.getY(index) / 300);
      }
      return geometry;
    }), [svg]);

  useEffect(() => () => geometries.forEach((geometry) => geometry.dispose()), [geometries]);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group rotation={rotation} scale={[0.012, -0.012, 0.012]}>
      <group position={[-148.07167, -150, -4.5]}>
        {geometries.map((geometry, index) => (
          <mesh key={index} geometry={geometry} position={[0, 0, index * 0.005]}>
            <meshBasicMaterial attach="material-0" map={texture} transparent alphaTest={0.1} toneMapped={false} side={THREE.DoubleSide} />
            <meshStandardMaterial attach="material-1" color="#a11920" metalness={0.5} roughness={0.35} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export const SculptureCanvas: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [rotation, setRotation] = useState<[number, number, number]>([0.06, -0.2, 0]);
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
          <ambientLight intensity={1.5} />
          <directionalLight position={[4, 3, 5]} intensity={3} />
          <Suspense fallback={null}>
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
            {Array.from({ length: 9 }, (_, index) => (
              <img key={index} src={CREST_URL} alt="" aria-hidden="true" draggable={false}
                style={{ transform: `translateZ(${index - 4}px)`, filter: index > 0 && index < 8 ? 'brightness(0.35)' : undefined }} />
            ))}
          </div>
        </div>
      )}
      <p className="club-crest-caption">MANCHESTER UNITED <span>Drag to rotate · Arrow keys supported</span></p>
    </div>
  );
};
