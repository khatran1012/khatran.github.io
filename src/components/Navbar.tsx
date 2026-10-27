import React, { useState, useEffect } from 'react';
import { Sun, Moon, Download, Menu, X } from 'lucide-react';
import { PERSONAL_INFO } from '../data/cvData';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeChapter, setActiveChapter] = useState('#origin');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveChapter(`#${entry.target.id}`);
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const chapters = [
    { num: '01', label: 'Origin', href: '#origin' },
    { num: '02', label: 'The System', href: '#system' },
    { num: '03', label: 'Under Pressure', href: '#pressure' },
    { num: '04', label: 'Reality', href: '#reality' },
    { num: '05', label: "What's Next", href: '#next' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        backgroundColor: scrolled || mobileMenuOpen ? 'var(--bg-glass)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--border-arch)' : 'transparent'}`,
        transition: 'all var(--trans-fast)',
      }}
    >
      <div className="container">
        <div
          style={{
            height: 'var(--nav-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          {/* Exhibition Monogram & Identity */}
          <a
            href="#origin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              textDecoration: 'none',
            }}
            aria-label="The Anatomy of Building Exhibition Home"
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--copper-patina-subtle)',
                border: '1px solid var(--copper-patina-border)',
                color: 'var(--copper-patina)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              KT
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-editorial)',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: 'var(--text-ivory)',
                  lineHeight: 1.1,
                }}
              >
                {PERSONAL_INFO.name}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--copper-patina)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                SOFTWARE ENGINEER
              </div>
            </div>
          </a>

          {/* Desktop Chapter Navigation */}
          <nav
            aria-label="Exhibition Chapters"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '1.5rem',
            }}
            className="desktop-chapters"
          >
            {chapters.map((ch) => (
              <a
                key={ch.num}
                href={ch.href}
                aria-current={activeChapter === ch.href ? 'location' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  transition: 'color var(--trans-fast)',
                  padding: '0.35rem 0.5rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--copper-patina)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <span style={{ color: 'var(--copper-warm-bright)', fontSize: '0.68rem' }}>{ch.num}</span>
                <span>{ch.label}</span>
              </a>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              onClick={toggleTheme}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-xs)',
                background: 'transparent',
                border: '1px solid var(--border-arch)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            <a
              href={PERSONAL_INFO.cvPdfUrl}
              download="Kha_Tran_Software_Engineer_CV.pdf"
              className="btn-arch btn-arch-patina nav-resume"
              aria-label="Download CV (PDF)"
              style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
            >
              <Download size={15} />
              <span>Resume PDF</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-xs)',
                background: 'transparent',
                border: '1px solid var(--border-arch)',
                color: 'var(--text-ivory)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              className="mobile-chapters-toggle"
              aria-label="Toggle Exhibition Chapters"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-chapters"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Chapters Dropdown */}
        {mobileMenuOpen && (
          <nav
            id="mobile-chapters"
            aria-label="Mobile exhibition chapters"
            style={{
              padding: '1.25rem 0',
              borderTop: '1px solid var(--border-arch)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {chapters.map((ch) => (
              <a
                key={ch.num}
                href={ch.href}
                aria-current={activeChapter === ch.href ? 'location' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  color: 'var(--text-ivory)',
                  padding: '0.5rem 0',
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span style={{ color: 'var(--copper-patina)' }}>{ch.num} //</span>
                <span>{ch.label}</span>
              </a>
            ))}
          </nav>
        )}
      </div>

      <style>{`
        @media (min-width: 900px) {
          .desktop-chapters {
            display: flex !important;
          }
          .mobile-chapters-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
