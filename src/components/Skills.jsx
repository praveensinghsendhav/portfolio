import { useLayoutEffect, useRef, useState } from 'react';
import { Eyebrow } from './SectionHeading';
import { gsap, ScrollTrigger } from '../lib/motion';
import { skillCategories } from '../data/profile';

const total = skillCategories.length;
const pad = (n) => String(n).padStart(2, '0');

// Desktop: cards travel along a wide arc while the section is pinned.
// Mobile: native horizontal snap carousel.
const Skills = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 769px)', () => {
        const place = (p) => {
          cardsRef.current.forEach((card, i) => {
            if (!card) return;
            const offset = i - p;
            const dist = Math.abs(offset);
            const rad = (offset * 17 * Math.PI) / 180;
            const radius = 1700;
            gsap.set(card, {
              x: Math.sin(rad) * radius,
              y: radius - Math.cos(rad) * radius,
              z: -dist * 60,
              rotationZ: offset * 17,
              scale: Math.max(0.5, 1 - dist * 0.14),
              opacity: Math.max(0.12, 1 - dist * 0.32),
              zIndex: Math.round(100 - dist * 10),
            });
          });
        };

        place(0);

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${(total - 1) * 65}%`,
          pin: true,
          scrub: 0.8,
          snap: { snapTo: 1 / (total - 1), duration: { min: 0.2, max: 0.6 }, ease: 'power2.inOut', delay: 0.05 },
          onUpdate: (self) => {
            const p = self.progress * (total - 1);
            place(p);
            setActive(Math.round(p));
          },
        });
      });

      mm.add('(max-width: 768px)', () => {
        cardsRef.current.forEach((card, i) => card && gsap.set(card, { scale: i === 0 ? 1 : 0.92 }));
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const onMobileScroll = () => {
    if (window.innerWidth > 768) return;
    const track = trackRef.current;
    const center = track.scrollLeft + track.offsetWidth / 2;
    let idx = 0;
    let best = Infinity;
    cardsRef.current.forEach((card, i) => {
      const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (d < best) {
        best = d;
        idx = i;
      }
    });
    if (idx !== active) {
      setActive(idx);
      cardsRef.current.forEach((card, i) =>
        gsap.to(card, { scale: i === idx ? 1 : 0.92, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
      );
    }
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-ink-2 md:[perspective:1100px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(226,182,107,0.08)_0%,transparent_60%)]" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />

      {/* Outlined background word */}
      <h2
        aria-hidden="true"
        className="text-outline pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[24vw] leading-none italic md:text-[19vw]"
      >
        Toolkit
      </h2>

      {/* Header + progress */}
      <div className="absolute inset-x-0 top-24 z-20 mx-auto flex max-w-7xl items-center justify-between px-5 md:top-28 md:px-12">
        <Eyebrow index="03" label="Skills" />
        <div className="flex items-center gap-3 font-mono text-xs text-ivory/50">
          <span className="text-gold">{pad(active + 1)}</span>
          <span className="relative h-[2px] w-20 overflow-hidden rounded-full bg-ivory/10 md:w-32">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold-light to-copper transition-[width] duration-500 ease-out"
              style={{ width: `${((active + 1) / total) * 100}%` }}
            />
          </span>
          <span>{pad(total)}</span>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={onMobileScroll}
        className="no-scrollbar relative z-10 flex h-full w-full snap-x snap-mandatory items-center gap-4 overflow-x-auto px-[9vw] pt-14 md:items-center md:justify-center md:gap-0 md:overflow-visible md:px-0 md:[transform-style:preserve-3d]"
      >
        {skillCategories.map((cat, i) => (
          <article
            key={cat.title}
            ref={(el) => (cardsRef.current[i] = el)}
            className="group relative flex h-[420px] w-[82vw] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[2rem] border border-ivory/10 bg-gradient-to-b from-panel to-ink p-7 shadow-[0_30px_70px_rgba(0,0,0,0.65)] transition-colors duration-500 hover:border-gold/50 sm:w-[360px] md:absolute md:h-[520px] md:w-[430px] md:p-10"
          >
            <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gold/0 blur-3xl transition-colors duration-700 group-hover:bg-gold/20" />
            <div className="absolute top-0 left-10 h-[2px] w-24 bg-gradient-to-r from-gold to-transparent" />

            <div className="relative flex items-center justify-between">
              <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-gold uppercase">
                {cat.tag}
              </span>
              <span className="font-display text-2xl text-ivory/25 italic">{pad(i + 1)}</span>
            </div>

            <div className="relative my-auto space-y-4">
              <h3 className="font-display text-4xl leading-[1.05] font-light tracking-[-0.01em] text-ivory transition-colors duration-300 group-hover:text-gold md:text-[2.75rem]">
                {cat.title}
              </h3>
              <p className="text-sm leading-relaxed font-light text-ivory/60 md:text-base">{cat.desc}</p>
            </div>

            <div className="relative flex flex-wrap gap-2 border-t border-ivory/10 pt-5">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-ivory/10 bg-ivory/[0.03] px-3 py-1 text-[11px] text-ivory/75 transition-colors group-hover:border-gold/25"
                >
                  {skill}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="pointer-events-none absolute inset-x-0 bottom-8 z-20 text-center font-mono text-[10px] tracking-[0.3em] text-ivory/30 uppercase">
        <span className="hidden md:inline">Keep scrolling</span>
        <span className="md:hidden">Swipe to browse</span>
      </p>
    </section>
  );
};

export default Skills;
