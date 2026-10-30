import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { NanoCircuitBackdrop } from './NanoCircuitBackdrop';
import {
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  Zap,
  X,
} from 'lucide-react';

export interface SystemNode {
  id: 'core' | 'frontend' | 'backend' | 'infra' | 'data';
  number: string;
  name: string;
  subTitle: string;
  category: string;
  xPercent: number;
  yPercent: number;
  color: 'cyan' | 'amber';
  hexColor: string;
  badgeLabel: string;
  technologies: string[];
  specs: string[];
  description: string;
  targetChapter: string;
}

const SYSTEM_NODES: SystemNode[] = [
  {
    id: 'core',
    number: '01',
    name: 'SYSTEM CORE',
    subTitle: 'Architecture & Engineering',
    category: 'CENTRAL PROCESSOR',
    xPercent: 50,
    yPercent: 49,
    color: 'cyan',
    hexColor: '#38efd8',
    badgeLabel: 'KT CHIP',
    technologies: ['Architecture', 'Engineering', 'Problem Solving', 'High Concurrency'],
    specs: ['Central Conduit Nexus', 'Fault-Tolerant Dispatch', 'Single Source of Truth'],
    description: 'The master architecture hub uniting deterministic client state, high-throughput microservices, transactional persistence, and offline IoT edge substrates.',
    targetChapter: '#origin',
  },
  {
    id: 'frontend',
    number: '02',
    name: 'FRONTEND',
    subTitle: 'React / TypeScript',
    category: 'DETERMINISTIC UI',
    xPercent: 22,
    yPercent: 24,
    color: 'cyan',
    hexColor: '#00f5d4',
    badgeLabel: 'REACT 19',
    technologies: ['React 18/19', 'TypeScript', 'UI/UX Performance', 'State Management'],
    specs: ['Deterministic UI projection', 'Sub-millisecond render cycles', 'WCAG AA accessible'],
    description: 'Predictable user interfaces eliminating transient state fragmentation. Responsive interactions and zero-layout-shift performance.',
    targetChapter: '#system',
  },
  {
    id: 'backend',
    number: '03',
    name: 'BACKEND',
    subTitle: 'Golang / API Design',
    category: 'DISTRIBUTED SERVICES',
    xPercent: 78,
    yPercent: 24,
    color: 'amber',
    hexColor: '#ffaa22',
    badgeLabel: 'GOLANG GIN',
    technologies: ['Golang Gin', 'API Contracts', 'Microservices', 'Concurrency Channels'],
    specs: ['Goroutine lightweight workers', 'Compile-time OpenAPI schemas', 'Sub-millisecond latency'],
    description: 'Resilient Golang microservices processing concurrent transactions, enforcing strict contracts, and handling peak edge load.',
    targetChapter: '#pressure',
  },
  {
    id: 'infra',
    number: '04',
    name: 'INFRASTRUCTURE',
    subTitle: 'Cloud / DevOps',
    category: 'EDGE & CLUSTERS',
    xPercent: 25,
    yPercent: 75,
    color: 'amber',
    hexColor: '#ff9e2c',
    badgeLabel: 'K8S & EDGE',
    technologies: ['Cloud & Edge Gateways', 'Docker / Kubernetes', 'Monitoring / CI/CD', 'IoT Turnstiles'],
    specs: ['Offline-First failover', 'Automated CI/CD pipelines', 'Hardware relay interfacing'],
    description: 'Autonomous edge controllers and cloud infrastructure designed to survive complete WAN disconnects without service interruption.',
    targetChapter: '#reality',
  },
  {
    id: 'data',
    number: '05',
    name: 'DATA',
    subTitle: 'PostgreSQL / Redis',
    category: 'TRANSACTIONAL INTEGRITY',
    xPercent: 75,
    yPercent: 75,
    color: 'cyan',
    hexColor: '#26e8db',
    badgeLabel: 'POSTGRES / REDIS',
    technologies: ['PostgreSQL', 'Redis Distributed Lock', 'Data Pipeline', 'Caching & Sync'],
    specs: ['Row-level pessimistic locking', 'Zero ticket double-spending', 'Write-ahead log sync'],
    description: 'Deterministic ACID storage combining distributed Redis mutex gates with PostgreSQL for absolute transactional integrity under contention.',
    targetChapter: '#system',
  },
];

const MODULE_SIZES = {
  core: '(min-width: 1520px) 165px, (min-width: 1280px) 12vw, (min-width: 760px) calc(27vw - 84px), (min-width: 601px) 27vw, 38vw',
  other: '(min-width: 1520px) 135px, (min-width: 1280px) 10vw, (min-width: 760px) calc(22vw - 68px), (min-width: 601px) 22vw, 32vw',
};

export const SculptureCanvas: React.FC = () => {
  const [selection, setSelection] = useState<{ nodeId: string; run: number; arrived: boolean } | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [neonActive, setNeonActive] = useState(true);
  const [signalPath, setSignalPath] = useState('');
  const exhibitRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLSpanElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const activeNodeId = selection?.nodeId ?? null;
  const litNodeId = highlightedId ?? activeNodeId;
  const selectedNode = SYSTEM_NODES.find(node => node.id === activeNodeId);

  useLayoutEffect(() => {
    const exhibit = exhibitRef.current;
    const viewport = depthRef.current;
    const dock = dockRef.current;
    const source = exhibit?.querySelector<HTMLButtonElement>(`[data-node="${selection?.nodeId}"]`);
    if (!exhibit || !viewport || !dock || !source) {
      setSignalPath('');
      return;
    }
    const measure = () => {
      const bounds = exhibit.getBoundingClientRect();
      const origin = source.getBoundingClientRect();
      const stage = viewport.getBoundingClientRect();
      exhibit.style.setProperty('--hero-stage-top', `${stage.top - bounds.top}px`);
      exhibit.style.setProperty('--hero-stage-height', `${stage.height}px`);
      const destination = dock.getBoundingClientRect();
      const x = origin.left + origin.width / 2 - bounds.left;
      const y = origin.top + origin.height / 2 - bounds.top;
      const endX = destination.left + destination.width / 2 - bounds.left;
      const endY = destination.top + destination.height / 2 - bounds.top;
      const bend = (endX - x) * 0.45;
      setSignalPath(`M ${x.toFixed(1)} ${y.toFixed(1)} C ${(x + bend).toFixed(1)} ${y.toFixed(1)} ${(endX - bend).toFixed(1)} ${endY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(exhibit);
    observer.observe(viewport);
    if (dock.parentElement) observer.observe(dock.parentElement);
    return () => observer.disconnect();
  }, [selection?.nodeId, selection?.run]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const finish = () => {
      if (preference.matches) setSelection(current => current ? { ...current, arrived: true } : null);
    };
    preference.addEventListener('change', finish);
    return () => preference.removeEventListener('change', finish);
  }, []);

  const selectNode = (nodeId: string) => setSelection(current => ({
    nodeId,
    run: (current?.run ?? 0) + 1,
    arrived: !neonActive || matchMedia('(prefers-reduced-motion: reduce)').matches,
  }));

  const updateDepth = (x: number, y: number) => {
    pointer.current = { x, y };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      depthRef.current?.style.setProperty('--hero-x', pointer.current.x.toFixed(3));
      depthRef.current?.style.setProperty('--hero-y', pointer.current.y.toFixed(3));
      frame.current = 0;
    });
  };

  const resetView = () => {
    setSelection(null);
    setHighlightedId(null);
    updateDepth(0, 0);
  };

  return (
    <div ref={exhibitRef} className={`cyber-exhibit ${neonActive ? '' : 'neon-paused'} ${selection && !selection.arrived ? 'is-routing' : ''}`} onKeyDown={event => {
      if (event.key === 'Escape') resetView();
    }}>
      <div className="cyber-core-viewer" role="region" aria-label="Interactive System Architecture Exhibit">
        <div className="cyber-core-header">
          <div className="cyber-core-title">
            <span className="cyber-status-led" />
            <span className="cyber-title-main">KT-CORE // SYSTEM ANATOMY</span>
            <span className="cyber-title-status">{neonActive ? '● LIVE LED CONDUITS' : '● SIGNALS PAUSED'}</span>
          </div>
          <div className="cyber-node-tabs" role="group" aria-label="Select architecture module">
            <button type="button" className={`cyber-tab-btn ${activeNodeId === null ? 'active' : ''}`}
              onClick={resetView} aria-pressed={activeNodeId === null}>ALL NODES</button>
            {SYSTEM_NODES.map(node => (
              <button key={node.id} type="button" className={`cyber-tab-btn ${activeNodeId === node.id ? 'active' : ''} ${node.color}`}
                onClick={() => selectNode(node.id)} aria-pressed={activeNodeId === node.id}
                aria-controls="hero-module-detail" title={`${node.number} ${node.name} — ${node.subTitle}`}>
                <span className="cyber-tab-num">{node.number}</span> {node.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div ref={depthRef} className="cyber-core-viewport" onPointerMove={event => {
          if (event.pointerType !== 'mouse' || selection && !selection.arrived || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          updateDepth((event.clientX - bounds.left) / bounds.width * 2 - 1, (event.clientY - bounds.top) / bounds.height * 2 - 1);
        }} onPointerLeave={() => { if (!selection || selection.arrived) updateDepth(0, 0); }}>
          <NanoCircuitBackdrop />
          <div className="cyber-depth-rig">
            <svg className="cyber-module-connections" viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true">
              {SYSTEM_NODES.filter(node => node.id !== 'core').map(node => {
                const x = node.xPercent * 10;
                const y = node.yPercent * 7.6;
                const path = `M 500 372 C 500 ${y} ${x} 372 ${x} ${y}`;
                return <g key={node.id} className={`cyber-connection ${litNodeId && litNodeId !== 'core' && litNodeId !== node.id ? 'is-dimmed' : ''}`}
                  style={{ color: node.hexColor }}>
                  <path d={path} strokeWidth="9" opacity="0.1" />
                  <path d={path} strokeWidth="1.5" opacity="0.85" />
                  <path d={path} pathLength="1" className="cyber-connection-packet" strokeWidth="3" strokeDasharray="0.05 0.95" />
                  <circle cx={x} cy={y} r="4" fill="currentColor" />
                </g>;
              })}
            </svg>
            {SYSTEM_NODES.map(node => (
              <button key={node.id} type="button" data-node={node.id}
                className={`cyber-module ${node.color} ${node.id === 'core' ? 'is-core' : ''} ${activeNodeId === node.id ? 'is-selected' : ''}`}
                style={{ left: `${node.xPercent}%`, top: `${node.yPercent}%`, '--module-color': node.hexColor } as React.CSSProperties}
                title={`${node.name} — ${node.subTitle}. Click to inspect.`}
                aria-pressed={activeNodeId === node.id} aria-controls="hero-module-detail"
                onClick={() => selectNode(node.id)}
                onPointerEnter={event => { if (event.pointerType === 'mouse') setHighlightedId(node.id); }}
                onPointerLeave={() => setHighlightedId(null)}
                onFocus={() => setHighlightedId(node.id)} onBlur={() => setHighlightedId(null)}>
                <span className="cyber-module-socket" aria-hidden="true" />
                <picture className="cyber-module-art">
                  <source type="image/avif" srcSet={`./hero-modules/${node.id}-384.avif 384w, ./hero-modules/${node.id}.avif 768w`}
                    sizes={MODULE_SIZES[node.id === 'core' ? 'core' : 'other']} />
                  <source type="image/webp" srcSet={`./hero-modules/${node.id}-384.webp 384w, ./hero-modules/${node.id}.webp 768w`}
                    sizes={MODULE_SIZES[node.id === 'core' ? 'core' : 'other']} />
                  <img src={`./hero-modules/${node.id}.webp`} width="768" height="768" alt=""
                    loading="eager" fetchPriority={node.id === 'core' ? 'high' : 'auto'} decoding="async" draggable={false}
                    onLoad={event => event.currentTarget.closest<HTMLButtonElement>('.cyber-module')?.style.setProperty('--module-texture', `url("${event.currentTarget.currentSrc}")`)} />
                </picture>
                <span className="cyber-module-label">
                  <span className="cyber-module-number">{node.number}</span>{' '}
                  <strong>{node.name}</strong>
                  <span className="cyber-module-indicator" aria-hidden="true">{activeNodeId === node.id ? '●' : '+'}</span>
                </span>
              </button>
            ))}
          </div>
          <span className="cyber-depth-label">NANO FABRIC / FIVE CONNECTED MODULES</span>
          <span className="cyber-scene-hint">HOVER TO ILLUMINATE · CLICK TO INSPECT</span>
        </div>

        <div className="cyber-core-footer">
          <div className="cyber-footer-actions">
            <button type="button" className={`cyber-action-btn ${neonActive ? 'active' : ''}`}
              onClick={() => {
                if (neonActive) setSelection(current => current ? { ...current, arrived: true } : null);
                setNeonActive(value => !value);
              }} aria-pressed={neonActive}>
              <Zap size={14} /><span>{neonActive ? 'LED Neon: ON' : 'LED Neon: OFF'}</span>
            </button>
            <button type="button" className="cyber-action-btn" onClick={resetView}>
              <RotateCcw size={14} /><span>Reset</span>
            </button>
          </div>
        </div>
      </div>
      <aside className="cyber-module-inspector" aria-label="Module information" data-open={Boolean(selection?.arrived)}
        style={{ '--module-color': selectedNode?.hexColor ?? '#38efd8' } as React.CSSProperties}>
        <span ref={dockRef} className="cyber-inspector-port" aria-hidden="true" />
          <div id="hero-module-detail" className="cyber-footer-readout" aria-live="polite" aria-atomic="true"
            aria-busy={selection !== null && !selection.arrived}>
            {SYSTEM_NODES.filter(node => node.id === activeNodeId).map(node => (
              <div key={`${node.id}:${selection?.run}`} className="cyber-node-readout cyber-selection-banner" data-selected-module={node.id}
                aria-hidden={!selection?.arrived}
                style={{ '--module-color': node.hexColor } as React.CSSProperties}>
                <button type="button" className="cyber-inspector-close" onClick={resetView} aria-label="Close module information"><X size={16} /></button>
                <span className="cyber-readout-eyebrow">{node.category}</span>
                <div className="cyber-readout-head">
                  <span className={`cyber-readout-pill ${node.color}`}>{node.number} // {node.name}</span>
                  <span className="cyber-readout-sub">{node.subTitle}</span>
                </div>
                <p className="cyber-readout-desc">{node.description}</p>
                <div className="cyber-readout-techs">{node.technologies.map(tech => <span key={tech}>{tech}</span>)}</div>
                <div className="cyber-readout-specs">{node.specs.map(spec => (
                  <span key={spec} className="cyber-spec-item"><CheckCircle2 size={12} color={node.hexColor} />{spec}</span>
                ))}</div>
                <a href={node.targetChapter} className="cyber-readout-link">Inspect in Exhibit <ExternalLink size={12} /></a>
              </div>
            ))}
            {selectedNode && !selection?.arrived && <p className="cyber-link-pending">Connecting to {selectedNode.name}…</p>}
            {activeNodeId === null && <div className="cyber-default-readout">
              <span className="cyber-readout-eyebrow">KT / ARCHITECTURE EXHIBIT</span>
              <strong>One machine. Five connected disciplines.</strong>
              <p>Explore the modules behind the work: interfaces, services, infrastructure and data, connected through the system core.</p>
              <p className="cyber-readout-instruction">Select a module to inspect its role, technologies and engineering decisions.</p>
            </div>}
          </div>
      </aside>
      {selectedNode && selection && signalPath && <React.Fragment key={`${selectedNode.id}:${selection.run}`}>
        <svg className={`cyber-selection-route ${selection.arrived ? 'is-complete' : ''}`} aria-hidden="true">
          <g className="cyber-connection cyber-selection-signal" data-signal-node={selectedNode.id} style={{ color: selectedNode.hexColor }}>
            <path d={signalPath} strokeWidth="1" opacity="0.15" />
            <path d={signalPath} pathLength="1" className="cyber-selection-draw" strokeWidth="2" />
          </g>
        </svg>
        <span className={`cyber-selection-head ${selection.arrived ? 'is-complete' : ''}`} aria-hidden="true"
          style={{ offsetPath: `path("${signalPath}")`, color: selectedNode.hexColor }}
          onAnimationEnd={event => {
            if (event.animationName !== 'hero-led-flight') return;
            setSelection(current => current?.nodeId === selectedNode.id && current.run === selection.run
              ? { ...current, arrived: true } : current);
          }} />
      </React.Fragment>}
    </div>
  );
};

export default SculptureCanvas;
