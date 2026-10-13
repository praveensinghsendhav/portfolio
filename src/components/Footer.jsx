import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Magnetic from './Magnetic';
import { navLinks, profile } from '../data/profile';
import { scrollToId } from '../lib/motion';

const ease = [0.22, 1, 0.36, 1];

const socials = [
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'GitHub', href: profile.github },
  { label: 'Email', href: `mailto:${profile.email}` },
].filter((s) => s.href);

// Champagne → copper across the oversized name.
const letterColor = (i, n) => {
  const from = [246, 226, 179];
  const to = [217, 139, 99];
  const t = n > 1 ? i / (n - 1) : 0;
  return `rgb(${from.map((c, k) => Math.round(c + (to[k] - c) * t)).join(',')})`;
};

const timeFormat = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

// Live local time in Indore (IST), refreshed every 15s.
const LocalTime = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{timeFormat.format(now).toUpperCase()} IST</span>;
};

const Footer = () => {
  const go = (id) => (e) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <footer className="relative z-10 overflow-hidden border-t border-ivory/[0.06] bg-ink px-5 pt-20 pb-10 md:px-12">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[360px] w-[80vw] -translate-x-1/2 rounded-full bg-gold/[0.07] blur-[140px]" />

      <div className="relative mx-auto max-w-7xl space-y-14">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div className="space-y-4">
            <p className="font-mono text-[10px] tracking-[0.3em] text-ivory/40 uppercase">Have a project in mind?</p>
            <a
              href="#contact"
              onClick={go('contact')}
              className="group block font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] font-light tracking-[-0.02em] text-ivory"
            >
              Let's work{' '}
              <span className="relative italic">
                <span className="text-gradient">together</span>
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-700 group-hover:scale-x-100" />
              </span>
              <span className="ml-3 inline-block text-gold transition-transform duration-500 group-hover:translate-x-2">→</span>
            </a>
          </div>

          <Magnetic strength={0.4}>
            <button
              type="button"
              onClick={() => scrollToId('home')}
              aria-label="Back to top"
              className="group flex h-20 w-20 items-center justify-center rounded-full border border-ivory/15 text-ivory transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-ink"
            >
              <svg className="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6" />
              </svg>
            </button>
          </Magnetic>
        </div>

        <div className="grid grid-cols-1 gap-10 border-y border-ivory/[0.07] py-10 sm:grid-cols-3">
          <div>
            <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-ivory/35 uppercase">Navigate</p>
            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-sm text-ivory/60">
              {navLinks.map(({ id, label }) => (
                <a key={id} href={`#${id}`} onClick={go(id)} className="w-fit transition-colors hover:text-gold">
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-ivory/35 uppercase">Connect</p>
            <div className="flex flex-col gap-2.5 text-sm">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group flex w-fit items-center gap-1.5 text-ivory/60 transition-colors hover:text-gold"
                >
                  {s.label}
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-ivory/35 uppercase">Local time</p>
            <p className="flex items-center gap-2.5 text-sm text-ivory/70">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              <LocalTime />
            </p>
            <p className="mt-2 text-sm text-ivory/45">{profile.location}</p>
          </div>
        </div>

        {/* Oversized name — letters rise in one by one */}
        <div aria-hidden="true" className="flex justify-center overflow-hidden select-none">
          {profile.firstName.split('').map((ch, i) => (
            <motion.span
              key={i}
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 1.1, ease, delay: i * 0.06 }}
              style={{ color: letterColor(i, profile.firstName.length) }}
              className="inline-block font-display text-[21vw] leading-[0.95] font-light tracking-[-0.03em] italic xl:text-[17rem]"
            >
              {ch}
            </motion.span>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 font-mono text-[10px] tracking-[0.2em] text-ivory/30 uppercase md:flex-row">
          <p>
            © {new Date().getFullYear()} {profile.fullName}
          </p>
          <p>Built with React · GSAP · Tailwind</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
