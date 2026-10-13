import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { navLinks, profile } from '../data/profile';
import { scrollToId, setScrollLocked } from '../lib/motion';

const ease = [0.22, 1, 0.36, 1];

const Monogram = ({ className = '' }) => (
  <span
    className={`relative flex items-center justify-center rounded-full border border-gold/40 font-display italic text-gold ${className}`}
  >
    {profile.firstName[0]}
    <span className="text-ivory/80">{profile.lastName[0]}</span>
  </span>
);

const Navbar = ({ visible }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  // Denser glass after leaving the top; hide on scroll down, reveal on scroll up.
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
        className={`fixed inset-x-0 top-0 z-50 px-4 pt-4 transition-all duration-500 ease-out md:pt-5 ${
          visible ? 'opacity-100' : 'opacity-0'
        } ${hidden && !menuOpen ? '-translate-y-[130%]' : 'translate-y-0'}`}
      >
        <div
          className={`mx-auto flex max-w-5xl items-center justify-between rounded-full border py-2 pr-2 pl-2.5 transition-all duration-500 ${
            scrolled || menuOpen
              ? 'border-ivory/10 bg-ink/70 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl'
              : 'border-ivory/[0.06] bg-ink/30 backdrop-blur-md'
          }`}
        >
          <a href="#home" onClick={go('home')} className="group flex items-center gap-3">
            <Monogram className="h-10 w-10 text-lg transition-transform duration-500 group-hover:rotate-[360deg]" />
            <span className="hidden font-display text-lg tracking-tight text-ivory sm:block">
              {profile.firstName}
              <span className="text-gold">.</span>
            </span>
          </a>

          <nav className="hidden items-center md:flex" aria-label="Primary">
            {navLinks.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={go(id)}
                aria-current={active === id ? 'page' : undefined}
                className={`relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
                  active === id ? 'text-ink' : 'text-ivory/60 hover:text-ivory'
                }`}
              >
                {active === id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-light to-gold"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              onClick={go('contact')}
              className="group hidden items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-xs font-semibold tracking-wide text-gold transition-all duration-300 hover:bg-gold hover:text-ink sm:flex md:hidden lg:flex"
            >
              Let's talk
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 bg-ivory/5 md:hidden"
            >
              <span
                className={`absolute h-[1.5px] w-4 bg-ivory transition-transform duration-300 ${
                  menuOpen ? 'rotate-45' : '-translate-y-1'
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-4 bg-ivory transition-transform duration-300 ${
                  menuOpen ? '-rotate-45' : 'translate-y-1'
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
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink-2 px-8 md:hidden"
          >
            <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-gold/15 blur-[100px]" />
            <ul className="relative space-y-1">
              {navLinks.map(({ id, label }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, ease, duration: 0.6 }}
                >
                  <a
                    href={`#${id}`}
                    onClick={go(id)}
                    className={`flex items-baseline gap-4 font-display text-5xl font-light tracking-tight transition-colors ${
                      active === id ? 'text-gold italic' : 'text-ivory/80 hover:text-ivory'
                    }`}
                  >
                    <span className="font-mono text-[11px] not-italic text-ivory/30">0{i + 1}</span>
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.a
              href={`mailto:${profile.email}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative mt-12 border-t border-ivory/10 pt-6 font-mono text-xs break-all text-ivory/50"
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
