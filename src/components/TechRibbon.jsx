import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { techStack } from '../data/profile';

const Star = () => (
  <svg className="h-4 w-4 shrink-0 md:h-5 md:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
  </svg>
);

const Row = ({ reverse, className, itemClass }) => (
  <div className={`flex overflow-hidden ${className}`}>
    <div className={`flex w-max shrink-0 items-center ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
      {[...techStack, ...techStack].map((tech, i) => (
        <span key={i} className={`flex items-center gap-6 px-6 md:gap-8 md:px-8 ${itemClass}`}>
          {tech}
          <Star />
        </span>
      ))}
    </div>
  </div>
);

// Two crossing ribbons of the tech stack. They lean into the scroll direction based on scroll speed.
const TechRibbon = () => {
  const rootRef = useRef(null);
  const skewRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    let settle;
    const ctx = gsap.context(() => {
      const skewTo = gsap.quickTo(skewRef.current, 'skewX', { duration: 0.6, ease: 'power3.out' });
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          skewTo(gsap.utils.clamp(-10, 10, self.getVelocity() / -250));
          clearTimeout(settle);
          settle = setTimeout(() => skewTo(0), 140);
        },
      });
    }, rootRef);
    return () => {
      clearTimeout(settle);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} aria-label="Tech stack" className="relative overflow-hidden bg-ink py-16 md:py-24">
      <div ref={skewRef} className="relative">
        <Row
          className="relative z-10 -mx-4 -rotate-2 bg-gradient-to-r from-gold-light via-gold to-copper py-4 text-ink shadow-[0_20px_60px_rgba(226,182,107,0.25)] md:py-5"
          itemClass="font-display text-2xl italic md:text-4xl"
        />
        <Row
          reverse
          className="-mx-4 -mt-2 rotate-[1.5deg] border-y border-ivory/10 bg-ink-2 py-4 text-ivory/50 md:py-5"
          itemClass="font-mono text-xs uppercase tracking-[0.3em] md:text-sm"
        />
      </div>
    </section>
  );
};

export default TechRibbon;
