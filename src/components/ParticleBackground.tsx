import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  color: string;
  type: 'dot' | 'symbol' | 'molecule';
  symbol?: string;
}

const SYMBOLS = ['Δ', 'λ', 'ℏ', 'Ω', 'π', 'E=mc²', 'H₂O', 'CO₂', 'A=T', 'C≡G', 'F=ma'];
const COLORS = [
  '#38bdf8', // sky/cyan
  '#818cf8', // indigo
  '#34d399', // emerald
  '#fb923c', // orange/amber
  '#a78bfa', // violet
];

export const ParticleBackground: React.FC<{ density?: number }> = ({ density = 45 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const count = Math.floor(Math.min(density, (width * height) / 25000));

    for (let i = 0; i < count; i++) {
      const isSymbol = Math.random() < 0.22;
      const isMolecule = !isSymbol && Math.random() < 0.18;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: isSymbol ? 12 : isMolecule ? 3.5 : Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.5 + 0.15,
        baseAlpha: Math.random() * 0.4 + 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        type: isSymbol ? 'symbol' : isMolecule ? 'molecule' : 'dot',
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Subtle scientific grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.25)';
      ctx.lineWidth = 0.6;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw particle connections for dots within distance
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.12;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        const pulse = Math.sin(time + p.x * 0.01) * 0.1;
        const currentAlpha = Math.max(0.05, Math.min(0.85, p.baseAlpha + pulse));

        if (p.type === 'symbol' && p.symbol) {
          ctx.font = '500 11px "JetBrains Mono", monospace';
          ctx.fillStyle = p.color;
          ctx.globalAlpha = currentAlpha * 0.65;
          ctx.fillText(p.symbol, p.x, p.y);
          ctx.globalAlpha = 1;
        } else if (p.type === 'molecule') {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = currentAlpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // small satellite node
          const satX = p.x + Math.cos(time * 2 + p.x) * 12;
          const satY = p.y + Math.sin(time * 2 + p.y) * 12;
          ctx.beginPath();
          ctx.arc(satX, satY, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(satX, satY);
          ctx.stroke();
          ctx.globalAlpha = 1;
        } else {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = currentAlpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
    />
  );
};
