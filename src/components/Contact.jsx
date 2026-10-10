import { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { profile } from '../data/profile';

const TOPICS = ['Job opportunity', 'Freelance project', 'Collaboration', 'Just saying hi'];
const MAX_MESSAGE = 1500; // keeps the generated mailto link within client URL limits
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ease = [0.22, 1, 0.36, 1];

const emptyForm = { name: '', email: '', company: '', topic: TOPICS[0], message: '' };

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Please enter a valid email address.';
  if (form.message.trim().length < 10) errors.message = 'Tell me a little more (at least 10 characters).';
  return errors;
}

// Builds the subject + body the visitor's mail client is opened with.
function buildEmail(form) {
  const name = form.name.trim();
  const subject = `[Portfolio] ${form.topic} — ${name}`;
  const lines = [
    `Hi ${profile.firstName},`,
    '',
    form.message.trim(),
    '',
    '—',
    `Name: ${name}`,
    `Email: ${form.email.trim()}`,
  ];
  if (form.company.trim()) lines.push(`Company: ${form.company.trim()}`);
  lines.push(`Topic: ${form.topic}`, '', 'Sent from your portfolio contact form');
  return { subject, body: lines.join('\r\n') };
}

function composeLinks({ subject, body }) {
  const to = profile.email;
  const s = encodeURIComponent(subject);
  const b = encodeURIComponent(body);
  return {
    mailto: `mailto:${to}?subject=${s}&body=${b}`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${s}&body=${b}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${s}&body=${b}`,
  };
}

const Field = ({ id, label, error, optional, children }) => (
  <div className="group relative">
    <label htmlFor={id} className="mb-2 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-white/45 uppercase">
      <span>
        {label}
        {!optional && <span className="text-brand"> *</span>}
      </span>
      {optional && <span className="tracking-normal normal-case text-white/30">Optional</span>}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          id={`${id}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 text-xs text-rose-400"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const inputClass = (hasError) =>
  `w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] text-white placeholder-white/25 transition-all duration-300 outline-none focus:bg-white/[0.06] focus:ring-4 ${
    hasError ? 'border-rose-500/60 focus:ring-rose-500/15' : 'border-white/10 hover:border-white/20 focus:border-brand/70 focus:ring-brand/15'
  }`;

const Contact = () => {
  const sectionRef = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(null); // holds compose links after submit
  const [copied, setCopied] = useState('');

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const watermarkY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  const errors = validate(form);
  const showError = (field) => (touched[field] || touched.submit) && errors[field];

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const blur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched((t) => ({ ...t, submit: true }));
    if (Object.keys(errors).length) {
      const first = ['name', 'email', 'message'].find((f) => errors[f]);
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    const email = buildEmail(form);
    const links = composeLinks(email);
    setSubmitted({ ...links, ...email });
    window.location.assign(links.mailto);
  };

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      setCopied('');
    }
  };

  const reset = () => {
    setForm(emptyForm);
    setTouched({});
    setSubmitted(null);
  };

  return (
    <section ref={sectionRef} id="contact" className="relative w-full overflow-hidden border-t border-white/[0.06] bg-[#0b0b0b] px-5 pt-28 pb-24 md:px-12 md:pt-36">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/12 blur-[170px]" />
      <motion.div
        style={{ y: watermarkY }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-10 flex justify-center font-display text-[26vw] leading-none text-brand/[0.07] select-none"
      >
        CONTACT
      </motion.div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Pitch + direct channels */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease }}
          className="flex flex-col lg:col-span-5"
        >
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/30 bg-black/60 px-3.5 py-1 font-mono text-[10px] tracking-[0.25em] text-white/80 uppercase backdrop-blur-xl md:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_10px_#E50914]" />
            <span className="font-bold text-brand">Episode 05</span>
            <span className="text-white/25">|</span>
            <span>Get in touch</span>
          </div>
          <h2 className="mt-5 font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.9] tracking-wide">
            Let's make the
            <span className="block bg-gradient-to-r from-brand via-rose-500 to-brand-dark bg-clip-text text-transparent">
              Next Episode.
            </span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed font-light text-white/60">
            Have a role, a product idea or a question? Fill in the form — your email app opens with everything
            pre-filled, so your message lands straight in my inbox.
          </p>

          <div className="mt-10 space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20">
              <a href={`mailto:${profile.email}`} className="min-w-0">
                <p className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">Email</p>
                <p className="mt-1 truncate text-sm font-medium text-white">{profile.email}</p>
              </a>
              <button
                type="button"
                onClick={() => copy(profile.email, 'email')}
                className="shrink-0 rounded-lg border border-white/10 px-3 py-2 font-mono text-[10px] tracking-widest text-white/70 uppercase transition-colors hover:border-brand/60 hover:text-white"
              >
                {copied === 'email' ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            {[
              { label: 'LinkedIn', href: profile.linkedin },
              { label: 'GitHub', href: profile.github },
            ]
              .filter((s) => s.href)
              .map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">{s.label}</p>
                    <p className="mt-1 truncate text-sm font-medium text-white">{s.href.replace(/^https?:\/\/(www\.)?/, '')}</p>
                  </div>
                  <svg className="h-4 w-4 shrink-0 text-white/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </a>
              ))}
            <p className="pt-2 font-mono text-[10px] tracking-[0.25em] text-white/35 uppercase">Based in {profile.location}</p>
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease, delay: 0.1 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-panel/90 p-6 shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:p-10 lg:col-span-7"
        >
          <div className="absolute top-0 left-1/2 h-[2px] w-48 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand to-transparent" />

          <AnimatePresence mode="wait" initial={false}>
            {!submitted ? (
              <motion.form
                key="form"
                noValidate
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Field id="contact-name" label="Your name" error={showError('name')}>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={update('name')}
                      onBlur={blur('name')}
                      placeholder="Jane Doe"
                      aria-invalid={!!showError('name')}
                      aria-describedby={showError('name') ? 'contact-name-error' : undefined}
                      className={inputClass(showError('name'))}
                    />
                  </Field>
                  <Field id="contact-email" label="Your email" error={showError('email')}>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={update('email')}
                      onBlur={blur('email')}
                      placeholder="jane@company.com"
                      aria-invalid={!!showError('email')}
                      aria-describedby={showError('email') ? 'contact-email-error' : undefined}
                      className={inputClass(showError('email'))}
                    />
                  </Field>
                </div>

                <Field id="contact-company" label="Company" optional>
                  <input
                    id="contact-company"
                    type="text"
                    autoComplete="organization"
                    value={form.company}
                    onChange={update('company')}
                    placeholder="Where are you reaching out from?"
                    className={inputClass(false)}
                  />
                </Field>

                <fieldset>
                  <legend className="mb-3 font-mono text-[10px] tracking-[0.25em] text-white/45 uppercase">What's this about?</legend>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((t) => (
                      <label key={t} className="relative">
                        <input
                          type="radio"
                          name="topic"
                          value={t}
                          checked={form.topic === t}
                          onChange={update('topic')}
                          className="peer sr-only"
                        />
                        <span className="block rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[13px] text-white/65 transition-all duration-300 select-none peer-checked:border-brand peer-checked:bg-brand/15 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand hover:border-white/25 hover:text-white">
                          {t}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <Field id="contact-message" label="Message" error={showError('message')}>
                  <div className="relative">
                  <textarea
                    id="contact-message"
                    rows={5}
                    maxLength={MAX_MESSAGE}
                    value={form.message}
                    onChange={update('message')}
                    onBlur={blur('message')}
                    placeholder="Tell me about the role, project or idea…"
                    aria-invalid={!!showError('message')}
                    aria-describedby={showError('message') ? 'contact-message-error' : undefined}
                    className={`${inputClass(showError('message'))} resize-none`}
                  />
                  <span className="pointer-events-none absolute right-3 bottom-3 font-mono text-[10px] text-white/30">
                    {form.message.length}/{MAX_MESSAGE}
                  </span>
                  </div>
                </Field>

                <div className="flex flex-col-reverse items-start justify-between gap-5 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center">
                  <p className="max-w-xs text-xs leading-relaxed text-white/40">
                    Opens your email app with this message ready to send. Nothing is stored on this site.
                  </p>
                  <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-brand px-8 py-4 text-xs font-bold tracking-widest text-white uppercase shadow-[0_10px_40px_rgba(229,9,20,0.45)] transition-all duration-300 hover:bg-brand-dark hover:shadow-[0_14px_50px_rgba(229,9,20,0.65)] active:scale-[0.98] sm:w-auto"
                  >
                    Send via email
                    <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease }}
                className="flex min-h-[460px] flex-col items-center justify-center text-center"
                role="status"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/15 ring-1 ring-brand/50"
                >
                  <svg className="h-7 w-7 text-brand" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="mt-6 font-display text-4xl tracking-wide">Your draft is ready</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                  Your email app should have opened with everything filled in — just hit <b className="text-white">Send</b>.
                  Nothing opened? Use one of these instead:
                </p>

                <div className="mt-7 flex w-full max-w-md flex-col gap-2.5 sm:flex-row">
                  <a
                    href={submitted.gmail}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-white/85"
                  >
                    Open in Gmail
                  </a>
                  <a
                    href={submitted.outlook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                  >
                    Open in Outlook
                  </a>
                </div>
                <div className="mt-2.5 flex w-full max-w-md flex-col gap-2.5 sm:flex-row">
                  <a
                    href={submitted.mailto}
                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70 transition-colors hover:border-white/25 hover:text-white"
                  >
                    Try email app again
                  </a>
                  <button
                    type="button"
                    onClick={() => copy(`To: ${profile.email}\nSubject: ${submitted.subject}\n\n${submitted.body}`, 'draft')}
                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70 transition-colors hover:border-white/25 hover:text-white"
                  >
                    {copied === 'draft' ? 'Copied ✓' : 'Copy message'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={reset}
                  className="mt-8 font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  ← Write another message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
