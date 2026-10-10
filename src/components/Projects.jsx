import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { gsap, ScrollTrigger, setScrollLocked } from '../lib/motion';
import { projects } from '../data/profile';

const episode = (i) => `S01 E0${i + 1}`;

const ArrowIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
  </svg>
);

const ProjectCard = ({ project, index, onOpen, compact = false }) => (
  <button
    type="button"
    onClick={() => onOpen(index)}
    className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-panel/95 p-6 text-left shadow-[0_25px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1.5 hover:border-brand/70 hover:shadow-[0_35px_80px_rgba(229,9,20,0.3)] md:p-7"
  >
    <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-brand/0 blur-3xl transition-colors duration-700 group-hover:bg-brand/20" />

    <div className="relative flex items-center justify-between">
      <span className="rounded-full border border-brand/25 bg-brand/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-brand uppercase">
        {episode(index)}
      </span>
      {project.link ? (
        <span className="flex items-center gap-1 font-mono text-[10px] tracking-wider text-emerald-400 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
        </span>
      ) : (
        <span className="font-mono text-[10px] tracking-wider text-white/35 uppercase">Private build</span>
      )}
    </div>

    <div className="relative my-auto space-y-2 py-4">
      <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase">{project.category}</p>
      <h3 className="font-display text-4xl leading-none tracking-wide text-white transition-colors duration-300 group-hover:text-brand">
        {project.title}
      </h3>
      <p className={`text-xs leading-relaxed font-light text-white/65 md:text-[13px] ${compact ? 'line-clamp-2' : 'line-clamp-3'}`}>
        {project.description}
      </p>
    </div>

    <div className="relative flex items-end justify-between gap-3 border-t border-white/10 pt-4">
      <div className="flex flex-wrap gap-1.5">
        {project.tags.slice(0, compact ? 3 : 4).map((tag) => (
          <span key={tag} className="rounded bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-white/65">
            {tag}
          </span>
        ))}
      </div>
      <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-white/50 transition-colors group-hover:text-white">
        More info <ArrowIcon className="h-3.5 w-3.5" />
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <motion.div
        data-lenis-prevent
        initial={{ y: 60, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 40, scale: 0.97, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="no-scrollbar relative max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#181818] shadow-[0_40px_120px_rgba(0,0,0,0.9)] sm:rounded-3xl"
      >
        {/* Banner */}
        <div className="relative h-56 overflow-hidden bg-[radial-gradient(120%_120%_at_20%_0%,#6b0b12_0%,#1c0507_50%,#181818_100%)] md:h-64">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_26px,rgba(255,255,255,0.02)_26px_27px)]" />
          <span className="pointer-events-none absolute -right-4 -bottom-10 font-display text-[12rem] leading-none text-white/[0.05]">
            0{index + 1}
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-white hover:text-black"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <p className="font-mono text-[10px] tracking-[0.3em] text-brand uppercase">
              {episode(index)} · {project.company}
            </p>
            <h3 id="project-modal-title" className="mt-1 font-display text-5xl leading-none tracking-wide text-white md:text-6xl">
              {project.title}
            </h3>
          </div>
        </div>

        <div className="space-y-7 p-6 pt-2 md:p-8 md:pt-2">
          <div className="flex flex-wrap items-center gap-3">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-white/85"
              >
                Visit live site <ArrowIcon />
              </a>
            )}
            <span className="text-sm font-semibold text-emerald-400">{project.highlight}</span>
          </div>

          <p className="text-base leading-relaxed text-white/80">{project.description}</p>

          <div>
            <h4 className="mb-4 font-mono text-[11px] font-bold tracking-[0.25em] text-white/45 uppercase">Episode highlights</h4>
            <ul className="space-y-3.5">
              {project.bullets.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="flex gap-3 text-sm leading-relaxed text-white/70"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {b}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-white/10 pt-6">
            <span className="mr-1 text-xs text-white/40">Stack:</span>
            {project.tags.map((tag) => (
              <span key={tag} className="rounded bg-white/[0.06] px-2.5 py-1 font-mono text-[11px] text-white/80">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Desktop: a folder flips open and the episodes fan out into a 2×2 grid.
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
    <section id="projects" ref={sectionRef} className="relative w-full overflow-x-clip bg-[#0b0b0b] px-5 py-28 md:px-12 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 left-0 flex w-full justify-center font-display text-[20vw] leading-none whitespace-nowrap text-white/[0.025]"
      >
        ORIGINALS
      </div>
      <div className="pointer-events-none absolute top-[60%] left-1/2 h-[50vw] max-h-[700px] w-[50vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/12 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          episode="04"
          label="Featured work"
          title="Only On"
          accent="This Portfolio."
          aside="Production platforms I've built and shipped. Open any episode for the full story — architecture, scale and stack."
        />

        {/* Desktop stage */}
        <div ref={stageRef} className="relative mt-16 hidden h-[720px] [perspective:2000px] md:block">
          <div className="absolute top-1/2 left-1/2 h-0 w-0 [transform-style:preserve-3d]">
            <div
              ref={folderBackRef}
              className="absolute flex aspect-video w-[400px] items-center justify-center rounded-3xl border border-brand/35 bg-panel shadow-[0_20px_50px_rgba(229,9,20,0.25)]"
              style={{ zIndex: 5 }}
            >
              <div className="absolute -top-6 left-6 h-8 w-32 rounded-t-xl border-t border-brand/30 bg-[#1f1f1f]" />
              <span className="font-mono text-xl font-black tracking-widest text-brand/60 uppercase">Originals</span>
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
              <div className="absolute bottom-0 flex h-[85%] w-full flex-col justify-end rounded-t-md rounded-b-3xl border-t border-brand/40 bg-[#1c1c1c] p-6 shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
                <div className="mx-auto mb-2 h-1.5 w-20 rounded-full bg-white/20" />
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
