import { useEffect, useRef } from 'react';
import { gsap } from '../lib/motion';

const INTERACTIVE = 'a, button, input, textarea, select, label, [data-cursor]';

// Dot + trailing ring + soft red spotlight. Only enabled for mouse/trackpad users.
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return;

    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
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
      const hovering = !!e.target.closest?.(INTERACTIVE);
      gsap.to(ring, {
        scale: hovering ? 1.7 : 1,
        backgroundColor: hovering ? 'rgba(229,9,20,0.12)' : 'rgba(229,9,20,0)',
        borderColor: hovering ? 'rgba(229,9,20,0.9)' : 'rgba(229,9,20,0.55)',
        duration: 0.3,
        ease: 'power3.out',
      });
      gsap.to(dot, { scale: hovering ? 0.5 : 1, duration: 0.3 });
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
            'radial-gradient(circle, rgba(229,9,20,0.13) 0%, rgba(229,9,20,0.04) 40%, transparent 68%)',
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[10001] h-10 w-10 rounded-full border border-brand/55 opacity-0"
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[10001] h-2 w-2 rounded-full bg-brand opacity-0 shadow-[0_0_12px_#E50914]"
      />
    </div>
  );
};

export default CustomCursor;
