import { useCallback, useEffect, useState } from 'react';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import TechRibbon from './components/TechRibbon';
import Hero from './components/Hero';
import About from './components/About';
import Expertise from './components/Expertise';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { initSmoothScroll, setScrollLocked, ScrollTrigger } from './lib/motion';

function App() {
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => initSmoothScroll(), []);

  useEffect(() => {
    setScrollLocked(loading);
    if (!loading) ScrollTrigger.refresh();
  }, [loading]);

  const handleReveal = useCallback(() => setRevealed(true), []);
  const handleLoaded = useCallback(() => setLoading(false), []);

  return (
    <main className="grain relative min-h-screen bg-ink text-ivory">
      {loading && <Preloader onReveal={handleReveal} onComplete={handleLoaded} />}

      <CustomCursor />
      <ScrollProgress />
      <Navbar visible={revealed} />

      <Hero ready={revealed} />
      <TechRibbon />
      <About />
      <Expertise />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}

export default App;
