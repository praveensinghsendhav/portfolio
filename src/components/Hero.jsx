import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, scrollToId } from '../lib/motion';
import { profile, roles, stats } from '../data/profile';

const PosterArt = () =>
  profile.photo ? (
    <>
      <img
        src={profile.photo}
        alt={profile.fullName}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
    </>
  ) : (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#5a0a0f_0%,#1a0406_45%,#0a0a0a_100%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_22px,rgba(255,255,255,0.018)_22px_23px)]" />
      <div className="absolute inset-x-0 top-[16%] flex justify-center">
        <span
          className="bg-gradient-to-b from-white via-white/85 to-brand bg-clip-text font-display text-[9.5rem] leading-none tracking-wide text-transparent drop-shadow-[0_10px_40px_rgba(229,9,20,0.45)] md:text-[11rem]"
          aria-hidden="true"
        >
          {profile.initials}
        </span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
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
      gsap.set(cardRef.current, { autoAlpha: 0, scale: 0.85, rotationY: 25, rotationX: -10 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to('.hero-item', { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.08 })
        .to(
          cardRef.current,
          { autoAlpha: 1, scale: 1, rotationY: 0, rotationX: 0, duration: 1.5, ease: 'expo.out' },
          0.2
        );

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

  // 3D tilt + glare on the poster (mouse / trackpad only).
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
      {/* Background: oversized role marquee + vignette */}
      <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden opacity-[0.07]" aria-hidden="true">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[...roles, ...roles].map((role, i) => (
            <span key={i} className="mx-10 font-display text-[16vw] leading-none text-brand">
              {role} •
            </span>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(229,9,20,0.16),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="hero-content relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pt-28 pb-10 md:px-12 md:pt-32">
        <div className="grid flex-1 grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Copy */}
          <div className="flex flex-col items-start lg:col-span-7">
            <div className="hero-item mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pr-4 pl-2 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              Now streaming · {profile.currentRole}
            </div>

            <p className="hero-item mb-3 font-mono text-xs tracking-[0.3em] text-brand uppercase">
              A Full-Stack Original
            </p>

            <h1 className="hero-item font-display text-[clamp(3.6rem,10vw,8.5rem)] leading-[0.86] tracking-wide text-white">
              {profile.firstName}
              <br />
              <span className="bg-gradient-to-r from-brand via-rose-500 to-brand-dark bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(229,9,20,0.35)]">
                {profile.lastName}
              </span>
            </h1>

            <div className="hero-item mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-white/60">
              <span className="font-semibold text-emerald-400">MERN · Next.js · AI SaaS</span>
              <span className="text-white/25">•</span>
              <span>{profile.title}</span>
              <span className="text-white/25">•</span>
              <span className="rounded border border-white/25 px-1.5 py-px font-mono text-[10px] text-white/70">
                {profile.location.toUpperCase()}
              </span>
            </div>

            <p className="hero-item mt-5 max-w-xl text-base leading-relaxed font-light text-white/75 md:text-lg">
              {profile.summary}
            </p>

            <div className="hero-item mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                onClick={go('projects')}
                className="group flex items-center gap-2.5 rounded-md bg-white px-7 py-3.5 text-sm font-bold text-black transition-all duration-300 hover:bg-white/85 active:scale-95"
              >
                <svg className="h-5 w-5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Projects
              </a>
              <a
                href="#about"
                onClick={go('about')}
                className="flex items-center gap-2.5 rounded-md bg-white/15 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/25 active:scale-95"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" d="M12 16v-4m0-4h.01" />
                </svg>
                More Info
              </a>
            </div>

            <dl className="hero-item mt-12 grid w-full max-w-xl grid-cols-2 gap-y-6 border-t border-white/10 pt-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-4xl leading-none text-white">{s.value}</dd>
                  <dd className="mt-1.5 text-[11px] tracking-wide text-white/45 uppercase">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Poster */}
          <div className="flex justify-center [perspective:1200px] lg:col-span-5 lg:justify-end">
            <div ref={cardRef} className="group relative transform-gpu will-change-transform" data-cursor>
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand/50 via-rose-700/25 to-transparent opacity-80 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative aspect-[2/3] w-[270px] overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-[0_40px_90px_rgba(0,0,0,0.9)] sm:w-[310px] lg:w-[340px]">
                <PosterArt />

                <div
                  ref={glareRef}
                  className="pointer-events-none absolute -inset-1/2 z-30 bg-gradient-to-tr from-transparent via-white/[0.09] to-transparent"
                />

                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5">
                  <span className="font-display text-2xl leading-none text-brand">P</span>
                  <span className="font-mono text-[9px] font-bold tracking-[0.35em] text-white/80">SERIES</span>
                </div>

                <div className="absolute inset-x-0 bottom-0 z-20 p-5">
                  <p className="font-mono text-[10px] tracking-[0.3em] text-brand uppercase">New Episodes</p>
                  <h2 className="mt-1 font-display text-[2.15rem] leading-[0.95] tracking-wide text-white">
                    The Full-Stack
                    <br />
                    Engineer
                  </h2>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-white/60">
                    <span className="font-semibold text-emerald-400">2024 — Now</span>
                    <span className="rounded-sm border border-white/30 px-1 text-[9px]">HD</span>
                    <span>2 Seasons</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-item mt-12 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-white/35 uppercase">
          <span className="flex items-center gap-3">
            <span className="relative block h-8 w-[1px] overflow-hidden bg-white/15">
              <span className="absolute inset-x-0 top-0 h-3 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-brand" />
            </span>
            Scroll to explore
          </span>
          <span className="hidden sm:inline">Engineered for scale</span>
        </div>
      </div>

      <style>{`@keyframes scrollcue { 0% { transform: translateY(-100%); } 100% { transform: translateY(300%); } }`}</style>
    </section>
  );
};

export default Hero;
