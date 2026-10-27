import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Building2,
  X,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { PROJECTS, Project } from '../data/cvData';

export const BuiltInReality: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Exhibition narrative data matching Kha Tran's exact projects
  const EXHIBITION_STORIES: Record<
    string,
    {
      problem: string;
      architecture: string;
      ownership: string;
      tradeoffs: string;
      results: string;
    }
  > = {
    'theme-park-iot': {
      problem:
        'Amusement park entry gates experience thousands of simultaneous barcode scans during peak rush hours. Central server network interruptions risked paralyzing physical turnstiles, while concurrent online & offline ticket redemptions risked catastrophic double-entry fraud.',
      architecture:
        'Hybrid Golang microservices (Gin, SQLC, PostgreSQL) combined with an autonomous on-premise Linux Edge Gateway. MQTT broker manages bidirectional telemetry. Redis distributed mutexes and PostgreSQL row-level locks (SELECT FOR UPDATE) serialize validations.',
      ownership:
        'Architected and implemented high-throughput backend services in Golang, engineered the offline-first edge caching and synchronization daemon, and authored public-facing OpenAPI integration endpoints for OTA partners (Klook, Traveloka).',
      tradeoffs:
        'Chose local HMAC-signed ticket verification on the edge gateway with Write-Ahead-Log (WAL) replay over blocking cloud verification. Prioritized 100% physical passage continuity over strict immediate cloud consensus.',
      results:
        'Achieved 100% turnstile physical hardware uptime during WAN disruptions, <15ms gate response times, and zero instances of ticket double-spending.',
    },
    'marina-bay-sands': {
      problem:
        'International tourists accessing ticket sales on high-latency mobile networks suffered high bounce rates. The platform needed instant first-paint times, global accessibility, and seamless transaction handoffs.',
      architecture:
        'Next.js SSR/SSG coupled with React Native Web Progressive Web App (PWA) architecture. Redux centralized state store with deterministic optimistic cart updates and secure multi-currency payment gateway integrations.',
      ownership:
        'Developed end-to-end e-commerce purchasing flows, optimized technical SEO to achieve sub-second LCP scores, and integrated localized payment gateways.',
      tradeoffs:
        'Maintained hybrid SSR/SSG rendering rather than full client-side SPA to guarantee SEO crawlability across global search engines while maintaining rich dynamic cart reactivity.',
      results:
        'Sub-second first paint times, seamless cross-platform desktop and mobile app experience, and resilient transaction conversion.',
    },
    'techcombank-portal': {
      problem:
        'Serving millions of banking customers across Vietnam requires absolute accessibility (WCAG 2.1 AA), zero layout shifts, and a unified enterprise CMS system enabling non-technical content authors to deploy dynamic banking products rapidly.',
      architecture:
        'Adobe Experience Manager (AEM) modular architecture. Custom component framework using Vanilla JavaScript to bypass heavy client-side runtime overhead.',
      ownership:
        'Customized and maintained modular AEM components, established strict WCAG AA accessibility compliance, and managed enterprise digital financial asset pipelines.',
      tradeoffs:
        'Deliberately avoided heavy client-side frameworks in favor of ultra-lean Vanilla JavaScript modules within AEM to guarantee maximum cross-device compatibility for elderly and low-spec banking users.',
      results:
        'Flawless WCAG AA compliance, zero layout shifts, and dramatic reduction in page publishing turnaround time for corporate banking campaigns.',
    },
    'nashtech-virtual-vietnam': {
      problem:
        'Needed an innovative, interactive 3D corporate showcase to present Vietnam’s cultural and technological landscape without requiring heavy app store downloads.',
      architecture:
        'Browser-based Three.js WebGL canvas combined with React and Tailwind CSS. Procedural 3D camera transitions and compressed GLTF texture streaming.',
      ownership:
        'Developed the 3D/360° interactive spatial environment using Three.js, optimized GPU draw calls for 60fps mobile execution, and integrated seamless audio-visual cues.',
      tradeoffs:
        'Employed low-poly geometric assets with baked ambient occlusion maps instead of real-time multi-light raymarching to ensure smooth 60fps performance on budget smartphones.',
      results:
        'Featured at major international NashTech showcase events, achieving 60fps interactive 3D rendering directly in standard mobile browsers.',
    },
  };

  return (
    <section id="reality" className="section" style={{ backgroundColor: 'rgba(12, 15, 18, 0.4)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="chapter-badge">
            <Building2 size={13} />
            <span>CHAPTER 04 // BUILT IN REALITY</span>
          </div>
          <h2 className="chapter-title">
            Engineered <span className="accent-patina">Artifacts.</span>
          </h2>
          <p className="chapter-desc">
            A portfolio of systems delivered under real constraints. Each artifact is presented
            with its core architectural problem, ownership boundaries, technical trade-offs, and
            measurable production outcomes.
          </p>
        </div>

        {/* Exhibition Projects Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem',
          }}
        >
          {PROJECTS.filter((p) => p.featured).map((project, idx) => {
            const story = EXHIBITION_STORIES[project.id] || {
              problem: project.description,
              architecture: project.technologies.join(', '),
              ownership: project.highlights[0] || '',
              tradeoffs: 'Optimized for high-performance delivery and reliability.',
              results: 'Successfully deployed to production with robust uptime.',
            };

            return (
              <div
                key={project.id}
                className="arch-slab"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Top Metadata */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <span className="arch-tag patina">
                      EXHIBIT 0{idx + 1} // {project.company?.toUpperCase()}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                      {project.period}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-editorial)',
                      fontSize: '1.45rem',
                      color: 'var(--text-ivory)',
                      lineHeight: 1.25,
                      marginBottom: '0.4rem',
                    }}
                  >
                    {project.title}
                  </h3>

                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--copper-warm-bright)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {project.subtitle}
                  </div>

                  {/* Core Problem Callout */}
                  <div
                    style={{
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--border-arch)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1rem',
                      marginBottom: '1.25rem',
                      fontSize: '0.88rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    <strong
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        color: 'var(--copper-patina)',
                        textTransform: 'uppercase',
                        marginBottom: '0.2rem',
                      }}
                    >
                      Problem Anatomy:
                    </strong>
                    {story.problem}
                  </div>

                  {/* Measured Outcome */}
                  <div
                    style={{
                      borderLeft: '2px solid var(--copper-patina)',
                      paddingLeft: '0.85rem',
                      marginBottom: '1.5rem',
                      fontSize: '0.85rem',
                      color: 'var(--text-ivory)',
                    }}
                  >
                    <strong
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--copper-patina)',
                        textTransform: 'uppercase',
                        display: 'block',
                      }}
                    >
                      Measured Outcome:
                    </strong>
                    {story.results}
                  </div>

                  {/* Tech Stack Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                    {project.technologies.slice(0, 5).map((t) => (
                      <span key={t} className="arch-tag" style={{ fontSize: '0.7rem' }}>
                        {t}
                      </span>
                    ))}
                    {project.technologies.length > 5 && (
                      <span className="arch-tag" style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                        +{project.technologies.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Inspect Case Study Button */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="btn-arch btn-arch-outline"
                    style={{ flex: 1, padding: '0.55rem 1rem', fontSize: '0.84rem' }}
                  >
                    <span>Inspect Case Study</span>
                    <ArrowUpRight size={15} />
                  </button>
                  {project.domain && (
                    <a
                      href={project.domain}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-arch btn-arch-outline"
                      style={{ padding: '0.55rem 0.85rem' }}
                      title="Visit Live Domain"
                      aria-label="Visit Live Domain"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Case Study Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(5, 7, 9, 0.88)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '1.5rem',
              }}
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="arch-slab"
                style={{
                  maxWidth: '780px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '2.5rem',
                  borderColor: 'var(--copper-patina-border)',
                }}
              >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                  <div>
                    <span className="arch-tag patina" style={{ marginBottom: '0.5rem' }}>
                      CASE STUDY // {selectedProject.company?.toUpperCase()}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.8rem', color: 'var(--text-ivory)' }}>
                      {selectedProject.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-arch)',
                      color: 'var(--text-ivory)',
                      borderRadius: 'var(--radius-xs)',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    aria-label="Close Case Study"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Narrative Sections */}
                {(() => {
                  const s = EXHIBITION_STORIES[selectedProject.id];
                  if (!s) return null;
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                      <div style={{ padding: '1.25rem', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-arch)' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--copper-patina)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                          01 // Architectural Challenge
                        </div>
                        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.problem}</p>
                      </div>

                      <div style={{ padding: '1.25rem', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-arch)' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--copper-warm-bright)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                          02 // System Architecture Blueprint
                        </div>
                        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.architecture}</p>
                      </div>

                      <div style={{ padding: '1.25rem', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-arch)' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--copper-patina)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                          03 // My Ownership &amp; Code Responsibility
                        </div>
                        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.ownership}</p>
                      </div>

                      <div style={{ padding: '1.25rem', background: 'var(--copper-warm-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--copper-warm-border)' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--copper-warm-bright)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                          04 // Technical Trade-Offs &amp; Decision
                        </div>
                        <p style={{ fontSize: '0.92rem', color: 'var(--text-ivory)', lineHeight: 1.6 }}>{s.tradeoffs}</p>
                      </div>

                      <div style={{ padding: '1.25rem', background: 'var(--copper-patina-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--copper-patina-border)' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--copper-patina)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                          05 // Production Metrics &amp; Impact
                        </div>
                        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-ivory)', lineHeight: 1.6 }}>{s.results}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Technologies List */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Full Technology Envelope:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedProject.technologies.map((t) => (
                      <span key={t} className="arch-tag">
                        <CheckCircle2 size={12} color="var(--copper-patina)" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="btn-arch btn-arch-patina"
                  style={{ width: '100%', padding: '0.75rem' }}
                >
                  Close Case Study
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
