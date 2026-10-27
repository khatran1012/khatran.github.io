import React, { useState } from 'react';
import { Cpu, CheckCircle2, Code2, Database, Radio, Wrench } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/cvData';

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number>(0);

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
    <section id="skills" className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <Cpu size={14} />
            <span>Core Competencies</span>
          </div>
          <h2 className="section-title">
            Technical <span>Skill Set</span>
          </h2>
          <p className="section-subtitle">
            From modern responsive interfaces to high-throughput backend services and distributed IoT hardware controls.
          </p>
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

        {/* Active Skills Grid */}
        <div className="skills-grid">
          {SKILL_CATEGORIES[activeCategory].skills.map((skill) => (
            <div key={skill.name} className="skill-item-card">
              <div className="skill-header">
                <span className="skill-name" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={16} color="var(--emerald-primary)" />
                  {skill.name}
                </span>
                <span className="skill-level-number">{skill.level}%</span>
              </div>
              <div className="skill-progress-bar">
                <div
                  className="skill-progress-fill"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Architectural Pillars Footer Card */}
        <div
          style={{
            marginTop: '3rem',
            padding: '1.75rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div>
            <h4 style={{ fontWeight: 800, color: 'var(--emerald-primary)', marginBottom: '0.4rem' }}>
              ⚡ High-Concurrency Systems
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Golang microservices with Gin and SQLC, strict ACID guarantees, and anti-fraud protections.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 800, color: 'var(--blue-accent)', marginBottom: '0.4rem' }}>
              📡 Offline-First IoT Edge
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              MQTT synchronization ensuring 100% turnstile hardware uptime during network disruptions.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 800, color: '#9333ea', marginBottom: '0.4rem' }}>
              🔒 Distributed Locking &amp; Integrity
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Redis distributed locks and row-level database transactions (SELECT FOR UPDATE) preventing flash-sale overselling.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
