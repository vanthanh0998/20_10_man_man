import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  oscillationSpeed: number;
  oscillationDistance: number;
  angle: number;
  flipSpeed: number;
  flipAngle: number;
  colorIndex: number;
  opacity: number;
}

const PETAL_COLORS = [
  { main: '#e11d48', shadow: '#9f1239', highlight: '#fda4af' }, // Crimson Rose
  { main: '#be123c', shadow: '#881337', highlight: '#f43f5e' }, // Velvet Ruby
  { main: '#fb7185', shadow: '#e11d48', highlight: '#ffe4e6' }, // Soft Blush
  { main: '#f43f5e', shadow: '#be123c', highlight: '#fecdd3' }, // Warm Rose
  { main: '#9f1239', shadow: '#4c0519', highlight: '#f43f5e' }, // Deep Wine
];

export const RosePetalsCanvas: React.FC<{ isEnabled?: boolean }> = ({ isEnabled = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isEnabled) return;

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

    // Number of petals adjusted for screen size
    const petalCount = window.innerWidth < 768 ? 22 : 40;
    const petals: Petal[] = [];

    const createPetal = (initialY = -20): Petal => ({
      x: Math.random() * width,
      y: initialY === -20 ? Math.random() * height : -20,
      size: Math.random() * 12 + 10,
      speedY: Math.random() * 1.2 + 0.8,
      speedX: Math.random() * 0.8 - 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      oscillationSpeed: Math.random() * 0.02 + 0.01,
      oscillationDistance: Math.random() * 40 + 20,
      angle: Math.random() * Math.PI * 2,
      flipSpeed: Math.random() * 0.03 + 0.01,
      flipAngle: Math.random() * Math.PI,
      colorIndex: Math.floor(Math.random() * PETAL_COLORS.length),
      opacity: Math.random() * 0.35 + 0.65,
    });

    for (let i = 0; i < petalCount; i++) {
      petals.push(createPetal(0));
    }

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // 3D flip effect using scale
      const scaleX = Math.cos(p.flipAngle);
      ctx.scale(scaleX, 1);
      ctx.globalAlpha = p.opacity;

      const palette = PETAL_COLORS[p.colorIndex];
      const s = p.size;

      // Draw curved rose petal shape
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.9);
      // Left curve
      ctx.bezierCurveTo(-s * 0.8, -s * 0.6, -s * 0.9, s * 0.4, 0, s);
      // Right curve
      ctx.bezierCurveTo(s * 0.9, s * 0.4, s * 0.8, -s * 0.6, 0, -s * 0.9);
      ctx.closePath();

      // Petal gradient
      const grad = ctx.createLinearGradient(-s * 0.5, -s * 0.8, s * 0.5, s * 0.8);
      grad.addColorStop(0, palette.highlight);
      grad.addColorStop(0.4, palette.main);
      grad.addColorStop(1, palette.shadow);

      ctx.fillStyle = grad;
      ctx.fill();

      // Subtle center vein
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.7);
      ctx.quadraticCurveTo(-s * 0.1, 0, 0, s * 0.7);
      ctx.strokeStyle = palette.shadow;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.angle += p.oscillationSpeed;
        p.flipAngle += p.flipSpeed;
        p.rotation += p.rotationSpeed;

        p.y += p.speedY;
        p.x += Math.sin(p.angle) * 0.8 + p.speedX;

        // Reset if petal falls beyond screen bottom or drifts off screen
        if (p.y > height + 25) {
          petals[i] = createPetal(-20);
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        drawPetal(p);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40 h-full w-full"
      aria-hidden="true"
    />
  );
};
