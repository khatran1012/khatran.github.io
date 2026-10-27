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
    return 'dark'; // Industrial Charcoal Dark Mode as requested
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kt-exhibition-theme', theme);
  }, [theme]);

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
