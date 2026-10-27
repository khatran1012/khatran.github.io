import React from 'react';
import { Briefcase, Calendar, Building2 } from 'lucide-react';
import { EXPERIENCES } from '../data/cvData';

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="section" style={{ backgroundColor: 'var(--bg-subtle)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <Briefcase size={14} />
            <span>Career Path</span>
          </div>
          <h2 className="section-title">
            Work <span>Experiences</span>
          </h2>
          <p className="section-subtitle">
            A solid track record of delivering enterprise-grade platforms, high-concurrency architectures, and client success.
          </p>
        </div>

        <div className="timeline-container">
          <div className="timeline-line" />

          {EXPERIENCES.map((exp) => (
            <div key={exp.id} className="timeline-item">
              <div className={`timeline-dot ${exp.isCurrent ? 'current' : ''}`} />

              <div className="timeline-card">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-role">{exp.role}</h3>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        marginTop: '0.2rem',
                      }}
                    >
                      <Building2 size={16} color="var(--emerald-primary)" />
                      <span className="timeline-company">{exp.company}</span>
                    </div>
                  </div>

                  <span className={`timeline-badge ${exp.isCurrent ? 'current' : ''}`}>
                    <Calendar size={13} />
                    <span>{exp.period}</span>
                  </span>
                </div>

                {exp.summary && <p className="timeline-summary">{exp.summary}</p>}

                <ul className="timeline-bullets">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>

                {exp.technologies && (
                  <div className="timeline-tech-tags">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="pill">
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
