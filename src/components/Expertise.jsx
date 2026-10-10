import { useLayoutEffect, useRef } from 'react';
import SectionHeading from './SectionHeading';
import { gsap, trackSpotlight } from '../lib/motion';
import { expertise } from '../data/profile';

const gradients = [
  'from-[#22090c] via-[#121212] to-[#0a0a0a]',
  'from-[#1c0809] via-[#111111] to-[#090909]',
  'from-[#260a0e] via-[#131313] to-[#0a0a0a]',
  'from-[#1f090b] via-[#101010] to-[#080808]',
];

// Sticky stacked cards: each one recedes as the next slides over it.
const Expertise = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card, {
          scale: 0.94 - (cards.length - i) * 0.01,
          opacity: 0.35,
          filter: 'blur(3px)',
          ease: 'none',
          scrollTrigger: {
            trigger: cards[i + 1],
            start: 'top 65%',
            end: `top ${110 + (i + 1) * 18}px`,
            scrub: true,
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="expertise" ref={sectionRef} className="relative w-full bg-ink px-5 py-24 md:px-12">
      <div className="pointer-events-none absolute top-1/3 left-1/4 h-[460px] w-[460px] rounded-full bg-brand/10 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-14">
        <SectionHeading
          episode="02"
          label="Core competencies"
          title="Director's Cut"
          accent="Technical Capabilities."
          aside="Full-stack engineering, secure APIs, AI-powered SaaS and cloud infrastructure — shipped to production, not just prototyped."
        />

        <div className="relative flex flex-col gap-8 pb-[10vh]">
          {expertise.map((item, i) => (
            <article
              key={item.title}
              ref={(el) => (cardsRef.current[i] = el)}
              onMouseMove={trackSpotlight}
              className={`spotlight group sticky flex min-h-[250px] origin-top transform-gpu flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br p-7 shadow-[0_24px_60px_rgba(0,0,0,0.85)] transition-colors duration-500 hover:border-brand/45 md:min-h-[280px] md:p-10 ${gradients[i % gradients.length]}`}
              style={{ top: `${110 + i * 18}px` }}
            >
              <div className="absolute top-0 left-1/2 h-[2px] w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand to-transparent" />

              <div className="flex items-center justify-between">
                <span className="rounded-full border border-brand/25 bg-brand/10 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-brand uppercase">
                  {item.tag}
                </span>
                <span className="font-display text-4xl text-white/15 md:text-5xl">0{i + 1}</span>
              </div>

              <div className="my-auto grid grid-cols-1 items-center gap-4 pt-6 lg:grid-cols-12 lg:gap-10">
                <h3 className="font-display text-4xl leading-[0.95] tracking-wide text-white transition-colors duration-300 group-hover:text-brand md:text-5xl lg:col-span-5">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed font-light text-white/70 md:text-base lg:col-span-7">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
