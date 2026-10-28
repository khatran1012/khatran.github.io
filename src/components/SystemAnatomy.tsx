import React, { useState } from 'react';
import { Layers, Sliders, CheckCircle, Activity, Cpu } from 'lucide-react';
import { EXHIBITION_LAYERS } from '../data/cvData';
import { LayeredAnatomy3D } from './canvas/LayeredAnatomy3D';

export const SystemAnatomy: React.FC = () => {
  const [activeLayerId, setActiveLayerId] = useState<string>('layer-surface');
  const [layerOffsets, setLayerOffsets] = useState<Record<string, number>>({});
  const selectLayer = (layerId: string) => {
    setActiveLayerId(layerId);
    setLayerOffsets((previous) => ({ ...previous, [layerId]: 0 }));
  };
  const moveLayer = (layerId: string, offset: number) => {
    setLayerOffsets((previous) => ({ ...previous, [layerId]: Math.max(-60, Math.min(60, Math.round(offset))) }));
  };

  return (
    <section id="system" className="section section-alt">
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="chapter-badge">
            <Layers size={13} />
            <span>CHAPTER 02 // INSIDE THE SYSTEM</span>
          </div>
          <h2 className="chapter-title">
            Deconstructed <span className="accent-patina">Anatomy.</span>
          </h2>
          <p className="chapter-desc">
            A software system is not a flat file of code. It is a connected stack of
            interdependent planes—from the physical edge turnstile to the deterministic interface.
            Focus a layer to bring it forward. Trace its signal through the shared bus, then inspect the projects and engineering decisions behind it.
          </p>
        </div>

        {/* Interactive Controls Bar */}
        <div
          className="arch-slab"
          style={{
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Quick Layer Switcher */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                marginRight: '0.5rem',
              }}
            >
              Select Plane:
            </span>
            {EXHIBITION_LAYERS.map((layer) => {
              const isSelected = layer.id === activeLayerId;
              return (
                <button
                  key={layer.id}
                  onClick={() => selectLayer(layer.id)}
                  aria-pressed={isSelected}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-xs)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: isSelected ? 'var(--copper-patina-subtle)' : 'transparent',
                    border: `1px solid ${isSelected ? 'var(--copper-patina-border)' : 'var(--border-arch)'}`,
                    color: isSelected ? 'var(--copper-patina)' : 'var(--text-secondary)',
                    transition: 'all var(--trans-fast)',
                  }}
                >
                  {layer.slabLabel} // {layer.number}
                </button>
              );
            })}
          </div>

          {/* Move the selected board without changing its vertical spacing. */}
          <div className="pcb-move-controls">
            <Sliders size={16} color="var(--copper-patina)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Layer Offset:
            </span>
            <input
              type="range"
              min="-60"
              max="60"
              step="1"
              value={layerOffsets[activeLayerId] ?? 0}
              onChange={(event) => moveLayer(activeLayerId, Number(event.target.value))}
              aria-label="Move selected layer left or right"
              aria-valuetext={`${layerOffsets[activeLayerId] ?? 0} units from center`}
              style={{
                accentColor: 'var(--copper-patina)',
                cursor: 'pointer',
                width: 'clamp(60px, 20vw, 120px)',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--copper-patina)',
                minWidth: '35px',
              }}
            >
              {layerOffsets[activeLayerId] ?? 0}
            </span>
            <button type="button" className="pcb-center-button" onClick={() => moveLayer(activeLayerId, 0)}>
              Center layer
            </button>
          </div>
        </div>

        {/* 3D Model & Technical Spec Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Connected circuit boards with independent horizontal movement. */}
          <div
            className="arch-slab anatomy-stack-panel"
            style={{
              height: 'clamp(560px, 50vw, 720px)',
              padding: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <LayeredAnatomy3D
              activeLayerId={activeLayerId}
              onSelectLayer={setActiveLayerId}
              layerOffsets={layerOffsets}
              onMoveLayer={moveLayer}
            />
            {/* Clean Non-Overlapping Status Bar */}
            <div className="anatomy-status"
              style={{
                position: 'absolute',
                bottom: '0.85rem',
                left: '1rem',
                right: '1rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.35rem 0.75rem',
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-arch)',
                borderRadius: 'var(--radius-xs)',
                pointerEvents: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Activity size={13} color="var(--copper-patina)" />
                <span style={{ fontWeight: 600 }}>Connected Circuit Stack</span>
              </div>
              <span style={{ color: 'var(--text-tertiary)' }}>Drag · snap · double click to center</span>
            </div>
          </div>

          {/* Technical Spec & Decision Rationale Panel */}
          <div className="anatomy-details" aria-label="Layer inspection">
            {EXHIBITION_LAYERS.map((activeLayer) => (
            <div
              key={activeLayer.id}
              aria-hidden={activeLayer.id !== activeLayerId}
              className="arch-slab anatomy-detail-panel"
              style={{
                padding: '2.25rem',
                borderColor: 'var(--copper-patina-border)',
                '--pcb-signal-color': activeLayer.color,
              } as React.CSSProperties}
            >
              <div className="pcb-inspection-kicker"><Activity size={14} /> LAYER INSPECTION <span>EXPERIENCE / {activeLayer.number}</span></div>
              {/* Layer Title & Number */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span className="arch-tag patina">
                  PLANE {activeLayer.number} // {activeLayer.slabLabel}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--copper-warm-bright)',
                    fontWeight: 600,
                  }}
                >
                  {activeLayer.metrics}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: '1.8rem',
                  color: 'var(--text-ivory)',
                  marginBottom: '0.75rem',
                }}
              >
                {activeLayer.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {activeLayer.description}
              </p>

              <div className="pcb-inspection-route" aria-label={`${activeLayer.slabLabel} signal route illustration`}>
                <div><span className="pcb-route-status-dot" /><strong>ROUTE ACTIVE</strong><span>INTERACTIVE DIAGRAM</span></div>
                <p>{activeLayer.signalLabel} <span aria-hidden="true">→</span> SYSTEM BUS <span aria-hidden="true">→</span> INSPECTION</p>
                <div className="pcb-signal-meter" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} style={{ animationDelay: `${index * 90}ms` }} />)}</div>
              </div>
              <div className="pcb-experience-context"><span>PROJECT CONTEXT</span><p>{activeLayer.experienceContext}</p></div>
              {/* Technologies Pinned to this Plane */}
              <div style={{ marginBottom: '1.75rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.6rem',
                  }}
                >
                  Stack used across these projects
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {activeLayer.technologies.map((tech) => (
                    <span key={tech} className="arch-tag">
                      <CheckCircle size={12} color="var(--copper-patina)" />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Architectural Decision Rationale */}
              <div
                style={{
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-arch)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--copper-patina)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: '0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Cpu size={14} />
                  <span>Engineering Decision Rationale</span>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-ivory)', lineHeight: 1.6 }}>
                  {activeLayer.engineeringRationale}
                </p>
              </div>

              {/* Trade-Offs Considered */}
              <div
                style={{
                  borderLeft: '2px solid var(--copper-warm)',
                  paddingLeft: '1rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: 'var(--copper-warm-bright)', display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                  Trade-Off Evaluated:
                </strong>
                {activeLayer.tradeoffs}
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
