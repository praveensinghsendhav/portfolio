import { useEffect, useRef } from 'react';
import { gsap } from '../lib/motion';

const INTERACTIVE = 'a, button, input, textarea, select, label, [data-cursor]';

// Gold dot + trailing ring + soft champagne glow. Elements with data-cursor-label="View"
// grow the ring into a filled gold disc showing that label. Mouse / trackpad only.
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return;

    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const glow = glowRef.current;

    gsap.set([dot, ring, glow], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
    const glowX = gsap.quickTo(glow, 'x', { duration: 0.9, ease: 'power3.out' });
    const glowY = gsap.quickTo(glow, 'y', { duration: 0.9, ease: 'power3.out' });

    let visible = false;
    const onMove = (e) => {
      if (!visible) {
        visible = true;
        gsap.set([dot, ring, glow], { x: e.clientX, y: e.clientY });
        gsap.to([dot, ring, glow], { opacity: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      glowX(e.clientX);
      glowY(e.clientY);
    };

    const onOver = (e) => {
      const labelled = e.target.closest?.('[data-cursor-label]');
      const hovering = !!e.target.closest?.(INTERACTIVE);
      const text = labelled?.getAttribute('data-cursor-label') ?? '';
      if (text) label.textContent = text;

      gsap.to(ring, {
        width: labelled ? 88 : 40,
        height: labelled ? 88 : 40,
        scale: !labelled && hovering ? 1.6 : 1,
        backgroundColor: labelled ? 'rgba(226,182,107,0.95)' : hovering ? 'rgba(226,182,107,0.1)' : 'rgba(226,182,107,0)',
        borderColor: hovering || labelled ? 'rgba(226,182,107,0.9)' : 'rgba(242,237,227,0.35)',
        duration: 0.35,
        ease: 'power3.out',
      });
      gsap.to(label, { opacity: labelled ? 1 : 0, scale: labelled ? 1 : 0.6, duration: 0.25 });
      gsap.to(dot, { scale: hovering || labelled ? 0 : 1, duration: 0.3 });
    };

    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.15 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: 'back.out(3)' });

    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring, glow], { opacity: 0, duration: 0.3 });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none">
      {/* Gradient is already soft, so no CSS blur filter — keeps it cheap to move. */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 z-[1] h-[640px] w-[640px] rounded-full opacity-0"
        style={{
          background:
            'radial-gradient(circle, rgba(226,182,107,0.09) 0%, rgba(143,163,255,0.04) 40%, transparent 68%)',
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[10001] flex h-10 w-10 items-center justify-center rounded-full border border-ivory/35 opacity-0"
      >
        <span
          ref={labelRef}
          className="font-mono text-[10px] font-bold tracking-[0.2em] text-ink uppercase opacity-0"
        />
      </div>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[10001] h-1.5 w-1.5 rounded-full bg-gold opacity-0 shadow-[0_0_12px_#E2B66B]"
      />
    </div>
  );
};

export default CustomCursor;
