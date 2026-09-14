import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  glyph: string;
  size: number;
  opacity: number;
  rotation: number;
  vRot: number;
}

const GLYPHS = ['☕', '📖', '⏰', '📝', '🍅', '⚡', '💡', '✏️', '🎓'];

export const ParticleCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle scroll and mouse reaction
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Generate particles
    const particleCount = Math.min(28, Math.max(16, Math.floor(width / 50)));
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.35, // Drifting upwards like focus thoughts
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      size: 16 + Math.random() * 14,
      opacity: 0.14 + Math.random() * 0.18,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.008,
    }));

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min(32, time - lastTime) / 16;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Render each particle
      particles.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt - (scrollY * 0.0003); // Subtle scroll influence
        p.rotation += p.vRot * dt;

        // Wrap around bounds
        if (p.x < -40) p.x = width + 30;
        if (p.x > width + 40) p.x = -30;
        if (p.y < -40) p.y = height + 30;
        if (p.y > height + 40) p.y = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.glyph, 0, 0);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
};
