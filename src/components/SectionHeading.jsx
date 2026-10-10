import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

// "EPISODE 0X | LABEL" badge + two-line display title used by every section.
const SectionHeading = ({ episode, label, title, accent, aside, className = '' }) => (
  <div className={`flex flex-col justify-between gap-6 md:flex-row md:items-end ${className}`}>
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease }}
        className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-black/60 px-3.5 py-1 font-mono text-[10px] tracking-[0.25em] text-white/80 uppercase backdrop-blur-xl md:text-[11px]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_10px_#E50914]" />
        <span className="font-bold text-brand">Episode {episode}</span>
        <span className="text-white/25">|</span>
        <span>{label}</span>
      </motion.div>
      <h2 className="font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.9] tracking-wide text-white">
        <motion.span
          className="block"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease, delay: 0.05 }}
        >
          {title}
        </motion.span>
        <motion.span
          className="block bg-gradient-to-r from-brand via-rose-500 to-brand-dark bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
        >
          {accent}
        </motion.span>
      </h2>
    </div>
    {aside && (
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="max-w-sm text-sm leading-relaxed font-light text-white/55"
      >
        {aside}
      </motion.p>
    )}
  </div>
);

export default SectionHeading;
