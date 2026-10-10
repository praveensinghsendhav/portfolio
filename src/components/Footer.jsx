import { navLinks, profile } from '../data/profile';
import { scrollToId } from '../lib/motion';

const socials = [
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'GitHub', href: profile.github },
  { label: 'Email', href: `mailto:${profile.email}` },
].filter((s) => s.href);

const Footer = () => {
  const go = (id) => (e) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-ink px-5 pt-16 pb-10 md:px-12">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="flex flex-col items-start justify-between gap-10 border-b border-white/[0.06] pb-12 md:flex-row md:items-end">
          <div className="space-y-3">
            <a
              href="#home"
              onClick={go('home')}
              className="flex items-center gap-1.5 font-display text-5xl leading-none tracking-wider text-brand drop-shadow-[0_2px_18px_rgba(229,9,20,0.55)]"
            >
              {profile.brand}
              <span className="mb-2 h-2 w-2 rounded-full bg-white" />
            </a>
            <p className="max-w-xs text-sm text-white/50">
              {profile.title} building fast, secure and scalable products.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-3 gap-x-10 gap-y-3 text-sm text-white/55">
            {navLinks.map(({ id, label }) => (
              <a key={id} href={`#${id}`} onClick={go(id)} className="transition-colors hover:text-white">
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col justify-between gap-6 text-sm md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-1.5 text-white/60 transition-colors hover:text-white"
              >
                {s.label}
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>
            ))}
          </div>
          <p className="font-mono text-[11px] tracking-[0.25em] text-white/35 uppercase">{profile.location}</p>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.04] pt-6 font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase md:flex-row">
          <p>
            © {new Date().getFullYear()} {profile.fullName}
          </p>
          <p>Built with React · GSAP · Tailwind</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
