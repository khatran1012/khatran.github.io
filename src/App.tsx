import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OriginHero } from './components/OriginHero';
import { SystemAnatomy } from './components/SystemAnatomy';
import { PressureSimulations } from './components/PressureSimulations';
import { BuiltInReality } from './components/BuiltInReality';
import { WhatsNext } from './components/WhatsNext';
import { ExhibitionFooter } from './components/ExhibitionFooter';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('kt-exhibition-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kt-exhibition-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const blocks = document.querySelectorAll<HTMLElement>(
      '#main-content > section:not(#origin) > .container > :not(.artifacts-grid):not(dialog), .artifacts-grid > .arch-slab, .career-snapshot',
    );
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('scroll-revealed');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -32px 0px', threshold: 0 });

    blocks.forEach((block) => {
      // Keep content already on screen visible, including direct chapter links.
      if (block.getBoundingClientRect().top < window.innerHeight) return;
      block.classList.add('scroll-reveal');
      observer.observe(block);
    });
    return () => {
      observer.disconnect();
      blocks.forEach((block) => block.classList.remove('scroll-reveal', 'scroll-revealed'));
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="portfolio-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main id="main-content" style={{ flex: 1 }}>
        {/* Chapter 01 — The Origin */}
        <OriginHero />

        {/* Chapter 02 — Inside the System */}
        <SystemAnatomy />

        {/* Chapter 03 — Decisions Under Pressure */}
        <PressureSimulations />

        {/* Chapter 04 — Built in Reality */}
        <BuiltInReality />

        {/* Chapter 05 — What's Next? */}
        <WhatsNext />
      </main>
      <ExhibitionFooter />
    </div>
  );
};

export default App;
