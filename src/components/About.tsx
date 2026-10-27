import React from 'react';
import { Users, Zap, Clock, Sparkles, Globe, Quote, Mail, Phone, MapPin } from 'lucide-react';
import { PERSONAL_INFO, STRENGTHS, LANGUAGES } from '../data/cvData';

export const About: React.FC = () => {
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
    <section id="about" className="section" style={{ backgroundColor: 'var(--bg-subtle)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <Quote size={14} />
            <span>Profile Overview</span>
          </div>
          <h2 className="section-title">
            About <span>Me</span>
          </h2>
          <p className="section-subtitle">
            Engineering excellence, collaborative culture, and end-to-end fullstack execution.
          </p>
        </div>

        <div className="about-grid">
          {/* Left: Summary & Personal Statement */}
          <div className="card about-card-primary">
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div className="education-icon-wrap green">
                  <Quote size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Engineering Philosophy</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    User-Centered Frontend × Resilient Distributed Backend
                  </p>
                </div>
              </div>

              <blockquote
                style={{
                  fontSize: '1.02rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  fontStyle: 'italic',
                  borderLeft: '3px solid var(--emerald-primary)',
                  paddingLeft: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                "{PERSONAL_INFO.bio}"
              </blockquote>

              {/* Languages Box */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                  <Globe size={18} color="var(--blue-accent)" />
                  <span>Languages</span>
                </div>
                {LANGUAGES.map((lang) => (
                  <div key={lang.name} style={{ fontSize: '0.88rem' }}>
                    <strong>{lang.name}</strong>: <span style={{ color: 'var(--text-secondary)' }}>{lang.details}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contact Pill Bar */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={15} color="var(--emerald-primary)" />
                {PERSONAL_INFO.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Phone size={15} color="var(--blue-accent)" />
                {PERSONAL_INFO.displayPhone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} color="var(--emerald-primary)" />
                {PERSONAL_INFO.location}
              </span>
            </div>
          </div>

          {/* Right: Strengths Grid */}
          <div className="strengths-grid">
            {STRENGTHS.map((str) => (
              <div key={str.title} className="strength-item">
                <div className="strength-icon-wrap">{getStrengthIcon(str.icon)}</div>
                <h3 className="strength-title">{str.title}</h3>
                <p className="strength-desc">{str.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
