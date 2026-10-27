import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Terminal, ShieldCheck } from 'lucide-react';
import { PERSONAL_INFO } from '../data/cvData';
import { GithubIcon, LinkedinIcon } from './Icons';
import { WorkspaceCanvas } from './canvas/WorkspaceCanvas';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Narrative & CTA */}
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Status Pill */}
            <motion.div
              className="hero-status-pill"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="status-dot" />
              <span>Fullstack Developer • High-Concurrency &amp; IoT</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Hi, I'm <span className="gradient-text">{PERSONAL_INFO.name}</span>
              <br />
              <span className="hero-role-badge">{PERSONAL_INFO.role}</span>
            </motion.h1>

            {/* Bio */}
            <motion.p
              className="hero-bio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Engineering end-to-end digital solutions—from responsive, highly interactive{' '}
              <strong>React &amp; TypeScript</strong> frontends to resilient, high-concurrency{' '}
              <strong>Golang</strong> microservices and <strong>Offline-First IoT edge gateways</strong>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="hero-cta-group"
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <a href="#projects" className="btn btn-primary">
                <span>Explore Projects</span>
                <ArrowRight size={18} />
              </a>

              <a href="#contact" className="btn btn-secondary">
                <Mail size={18} />
                <span>Contact Me</span>
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
                title="LinkedIn Profile"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon size={20} />
              </a>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
                title="GitHub Profile"
                aria-label="GitHub Profile"
              >
                <GithubIcon size={20} />
              </a>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              className="hero-stats-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              <div className="stat-item">
                <span className="stat-value">8+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">15+</span>
                <span className="stat-label">Enterprise Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">100%</span>
                <span className="stat-label">IoT Turnstile Uptime</span>
              </div>
            </motion.div>

            {/* Architectural Tags */}
            <motion.div
              style={{
                display: 'flex',
                gap: '1.25rem',
                fontSize: '0.84rem',
                color: 'var(--text-muted)',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: '0.5rem',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} color="var(--cyber-emerald)" />
                Strict ACID &amp; Anti-Fraud
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Terminal size={16} color="var(--neon-blue)" />
                MQTT Offline-First Edge
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive 3D Developer Workspace */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <WorkspaceCanvas />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
