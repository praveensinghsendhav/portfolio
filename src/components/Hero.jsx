import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Magnetic from './Magnetic';
import { gsap, prefersReducedMotion, scrollToId } from '../lib/motion';
import { profile, roles, stats } from '../data/profile';

const ease = [0.22, 1, 0.36, 1];
const BADGE_R = 46;

// Counts "2.5+", "10M+", "1000+" up from zero once `start` flips true.
const CountUp = ({ value, start }) => {
  const ref = useRef(null);

  useEffect(() => {
    const match = value.match(/^([\d.]+)(.*)$/);
    if (!start || !match || prefersReducedMotion()) return;
    const target = parseFloat(match[1]);
    const decimals = (match[1].split('.')[1] || '').length;
    const obj = { v: 0 };
    const render = () => {
      if (ref.current) ref.current.textContent = obj.v.toFixed(decimals) + match[2];
    };
    render();
    const tween = gsap.to(obj, { v: target, duration: 2.2, delay: 0.5, ease: 'power3.out', onUpdate: render });
    return () => tween.kill();
  }, [start, value]);

  return <span ref={ref}>{value}</span>;
};

// "I build ___" — phrases roll up through a mask every few seconds.
const RoleRoller = ({ start }) => {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!start) return;
    const id = setInterval(() => setI((n) => (n + 1) % roles.length), 2800);
    return () => clearInterval(id);
  }, [start]);

  return (
    <>
      <span className="sr-only">{roles.join(', ')}</span>
      <span aria-hidden="true" className="inline-grid overflow-hidden pb-[0.12em] align-bottom">
        <AnimatePresence initial={false}>
          <motion.span
            key={i}
            initial={{ y: '105%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-105%', opacity: 0 }}
            transition={{ duration: 0.7, ease }}
            className="col-start-1 row-start-1 font-display whitespace-nowrap text-gold italic"
          >
            {roles[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
};

// Circular text slowly spinning around a gold button.
const RotatingBadge = ({ onClick }) => (
  <a
    href="#about"
    onClick={onClick}
    aria-label="Scroll to About"
    className="group relative block h-28 w-28 rounded-full bg-ink/80 backdrop-blur-md md:h-32 md:w-32"
  >
    <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden="true">
      <defs>
        <path
          id="hero-badge-path"
          d={`M60,60 m-${BADGE_R},0 a${BADGE_R},${BADGE_R} 0 1,1 ${BADGE_R * 2},0 a${BADGE_R},${BADGE_R} 0 1,1 -${BADGE_R * 2},0`}
        />
      </defs>
      <text className="fill-ivory/75 font-mono uppercase" style={{ fontSize: 8.5 }}>
        <textPath href="#hero-badge-path" textLength={Math.floor(2 * Math.PI * BADGE_R) - 4} lengthAdjust="spacing">
          Full-stack engineer · MERN · Next.js · AI ·
        </textPath>
      </text>
    </svg>
    <span className="absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold text-ink transition-transform duration-500 group-hover:scale-110 md:h-12 md:w-12">
      <svg className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6" />
      </svg>
    </span>
  </a>
);

// Two rings of tech labels circling the portrait. Each label counter-spins so it stays upright.
const ORBITS = [
  {
    inset: '6%',
    ring: 'border-gold/20',
    spin: 'animate-orbit',
    counter: 'animate-orbit-reverse',
    items: ['Next.js', 'Node.js', 'MongoDB'],
    start: -90,
    dots: [30, 150, 270],
  },
  {
    inset: '0%',
    ring: 'border-dashed border-ivory/[0.12]',
    spin: 'animate-orbit-slow-reverse',
    counter: 'animate-orbit-slow',
    items: ['React', 'TypeScript', 'GCP'],
    start: -30,
    dots: [90, 210],
  },
];

const onCircle = (deg) => {
  const a = (deg * Math.PI) / 180;
  return { left: `${50 + 50 * Math.cos(a)}%`, top: `${50 + 50 * Math.sin(a)}%` };
};

const Orbit = ({ inset, ring, spin, counter, items, start, dots }) => (
  <div className={`absolute rounded-full border ${ring} ${spin}`} style={{ inset }}>
    {dots.map((deg) => (
      <span
        key={deg}
        className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_10px_#E2B66B]"
        style={onCircle(deg)}
      />
    ))}
    {items.map((label, i) => (
      <span
        key={label}
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={onCircle(start + (360 / items.length) * i)}
      >
        <span className={`block ${counter}`}>
          <span className="flex items-center gap-1.5 rounded-full border border-ivory/10 bg-ink/85 px-2.5 py-1 font-mono text-[9px] tracking-widest whitespace-nowrap text-ivory/80 uppercase shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-[10px]">
            <span className="h-1 w-1 rounded-full bg-gold" />
            {label}
          </span>
        </span>
      </span>
    ))}
  </div>
);

// Depth plane inside the tilting card — higher z drifts more as the card tilts.
const Layer = ({ z, className = '', children }) => (
  <div className={`pointer-events-none absolute inset-0 ${className}`} style={{ transform: `translateZ(${z}px)` }}>
    {children}
  </div>
);

const Portrait = () =>
  profile.photo ? (
    <>
      <img
        src={profile.photo}
        alt={profile.fullName}
        className="absolute inset-0 h-full w-full scale-[1.04] object-cover object-[center_20%] saturate-[0.85] transition-all duration-1000 group-hover:scale-[1.1] group-hover:saturate-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(246,226,179,0.28),transparent_55%)] mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-60" />
    </>
  ) : (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#3a3020_0%,#151a2a_50%,#0a0e19_100%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-gradient font-display text-[8rem] leading-none italic" aria-hidden="true">
          {profile.initials}
        </span>
      </div>
    </>
  );

const Hero = ({ ready }) => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const glareRef = useRef(null);

  // Hide intro elements before first paint so the reveal never flashes.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero-item', { autoAlpha: 0, y: 40, filter: 'blur(8px)' });
      gsap.set('.hero-line', { yPercent: 110 });
      gsap.set(cardRef.current, { autoAlpha: 0, scale: 0.85, rotationY: 25, rotationX: -10 });
      gsap.set('.hero-chip', { autoAlpha: 0, scale: 0.6 });
      gsap.set('.hero-orbit', { autoAlpha: 0, scale: 0.6, rotation: -90 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to('.hero-line', { yPercent: 0, duration: 1.3, stagger: 0.12 })
        .to('.hero-item', { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.08 }, 0.15)
        .to(
          cardRef.current,
          { autoAlpha: 1, scale: 1, rotationY: 0, rotationX: 0, duration: 1.6, ease: 'expo.out' },
          0.2
        )
        .to('.hero-orbit', { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.8, stagger: 0.15, ease: 'expo.out' }, 0.35)
        .to('.hero-chip', { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: 'back.out(1.8)' }, 0.9);

      // Parallax drift as the hero scrolls away
      gsap.to('.hero-content', {
        yPercent: -12,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [ready]);

  // 3D tilt + glare on the portrait (mouse / trackpad only).
  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const tiltY = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    const tiltX = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const glareX = gsap.quickTo(glareRef.current, 'xPercent', { duration: 0.6, ease: 'power3.out' });
    const glareY = gsap.quickTo(glareRef.current, 'yPercent', { duration: 0.6, ease: 'power3.out' });

    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
      tiltY(gsap.utils.clamp(-1, 1, dx) * 12);
      tiltX(gsap.utils.clamp(-1, 1, dy) * -10);
      glareX(dx * 25);
      glareY(dy * 25);
    };
    const onLeave = () => {
      tiltY(0);
      tiltX(0);
    };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink"
    >
      {/* Background: drifting aurora + blueprint grid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-48 right-[-12%] h-[620px] w-[620px] animate-aurora rounded-full bg-gold/[0.16] blur-[140px] will-change-transform" />
        <div className="absolute bottom-[-25%] left-[-12%] h-[560px] w-[560px] animate-aurora rounded-full bg-mist/[0.13] blur-[140px] [animation-delay:-6s] will-change-transform" />
        <div className="absolute top-1/3 left-1/3 h-[380px] w-[380px] animate-aurora rounded-full bg-copper/[0.08] blur-[120px] [animation-delay:-12s] will-change-transform" />
        <div className="bg-grid absolute inset-0" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="hero-content relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pt-32 pb-10 md:px-12 md:pt-36">
        <div className="grid flex-1 grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Copy */}
          <div className="flex flex-col items-start lg:col-span-7">
            <div className="hero-item mb-8 inline-flex items-center gap-2.5 rounded-full border border-ivory/10 bg-ivory/[0.04] py-1.5 pr-4 pl-2 text-[11px] font-medium tracking-wide text-ivory/75 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              {profile.currentRole}
            </div>

            <h1 className="font-display text-[clamp(2.9rem,7.4vw,6.4rem)] leading-[0.98] font-light tracking-[-0.03em] text-ivory">
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="hero-line block">{profile.firstName}</span>
              </span>
              <span className="block overflow-hidden pb-[0.12em]">
                <span className="hero-line block italic">
                  <span className="text-gradient">{profile.lastName}</span>
                </span>
              </span>
            </h1>

            <p className="hero-item mt-6 text-xl font-light text-ivory/70 md:text-[1.7rem]">
              <span className="mr-2">I build</span>
              <br className="sm:hidden" />
              <RoleRoller start={ready} />
            </p>

            <p className="hero-item mt-6 max-w-xl text-[15px] leading-relaxed font-light text-ivory/60 md:text-base">
              {profile.summary}
            </p>

            <div className="hero-item mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  href="#projects"
                  onClick={go('projects')}
                  className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-deep py-3.5 pr-3.5 pl-7 text-sm font-semibold text-ink shadow-[0_12px_40px_rgba(226,182,107,0.3)] transition-shadow duration-300 hover:shadow-[0_16px_50px_rgba(226,182,107,0.5)]"
                >
                  View selected work
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-gold transition-transform duration-500 group-hover:rotate-45">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </span>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#about"
                  onClick={go('about')}
                  className="flex items-center gap-2 rounded-full border border-ivory/20 px-7 py-4 text-sm font-semibold text-ivory transition-colors duration-300 hover:border-gold/60 hover:text-gold"
                >
                  About me
                </a>
              </Magnetic>
            </div>

            <dl className="hero-item mt-14 grid w-full max-w-xl grid-cols-2 gap-y-7 border-t border-ivory/10 pt-7 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-2 text-[11px] tracking-wide text-ivory/45 uppercase">{s.label}</dt>
                  <dd className="font-display text-4xl leading-none font-light text-ivory tabular-nums">
                    <CountUp value={s.value} start={ready} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Orbit portrait */}
          <div className="flex justify-center [perspective:1400px] lg:col-span-5 lg:justify-end">
            <div
              ref={cardRef}
              className="group relative aspect-square w-[290px] transform-gpu will-change-transform [transform-style:preserve-3d] sm:w-[380px] lg:w-[450px]"
              data-cursor
            >
              {/* Back: colour halo + outer orbit */}
              <Layer z={-70}>
                <div className="absolute inset-[10%] animate-ring rounded-full bg-[conic-gradient(from_0deg,#f6e2b3,#e2b66b,#d98b63,#8fa3ff,#f6e2b3)] opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-70" />
                <div className="hero-orbit absolute inset-0">
                  <Orbit {...ORBITS[1]} />
                </div>
              </Layer>

              {/* Middle: inner orbit */}
              <Layer z={-25}>
                <div className="hero-orbit absolute inset-0">
                  <Orbit {...ORBITS[0]} />
                </div>
              </Layer>

              {/* Front: ripples, gradient ring, photo */}
              <Layer z={0}>
                <div className="absolute inset-[13%] animate-ripple rounded-full border border-gold/40" />
                <div className="absolute inset-[13%] animate-ripple rounded-full border border-gold/30 [animation-delay:-1.8s]" />
                <div className="absolute inset-[13%] animate-ring rounded-full bg-[conic-gradient(from_0deg,#f6e2b3,#e2b66b,#d98b63,#8fa3ff,#f6e2b3)]" />
                <div className="absolute inset-[13.8%] overflow-hidden rounded-full border-[5px] border-ink bg-panel shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
                  <Portrait />
                  <div
                    ref={glareRef}
                    className="pointer-events-none absolute -inset-1/2 z-30 bg-gradient-to-tr from-transparent via-ivory/[0.1] to-transparent"
                  />
                </div>
              </Layer>

              {/* Floating details closest to the viewer */}
              <Layer z={60}>
                <div className="hero-chip absolute bottom-[7%] left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-3 rounded-2xl border border-ivory/10 bg-ink/80 py-2.5 pr-5 pl-3 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
                    </span>
                    <span className="text-left whitespace-nowrap">
                      <span className="block font-display text-[15px] leading-tight text-ivory italic sm:text-lg">{profile.title}</span>
                      <span className="block font-mono text-[9px] tracking-[0.25em] text-gold uppercase">{profile.location}</span>
                    </span>
                  </div>
                </div>
                <div className="hero-chip absolute top-[16%] -left-4 hidden sm:block">
                  <div className="animate-float rounded-2xl border border-ivory/10 bg-ink/80 px-4 py-3 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                    <p className="font-display text-2xl leading-none text-gold">{stats[1].value}</p>
                    <p className="mt-1 text-[10px] tracking-wide text-ivory/55 uppercase">{stats[1].label}</p>
                  </div>
                </div>
              </Layer>

              <Layer z={90}>
                <div className="hero-chip pointer-events-auto absolute top-[2%] right-[-2%] scale-[0.8] sm:scale-100">
                  <RotatingBadge onClick={go('about')} />
                </div>
              </Layer>
            </div>
          </div>
        </div>

        <div className="hero-item mt-16 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-ivory/35 uppercase">
          <span className="flex items-center gap-3">
            <span className="relative block h-8 w-[1px] overflow-hidden bg-ivory/15">
              <span className="absolute inset-x-0 top-0 h-3 animate-scrollcue bg-gold" />
            </span>
            Scroll to explore
          </span>
          <span className="hidden sm:inline">Crafted with care · {new Date().getFullYear()}</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
