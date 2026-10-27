import React from 'react';
import { ArrowUp, Mail, Globe } from 'lucide-react';
import { PERSONAL_INFO } from '../data/cvData';
import { GithubIcon, LinkedinIcon } from './Icons';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          {/* Left: Brand & Title */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div className="brand-badge" style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
                KT
              </div>
              <div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  {PERSONAL_INFO.name}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    color: 'var(--emerald-primary)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  Software Engineer &amp; Fullstack Developer
                </span>
              </div>
            </div>
            <p className="footer-copy">
              Designed &amp; built according to CV color palette and engineering standards.
            </p>
          </div>

          {/* Social Links & Back to Top */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon"
              title="GitHub"
              aria-label="GitHub"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={18} />
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="btn-icon"
              title="Email"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <button
              onClick={scrollToTop}
              className="btn-icon"
              title="Back to Top"
              aria-label="Back to Top"
              style={{
                backgroundColor: 'var(--emerald-light)',
                color: 'var(--emerald-primary)',
                borderColor: 'var(--emerald-border)',
              }}
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>

        {/* Bottom Line */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>
            © {new Date().getFullYear()} {PERSONAL_INFO.name} ({PERSONAL_INFO.fullName}). All rights reserved.
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Globe size={14} color="var(--emerald-primary)" />
            Deployed on GitHub Pages: <strong>khatran1012.github.io/khatran.github.io</strong>
          </span>
        </div>
      </div>
    </footer>
  );
};
