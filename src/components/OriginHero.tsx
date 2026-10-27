import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Download, Layers, ShieldCheck, Cpu } from 'lucide-react';
import { PERSONAL_INFO } from '../data/cvData';
import { SculptureCanvas } from './canvas/SculptureCanvas';

export const OriginHero: React.FC = () => {
  return (
    <section id="origin" className="section" style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', paddingTop: '6rem' }}>
      <div className="container" style={{ width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Manifesto & Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Exhibition Badge */}
            <div className="chapter-badge">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--copper-patina)' }} />
              <span>CHAPTER 01 // THE ORIGIN</span>
            </div>

            {/* Exhibition Monolithic Title */}
            <h1
              className="chapter-title"
              style={{
                fontSize: 'clamp(2.6rem, 5.8vw, 4.4rem)',
                lineHeight: 1.05,
                marginBottom: '1rem',
              }}
            >
              The Anatomy <br />
              <span className="accent-patina">of Building.</span>
            </h1>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                color: 'var(--copper-warm-bright)',
                marginBottom: '1.5rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              An Interactive Engineering Exhibition — By {PERSONAL_INFO.name}
            </div>

            {/* Core Manifesto - Not long clichés, but deep engineering philosophy */}
            <div
              style={{
                borderLeft: '2px solid var(--copper-patina)',
                paddingLeft: '1.25rem',
                marginBottom: '2rem',
                fontFamily: 'var(--font-body)',
                fontSize: '1.08rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}
            >
              <p style={{ color: 'var(--text-ivory)', fontWeight: 600, marginBottom: '0.5rem' }}>
                Software is not transient syntax. It is an enduring, engineered anatomy.
              </p>
              <p>
                From deterministic frontend projection loops (React, TypeScript) to resilient,
                high-concurrency microservices and offline-first IoT edge hardware (Golang, PostgreSQL, MQTT).
                Built to withstand real network collapse and scale under contention.
              </p>
            </div>

            {/* Technical Attributes Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '1rem',
                marginBottom: '2.5rem',
              }}
            >
              <div className="arch-slab" style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--copper-patina)', marginBottom: '0.2rem' }}>
                  <Layers size={15} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Structure</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-ivory)' }}>
                  5 Architecture Slabs
                </div>
              </div>

              <div className="arch-slab" style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--copper-warm-bright)', marginBottom: '0.2rem' }}>
                  <ShieldCheck size={15} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Uptime</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-ivory)' }}>
                  100% Edge Offline
                </div>
              </div>

              <div className="arch-slab" style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-ivory)', marginBottom: '0.2rem' }}>
                  <Cpu size={15} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Role</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-ivory)' }}>
                  Software Engineer
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#system" className="btn-arch btn-arch-patina">
                <span>Enter The Exhibition</span>
                <ArrowDown size={17} />
              </a>
              <a
                href={PERSONAL_INFO.cvPdfUrl}
                download="Kha_Tran_Software_Engineer_CV.pdf"
                className="btn-arch btn-arch-outline"
              >
                <Download size={17} />
                <span>Download CV (PDF)</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: 3D Monolithic Abstract Sculpture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              height: '520px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SculptureCanvas />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
