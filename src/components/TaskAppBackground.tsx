import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  pulseSpeed: number;
  phase: number;
}

interface FloatingGlyph {
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

const GLYPHS = ['☕', '📖', '⏰', '📝', '🍅', '⚡', '✏️'];

export const TaskAppBackground: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only animate in dark mode
    if (theme !== 'dark') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Scroll parallax tracking
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Page Visibility API - pause completely when tab is hidden to save battery & CPU
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning) {
          isRunning = true;
          lastTime = performance.now();
          animationFrameId = requestAnimationFrame(render);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 1. Generate gentle twinkling starfield (atmosphere, not clutter)
    const starCount = Math.min(45, Math.max(25, Math.floor(width / 35)));
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.6 + Math.random() * 0.9,
      baseAlpha: 0.15 + Math.random() * 0.25,
      pulseSpeed: 0.0012 + Math.random() * 0.002,
      phase: Math.random() * Math.PI * 2,
    }));

    // 2. Generate a few soft floating student glyphs (ultra-low opacity: ~10-14%)
    const glyphCount = 7;
    const glyphs: FloatingGlyph[] = Array.from({ length: glyphCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -0.12 - Math.random() * 0.18, // Very slow calm drift
      glyph: GLYPHS[i % GLYPHS.length],
      size: 16 + Math.random() * 8,
      opacity: 0.09 + Math.random() * 0.05, // 9% to 14% opacity
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.004,
    }));

    let lastTime = performance.now();

    const render = (time: number) => {
      if (!isRunning) return;

      const dt = Math.min(32, time - lastTime) / 16;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Render twinkling stars
      ctx.fillStyle = '#e5e5e5';
      stars.forEach((s) => {
        const pulse = Math.sin(time * s.pulseSpeed + s.phase);
        const currentAlpha = Math.max(0.05, Math.min(0.5, s.baseAlpha + pulse * 0.16));
        
        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(s.x, (s.y - scrollY * 0.05 + height) % height, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render soft floating icons
      glyphs.forEach((g) => {
        g.x += g.vx * dt;
        g.y += g.vy * dt - (scrollY * 0.0002);
        g.rotation += g.vRot * dt;

        // Wrap around viewport
        if (g.x < -30) g.x = width + 20;
        if (g.x > width + 30) g.x = -20;
        if (g.y < -30) g.y = height + 20;
        if (g.y > height + 30) g.y = -20;

        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.rotation);
        ctx.globalAlpha = g.opacity;
        ctx.font = `${g.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(g.glyph, 0, 0);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // Only active in dark mode
  if (theme !== 'dark') return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 w-full h-full"
    />
  );
};
