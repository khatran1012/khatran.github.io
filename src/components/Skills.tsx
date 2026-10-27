import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Cpu, CheckCircle2, Code2, Database, Radio, Wrench, Layers } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/cvData';

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Multi-tier Parallax velocities
  const yFast = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const ySlow = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const featuredTechPills = [
    { name: 'Golang', role: 'Gin & SQLC', color: 'var(--cyber-emerald)' },
    { name: 'MQTT', role: 'Offline-First IoT', color: 'var(--neon-blue)' },
    { name: 'React 18/19', role: 'TypeScript & Next.js', color: 'var(--cyber-emerald)' },
    { name: 'PostgreSQL', role: 'ACID Transactions', color: 'var(--neon-blue)' },
    { name: 'Redis', role: 'Distributed Locking', color: 'var(--neon-purple)' },
    { name: 'RabbitMQ', role: 'Event Broker', color: 'var(--cyber-emerald)' },
    { name: 'Docker', role: 'Containerization', color: 'var(--neon-blue)' },
    { name: 'AEM CMS', role: 'Enterprise Frontend', color: 'var(--neon-purple)' },
    { name: 'Three.js', role: '3D/360° WebGL', color: 'var(--cyber-emerald)' },
    { name: 'WCAG A11y', role: 'Inclusive Accessibility', color: 'var(--neon-blue)' },
  ];

  const getCategoryIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Code2 size={18} />;
      case 1:
        return <Database size={18} />;
      case 2:
        return <Radio size={18} />;
      case 3:
        return <Wrench size={18} />;
      default:
        return <Cpu size={18} />;
    }
  };

  return (
    <section id="skills" ref={containerRef} className="section" style={{ backgroundColor: 'var(--bg-page-alt)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Cpu size={13} />
            <span>02 — FLOATING TECH STACK</span>
          </div>
          <h2 className="section-title">
            Skills &amp; <span>Architecture</span>
          </h2>
          <p className="section-subtitle">
            Parallax depth, high-concurrency microservices, and distributed hardware controls.
          </p>
        </div>

        {/* FLOATING TECH STACK CLOUD (Parallax + Subtle 3D Tilt) */}
        <div className="floating-stack-wrapper" style={{ marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--cyber-emerald)', fontWeight: 700 }}>
              <Layers size={18} />
              <span>CORE ARCHITECTURE CLUSTER</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'Fira Code', monospace" }}>
              LATENCY: &lt;15ms • ACID GUARANTEED
            </div>
          </div>

          <motion.div style={{ y: yFast }} className="floating-pills-cloud">
            {featuredTechPills.map((pill) => (
              <motion.div
                key={pill.name}
                className="floating-pill"
                whileHover={{
                  scale: 1.08,
                  rotateX: 8,
                  rotateY: -8,
                  boxShadow: '0 10px 25px rgba(0, 245, 160, 0.3)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  borderLeft: `3px solid ${pill.color}`,
                }}
              >
                <span style={{ color: pill.color }}>●</span>
                <span>{pill.name}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontFamily: "'Fira Code', monospace",
                  }}
                >
                  [{pill.role}]
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Category Tabs */}
        <div className="skills-tabs" role="tablist">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.name}
              role="tab"
              aria-selected={activeCategory === idx}
              onClick={() => setActiveCategory(idx)}
              className={`skill-tab-btn ${activeCategory === idx ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {getCategoryIcon(idx)}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Skill Cards Grid (No arbitrary percentages or progress bars) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="skills-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            {SKILL_CATEGORIES[activeCategory].skills.map((skill) => (
              <motion.div
                key={skill.name}
                className="cyber-card"
                whileHover={{ y: -3, scale: 1.02 }}
                style={{
                  padding: '1.25rem 1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--cyber-emerald-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border-glow)',
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle2 size={16} color="var(--cyber-emerald)" />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {skill.name}
                  </span>
                </div>

                {skill.tag && (
                  <span
                    className="pill pill-emerald"
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: "'Fira Code', monospace",
                      fontWeight: 600,
                    }}
                  >
                    {skill.tag}
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Architectural Pillars HUD */}
        <motion.div
          style={{
            y: ySlow,
            marginTop: '3.5rem',
            padding: '1.75rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div>
            <h4 style={{ fontWeight: 800, color: 'var(--cyber-emerald)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚡</span> High-Concurrency Engine
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Golang Gin &amp; SQLC microservices processing high-volume concurrent orders with strict ACID guarantees and anti-fraud protections.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 800, color: 'var(--neon-blue)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📡</span> Offline-First IoT Edge
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              MQTT synchronization with local edge caching guaranteeing 100% turnstile physical hardware uptime during network disruptions.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 800, color: 'var(--neon-purple)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🔒</span> Distributed Locking &amp; Integrity
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Redis distributed locks and row-level database transactions (SELECT FOR UPDATE) preventing double-spending during flash sales.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
