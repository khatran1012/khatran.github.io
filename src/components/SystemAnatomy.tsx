import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Sliders, CheckCircle, Activity, Cpu } from 'lucide-react';
import { EXHIBITION_LAYERS } from '../data/cvData';
import { LayeredAnatomy3D } from './canvas/LayeredAnatomy3D';

export const SystemAnatomy: React.FC = () => {
  const [activeLayerId, setActiveLayerId] = useState<string>('layer-surface');
  const [explosionFactor, setExplosionFactor] = useState<number>(0.65);

  const activeLayer =
    EXHIBITION_LAYERS.find((l) => l.id === activeLayerId) || EXHIBITION_LAYERS[0];

  return (
    <section id="system" className="section" style={{ backgroundColor: 'rgba(12, 15, 18, 0.6)' }}>
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
            A software system is not a flat file of code. It is an exploded stack of
            interdependent planes—from the physical edge turnstile to the deterministic interface.
            Rotate, explode, and inspect the engineering decisions governing each layer.
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
                  onClick={() => setActiveLayerId(layer.id)}
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

          {/* Explosion Slider Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Sliders size={16} color="var(--copper-patina)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Explode Stack:
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={explosionFactor}
              onChange={(e) => setExplosionFactor(parseFloat(e.target.value))}
              aria-label="Explode Stack"
              style={{
                accentColor: 'var(--copper-patina)',
                cursor: 'pointer',
                width: '120px',
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
              {Math.round(explosionFactor * 100)}%
            </span>
          </div>
        </div>

        {/* 3D Model & Technical Spec Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          {/* 3D Exploded Isometric View */}
          <div
            className="arch-slab"
            style={{
              height: '520px',
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
              explosionFactor={explosionFactor}
            />
            {/* Direct Hint */}
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Activity size={13} color="var(--copper-patina)" />
              <span>Click slabs or drag to rotate 3D view</span>
            </div>
          </div>

          {/* Technical Spec & Decision Rationale Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLayer.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="arch-slab"
              style={{
                padding: '2.25rem',
                borderColor: 'var(--copper-patina-border)',
              }}
            >
              {/* Layer Title & Number */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
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
                  Active Stack &amp; Subsystems
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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
