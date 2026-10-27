import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Calendar, Building2 } from 'lucide-react';
import { EXPERIENCES } from '../data/cvData';

gsap.registerPlugin(ScrollTrigger);

export const Experience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const ctx = gsap.context(() => {
      itemsRef.current.forEach((el) => {
        if (!el) return;

        // Depth reveal animation as each card scrolls into view
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 60,
            scale: 0.94,
            rotationX: 8,
            transformPerspective: 1000,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={containerRef} className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Briefcase size={13} />
            <span>03 — EXPERIENCE / DEPTH TIMELINE</span>
          </div>
          <h2 className="section-title">
            Career <span>Milestones</span>
          </h2>
          <p className="section-subtitle">
            Cards reveal at different depths across 8+ years of engineering leadership and high-concurrency systems.
          </p>
        </div>

        <div className="timeline-depth-container">
          <div className="timeline-rail" />

          {EXPERIENCES.map((exp, idx) => (
            <div
              key={exp.id}
              ref={(el) => (itemsRef.current[idx] = el)}
              className="timeline-depth-item"
            >
              <div
                className="timeline-depth-marker"
                style={{
                  borderColor: exp.isCurrent ? 'var(--cyber-emerald)' : 'var(--neon-blue)',
                  boxShadow: exp.isCurrent
                    ? '0 0 15px var(--cyber-emerald)'
                    : '0 0 10px var(--neon-blue)',
                }}
              />

              <div
                className="cyber-card"
                style={{
                  borderLeft: `4px solid ${
                    exp.isCurrent ? 'var(--cyber-emerald)' : 'var(--neon-blue)'
                  }`,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '0.65rem',
                    marginBottom: '0.85rem',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {exp.role}
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        marginTop: '0.25rem',
                      }}
                    >
                      <Building2 size={16} color="var(--cyber-emerald)" />
                      <span
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: 'var(--cyber-emerald)',
                        }}
                      >
                        {exp.company}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`pill ${exp.isCurrent ? 'pill-emerald' : 'pill-blue'}`}
                    style={{ fontFamily: "'Fira Code', monospace" }}
                  >
                    <Calendar size={13} />
                    <span>{exp.period}</span>
                  </span>
                </div>

                {/* Summary */}
                {exp.summary && (
                  <p
                    style={{
                      fontSize: '0.94rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '1rem',
                      fontStyle: 'italic',
                      lineHeight: 1.6,
                    }}
                  >
                    {exp.summary}
                  </p>
                )}

                {/* Bullets */}
                <ul
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  {exp.responsibilities.map((resp, bIdx) => (
                    <li
                      key={bIdx}
                      style={{
                        position: 'relative',
                        paddingLeft: '1.4rem',
                        fontSize: '0.91rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          color: 'var(--cyber-emerald)',
                          fontFamily: "'Fira Code', monospace",
                          fontWeight: 700,
                        }}
                      >
                        ▸
                      </span>
                      {resp}
                    </li>
                  ))}
                </ul>

                {/* Tech Tags */}
                {exp.technologies && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="pill" style={{ fontSize: '0.78rem' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
