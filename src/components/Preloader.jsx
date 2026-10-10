import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { profile } from '../data/profile';

// Short "ta-dum" style intro: letters rise in, red bar sweeps, curtain lifts.
// onReveal fires as the curtain starts lifting, so the hero can animate in underneath it.
const Preloader = ({ onReveal, onComplete }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onReveal();
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({ onComplete })
        .from('.pl-letter', {
          yPercent: 110,
          opacity: 0,
          duration: 0.7,
          stagger: 0.05,
          ease: 'power4.out',
        })
        .from('.pl-bar', { scaleX: 0, duration: 0.7, ease: 'power3.inOut' }, '-=0.35')
        .from('.pl-sub', { opacity: 0, y: 8, duration: 0.4 }, '-=0.4')
        .to('.pl-content', { scale: 1.08, opacity: 0, filter: 'blur(8px)', duration: 0.45, ease: 'power2.in' }, '+=0.35')
        .call(onReveal, null, '-=0.1')
        .to(rootRef.current, { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, '<');
    }, rootRef);

    return () => ctx.revert();
  }, [onReveal, onComplete]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-ink"
      aria-hidden="true"
    >
      <div className="pl-content flex flex-col items-center gap-4">
        <h1 className="flex overflow-hidden font-display text-6xl tracking-[0.18em] text-brand drop-shadow-[0_0_35px_rgba(229,9,20,0.55)] md:text-8xl">
          {profile.brand.split('').map((ch, i) => (
            <span key={i} className="pl-letter inline-block">
              {ch}
            </span>
          ))}
        </h1>
        <div className="pl-bar h-[2px] w-40 origin-left bg-gradient-to-r from-transparent via-brand to-transparent md:w-64" />
        <p className="pl-sub font-mono text-[10px] uppercase tracking-[0.4em] text-white/50 md:text-xs">
          {profile.title}
        </p>
      </div>
    </div>
  );
};

export default Preloader;
