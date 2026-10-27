import React from 'react';
import { ArrowRight, Mail, MapPin, ShieldCheck, Terminal } from 'lucide-react';
import { PERSONAL_INFO } from '../data/cvData';
import { GithubIcon, LinkedinIcon } from './Icons';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-background-gradient" />
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Intro */}
          <div className="hero-content">
            <div className="hero-status-pill">
              <span className="status-dot" />
              <span>Fullstack &amp; IoT Edge Systems Specialist</span>
            </div>

            <h1 className="hero-title">
              Hi, I'm <span className="gradient-text">{PERSONAL_INFO.name}</span>
              <br />
              <span className="hero-role-badge">{PERSONAL_INFO.role}</span>
            </h1>

            <p className="hero-bio">
              Bridging high-performance <strong>React &amp; TypeScript</strong> frontends with resilient, 
              high-concurrency <strong>Golang</strong> microservices and <strong>Offline-First IoT edge gateways</strong>.
              Delivering secure, scalable, and user-centered digital solutions.
            </p>

            <div className="hero-cta-group">
              <a href="#projects" className="btn btn-primary">
                <span>View Projects</span>
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
            </div>

            {/* Quick Stats Grid */}
            <div className="hero-stats-row">
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
            </div>
          </div>

          {/* Right Column: Profile Avatar Card */}
          <div className="hero-visual">
            <div className="avatar-card-wrapper">
              <div className="avatar-glow" />
              <div className="avatar-card">
                <div className="avatar-img-container">
                  <img
                    src={PERSONAL_INFO.avatarUrl}
                    alt="Kha Tran - Senior Software Engineer"
                    className="avatar-img"
                    width={200}
                    height={200}
                  />
                </div>

                <div className="avatar-info">
                  <h2 className="avatar-name">{PERSONAL_INFO.name}</h2>
                  <div className="avatar-title">{PERSONAL_INFO.fullName}</div>
                  
                  <div className="avatar-location">
                    <MapPin size={15} color="var(--emerald-primary)" />
                    <span>{PERSONAL_INFO.location}</span>
                  </div>

                  <div className="avatar-chips">
                    <span className="pill pill-emerald">React / TS</span>
                    <span className="pill pill-blue">Golang / Gin</span>
                    <span className="pill">MQTT &amp; IoT</span>
                    <span className="pill">PostgreSQL</span>
                    <span className="pill">Redis Locks</span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '1.25rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-color)',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ShieldCheck size={16} color="var(--emerald-primary)" />
                    ACID &amp; Anti-Fraud
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Terminal size={16} color="var(--blue-accent)" />
                    Clean Architecture
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
