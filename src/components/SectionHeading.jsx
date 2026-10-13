import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

// "(01) ——— LABEL" marker used above every section title.
export const Eyebrow = ({ index, label, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, ease }}
    className={`flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-ivory/55 uppercase md:text-[11px] ${className}`}
  >
    <span className="text-gold">({index})</span>
    <motion.span
      className="block h-px w-12 origin-left bg-gradient-to-r from-gold to-transparent"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease, delay: 0.2 }}
    />
    <span>{label}</span>
  </motion.div>
);

// Each line slides up from behind a mask.
const MaskLine = ({ children, className = '', delay = 0 }) => (
  <span className="block overflow-hidden pb-[0.12em]">
    <motion.span
      className={`block ${className}`}
      initial={{ y: '110%' }}
      whileInView={{ y: '0%' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.1, ease, delay }}
    >
      {children}
    </motion.span>
  </span>
);

// Eyebrow + two-line serif title (second line italic gold) used by every section.
const SectionHeading = ({ index, label, title, accent, aside, className = '' }) => (
  <div className={`flex flex-col justify-between gap-6 md:flex-row md:items-end ${className}`}>
    <div className="space-y-5">
      <Eyebrow index={index} label={label} />
      <h2 className="font-display text-[clamp(2.5rem,5.8vw,4.9rem)] leading-[1] font-light tracking-[-0.02em] text-ivory">
        <MaskLine>{title}</MaskLine>
        <MaskLine className="italic" delay={0.1}>
          <span className="text-gradient">{accent}</span>
        </MaskLine>
      </h2>
    </div>
    {aside && (
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease, delay: 0.3 }}
        className="max-w-sm border-l border-gold/30 pl-5 text-sm leading-relaxed font-light text-ivory/60"
      >
        {aside}
      </motion.p>
    )}
  </div>
);

export default SectionHeading;
