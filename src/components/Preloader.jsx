import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { profile } from '../data/profile';

// Name rises in, a counter runs 000 → 100 along a gold line, then the screen splits open.
// onReveal fires as the panels part, so the hero can animate in underneath.
const Preloader = ({ onReveal, onComplete }) => {
  const rootRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onReveal();
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      gsap
        .timeline({ onComplete })
        .from('.pl-word', { yPercent: 115, duration: 1, stagger: 0.1, ease: 'power4.out' })
        .from('.pl-meta', { opacity: 0, y: 10, duration: 0.6, stagger: 0.08 }, 0.3)
        .fromTo('.pl-line', { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0.15)
        .to(
          counter,
          {
            v: 100,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0');
            },
          },
          0.15
        )
        .to('.pl-content', { opacity: 0, y: -24, duration: 0.5, ease: 'power2.in' }, '+=0.2')
        .call(onReveal, null, '-=0.1')
        .to('.pl-top', { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '<')
        .to('.pl-bottom', { yPercent: 100, duration: 1, ease: 'expo.inOut' }, '<');
    }, rootRef);

    return () => ctx.revert();
  }, [onReveal, onComplete]);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[10000]" aria-hidden="true">
      <div className="pl-top absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div className="pl-bottom absolute inset-x-0 bottom-0 h-1/2 bg-ink" />

      <div className="pl-content absolute inset-0 flex flex-col justify-between p-6 md:p-12">
        <div className="pl-meta flex justify-between font-mono text-[10px] tracking-[0.3em] text-ivory/40 uppercase">
          <span>Portfolio</span>
          <span>{profile.location}</span>
        </div>

        <div className="flex flex-col items-center text-center">
          <h1 className="font-display text-[clamp(3rem,11vw,9rem)] leading-[0.95] font-light tracking-[-0.03em] text-ivory">
            <span className="block overflow-hidden pb-[0.1em]">
              <span className="pl-word block">{profile.firstName}</span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <span className="pl-word block italic">
                <span className="text-gradient">{profile.lastName}</span>
              </span>
            </span>
          </h1>
        </div>

        <div className="space-y-4">
          <div className="pl-line h-px w-full origin-left bg-gradient-to-r from-gold-light via-gold to-copper" />
          <div className="flex items-end justify-between">
            <p className="pl-meta font-mono text-[10px] tracking-[0.3em] text-ivory/50 uppercase md:text-xs">
              {profile.title}
            </p>
            <span ref={countRef} className="font-display text-5xl leading-none font-light text-gold tabular-nums md:text-7xl">
              000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
