import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Users, Zap, Clock, Sparkles, Globe, Quote, Mail, Phone, MapPin } from 'lucide-react';
import { PERSONAL_INFO, STRENGTHS, LANGUAGES } from '../data/cvData';

export const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Parallax offsets
  const yBg = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const yFloating = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const getStrengthIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return <Users size={22} />;
      case 'Zap':
        return <Zap size={22} />;
      case 'Clock':
        return <Clock size={22} />;
      case 'Sparkles':
        return <Sparkles size={22} />;
      default:
        return <Sparkles size={22} />;
    }
  };

  return (
    <section id="about" ref={containerRef} className="section" style={{ overflow: 'hidden' }}>
      {/* Background Parallax HUD Orb */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 245, 160, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          y: yBg,
        }}
      />

      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Quote size={13} />
            <span>02 — ABOUT / PHILOSOPHY</span>
          </div>
          <h2 className="section-title">
            Engineering <span>Profile</span>
          </h2>
          <p className="section-subtitle">
            User-Centered Design × High-Concurrency Distributed Architecture.
          </p>
        </div>

        <div className="about-grid">
          {/* Left: Bio Card & Philosophy */}
          <motion.div
            className="cyber-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'var(--cyber-emerald-subtle)',
                  color: 'var(--cyber-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-glow)',
                }}
              >
                <Quote size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Fullstack Vision</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontFamily: "'Fira Code', monospace" }}>
                  // end-to-end digital solutions
                </p>
              </div>
            </div>

            <blockquote
              style={{
                fontSize: '1.02rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                fontStyle: 'italic',
                borderLeft: '3px solid var(--cyber-emerald)',
                paddingLeft: '1.15rem',
                marginBottom: '1.75rem',
              }}
            >
              "{PERSONAL_INFO.bio}"
            </blockquote>

            {/* Languages HUD */}
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'rgba(8, 13, 24, 0.6)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                <Globe size={18} color="var(--neon-blue)" />
                <span>Languages</span>
              </div>
              {LANGUAGES.map((lang) => (
                <div key={lang.name} style={{ fontSize: '0.88rem' }}>
                  <strong style={{ color: 'var(--cyber-emerald)' }}>{lang.name}</strong>:{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>{lang.details}</span>
                </div>
              ))}
            </div>

            {/* Quick Contact Bar */}
            <div
              style={{
                marginTop: '1.75rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.25rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={15} color="var(--cyber-emerald)" />
                {PERSONAL_INFO.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={15} color="var(--neon-blue)" />
                {PERSONAL_INFO.displayPhone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={15} color="var(--cyber-emerald)" />
                {PERSONAL_INFO.location}
              </span>
            </div>
          </motion.div>

          {/* Right: Strengths Grid with Parallax Floating */}
          <motion.div style={{ y: yFloating }} className="strengths-grid">
            {STRENGTHS.map((str, idx) => (
              <motion.div
                key={str.title}
                className="cyber-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                style={{ padding: '1.4rem' }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: idx % 2 === 0 ? 'var(--cyber-emerald-subtle)' : 'var(--neon-blue-subtle)',
                    color: idx % 2 === 0 ? 'var(--cyber-emerald)' : 'var(--neon-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.85rem',
                    border: `1px solid ${idx % 2 === 0 ? 'var(--border-glow)' : 'var(--border-blue-glow)'}`,
                  }}
                >
                  {getStrengthIcon(str.icon)}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  {str.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {str.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
