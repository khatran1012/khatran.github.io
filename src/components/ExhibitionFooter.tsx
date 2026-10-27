import React from 'react';
import { ArrowUp, Globe, Shield } from 'lucide-react';
import { PERSONAL_INFO } from '../data/cvData';
import { GithubIcon, LinkedinIcon } from './Icons';

export const ExhibitionFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-arch)',
        backgroundColor: '#07090a',
        paddingTop: '3.5rem',
        paddingBottom: '3.5rem',
        position: 'relative',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            gap: '2rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
          }}
        >
          {/* Identity */}
          <div style={{ maxWidth: '420px' }}>
            <div
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-ivory)',
                marginBottom: '0.3rem',
              }}
            >
              The Anatomy of Building
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--copper-patina)',
                textTransform: 'uppercase',
                marginBottom: '0.85rem',
              }}
            >
              Curated by {PERSONAL_INFO.name} • Software Engineer
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              An interactive engineering exhibition showcasing the deterministic anatomy of software,
              from high-concurrency microservices to offline-first edge gateways.
            </p>
          </div>

          {/* Telemetry Coordinates */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div>SYSTEM // PRODUCTION BUILD v2.0</div>
            <div>LOCATION // HO CHI MINH CITY, VIETNAM</div>
            <div style={{ color: 'var(--copper-warm-bright)' }}>COORDINATES // 10.7769° N, 106.7009° E</div>
            <div style={{ color: 'var(--copper-patina)' }}>DEPLOYMENT // GITHUB PAGES STATIC EDGE</div>
          </div>

          {/* Socials & Top Scroll */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-arch)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-ivory)',
                }}
                aria-label="GitHub Profile"
              >
                <GithubIcon size={16} />
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-arch)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-ivory)',
                }}
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon size={16} />
              </a>

              <button
                onClick={scrollToTop}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--copper-patina-border)',
                  background: 'var(--copper-patina-subtle)',
                  color: 'var(--copper-patina)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="Return to Origin"
                aria-label="Return to Origin"
              >
                <ArrowUp size={16} />
              </button>
            </div>

            <a
              href={PERSONAL_INFO.website}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--copper-patina)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Globe size={13} />
              <span>{PERSONAL_INFO.website}</span>
            </a>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-arch-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.76rem',
            color: 'var(--text-tertiary)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>© {new Date().getFullYear()} Kha Tran (Trần Đình Kha). All exhibition rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shield size={13} color="var(--copper-patina)" />
            <span>Built with React, TypeScript, R3F, Motion &amp; Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
