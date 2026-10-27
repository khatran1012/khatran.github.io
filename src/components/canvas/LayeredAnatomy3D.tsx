import React, { useState } from 'react';
import { EXHIBITION_LAYERS } from '../../data/cvData';

interface LayeredAnatomy3DProps {
  activeLayerId: string;
  onSelectLayer: (layerId: string) => void;
  explosionFactor: number;
}

export const LayeredAnatomy3D: React.FC<LayeredAnatomy3DProps> = ({
  activeLayerId,
  onSelectLayer,
  explosionFactor,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Isometric 3D Layer offsets matching user's exact diagram
  // Slabs: DESIGN (01), LOGIC (02), BRIDGE (03), PERSISTENCE (04), SYSTEM (05)
  const getSlabTransform = (index: number) => {
    // Center is index 2 (BRIDGE)
    const offsetFromCenter = index - 2;
    // Base Y spacing + explosion expansion
    const yShift = offsetFromCenter * (44 + explosionFactor * 48);
    return `translateY(${yShift}px)`;
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      {/* Background Architectural Drafting Coordinate Axes */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        viewBox="0 0 500 500"
      >
        <defs>
          <radialGradient id="patinaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(50, 168, 149, 0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <circle cx="250" cy="250" r="210" fill="url(#patinaGlow)" />

        {/* Dashed Elliptical Construction Orbits (Matching User Diagram) */}
        <ellipse
          cx="250"
          cy="250"
          rx="210"
          ry="110"
          fill="none"
          stroke="rgba(245, 242, 235, 0.16)"
          strokeWidth="1.2"
          strokeDasharray="5,6"
        />
        <ellipse
          cx="250"
          cy="250"
          rx="170"
          ry="88"
          fill="none"
          stroke="rgba(50, 168, 149, 0.22)"
          strokeWidth="1.2"
          strokeDasharray="4,5"
        />

        {/* Horizontal Dashed Center Line (Matching User Diagram) */}
        <line
          x1="30"
          y1="250"
          x2="470"
          y2="250"
          stroke="rgba(245, 242, 235, 0.18)"
          strokeWidth="1"
          strokeDasharray="4,5"
        />
        <line
          x1="250"
          y1="60"
          x2="250"
          y2="440"
          stroke="rgba(50, 168, 149, 0.25)"
          strokeWidth="1"
          strokeDasharray="3,4"
        />

        {/* Crosshair Markers at Axis Ends */}
        <text x="35" y="246" fill="var(--text-tertiary)" fontSize="10" fontFamily="var(--font-mono)">+</text>
        <text x="455" y="246" fill="var(--text-tertiary)" fontSize="10" fontFamily="var(--font-mono)">+</text>
        <text x="246" y="55" fill="var(--copper-patina)" fontSize="10" fontFamily="var(--font-mono)">▲</text>
        <text x="246" y="455" fill="var(--copper-warm-bright)" fontSize="10" fontFamily="var(--font-mono)">▼</text>
      </svg>

      {/* Layer Slabs Container (Axonometric Isometric Projection) */}
      <div
        style={{
          position: 'relative',
          width: '320px',
          height: '240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {EXHIBITION_LAYERS.map((layer, index) => {
          const isSelected = activeLayerId === layer.id;
          const isHovered = hoveredId === layer.id;
          const isWarm = layer.slabLabel === 'SYSTEM' || layer.slabLabel === 'PERSISTENCE';

          // Callout pointer coordinates
          const calloutLabel = `${layer.slabLabel} // 0${index + 1}`;

          return (
            <div
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              onMouseEnter={() => setHoveredId(layer.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                position: 'absolute',
                transform: getSlabTransform(index),
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                zIndex: isSelected ? 30 : 20 - index,
              }}
            >
              {/* Isometric Rhomboid Prism (The 3D Slab) */}
              <div
                style={{
                  position: 'relative',
                  width: '210px',
                  height: '110px',
                  transition: 'all 0.25s ease',
                  filter: isSelected
                    ? `drop-shadow(0 0 16px ${isWarm ? 'rgba(196, 122, 83, 0.4)' : 'rgba(50, 168, 149, 0.45)'})`
                    : isHovered
                    ? 'drop-shadow(0 0 10px rgba(245, 242, 235, 0.2))'
                    : 'none',
                }}
              >
                <svg
                  viewBox="0 0 210 110"
                  style={{ width: '100%', height: '100%', overflow: 'visible' }}
                >
                  {/* Top Face (Rhombus) */}
                  <polygon
                    points="105,8 200,52 105,96 10,52"
                    fill={
                      isSelected
                        ? isWarm
                          ? '#2a1a15'
                          : '#172825'
                        : isWarm
                        ? '#1d1715'
                        : '#141c1a'
                    }
                    stroke={
                      isSelected
                        ? isWarm
                          ? '#de8e65'
                          : '#32a895'
                        : isHovered
                        ? 'rgba(245, 242, 235, 0.5)'
                        : isWarm
                        ? 'rgba(196, 122, 83, 0.45)'
                        : 'rgba(50, 168, 149, 0.35)'
                    }
                    strokeWidth={isSelected ? '2' : '1.2'}
                  />

                  {/* Left Extrusion Side */}
                  <polygon
                    points="10,52 105,96 105,108 10,64"
                    fill={isWarm ? '#120f0e' : '#0d1312'}
                    stroke={isSelected ? (isWarm ? '#de8e65' : '#32a895') : 'rgba(245, 242, 235, 0.15)'}
                    strokeWidth="1"
                  />

                  {/* Right Extrusion Side */}
                  <polygon
                    points="105,96 200,52 200,64 105,108"
                    fill={isWarm ? '#181210' : '#101716'}
                    stroke={isSelected ? (isWarm ? '#de8e65' : '#32a895') : 'rgba(245, 242, 235, 0.15)'}
                    strokeWidth="1"
                  />

                  {/* Top Vertex Node (Orange/Patina Dot like user diagram) */}
                  <circle
                    cx="105"
                    cy="8"
                    r={isSelected ? '3.8' : '2.8'}
                    fill={isWarm ? '#de8e65' : '#32a895'}
                  />

                  {/* Bottom Vertex Node */}
                  <circle
                    cx="105"
                    cy="108"
                    r={isSelected ? '3.8' : '2.8'}
                    fill={isWarm ? '#de8e65' : '#32a895'}
                  />

                  {/* Slab Label printed on top face */}
                  <text
                    x="105"
                    y="55"
                    textAnchor="middle"
                    fill={isSelected ? (isWarm ? '#de8e65' : '#44caa8') : '#f5f2eb'}
                    fontSize="11"
                    fontFamily="var(--font-mono)"
                    fontWeight="700"
                    letterSpacing="0.08em"
                  >
                    {layer.slabLabel}
                  </text>
                </svg>

                {/* Architectural Callout Pointer & Label (Matching User Diagram) */}
                <div
                  style={{
                    position: 'absolute',
                    top: '44px',
                    left: '205px',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                    opacity: isSelected || isHovered ? 1 : 0.65,
                    transition: 'all 0.25s ease',
                  }}
                >
                  {/* Callout Elbow Line */}
                  <div
                    style={{
                      width: '32px',
                      height: '1px',
                      background: isSelected
                        ? isWarm
                          ? 'var(--copper-warm-bright)'
                          : 'var(--copper-patina)'
                        : 'var(--border-arch)',
                    }}
                  />
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected
                        ? isWarm
                          ? 'var(--copper-warm-bright)'
                          : 'var(--copper-patina)'
                        : 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      paddingLeft: '0.45rem',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {calloutLabel}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Interactive Guide */}
      <div
        style={{
          position: 'absolute',
          bottom: '0.75rem',
          left: '1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-tertiary)',
        }}
      >
        <span>[AXONOMETRIC DECONSTRUCTION] // CLICK ANY SLAB</span>
      </div>
    </div>
  );
};
