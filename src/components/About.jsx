import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { trackSpotlight } from '../lib/motion';
import { education, experience, profile } from '../data/profile';

const ease = [0.22, 1, 0.36, 1];

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 60, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 1, ease, delay },
});

const cardBase =
  'spotlight relative rounded-[2rem] border border-white/[0.08] bg-panel/80 p-7 backdrop-blur-xl transition-colors duration-500 hover:border-brand/40 md:p-10';

const stack = ['Next.js', 'React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis', 'GCP', 'Docker'];

const About = () => (
  <section id="about" className="relative w-full overflow-hidden bg-ink px-5 py-28 md:px-12 md:py-36">
    <div className="pointer-events-none absolute top-1/4 -left-40 h-[520px] w-[520px] rounded-full bg-brand/10 blur-[160px]" />
    <div className="pointer-events-none absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full bg-red-900/10 blur-[160px]" />

    <div className="relative z-10 mx-auto max-w-7xl space-y-14">
      <SectionHeading episode="01" label="About the engineer" title="Episode Synopsis" accent="Origin & Vision." />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {/* Bio */}
        <motion.article {...reveal()} onMouseMove={trackSpotlight} className={`${cardBase} flex flex-col justify-between md:col-span-7`}>
          <span className="pointer-events-none absolute top-6 right-8 font-display text-8xl text-white/[0.04]">01</span>
          <div className="space-y-5">
            <h3 className="font-mono text-[11px] font-bold tracking-[0.25em] text-brand uppercase">Cast & Background</h3>
            <p className="text-xl leading-relaxed font-medium text-white/90 md:text-2xl">
              I'm <span className="font-bold text-white">{profile.fullName}</span>, a full-stack MERN developer in{' '}
              {profile.location} who turns complex product requirements into fast, secure, production-grade web apps.
            </p>
            <p className="text-sm leading-relaxed font-light text-white/60 md:text-base">
              Over 2.5+ years I've built SEO-first Next.js frontends for a student-housing platform serving 10M+ students,
              a HIPAA-conscious healthcare SaaS on GCP, and AI-powered multi-tenant products with LLM streaming, Stripe
              billing and fine-grained RBAC — across healthcare, student housing and consumer AI.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-8">
            {['Full-Stack MERN', 'SEO & Core Web Vitals', 'AI / LLM SaaS', 'Cloud on GCP'].map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/75">
                {t}
              </span>
            ))}
          </div>
        </motion.article>

        {/* Experience timeline */}
        <motion.article {...reveal(0.1)} onMouseMove={trackSpotlight} className={`${cardBase} md:col-span-5`}>
          <span className="pointer-events-none absolute top-6 right-8 font-display text-8xl text-white/[0.04]">02</span>
          <h3 className="mb-7 font-mono text-[11px] font-bold tracking-[0.25em] text-brand uppercase">Seasons So Far</h3>
          <ol className="relative space-y-7 border-l border-white/10 pl-6">
            {experience.map((job, i) => (
              <li key={job.company} className="relative">
                <span
                  className={`absolute top-1.5 -left-[29px] h-2.5 w-2.5 rounded-full ring-4 ring-panel ${
                    i === 0 ? 'bg-brand shadow-[0_0_12px_#E50914]' : 'bg-white/30'
                  }`}
                />
                <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                  Season {experience.length - i} · {job.period}
                </p>
                <p className="mt-1 text-lg font-bold text-white">{job.role}</p>
                <p className="text-sm text-white/60">
                  {job.company} · {job.location}
                </p>
              </li>
            ))}
            <li className="relative">
              <span className="absolute top-1.5 -left-[29px] h-2.5 w-2.5 rounded-full bg-white/15 ring-4 ring-panel" />
              <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase">Pilot · {education.period}</p>
              <p className="mt-1 text-lg font-bold text-white">{education.degree}</p>
              <p className="text-sm text-white/60">
                {education.school}, {education.location} · <span className="text-white/80">{education.score}</span>
              </p>
            </li>
          </ol>
        </motion.article>

        {/* Stack strip */}
        <motion.article
          {...reveal(0.15)}
          onMouseMove={trackSpotlight}
          className={`${cardBase} flex flex-col items-start justify-between gap-6 md:col-span-12 md:flex-row md:items-center`}
        >
          <div className="space-y-2">
            <h3 className="font-mono text-[11px] font-bold tracking-[0.25em] text-brand uppercase">Production Tech Stack</h3>
            <p className="text-base font-semibold text-white md:text-lg">The tools behind every episode.</p>
          </div>
          <div className="flex flex-wrap gap-2.5 md:justify-end">
            {stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 bg-white/[0.04] px-3.5 py-2 font-mono text-[11px] tracking-wider text-white/85 uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:bg-brand/15"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.article>
      </div>
    </div>
  </section>
);

export default About;
