import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { gsap, ScrollTrigger, setScrollLocked } from '../lib/motion';
import { projects } from '../data/profile';

const pad = (i) => String(i + 1).padStart(2, '0');

const ArrowIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
  </svg>
);

const ProjectCard = ({ project, index, onOpen, compact = false }) => (
  <button
    type="button"
    onClick={() => onOpen(index)}
    data-cursor-label="View"
    className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[1.75rem] border border-ivory/10 bg-gradient-to-br from-panel via-[#10162a] to-ink p-6 text-left shadow-[0_25px_50px_rgba(0,0,0,0.6)] transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_35px_80px_rgba(226,182,107,0.18)] md:p-7"
  >
    <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gold/0 blur-3xl transition-colors duration-700 group-hover:bg-gold/20" />
    <span
      aria-hidden="true"
      className="text-outline pointer-events-none absolute -right-1 -bottom-8 font-display text-[8rem] leading-none italic"
    >
      {pad(index)}
    </span>

    <div className="relative flex items-center justify-between">
      <span className="font-display text-lg text-gold italic">No. {pad(index)}</span>
      {project.link ? (
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-gold-light uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
          Live
        </span>
      ) : (
        <span className="font-mono text-[10px] tracking-wider text-ivory/35 uppercase">Private build</span>
      )}
    </div>

    <div className="relative my-auto space-y-2 py-4">
      <p className="font-mono text-[10px] tracking-widest text-ivory/40 uppercase">{project.category}</p>
      <h3 className="font-display text-[2.1rem] leading-none font-light tracking-[-0.01em] text-ivory transition-colors duration-300 group-hover:text-gold">
        {project.title}
      </h3>
      <p className={`text-xs leading-relaxed font-light text-ivory/60 md:text-[13px] ${compact ? 'line-clamp-2' : 'line-clamp-3'}`}>
        {project.description}
      </p>
    </div>

    <div className="relative flex items-end justify-between gap-3 border-t border-ivory/10 pt-4">
      <div className="flex flex-wrap gap-1.5">
        {project.tags.slice(0, compact ? 3 : 4).map((tag) => (
          <span key={tag} className="rounded-full border border-ivory/10 px-2.5 py-0.5 text-[10px] text-ivory/65">
            {tag}
          </span>
        ))}
      </div>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ivory/15 text-ivory/60 transition-all duration-500 group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
        <ArrowIcon className="h-3.5 w-3.5" />
      </span>
    </div>
  </button>
);

const ProjectModal = ({ project, index, onClose }) => {
  useEffect(() => {
    setScrollLocked(true);
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-md" onClick={onClose} />

      <motion.div
        data-lenis-prevent
        initial={{ y: 60, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 40, scale: 0.97, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="no-scrollbar relative max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-[2rem] border border-ivory/10 bg-ink-2 shadow-[0_40px_120px_rgba(0,0,0,0.8)] sm:rounded-[2rem]"
      >
        {/* Banner */}
        <div className="relative h-56 overflow-hidden bg-[radial-gradient(120%_120%_at_15%_0%,#4a3a22_0%,#1a2035_50%,#0d1220_100%)] md:h-64">
          <div className="bg-grid absolute inset-0" />
          <div className="absolute -top-20 right-10 h-64 w-64 animate-aurora rounded-full bg-gold/25 blur-[90px]" />
          <span className="text-outline pointer-events-none absolute -right-2 -bottom-12 font-display text-[12rem] leading-none italic">
            {pad(index)}
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-2 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 bg-ink/60 text-ivory transition-all duration-300 hover:rotate-90 hover:bg-gold hover:text-ink"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <p className="font-mono text-[10px] tracking-[0.3em] text-gold uppercase">
              Case study {pad(index)} · {project.company}
            </p>
            <h3 id="project-modal-title" className="mt-2 font-display text-5xl leading-none font-light tracking-[-0.02em] text-ivory md:text-6xl">
              {project.title}
            </h3>
          </div>
        </div>

        <div className="space-y-7 p-6 pt-3 md:p-8 md:pt-3">
          <div className="flex flex-wrap items-center gap-3">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-light to-gold px-5 py-2.5 text-sm font-semibold text-ink transition-shadow hover:shadow-[0_10px_30px_rgba(226,182,107,0.4)]"
              >
                Visit live site <ArrowIcon />
              </a>
            )}
            <span className="font-display text-base text-gold italic">{project.highlight}</span>
          </div>

          <p className="text-base leading-relaxed text-ivory/80">{project.description}</p>

          <div>
            <h4 className="mb-4 font-mono text-[11px] font-bold tracking-[0.25em] text-ivory/45 uppercase">Key contributions</h4>
            <ul className="space-y-3.5">
              {project.bullets.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="flex gap-3 text-sm leading-relaxed text-ivory/70"
                >
                  <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                  {b}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-ivory/10 pt-6">
            <span className="mr-1 text-xs text-ivory/40">Stack</span>
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-ivory/10 bg-ivory/[0.04] px-3 py-1 text-[11px] text-ivory/80">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Desktop: a portfolio case opens and the projects fan out into a 2×2 grid.
// Mobile: swipeable carousel.
const Projects = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const folderBackRef = useRef(null);
  const folderFrontRef = useRef(null);
  const cardsRef = useRef([]);
  const [openIndex, setOpenIndex] = useState(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        const cards = cardsRef.current.filter(Boolean);
        const folder = [folderBackRef.current, folderFrontRef.current];

        gsap.set([...folder, ...cards], { xPercent: -50, yPercent: -50 });
        gsap.set(folderFrontRef.current, { transformOrigin: 'bottom center' });
        gsap.set(cards, { x: 0, y: 0, scale: 0.8, rotation: (i) => (i - 1.5) * 4 });

        let float;
        const tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            float = gsap.to(cards, {
              y: '+=8',
              duration: 3,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut',
              stagger: { each: 0.4, from: 'random' },
            });
          },
          onReverseComplete: () => float?.kill(),
        });

        tl.to(folderFrontRef.current, { rotationX: -125, duration: 0.9, ease: 'power3.inOut' })
          .to(cards, { y: -150, scale: 0.88, duration: 0.55, stagger: 0.05, ease: 'back.out(1.4)' }, '-=0.45')
          .to(
            cards,
            {
              x: (i) => ((i % 2) - 0.5) * (cards[0].offsetWidth + 32),
              y: (i) => (Math.floor(i / 2) - 0.5) * (cards[0].offsetHeight + 32),
              rotation: 0,
              scale: 1,
              duration: 1.2,
              stagger: 0.06,
              ease: 'expo.out',
            },
            '-=0.1'
          )
          .to(folder, { y: 140, opacity: 0, scale: 0.9, duration: 0.7, ease: 'power2.in' }, '<');

        const st = ScrollTrigger.create({
          trigger: stageRef.current,
          start: 'top 70%',
          onEnter: () => tl.timeScale(1).play(),
          onLeaveBack: () => {
            float?.kill();
            tl.timeScale(1.6).reverse();
          },
        });

        return () => {
          float?.kill();
          st.kill();
          tl.kill();
        };
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const close = useCallback(() => setOpenIndex(null), []);

  return (
    <section id="projects" ref={sectionRef} className="relative w-full overflow-x-clip bg-ink-2 px-5 py-28 md:px-12 md:py-36">
      <div
        aria-hidden="true"
        className="text-outline pointer-events-none absolute top-10 left-0 flex w-full justify-center font-display text-[20vw] leading-none whitespace-nowrap italic"
      >
        Work
      </div>
      <div className="pointer-events-none absolute top-[60%] left-1/2 h-[50vw] max-h-[700px] w-[50vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.09] blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          index="04"
          label="Work"
          title="Selected"
          accent="projects."
          aside="Production platforms I've built and shipped. Open any project for the full story — architecture, scale and stack."
        />

        {/* Desktop stage */}
        <div ref={stageRef} className="relative mt-16 hidden h-[720px] [perspective:2000px] md:block">
          <div className="absolute top-1/2 left-1/2 h-0 w-0 [transform-style:preserve-3d]">
            <div
              ref={folderBackRef}
              className="absolute flex aspect-video w-[400px] items-center justify-center rounded-[1.75rem] border border-gold/35 bg-panel shadow-[0_20px_50px_rgba(226,182,107,0.15)]"
              style={{ zIndex: 5 }}
            >
              <div className="absolute -top-6 left-6 h-8 w-32 rounded-t-xl border-t border-gold/30 bg-[#18203a]" />
              <span className="font-display text-3xl text-gold/70 italic">Selected work</span>
            </div>

            {projects.map((project, i) => (
              <div
                key={project.title}
                ref={(el) => (cardsRef.current[i] = el)}
                className="absolute h-[clamp(250px,25vw,300px)] w-[min(40vw,440px)] will-change-transform"
                style={{ zIndex: 10 + i }}
              >
                <ProjectCard project={project} index={i} onOpen={setOpenIndex} />
              </div>
            ))}

            <div
              ref={folderFrontRef}
              className="pointer-events-none absolute aspect-video w-[400px] will-change-transform"
              style={{ zIndex: 60 }}
            >
              <div className="absolute bottom-0 flex h-[85%] w-full flex-col items-center justify-end rounded-t-md rounded-b-[1.75rem] border-t border-gold/40 bg-gradient-to-b from-[#1b2340] to-panel p-6 shadow-[0_-5px_20px_rgba(0,0,0,0.6)]">
                <span className="mb-3 font-mono text-[10px] tracking-[0.3em] text-ivory/35 uppercase">
                  {projects.length} case studies
                </span>
                <div className="h-1.5 w-20 rounded-full bg-gold/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 md:hidden">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="h-[330px] w-[84vw] max-w-[380px] shrink-0 snap-center"
            >
              <ProjectCard project={project} index={i} onOpen={setOpenIndex} compact />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && <ProjectModal project={projects[openIndex]} index={openIndex} onClose={close} />}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
