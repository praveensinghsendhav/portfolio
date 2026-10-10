import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { navLinks, profile } from '../data/profile';
import { scrollToId, setScrollLocked } from '../lib/motion';

const Navbar = ({ visible }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  // Glass background after leaving the top; hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > lastY + 4);
      if (y < lastY - 4 || y < 400) setHidden(false);
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight whichever section occupies the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    setScrollLocked(true);
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const go = (id) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    // Let the menu close (and unlock scrolling) before scrolling.
    requestAnimationFrame(() => scrollToId(id));
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
          visible ? 'opacity-100' : 'opacity-0'
        } ${hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'} ${
          scrolled
            ? 'border-b border-white/[0.06] bg-black/60 backdrop-blur-xl'
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-12">
          <a
            href="#home"
            onClick={go('home')}
            className="flex items-center gap-1.5 font-display text-3xl leading-none tracking-wider text-brand drop-shadow-[0_2px_14px_rgba(229,9,20,0.6)]"
          >
            {profile.brand}
            <span className="mb-1 h-1.5 w-1.5 rounded-full bg-white" />
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navLinks.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={go(id)}
                aria-current={active === id ? 'page' : undefined}
                className={`relative px-3.5 py-2 text-[13px] font-medium transition-colors duration-300 ${
                  active === id ? 'text-white' : 'text-white/55 hover:text-white'
                }`}
              >
                {label}
                {active === id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-brand"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              onClick={go('contact')}
              className="hidden rounded-md bg-brand px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_24px_rgba(229,9,20,0.45)] transition-all duration-300 hover:bg-brand-dark hover:shadow-[0_0_34px_rgba(229,9,20,0.7)] active:scale-95 sm:inline-block"
            >
              Hire Me
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="relative flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/5 md:hidden"
            >
              <span
                className={`absolute h-[1.5px] w-5 bg-white transition-transform duration-300 ${
                  menuOpen ? 'rotate-45' : '-translate-y-1.5'
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-5 bg-white transition-opacity duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-5 bg-white transition-transform duration-300 ${
                  menuOpen ? '-rotate-45' : 'translate-y-1.5'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-black/95 px-8 backdrop-blur-xl md:hidden"
          >
            <ul className="space-y-2">
              {navLinks.map(({ id, label }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
                >
                  <a
                    href={`#${id}`}
                    onClick={go(id)}
                    className={`block font-display text-5xl tracking-wide transition-colors ${
                      active === id ? 'text-brand' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <span className="mr-3 align-middle font-mono text-xs text-white/30">0{i + 1}</span>
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.a
              href={`mailto:${profile.email}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-12 font-mono text-xs break-all text-white/50"
            >
              {profile.email}
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
