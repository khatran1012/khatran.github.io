import React, { useState, useLayoutEffect, useRef } from 'react';
import {
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  Zap,
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
    xPercent: 49.6,
    yPercent: 42.0,
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
    number: '01',
    name: 'FRONTEND',
    subTitle: 'React / TypeScript',
    category: 'DETERMINISTIC UI',
    xPercent: 27.5,
    yPercent: 22.5,
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
    xPercent: 75.5,
    yPercent: 30.0,
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
    xPercent: 24.2,
    yPercent: 64.5,
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
    xPercent: 74.5,
    yPercent: 71.0,
    color: 'cyan',
    hexColor: '#26e8db',
    badgeLabel: 'POSTGRES / REDIS',
    technologies: ['PostgreSQL', 'Redis Distributed Lock', 'Data Pipeline', 'Caching & Sync'],
    specs: ['Row-level pessimistic locking', 'Zero ticket double-spending', 'Write-ahead log sync'],
    description: 'Deterministic ACID storage combining distributed Redis mutex gates with PostgreSQL for absolute transactional integrity under contention.',
    targetChapter: '#system',
  },
];

export const SculptureCanvas: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [neonActive, setNeonActive] = useState<boolean>(true);
  const hudRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const exhibitRef = useRef<HTMLDivElement>(null);
  const [signalPath, setSignalPath] = useState('');

  const activeNode = SYSTEM_NODES.find((n) => n.id === activeNodeId) || null;

  useLayoutEffect(() => {
    if (!activeNode || !hudRef.current) return;
    const position = () => {
      const anchor = viewerRef.current?.querySelector(`[data-node="${activeNode.id}"]`)?.getBoundingClientRect();
      const card = hudRef.current?.getBoundingClientRect();
      const exhibit = exhibitRef.current?.getBoundingClientRect();
      if (!anchor || !card || !exhibit) return;
      const startX = anchor.left + anchor.width / 2 - exhibit.left;
      const startY = anchor.top + anchor.height / 2 - exhibit.top;
      const endX = card.right - exhibit.left - 24;
      const endY = card.top - exhibit.top;
      const edgeX = exhibit.width + 12;
      setSignalPath(`M ${startX} ${startY} H ${edgeX - 16} Q ${edgeX} ${startY} ${edgeX} ${startY + 16} V ${endY - 16} Q ${edgeX} ${endY} ${edgeX - 16} ${endY} H ${endX}`);
    };
    position();
    const dismiss = () => {
      setActiveNodeId(null);
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && (event.target.closest('.cyber-hotspot-trigger, .cyber-tab-btn, .cyber-action-btn') || hudRef.current?.contains(event.target))) return;
      dismiss();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };
    window.addEventListener('resize', position);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', position);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeNode]);

  const selectNode = (id: string | null) => {
    setActiveNodeId((prev) => (prev === id ? null : id));
  };

  const resetView = () => {
    setActiveNodeId(null);
  };

  return (
    <>
      <div ref={exhibitRef} className={`cyber-exhibit ${neonActive ? '' : 'neon-paused'}`}>
      <div ref={viewerRef} className={`cyber-core-viewer ${neonActive ? '' : 'neon-paused'}`} role="region" aria-label="Interactive System Architecture Exhibit">
        {/* Top Console Bar */}
        <div className="cyber-core-header">
          <div className="cyber-core-title">
            <span className="cyber-status-led" />
            <span className="cyber-title-main">KT-CORE // SYSTEM ANATOMY</span>
            <span className="cyber-title-status">● LIVE LED CONDUITS</span>
          </div>

          {/* Quick Node Switcher Tabs */}
          <div className="cyber-node-tabs" role="group" aria-label="Filter architecture modules">
            <button
              type="button"
              className={`cyber-tab-btn ${activeNodeId === null ? 'active' : ''}`}
              onClick={() => selectNode(null)}
              aria-pressed={activeNodeId === null}
            >
              ALL NODES
            </button>
            {SYSTEM_NODES.map((node) => {
              const isSelected = activeNodeId === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  className={`cyber-tab-btn ${isSelected ? 'active' : ''} ${node.color}`}
                  onClick={() => selectNode(node.id)}
                  aria-pressed={isSelected}
                  title={`${node.number} ${node.name} — ${node.subTitle}`}
                >
                  <span className="cyber-tab-num">{node.number}</span> {node.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 16:9 Interactive Motherboard Viewport */}
        <div className="cyber-core-viewport">
          {/* Razor-Sharp Ultra-HD Image Presentation */}
          <picture className="cyber-core-picture">
            <source
              type="image/webp"
              srcSet="./hero-anatomy-core-640.webp 640w, ./hero-anatomy-core-1280.webp 1280w, ./hero-anatomy-core.webp 2048w"
              sizes="(min-width: 1260px) 605px, (min-width: 1024px) 48vw, calc(100vw - 48px)"
            />
            <img
              src="./hero-anatomy-core.png"
              alt="Kha Tran - Software Engineer - The Anatomy of Building Interactive Engineering Exhibit"
              className="cyber-core-img"
              width="2048"
              height="1152"
              loading="eager"
              decoding="async"
            />
          </picture>

          {/* SVG Glowing Neon LED Conduits & Dynamic Light Overlay */}
          <svg
            className={`cyber-svg-overlay ${neonActive ? 'neon-active' : ''}`}
            viewBox="0 0 1024 576"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              {/* Cyan Glow Filters */}
              <filter id="cyan-glow-intense" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3" result="blur1" />
                <feGaussianBlur stdDeviation="8" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Amber Glow Filters */}
              <filter id="amber-glow-intense" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3" result="blur1" />
                <feGaussianBlur stdDeviation="8" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Conduits Gradients */}
              <linearGradient id="grad-conduit-fe" x1="1" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#38efd8" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#00f5d4" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>

              <linearGradient id="grad-conduit-be" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff9e2c" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#ffaa22" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>

              <linearGradient id="grad-conduit-infra" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff9e2c" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#ffb703" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>

              <linearGradient id="grad-conduit-data" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38efd8" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#26e8db" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>

              {/* Vertical Beams */}
              <linearGradient id="grad-beam-cyan" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#38efd8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="grad-beam-amber" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#ffaa22" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#ff9e2c" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Ambient Concentric Orbit Rings around Center KT Core */}
            <g className="neon-core-rings" opacity={neonActive ? '0.65' : '0.2'}>
              <ellipse
                cx="506"
                cy="275"
                rx="145"
                ry="72"
                fill="none"
                stroke="#00f5d4"
                strokeWidth="1.2"
                strokeDasharray="4 8"
                filter="url(#cyan-glow-intense)"
                className="spin-cw"
              />
              <ellipse
                cx="506"
                cy="275"
                rx="195"
                ry="98"
                fill="none"
                stroke="#ffaa22"
                strokeWidth="1"
                strokeDasharray="6 14"
                filter="url(#amber-glow-intense)"
                className="spin-ccw"
              />
            </g>

            {/* Vertical Data Beams */}
            <g className="neon-vertical-beams" opacity={neonActive ? '0.75' : '0.15'}>
              <line x1="506" y1="242" x2="506" y2="15" stroke="url(#grad-beam-cyan)" strokeWidth="3" filter="url(#cyan-glow-intense)" />
              <line x1="280" y1="130" x2="280" y2="15" stroke="url(#grad-beam-cyan)" strokeWidth="2.5" filter="url(#cyan-glow-intense)" />
              <line x1="774" y1="172" x2="774" y2="15" stroke="url(#grad-beam-amber)" strokeWidth="2.5" filter="url(#amber-glow-intense)" />
            </g>

            {/* 1. FRONTEND CONDUIT (Cyan, Top-Left) */}
            <g
              className={`neon-conduit-group ${activeNode?.id === 'frontend' ? 'is-focused' : ''} ${activeNode && activeNode.id !== 'frontend' ? 'is-dimmed' : ''}`}
            >
              {/* Outer Bloom */}
              <path
                d="M 450 222 C 400 206, 350 185, 298 165"
                fill="none"
                stroke="#00f5d4"
                strokeWidth="6"
                filter="url(#cyan-glow-intense)"
                opacity="0.65"
              />
              {/* Neon Tube Core */}
              <path
                d="M 450 222 C 400 206, 350 185, 298 165"
                fill="none"
                stroke="url(#grad-conduit-fe)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Pulsing White Laser Fiber */}
              <path
                d="M 450 222 C 400 206, 350 185, 298 165"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.95"
              />
              {/* Animated Data Packets Flowing to Frontend */}
              {neonActive && (
                <path
                  d="M 450 222 C 400 206, 350 185, 298 165"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.8"
                  strokeDasharray="8 20"
                  className="conduit-data-flow reverse-flow"
                />
              )}
            </g>

            {/* 2. BACKEND CONDUIT (Amber, Top-Right) */}
            <g
              className={`neon-conduit-group ${activeNode?.id === 'backend' ? 'is-focused' : ''} ${activeNode && activeNode.id !== 'backend' ? 'is-dimmed' : ''}`}
            >
              {/* Outer Bloom */}
              <path
                d="M 560 274 C 625 268, 680 250, 742 216"
                fill="none"
                stroke="#ffaa22"
                strokeWidth="6"
                filter="url(#amber-glow-intense)"
                opacity="0.65"
              />
              {/* Neon Tube Core */}
              <path
                d="M 560 274 C 625 268, 680 250, 742 216"
                fill="none"
                stroke="url(#grad-conduit-be)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Pulsing White Laser Fiber */}
              <path
                d="M 560 274 C 625 268, 680 250, 742 216"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.95"
              />
              {/* Animated Data Packets Flowing to Backend */}
              {neonActive && (
                <path
                  d="M 560 274 C 625 268, 680 250, 742 216"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.8"
                  strokeDasharray="8 20"
                  className="conduit-data-flow"
                />
              )}
            </g>

            {/* 3. INFRASTRUCTURE CONDUIT (Amber, Bottom-Left) */}
            <g
              className={`neon-conduit-group ${activeNode?.id === 'infra' ? 'is-focused' : ''} ${activeNode && activeNode.id !== 'infra' ? 'is-dimmed' : ''}`}
            >
              {/* Outer Bloom */}
              <path
                d="M 455 298 C 405 328, 345 358, 270 365"
                fill="none"
                stroke="#ff9e2c"
                strokeWidth="6"
                filter="url(#amber-glow-intense)"
                opacity="0.65"
              />
              {/* Neon Tube Core */}
              <path
                d="M 455 298 C 405 328, 345 358, 270 365"
                fill="none"
                stroke="url(#grad-conduit-infra)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Pulsing White Laser Fiber */}
              <path
                d="M 455 298 C 405 328, 345 358, 270 365"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.95"
              />
              {/* Animated Data Packets Flowing to Infra */}
              {neonActive && (
                <path
                  d="M 455 298 C 405 328, 345 358, 270 365"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.8"
                  strokeDasharray="8 20"
                  className="conduit-data-flow reverse-flow"
                />
              )}
            </g>

            {/* 4. DATA CONDUIT (Cyan, Bottom-Right) */}
            <g
              className={`neon-conduit-group ${activeNode?.id === 'data' ? 'is-focused' : ''} ${activeNode && activeNode.id !== 'data' ? 'is-dimmed' : ''}`}
            >
              {/* Outer Bloom */}
              <path
                d="M 560 318 C 615 345, 680 378, 755 416"
                fill="none"
                stroke="#26e8db"
                strokeWidth="6"
                filter="url(#cyan-glow-intense)"
                opacity="0.65"
              />
              {/* Neon Tube Core */}
              <path
                d="M 560 318 C 615 345, 680 378, 755 416"
                fill="none"
                stroke="url(#grad-conduit-data)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Pulsing White Laser Fiber */}
              <path
                d="M 560 318 C 615 345, 680 378, 755 416"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.95"
              />
              {/* Animated Data Packets Flowing to Data */}
              {neonActive && (
                <path
                  d="M 560 318 C 615 345, 680 378, 755 416"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.8"
                  strokeDasharray="8 20"
                  className="conduit-data-flow"
                />
              )}
            </g>
          </svg>

          {/* Interactive Hotspot Targets on All 5 Nodes */}
          {SYSTEM_NODES.map((node) => {
            const isSelected = activeNodeId === node.id;
            const isHighlighted = activeNode?.id === node.id;

            return (
              <div
                key={node.id}
                data-node={node.id}
                className={`cyber-hotspot-pin ${node.color} ${isHighlighted ? 'active' : ''}`}
                style={{
                  left: `${node.xPercent}%`,
                  top: `${node.yPercent}%`,
                }}
              >
                {/* Clickable Target Button */}
                <button
                  type="button"
                  className="cyber-hotspot-trigger"
                  onClick={() => selectNode(node.id)}
                  aria-label={`Inspect ${node.number} ${node.name} (${node.subTitle})`}
                  aria-pressed={isSelected}
                >
                  <span className="cyber-hotspot-radar" />
                  <span className="cyber-hotspot-reticle" />
                  <span className="cyber-hotspot-dot" />
                  <span className="cyber-hotspot-tag">{node.badgeLabel}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Telemetry & Control Bar */}
        <div className="cyber-core-footer">
          {/* Active Node Narrative Specs */}
          <div className="cyber-footer-readout">
            {SYSTEM_NODES.map((activeNode) => (
              <div key={activeNode.id} className="cyber-node-readout" aria-hidden={activeNode.id !== activeNodeId}>
                <div className="cyber-readout-head">
                  <span className={`cyber-readout-pill ${activeNode.color}`}>
                    {activeNode.number} // {activeNode.name}
                  </span>
                  <span className="cyber-readout-sub">{activeNode.subTitle}</span>
                </div>
                <p className="cyber-readout-desc">{activeNode.description}</p>
                <div className="cyber-readout-specs">
                  {activeNode.specs.map((spec) => (
                    <span key={spec} className="cyber-spec-item">
                      <CheckCircle2 size={12} color={activeNode.hexColor} />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
              <div className="cyber-default-readout" aria-hidden={!!activeNode}>
                <span className="cyber-readout-eyebrow">KT / ARCHITECTURE EXHIBIT</span>
                <strong>Interconnected Fullstack Substrates</strong>
                <p>
                  5 high-concurrency systems connected by real-time neon LED conduits. Click a node to trace its signal to the detail banner.
                </p>
              </div>
          </div>

          {/* Action Tools */}
          <div className="cyber-footer-actions">
            {/* Toggle Neon Stream */}
            <button
              type="button"
              className={`cyber-action-btn ${neonActive ? 'active' : ''}`}
              onClick={() => setNeonActive((prev) => !prev)}
              aria-pressed={neonActive}
              title={neonActive ? 'Tắt hiệu ứng luồng LED Neon' : 'Bật hiệu ứng luồng LED Neon'}
            >
              <Zap size={14} />
              <span>{neonActive ? 'LED Neon: ON' : 'LED Neon: OFF'}</span>
            </button>

            {/* Reset */}
            <button
              type="button"
              className="cyber-action-btn"
              onClick={resetView}
              title="Đặt lại góc nhìn ban đầu"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {activeNode && signalPath && (
        <svg key={activeNode.id} className="cyber-node-signal" aria-hidden="true">
          <path d={signalPath} pathLength="1" className="cyber-node-signal-trace" style={{ stroke: activeNode.hexColor, color: activeNode.hexColor }} />
          <path d={signalPath} pathLength="1" className="cyber-node-signal-packet" />
        </svg>
      )}
      <div className="cyber-banner-rail">
      {activeNode ? (
        <div key={activeNode.id} ref={hudRef} className={`cyber-hud-card cyber-external-banner ${activeNode.color}`} aria-live="polite">
          <div className="cyber-hud-header">
            <span className="cyber-hud-badge">NODE {activeNode.number} // {activeNode.category}</span>
            <span className="cyber-hud-dot" />
          </div>
          <div className="cyber-hud-title">{activeNode.name}</div>
          <div className="cyber-hud-sub">{activeNode.subTitle}</div>

          <div className="cyber-hud-techs">
            {activeNode.technologies.map((tech) => (
              <span key={tech} className="cyber-hud-tag">
                {tech}
              </span>
            ))}
          </div>

          <div className="cyber-hud-footer">
            <a href={activeNode.targetChapter} className="cyber-hud-link">
              <span>Inspect in Exhibit</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      ) : <p className="cyber-banner-hint">SELECT A NODE // FOLLOW THE SIGNAL</p>}
      </div>
      </div>

    </>
  );
};

export default SculptureCanvas;
