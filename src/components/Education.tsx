import React from 'react';
import { GraduationCap, Award, BookOpen, CheckCircle2 } from 'lucide-react';
import { EDUCATION_LIST } from '../data/cvData';

export const Education: React.FC = () => {
  return (
    <section id="education" className="section" style={{ backgroundColor: 'var(--bg-subtle)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <GraduationCap size={14} />
            <span>Academic Background</span>
          </div>
          <h2 className="section-title">
            Education &amp; <span>Certifications</span>
          </h2>
          <p className="section-subtitle">
            Formal computer science foundations combined with continuous specialized technical certifications.
          </p>
        </div>

        <div className="education-grid">
          {EDUCATION_LIST.map((item) => (
            <div key={item.degree} className="education-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className={`education-icon-wrap ${item.isCertificate ? 'green' : ''}`}>
                  {item.isCertificate ? <Award size={24} /> : <GraduationCap size={24} />}
                </div>

                <div>
                  <span
                    className={`pill ${item.isCertificate ? 'pill-emerald' : 'pill-blue'}`}
                    style={{ marginBottom: '0.35rem' }}
                  >
                    {item.isCertificate ? 'Certification' : 'Academic Degree'}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {item.degree}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: 'var(--emerald-primary)',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      marginTop: '0.2rem',
                    }}
                  >
                    <BookOpen size={16} />
                    <span>{item.institution}</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {item.details.map((detail, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <CheckCircle2
                      size={16}
                      color="var(--emerald-primary)"
                      style={{ flexShrink: 0, marginTop: '3px' }}
                    />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
