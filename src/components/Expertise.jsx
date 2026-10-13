import { useLayoutEffect, useRef } from 'react';
import SectionHeading from './SectionHeading';
import { gsap, trackSpotlight } from '../lib/motion';
import { expertise } from '../data/profile';

const gradients = [
  'from-[#1a2033] via-[#121829] to-[#0c1120]',
  'from-[#1d1f2e] via-[#131828] to-[#0b101d]',
  'from-[#22212a] via-[#141827] to-[#0c1120]',
  'from-[#171f33] via-[#11172a] to-[#0a0f1c]',
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
    <section id="expertise" ref={sectionRef} className="relative w-full overflow-x-clip bg-ink px-5 py-24 md:px-12">
      <div className="pointer-events-none absolute top-1/3 left-1/4 h-[460px] w-[460px] rounded-full bg-mist/[0.08] blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-14">
        <SectionHeading
          index="02"
          label="Expertise"
          title="What I bring"
          accent="to the table."
          aside="Full-stack engineering, secure APIs, AI-powered SaaS and cloud infrastructure — shipped to production, not just prototyped."
        />

        <div className="relative flex flex-col gap-8 pb-[10vh]">
          {expertise.map((item, i) => (
            <article
              key={item.title}
              ref={(el) => (cardsRef.current[i] = el)}
              onMouseMove={trackSpotlight}
              className={`spotlight group sticky flex min-h-[260px] origin-top transform-gpu flex-col justify-between overflow-hidden rounded-[2rem] border border-ivory/10 bg-gradient-to-br p-7 shadow-[0_30px_70px_rgba(0,0,0,0.6)] transition-colors duration-500 hover:border-gold/40 md:min-h-[290px] md:p-10 ${gradients[i % gradients.length]}`}
              style={{ top: `${110 + i * 18}px` }}
            >
              <div className="absolute top-0 left-10 h-[2px] w-40 bg-gradient-to-r from-gold to-transparent" />
              <span
                aria-hidden="true"
                className="text-outline pointer-events-none absolute -right-2 -bottom-10 font-display text-[11rem] leading-none italic transition-transform duration-700 group-hover:-translate-y-3 md:text-[14rem]"
              >
                0{i + 1}
              </span>

              <div className="flex items-center justify-between">
                <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-gold uppercase">
                  {item.tag}
                </span>
                <span className="font-mono text-xs text-ivory/35">
                  0{i + 1} / 0{expertise.length}
                </span>
              </div>

              <div className="relative my-auto grid grid-cols-1 items-center gap-4 pt-6 lg:grid-cols-12 lg:gap-10">
                <h3 className="font-display text-[2rem] leading-[1.05] font-light tracking-[-0.01em] text-ivory transition-colors duration-300 group-hover:text-gold md:text-[2.6rem] lg:col-span-5">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed font-light text-ivory/65 md:text-base lg:col-span-7">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
