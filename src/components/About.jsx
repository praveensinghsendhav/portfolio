import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { gsap, trackSpotlight } from '../lib/motion';
import { education, experience, profile } from '../data/profile';

const ease = [0.22, 1, 0.36, 1];

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 60, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 1, ease, delay },
});

const cardBase =
  'spotlight relative rounded-[2rem] border border-ivory/[0.08] bg-panel/70 p-7 backdrop-blur-xl transition-colors duration-500 hover:border-gold/35 md:p-10';

// Words marked with * are rendered in gold italic.
const statement = `I'm ${profile.firstName} — a full-stack *engineer* in Indore who turns complex product requirements into *fast,* *secure,* production-grade web apps.`;

const About = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Statement lights up word by word as it scrolls through the viewport.
      gsap.fromTo(
        '.about-word',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: '.about-statement', start: 'top 80%', end: 'bottom 45%', scrub: true },
        }
      );

      // Timeline rail draws itself in.
      gsap.fromTo(
        '.about-rail',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.about-timeline', start: 'top 75%', end: 'bottom 60%', scrub: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative w-full overflow-hidden bg-ink px-5 py-28 md:px-12 md:py-36">
      <div className="pointer-events-none absolute top-1/4 -left-40 h-[520px] w-[520px] rounded-full bg-gold/[0.07] blur-[160px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full bg-mist/[0.07] blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-16 md:space-y-24">
        <SectionHeading index="01" label="About" title="The person behind" accent="the code." />

        <p className="about-statement max-w-5xl font-display text-[clamp(1.7rem,3.6vw,3.1rem)] leading-[1.25] font-light tracking-[-0.01em] text-ivory">
          {statement.split(' ').map((word, i) => {
            const accent = word.startsWith('*');
            return (
              <span key={i} className={`about-word ${accent ? 'text-gold italic' : ''}`}>
                {accent ? word.replaceAll('*', '') : word}{' '}
              </span>
            );
          })}
        </p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {/* Bio */}
          <motion.article {...reveal()} onMouseMove={trackSpotlight} className={`${cardBase} flex flex-col justify-between md:col-span-7`}>
            <span className="pointer-events-none absolute top-6 right-8 font-display text-8xl text-ivory/[0.04] italic">i.</span>
            <div className="space-y-5">
              <h3 className="font-mono text-[11px] font-bold tracking-[0.25em] text-gold uppercase">Background</h3>
              <p className="text-lg leading-relaxed text-ivory/85 md:text-xl">
                Over 2.5+ years I've built SEO-first Next.js frontends for a student-housing platform serving{' '}
                <span className="text-gold">10M+ students</span>, a HIPAA-conscious healthcare SaaS on GCP, and AI-powered
                multi-tenant products.
              </p>
              <p className="text-sm leading-relaxed font-light text-ivory/55 md:text-base">
                My work spans LLM streaming, Stripe billing and fine-grained RBAC — across healthcare, student housing and
                consumer AI.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-8">
              {['Full-Stack MERN', 'SEO & Core Web Vitals', 'AI / LLM SaaS', 'Cloud on GCP'].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-ivory/10 bg-ivory/[0.03] px-3.5 py-1.5 text-xs text-ivory/70 transition-colors duration-300 hover:border-gold/50 hover:text-gold"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.article>

          {/* Experience timeline */}
          <motion.article {...reveal(0.1)} onMouseMove={trackSpotlight} className={`${cardBase} md:col-span-5`}>
            <span className="pointer-events-none absolute top-6 right-8 font-display text-8xl text-ivory/[0.04] italic">ii.</span>
            <h3 className="mb-8 font-mono text-[11px] font-bold tracking-[0.25em] text-gold uppercase">Journey</h3>
            <div className="about-timeline relative pl-7">
              <span className="absolute top-1 bottom-1 left-0 w-px bg-ivory/10" aria-hidden="true" />
              <span
                className="about-rail absolute top-1 bottom-1 left-0 w-px origin-top bg-gradient-to-b from-gold via-copper to-mist"
                aria-hidden="true"
              />
              <ol className="space-y-8">
                {experience.map((job, i) => (
                  <li key={job.company} className="relative">
                    <span
                      className={`absolute top-1.5 -left-[33px] h-2.5 w-2.5 rounded-full ring-4 ring-panel ${
                        i === 0 ? 'bg-gold shadow-[0_0_14px_#E2B66B]' : 'bg-ivory/40'
                      }`}
                    />
                    <p className="font-mono text-[10px] tracking-widest text-ivory/40 uppercase">{job.period}</p>
                    <p className="mt-1 font-display text-xl text-ivory">{job.role}</p>
                    <p className="text-sm text-ivory/55">
                      {job.company} · {job.location}
                    </p>
                  </li>
                ))}
                <li className="relative">
                  <span className="absolute top-1.5 -left-[33px] h-2.5 w-2.5 rounded-full bg-ivory/20 ring-4 ring-panel" />
                  <p className="font-mono text-[10px] tracking-widest text-ivory/40 uppercase">{education.period}</p>
                  <p className="mt-1 font-display text-xl text-ivory">{education.degree}</p>
                  <p className="text-sm text-ivory/55">
                    {education.school}, {education.location} · <span className="text-gold">{education.score}</span>
                  </p>
                </li>
              </ol>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
};

export default About;
