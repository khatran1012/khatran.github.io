import React, { useState, useEffect } from 'react';
import { Sun, Moon, Download, Menu, X, FileText } from 'lucide-react';
import { PERSONAL_INFO } from '../data/cvData';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          {/* Brand */}
          <a href="#hero" className="brand" aria-label="Kha Tran Portfolio Home">
            <div className="brand-badge">KT</div>
            <div className="brand-text">
              <span className="brand-name">{PERSONAL_INFO.name}</span>
              <span className="brand-role">Software Engineer</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="nav-actions">
            <button
              onClick={toggleTheme}
              className="btn-icon"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
            </button>

            <a
              href={PERSONAL_INFO.cvPdfUrl}
              download="Kha_Tran_Software_Engineer_CV.pdf"
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.15rem', fontSize: '0.88rem' }}
            >
              <Download size={16} />
              <span>CV PDF</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-icon mobile-toggle"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1.25rem 0',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="nav-link"
                style={{ fontSize: '1rem', padding: '0.4rem 0' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={PERSONAL_INFO.cvPdfUrl}
              download="Kha_Tran_Software_Engineer_CV.pdf"
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              <FileText size={16} />
              <span>Download CV (PDF)</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
