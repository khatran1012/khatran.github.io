import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ExternalLink,
  Building2,
  X,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { PROJECTS, Project } from '../data/cvData';

export const BuiltInReality: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
    const projectId = new URLSearchParams(window.location.search).get('case');
    return PROJECTS.find((project) => project.featured && project.id === projectId) || null;
  });

  const caseStudyRef = useRef<HTMLDialogElement>(null);
  const restorePage = useRef<(() => void) | null>(null);
  const reducedMotion = useReducedMotion();
  const finishClose = () => {
    restorePage.current?.();
    restorePage.current = null;
  };
  useEffect(() => () => { restorePage.current?.(); }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedProject) url.searchParams.set('case', selectedProject.id);
    else url.searchParams.delete('case');
    window.history.replaceState(window.history.state, '', url);
    if (!selectedProject || !caseStudyRef.current) return;
    if (caseStudyRef.current.open) return;
    const dialog = caseStudyRef.current;
    const previousOverflow = document.body.style.overflow;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollPosition = { top: window.scrollY, left: window.scrollX };
    restorePage.current = () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
      window.scrollTo({ ...scrollPosition, behavior: 'instant' });
    };
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }, [selectedProject]);

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
        'My implementation scope: Golang backend services, edge caching and synchronization, and OTA-facing API endpoints. The architecture above describes the wider platform; delivery also involved frontend, infrastructure, and product teammates.',
      tradeoffs:
        'Chose local HMAC-signed ticket verification on the edge gateway with Write-Ahead-Log (WAL) replay over blocking cloud verification. Designed for local admission during WAN loss, accepting delayed reconciliation. Independent offline gateways require ticket partitioning or coordination to prevent duplicate admission.',
      results:
        'Implemented offline validation and deferred synchronization. Production uptime, gate latency, and cross-gateway duplicate rates are not benchmarked in this portfolio.',
    },
    'marina-bay-sands': {
      problem:
        'International tourists accessing ticket sales on high-latency mobile networks suffered high bounce rates. The platform needed instant first-paint times, global accessibility, and seamless transaction handoffs.',
      architecture:
        'Next.js SSR/SSG coupled with React Native Web Progressive Web App (PWA) architecture. Redux centralized state store with deterministic optimistic cart updates and secure multi-currency payment gateway integrations.',
      ownership:
        'Developed end-to-end e-commerce purchasing flows, worked on rendering performance and technical SEO, and integrated localized payment gateways.',
      tradeoffs:
        'Maintained hybrid SSR/SSG rendering rather than full client-side SPA to guarantee SEO crawlability across global search engines while maintaining rich dynamic cart reactivity.',
      results:
        'Delivered purchasing interfaces across desktop and mobile. No public LCP or conversion benchmark is included here.',
    },
    'techcombank-portal': {
      problem:
        'Serving millions of banking customers across Vietnam requires accessible interactions, stable layouts, and a unified enterprise CMS system enabling non-technical content authors to deploy dynamic banking products rapidly.',
      architecture:
        'Adobe Experience Manager (AEM) modular architecture. Custom component framework using Vanilla JavaScript to bypass heavy client-side runtime overhead.',
      ownership:
        'Customized and maintained modular AEM components, improved accessibility against WCAG guidance, and managed enterprise digital financial asset pipelines.',
      tradeoffs:
        'Deliberately avoided heavy client-side frameworks in favor of ultra-lean Vanilla JavaScript modules within AEM to guarantee maximum cross-device compatibility for elderly and low-spec banking users.',
      results:
        'Delivered reusable banking content components and accessibility improvements. Formal WCAG certification and publishing-time measurements are not provided here.',
    },
    'nashtech-virtual-vietnam': {
      problem:
        'Needed an innovative, interactive 3D corporate showcase to present Vietnam’s cultural and technological landscape without requiring heavy app store downloads.',
      architecture:
        'Browser-based Three.js WebGL canvas combined with React and Tailwind CSS. Procedural 3D camera transitions and compressed GLTF texture streaming.',
      ownership:
        'Developed the 3D/360° interactive spatial environment using Three.js, optimized GPU draw calls for mobile execution, and integrated seamless audio-visual cues.',
      tradeoffs:
        'Employed low-poly geometric assets with baked ambient occlusion maps instead of real-time multi-light raymarching to reduce rendering cost on mobile devices.',
      results:
        'Delivered a browser-based interactive showcase. Device-specific FPS measurements are not included here.',
    },
  };

  return (
    <section id="reality" className="section section-alt">
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '3rem' }}>
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
            implementation outcomes. Performance and compliance claims require separate measurement.
          </p>
        </div>

        {/* 4-Block Exhibition Projects Grid (All 4 on One Row on Desktop) */}
        <div className="artifacts-grid">
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
                  padding: '1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <div>
                  {/* Top Metadata */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.85rem',
                      gap: '0.5rem',
                    }}
                  >
                    <span className="arch-tag patina" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                      0{idx + 1} // {project.company?.toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--text-tertiary)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {project.period}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-editorial)',
                      fontSize: '1.18rem',
                      color: 'var(--text-ivory)',
                      lineHeight: 1.25,
                      marginBottom: '0.35rem',
                      minHeight: '2.9rem',
                    }}
                  >
                    {project.title}
                  </h3>

                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      color: 'var(--copper-warm-bright)',
                      marginBottom: '1rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={project.subtitle}
                  >
                    {project.subtitle}
                  </div>

                  {/* Core Problem Callout */}
                  <div
                    style={{
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--border-arch)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.85rem',
                      marginBottom: '1rem',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      minHeight: '85px',
                    }}
                  >
                    <strong
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: 'var(--copper-patina)',
                        textTransform: 'uppercase',
                        marginBottom: '0.2rem',
                      }}
                    >
                      Problem Anatomy:
                    </strong>
                    {story.problem.length > 130 ? `${story.problem.slice(0, 130)}...` : story.problem}
                  </div>

                  {/* Measured Outcome */}
                  <div
                    style={{
                      borderLeft: '2px solid var(--copper-patina)',
                      paddingLeft: '0.75rem',
                      marginBottom: '1.1rem',
                      fontSize: '0.8rem',
                      color: 'var(--text-ivory)',
                      minHeight: '62px',
                    }}
                  >
                    <strong
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.66rem',
                        color: 'var(--copper-patina)',
                        textTransform: 'uppercase',
                        display: 'block',
                      }}
                    >
                      Measured Outcome:
                    </strong>
                    {story.results.length > 105 ? `${story.results.slice(0, 105)}...` : story.results}
                  </div>

                  {/* Tech Stack Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    {project.technologies.slice(0, 3).map((t) => (
                      <span key={t} className="arch-tag" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                        {t}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="arch-tag" style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', padding: '0.15rem 0.45rem' }}>
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Inspect Case Study Button */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="btn-arch btn-arch-outline"
                    style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    <span>Inspect Case</span>
                    <ArrowUpRight size={14} />
                  </button>
                  {project.domain && (
                    <a
                      href={project.domain}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-arch btn-arch-outline"
                      style={{ padding: '0.5rem 0.65rem' }}
                      title="Visit Live Domain"
                      aria-label="Visit Live Domain"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Case Study Modal */}
        <AnimatePresence onExitComplete={finishClose}>
          {selectedProject && (
            <motion.dialog
              ref={caseStudyRef}
              aria-labelledby="case-study-title"
              aria-modal="true"
              onCancel={(event) => { event.preventDefault(); setSelectedProject(null); }}
              onKeyDown={(event) => {
                if (event.key !== 'Tab') return;
                const controls = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]');
                const first = controls[0];
                const last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
                }
              }}
              className="case-study-dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.18, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(5, 7, 9, 0.88)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '1.5rem',
              }}
              onClick={(event) => {
                if (event.target === event.currentTarget) setSelectedProject(null);
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                transition={{ duration: reducedMotion ? 0 : 0.18, ease: 'easeOut' }}
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
                    <h3 id="case-study-title" style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.8rem', color: 'var(--text-ivory)' }}>
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
                          05 // Outcomes &amp; Evidence
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
            </motion.dialog>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
