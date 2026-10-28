import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { EXHIBITION_LAYERS } from '../../data/cvData';

const CENTER = 220;
const PORT = 120;
const SPINE = 426;
const HUB_Y = 590;
const layerY = (index: number) => 72 + index * 120;
const spring = (value: number, velocity: number, target: number, delta: number): [number, number] => {
  const nextVelocity = (velocity + (target - value) * 160 * delta) * Math.exp(-17 * delta);
  return [value + nextVelocity * delta, nextVelocity];
};

interface LayeredAnatomy3DProps {
  activeLayerId: string;
  onSelectLayer: (layerId: string) => void;
  layerOffsets: Record<string, number>;
  onMoveLayer: (layerId: string, offset: number) => void;
}

export const LayeredAnatomy3D: React.FC<LayeredAnatomy3DProps> = ({ activeLayerId, onSelectLayer, layerOffsets, onMoveLayer }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const boardRefs = useRef<(SVGGElement | null)[]>([]);
  const branchRefs = useRef<(SVGGElement | null)[]>([]);
  const routeRef = useRef<SVGPathElement>(null);
  const ports = useRef<(SVGCircleElement | null)[]>([]);
  const poses = useRef(EXHIBITION_LAYERS.map(() => ({ x: 0, y: 0, scale: 1, tilt: 0, vx: 0, vy: 0, vs: 0, vt: 0 })));
  const targets = useRef({ activeLayerId, layerOffsets, hovered: '', tilt: 0 });
  const dragRef = useRef<{ id: string; pointerId: number; startX: number; startOffset: number; offset: number; scale: number } | null>(null);
  const [hovered, setHovered] = useState('');
  const [releasing, setReleasing] = useState('');
  const previousActive = useRef(activeLayerId);
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    targets.current = { ...targets.current, activeLayerId, layerOffsets, hovered };
  }, [activeLayerId, layerOffsets, hovered]);

  useEffect(() => {
    const previous = previousActive.current;
    previousActive.current = activeLayerId;
    if (previous === activeLayerId) return;
    setReleasing(previous);
    const timer = window.setTimeout(() => setReleasing(''), 450);
    return () => window.clearTimeout(timer);
  }, [activeLayerId]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  // A single frame updates both the board matrix and its cable endpoint, including idle and tilt.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let frame = 0;
    let visible = false;
    let last = 0;
    const draw = (time: number) => {
      frame = 0;
      const delta = Math.min((time - last) / 1000 || 1 / 60, 0.032);
      last = time;
      const target = targets.current;
      EXHIBITION_LAYERS.forEach((layer, index) => {
        const pose = poses.current[index];
        const active = layer.id === target.activeLayerId;
        const hover = layer.id === target.hovered;
        const offset = target.layerOffsets[layer.id] ?? 0;
        const x = offset + (active ? -12 : 3);
        const y = active ? -6 : 2;
        const scale = active ? 1.045 : hover ? 1.005 : 0.975;
        const tilt = hover ? target.tilt : 0;
        if (reducedMotion) {
          Object.assign(pose, { x, y, scale, tilt: 0, vx: 0, vy: 0, vs: 0, vt: 0 });
        } else {
          [pose.x, pose.vx] = spring(pose.x, pose.vx, x, delta);
          [pose.y, pose.vy] = spring(pose.y, pose.vy, y, delta);
          [pose.scale, pose.vs] = spring(pose.scale, pose.vs, scale, delta);
          [pose.tilt, pose.vt] = spring(pose.tilt, pose.vt, tilt, delta);
        }
        const idle = reducedMotion || dragRef.current?.id === layer.id ? 0 : Math.sin(time / 1800 + index * 0.85) * 1.7;
        const angle = pose.tilt * Math.PI / 180;
        const a = Math.cos(angle) * pose.scale;
        const b = Math.sin(angle) * pose.scale * 0.6;
        const c = -Math.sin(angle) * pose.scale;
        const d = Math.cos(angle) * pose.scale;
        const px = CENTER + pose.x;
        const py = layerY(index) + pose.y + idle;
        boardRefs.current[index]?.setAttribute('transform', `matrix(${a} ${b} ${c} ${d} ${px} ${py})`);
        const sourceX = px + PORT * a;
        const sourceY = py + PORT * b;
        const endY = layerY(index);
        const elbow = Math.min(sourceX + 18, SPINE - 10);
        const branch = `M${sourceX} ${sourceY}H${elbow}L${Math.min(elbow + 12, SPINE - 6)} ${endY}H${SPINE}`;
        const group = branchRefs.current[index];
        if (group) for (const child of Array.from(group.children)) {
          if (child instanceof SVGPathElement) child.setAttribute('d', branch);
        }
        ports.current[index]?.setAttribute('cx', String(sourceX));
        ports.current[index]?.setAttribute('cy', String(sourceY));
        if (active) routeRef.current?.setAttribute('d', `${branch}V${HUB_Y}`);
      });
      if (visible && !document.hidden && !reducedMotion) frame = requestAnimationFrame(draw);
    };
    const update = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (visible && !document.hidden) { last = performance.now(); draw(last); }
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(svg);
    document.addEventListener('visibilitychange', update);
    // Reduced motion still needs to update exact geometry when controls change.
    const changes = reducedMotion ? new MutationObserver(update) : null;
    changes?.observe(svg, { attributes: true, attributeFilter: ['data-selection', 'data-offsets'] });
    return () => { observer.disconnect(); changes?.disconnect(); document.removeEventListener('visibilitychange', update); cancelAnimationFrame(frame); };
  }, [reducedMotion]);

  const startDrag = (event: React.PointerEvent<SVGGElement>, id: string) => {
    if (event.button !== 0 || dragRef.current) return;
    const scale = svgRef.current?.getScreenCTM()?.a;
    if (!scale) return;
    onSelectLayer(id);
    event.currentTarget.setPointerCapture(event.pointerId);
    const offset = layerOffsets[id] ?? 0;
    dragRef.current = { id, pointerId: event.pointerId, startX: event.clientX, startOffset: offset, offset, scale: 1 / scale };
  };
  const movePointer = (event: React.PointerEvent<SVGGElement>, id: string) => {
    const drag = dragRef.current;
    if (drag && drag.pointerId === event.pointerId) {
      drag.offset = Math.max(-60, Math.min(60, drag.startOffset + (event.clientX - drag.startX) * drag.scale));
      onMoveLayer(drag.id, drag.offset);
    } else if (event.pointerType === 'mouse') {
      const point = svgRef.current?.createSVGPoint();
      const matrix = svgRef.current?.getScreenCTM();
      if (!point || !matrix) return;
      point.x = event.clientX; point.y = event.clientY;
      const local = point.matrixTransform(matrix.inverse());
      targets.current.tilt = Math.max(-3, Math.min(3, (local.x - CENTER - (layerOffsets[id] ?? 0)) / 40));
    }
  };
  const endDrag = (event: React.PointerEvent<SVGGElement>, cancelled = false) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    onMoveLayer(drag.id, cancelled ? drag.startOffset : Math.round(drag.offset / 20) * 20);
    if (!reducedMotion && !cancelled) {
      const index = EXHIBITION_LAYERS.findIndex((layer) => layer.id === drag.id);
      for (const adjacent of [index - 1, index + 1]) {
        if (poses.current[adjacent]) poses.current[adjacent].vx += Math.sign(drag.offset - drag.startOffset) * 18;
      }
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const boardOrder = EXHIBITION_LAYERS.map((layer, index) => ({ layer, index })).sort((a, b) => Number(a.layer.id === activeLayerId) - Number(b.layer.id === activeLayerId));
  return (
    <svg ref={svgRef} className="pcb-stack" viewBox="0 0 460 650" data-selection={activeLayerId} data-offsets={JSON.stringify(layerOffsets)}
      aria-label="Spatial architecture stack. Click to focus, drag to adjust depth offset, use arrow keys to move, or double click to center.">
      <path d="M220 16V598" className="pcb-center-anchor" />
      <g className="pcb-system-spine" aria-hidden="true">
        <path d={`M${SPINE - 3} 34V${HUB_Y}M${SPINE + 3} 34V${HUB_Y}`} className="pcb-spine-rail" />
        <path d={`M${SPINE} 34V${HUB_Y}`} className="pcb-spine-core" />
        <text x="387" y="20">SYSTEM BUS</text>
        <circle cx={SPINE} cy={HUB_Y} r="7" className="pcb-hub" />
        <text x="330" y="607">INSPECTION</text>
      </g>
      {EXHIBITION_LAYERS.map((layer, index) => {
        const active = layer.id === activeLayerId;
        return (
          <g key={layer.id} className={`pcb-branch ${active ? 'is-active' : ''} ${layer.id === hovered ? 'has-hover' : ''} ${layer.id === releasing ? 'is-releasing' : ''}`}
            style={{ color: layer.color }} data-branch={layer.id} aria-hidden="true">
            <g ref={(node) => { branchRefs.current[index] = node; }}>
              <path d={`M340 ${layerY(index)}H426`} className="pcb-branch-base" />
              <path d={`M340 ${layerY(index)}H426`} pathLength="1" className="pcb-branch-charge" />
            </g>
            <circle ref={(node) => { ports.current[index] = node; }} cx="340" cy={layerY(index)} r="2.8" className="pcb-source-port" />
            <circle cx={SPINE} cy={layerY(index)} r="4" className="pcb-junction" />
          </g>
        );
      })}
      <path key={activeLayerId} ref={routeRef} d={`M340 ${layerY(EXHIBITION_LAYERS.findIndex((layer) => layer.id === activeLayerId))}H426V${HUB_Y}`}
        className="pcb-route-pulse" pathLength="1" style={{ color: EXHIBITION_LAYERS.find((layer) => layer.id === activeLayerId)?.color }} aria-hidden="true" />
      {boardOrder.map(({ layer, index }) => {
        const selected = layer.id === activeLayerId;
        return (
          <g key={layer.id} ref={(node) => { boardRefs.current[index] = node; }}
            className={`pcb-board ${selected ? 'is-selected' : 'is-receding'} ${hovered === layer.id ? 'has-hover' : ''}`}
            data-layer={layer.id} transform={`translate(${CENTER} ${layerY(index)})`} style={{ color: layer.color }}
            role="button" tabIndex={0} aria-pressed={selected} aria-label={`Focus ${layer.slabLabel} layer`}
            onClick={() => onSelectLayer(layer.id)} onDoubleClick={() => onMoveLayer(layer.id, 0)}
            onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(layer.id); }}
            onPointerLeave={() => { setHovered(''); targets.current.tilt = 0; }}
            onPointerDown={(event) => startDrag(event, layer.id)} onPointerMove={(event) => movePointer(event, layer.id)}
            onPointerUp={(event) => endDrag(event)} onPointerCancel={(event) => endDrag(event, true)}
            onLostPointerCapture={(event) => endDrag(event, true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelectLayer(layer.id); }
              if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault(); onSelectLayer(layer.id);
                onMoveLayer(layer.id, (layerOffsets[layer.id] ?? 0) + (event.key === 'ArrowLeft' ? -20 : 20));
              }
              if (event.key === 'Home') { event.preventDefault(); onMoveLayer(layer.id, 0); }
            }}>
            <title>{layer.slabLabel} // {layer.signalLabel} · Drag to offset, double click to center</title>
            <defs><clipPath id={`pcb-scan-${layer.id}`}><path d="M-120 0 0-60 120 0 0 60Z" /></clipPath></defs>
            <path d="M-120 0 0-60 120 0 0 60Z" fill="transparent" />
            <image href="./anatomy-circuit-board-chip-v2.png" x="-120" y="-60" width="240" height="120" className="pcb-hardware-image" pointerEvents="none" />
            <path d="M-114 1 0 57 114 1" className="pcb-edge-led" />
            <g className="pcb-internal-signal" aria-hidden="true"><path d="M-64 10 0 28 120 0" /><circle cx="-64" cy="10" r="1.8" /><circle cx="0" cy="28" r="1.8" /></g>
            <g clipPath={`url(#pcb-scan-${layer.id})`} pointerEvents="none"><rect key={`${selected}-${hovered === layer.id}`} x="-130" y="-1" width="260" height="1.5" className="pcb-diagnostic-scan" /></g>
            <circle cx={PORT} cy="0" r="2.5" fill={layer.color} className="pcb-port" />
            <g className="pcb-chip-engraving" transform="translate(0 -11) matrix(1 0.55 -1 0.55 0 0)" textAnchor="middle" dominantBaseline="central" pointerEvents="none">
              <text y="-14" className="pcb-chip-serial">KT / PLANE {layer.number}</text>
              <text y="-2" className="pcb-chip-label" style={{ fontSize: layer.slabLabel.length > 8 ? 7 : 9.5 }}>{layer.slabLabel}</text>
              <path d="M-18 5H18" stroke="#455158" strokeWidth="0.45" />
              <text y="12" className="pcb-chip-caption">{layer.chipCaption}</text>
            </g>
          </g>
        );
      })}
    </svg>
  );
};
