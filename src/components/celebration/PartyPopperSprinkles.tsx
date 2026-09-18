'use client';

import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle' | 'star' | 'streamer';
  opacity: number;
  decay: number;
  gravity: number;
  drag: number;
}

export function PartyPopperSprinkles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // 1. Safe canvas-confetti trigger
    const fireConfettiLib = () => {
      try {
        const colors = ['#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#8b5cf6', '#facc15', '#ffffff'];

        // Left Corner Party Popper
        confetti({
          particleCount: 65,
          angle: 60,
          spread: 80,
          origin: { x: 0.05, y: 0.15 },
          zIndex: 99999999,
          colors,
        });

        // Right Corner Party Popper
        confetti({
          particleCount: 65,
          angle: 120,
          spread: 80,
          origin: { x: 0.95, y: 0.15 },
          zIndex: 99999999,
          colors,
        });

        // Center Burst
        confetti({
          particleCount: 85,
          spread: 120,
          origin: { x: 0.5, y: 0.1 },
          zIndex: 99999999,
          colors,
        });
      } catch (e) {
        console.warn('Canvas-confetti lib trigger notice:', e);
      }
    };

    fireConfettiLib();

    // 2. High Performance 60 FPS HTML5 Canvas Physics Engine
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

    const colors = [
      '#f59e0b', // Amber Gold
      '#10b981', // Emerald
      '#06b6d4', // Cyan
      '#ec4899', // Pink
      '#8b5cf6', // Purple
      '#facc15', // Yellow Star
      '#ffffff', // White Sparkle
    ];

    const particles: Particle[] = [];

    const spawnBurst = (
      originX: number,
      originY: number,
      count: number = 50,
      angleMin: number = 0,
      angleMax: number = Math.PI * 2,
      speedBase: number = 14
    ) => {
      for (let i = 0; i < count; i++) {
        const angle = angleMin + Math.random() * (angleMax - angleMin);
        const speed = Math.random() * speedBase + 5;
        const shapes: Particle['shape'][] = ['rect', 'star', 'circle', 'streamer'];

        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 6,
          size: Math.random() * 9 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.3,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          opacity: 1,
          decay: Math.random() * 0.006 + 0.002,
          gravity: 0.18,
          drag: 0.98,
        });
      }
    };

    // Burst 1: Top Corners (0s)
    spawnBurst(width * 0.05, height * 0.15, 60, -Math.PI / 3, Math.PI / 4, 16);
    spawnBurst(width * 0.95, height * 0.15, 60, (Math.PI * 3) / 4, (Math.PI * 4) / 3, 16);

    // Burst 2: Top Center (0.3s)
    const tCenter = setTimeout(() => {
      spawnBurst(width * 0.5, height * 0.1, 80, -Math.PI, Math.PI, 18);
    }, 300);

    // Burst 3: Side Edge Streamers (0.8s)
    const tSides = setTimeout(() => {
      spawnBurst(0, height * 0.4, 60, -Math.PI / 4, Math.PI / 4, 18);
      spawnBurst(width, height * 0.4, 60, (Math.PI * 3) / 4, (Math.PI * 5) / 4, 18);
    }, 800);

    // Burst 4: Center Explosion (1.5s)
    const tExplode = setTimeout(() => {
      spawnBurst(width * 0.5, height * 0.35, 140, 0, Math.PI * 2, 22);
    }, 1500);

    // Continuous sparkles for 5 seconds
    const intervalShower = setInterval(() => {
      if (particles.length < 300) {
        spawnBurst(Math.random() * width, Math.random() * height * 0.2, 12, 0, Math.PI * 2, 8);
      }
    }, 400);

    const stopShower = setTimeout(() => {
      clearInterval(intervalShower);
    }, 5500);

    const drawStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      let step = Math.PI / spikes;

      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      c.lineTo(cx, cy - outerRadius);
      c.closePath();
      c.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y > height + 40) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.8);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'star') {
          drawStar(ctx, 0, 0, 5, p.size, p.size / 2);
        } else {
          // Party Popper Streamer Ribbon
          ctx.fillRect(-p.size / 3, -p.size * 2, p.size / 1.5, p.size * 4);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(tCenter);
      clearTimeout(tSides);
      clearTimeout(tExplode);
      clearTimeout(stopShower);
      clearInterval(intervalShower);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none w-full h-full"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999999,
        pointerEvents: 'none',
      }}
    />
  );
}
