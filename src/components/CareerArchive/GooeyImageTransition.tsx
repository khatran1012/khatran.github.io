import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import vertexShader from './shaders/gooey.vert?raw';
import fragmentShader from './shaders/gooey.frag?raw';

interface GooeyProps {
  image: string;
  initialImage: string;
  active: boolean;
  origin: MutableRefObject<{ x: number; y: number }>;
  onReady: () => void;
  onUnavailable: () => void;
  onDisplay: (image: string) => void;
}

function LiquidPlane({ image, initialImage, active, origin, onReady, onUnavailable, onDisplay }: GooeyProps) {
  const { invalidate, viewport, size, gl } = useThree();
  const material = useRef<THREE.ShaderMaterial>(null);
  const textures = useRef(new Map<string, THREE.Texture>());
  const loading = useRef(new Map<string, Promise<THREE.Texture>>());
  const firstImage = useRef(initialImage);
  const latestImage = useRef(image);
  latestImage.current = image;
  const pending = useRef<{ image: string; texture: THREE.Texture } | null>(null);
  const current = useRef('');
  const destination = useRef('');
  const tween = useRef<gsap.core.Tween | null>(null);
  const alive = useRef(true);
  const requested = useRef(0);
  const ready = useRef(false);
  const activeRef = useRef(active);
  activeRef.current = active;
  const uniforms = useMemo(() => ({
    uFrom: { value: null as THREE.Texture | null }, uTo: { value: null as THREE.Texture | null },
    uProgress: { value: 0 }, uTime: { value: 0 }, uAspect: { value: 4 / 3 },
    uOrigin: { value: new THREE.Vector2(0.5, 0.5) },
  }), []);
  const trimTextures = useCallback(() => {
    const inUse = new Set([uniforms.uFrom.value, uniforms.uTo.value, pending.current?.texture, textures.current.get(latestImage.current)]);
    for (const [url, texture] of textures.current) {
      if (textures.current.size <= 3) break;
      if (!inUse.has(texture)) { texture.dispose(); textures.current.delete(url); }
    }
  }, [uniforms]);
  const start = useRef(() => {});
  start.current = () => {
    if (!pending.current || tween.current || !activeRef.current) return;
    const next = pending.current;
    pending.current = null;
    if (next.image === current.current) return;
    if (!uniforms.uFrom.value) {
      uniforms.uFrom.value = next.texture;
      uniforms.uTo.value = next.texture;
      current.current = next.image;
      onDisplay(next.image);
      invalidate();
      return;
    }
    uniforms.uTo.value = next.texture;
    uniforms.uOrigin.value.set(origin.current.x, origin.current.y);
    destination.current = next.image;
    tween.current = gsap.to(uniforms.uProgress, {
      value: 1, duration: 0.6, ease: 'power2.inOut',
      onUpdate: () => { uniforms.uTime.value += 0.016; invalidate(); },
      onComplete: () => {
        uniforms.uFrom.value = next.texture;
        uniforms.uProgress.value = 0;
        current.current = next.image;
        destination.current = '';
        tween.current = null;
        onDisplay(next.image);
        invalidate();
        start.current();
        trimTextures();
      },
      onReverseComplete: () => {
        uniforms.uTo.value = uniforms.uFrom.value;
        uniforms.uProgress.value = 0;
        destination.current = '';
        tween.current = null;
        onDisplay(current.current);
        invalidate();
        start.current();
        trimTextures();
      },
    });
  };
  useEffect(() => {
    alive.current = true;
    const lost = (event: Event) => { event.preventDefault(); onUnavailable(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => { alive.current = false; gl.domElement.removeEventListener('webglcontextlost', lost); tween.current?.kill(); textures.current.forEach(texture => texture.dispose()); textures.current.clear(); loading.current.clear(); };
  }, [gl, onUnavailable]);
  useEffect(() => {
    const token = ++requested.current;
    const load = (url: string) => {
      const cached = textures.current.get(url);
      if (cached) return Promise.resolve(cached);
      const existing = loading.current.get(url);
      if (existing) return existing;
      const promise = new THREE.TextureLoader().loadAsync(url).then(texture => {
        loading.current.delete(url);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        if (!alive.current) texture.dispose();
        else { textures.current.set(url, texture); trimTextures(); }
        return texture;
      }).catch(error => {
        loading.current.delete(url);
        throw error;
      });
      loading.current.set(url, promise);
      return promise;
    };
    const prepare = async () => {
      if (!uniforms.uFrom.value) {
        const first = await load(firstImage.current);
        if (!alive.current) return;
        if (!uniforms.uFrom.value) {
          uniforms.uFrom.value = first; uniforms.uTo.value = first;
          current.current = firstImage.current; onDisplay(firstImage.current); invalidate();
        }
      }
      const texture = await load(image);
      if (!alive.current || token !== requested.current) { trimTextures(); return; }
      if (tween.current && (image === current.current || image === destination.current)) {
        pending.current = null;
        if (image === current.current) tween.current.reverse();
        else tween.current.play();
        if (!activeRef.current) tween.current?.pause();
        return;
      }
      pending.current = { image, texture }; start.current(); trimTextures();
    };
    prepare().catch(() => { if (alive.current && token === requested.current) onUnavailable(); });
  }, [image, onUnavailable, trimTextures]);
  useEffect(() => {
    if (active) { tween.current?.resume(); start.current(); invalidate(); }
    else tween.current?.pause();
  }, [active, invalidate]);
  useFrame(() => {
    uniforms.uAspect.value = size.width / size.height;
    if (!ready.current && uniforms.uFrom.value && material.current) { ready.current = true; onReady(); }
  });
  return <mesh scale={[viewport.width, viewport.height, 1]}>
    <planeGeometry args={[1, 1]} />
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} depthTest={false} depthWrite={false} />
  </mesh>;
}

export default function GooeyImageTransition(props: GooeyProps) {
  return <Canvas orthographic camera={{ position: [0, 0, 1], near: 0.1, far: 5 }} dpr={[1, 1.5]} frameloop="demand"
    gl={{ alpha: false, antialias: false, powerPreference: 'low-power' }}>
    <LiquidPlane {...props} />
  </Canvas>;
}
