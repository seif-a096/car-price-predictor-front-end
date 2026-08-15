import { useEffect, useRef } from 'react';

export default function HeroGraphic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let carBounce = 0;
    
    // Generate some random particles for dynamic effect — fewer, slower
    const particles = Array.from({ length: 18 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      speed: Math.random() * 0.0008 + 0.0003, // much slower drift
      size: Math.random() * 0.5 + 0.15
    }));

    // Generate fixed star positions (seeded once, stay consistent)
    const stars = Array.from({ length: 22 }).map(() => ({
      x: Math.random() * 0.95 + 0.025, // avoid extreme edges
      y: Math.random() * 0.42,          // only above horizon
      size: Math.random() * 1.2 + 0.4,
      twinkleSpeed: Math.random() * 0.008 + 0.003, // slow gentle twinkle
      twinkleOffset: Math.random() * Math.PI * 2,
      brightness: Math.random() * 0.4 + 0.3 // 0.3 – 0.7 base brightness
    }));

    // Load car image
    const carImg = new Image();
    carImg.src = '/realistic-car.jpg';

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear to pure black (matches the car image background exactly)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Subtle blue horizon sky glow — softer
      const skyGrad = ctx.createRadialGradient(
        width / 2, height * 0.48, 0,
        width / 2, height * 0.48, width * 0.7
      );
      skyGrad.addColorStop(0, 'rgba(0, 80, 160, 0.15)');
      skyGrad.addColorStop(0.5, 'rgba(0, 30, 80, 0.06)');
      skyGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.55);

      const horizonY = height * 0.48;

      // Draw stars — gentle twinkling dots scattered across night sky
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.5 + 0.5;
        const alpha = star.brightness * (0.6 + twinkle * 0.4); // subtle brightness variation
        const sx = star.x * width;
        const sy = star.y * height;

        // Tiny soft glow around brighter stars
        if (star.size > 1.0) {
          const starGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.size * 4);
          starGlow.addColorStop(0, `rgba(200, 220, 255, ${alpha * 0.15})`);
          starGlow.addColorStop(1, 'rgba(200, 220, 255, 0)');
          ctx.fillStyle = starGlow;
          ctx.fillRect(sx - star.size * 4, sy - star.size * 4, star.size * 8, star.size * 8);
        }

        ctx.fillStyle = `rgba(230, 240, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw realistic crescent moon — clean, natural, without artificial halos or rings
      const moonRadius = Math.min(width, height) * 0.052;
      const moonX = width * 0.84;
      const moonY = height * 0.11;

      ctx.save();
      ctx.translate(moonX, moonY);
      ctx.rotate(-0.35); // Natural celestial orbital tilt (~20 degrees)

      // 1. Soft, seamless ambient moonlight glow (completely continuous, no hard edges)
      const ambientGlow = ctx.createRadialGradient(
        moonRadius * 0.3, 0, 0,
        moonRadius * 0.3, 0, moonRadius * 3.5
      );
      ambientGlow.addColorStop(0, 'rgba(160, 205, 255, 0.18)');
      ambientGlow.addColorStop(0.25, 'rgba(120, 175, 245, 0.08)');
      ambientGlow.addColorStop(0.6, 'rgba(60, 110, 190, 0.02)');
      ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(moonRadius * 0.3, 0, moonRadius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Clean 3D Illuminated Crescent Geometry
      ctx.beginPath();
      // Outer illuminated limb (semicircle)
      ctx.arc(0, 0, moonRadius, -Math.PI / 2, Math.PI / 2, false);
      // Inner shadow terminator (smooth spherical ellipse curve)
      ctx.ellipse(0, 0, moonRadius * 0.52, moonRadius, 0, Math.PI / 2, -Math.PI / 2, true);
      ctx.closePath();

      // Lunar surface lighting gradient: Crisp silver-white limb smoothly fading to soft lunar blue
      const moonLimb = ctx.createRadialGradient(
        moonRadius * 0.7, 0, moonRadius * 0.05,
        moonRadius * 0.3, 0, moonRadius * 0.95
      );
      moonLimb.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      moonLimb.addColorStop(0.3, 'rgba(235, 244, 255, 0.95)');
      moonLimb.addColorStop(0.7, 'rgba(195, 220, 250, 0.88)');
      moonLimb.addColorStop(1, 'rgba(140, 175, 225, 0.65)');

      ctx.fillStyle = moonLimb;
      ctx.fill();

      // 3. Subtle organic surface texture on the lit body
      const mariaSpots = [
        { x: moonRadius * 0.48, y: -moonRadius * 0.28, r: moonRadius * 0.15, opacity: 0.09 },
        { x: moonRadius * 0.60, y: 0, r: moonRadius * 0.18, opacity: 0.11 },
        { x: moonRadius * 0.45, y: moonRadius * 0.30, r: moonRadius * 0.14, opacity: 0.08 },
      ];

      mariaSpots.forEach((spot) => {
        const spotGrad = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, spot.r);
        spotGrad.addColorStop(0, `rgba(110, 140, 185, ${spot.opacity})`);
        spotGrad.addColorStop(1, 'rgba(180, 205, 240, 0)');
        ctx.fillStyle = spotGrad;
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // Grid road - vertical perspective lines — softer opacity
      ctx.lineWidth = 1;
      const numLines = 20;
      for (let i = 0; i <= numLines; i++) {
        const xOffset = ((i / numLines) - 0.5) * width * 3;
        ctx.beginPath();
        ctx.moveTo(width / 2, horizonY);
        ctx.lineTo((width / 2) + xOffset, height);
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
        ctx.stroke();
      }

      // Horizontal moving lines — much slower
      time += 0.006;
      const numHorizontals = 15;
      for (let i = 0; i < numHorizontals; i++) {
        const progress = (i / numHorizontals + time) % 1;
        const yPos = horizonY + (progress * progress) * (height - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(width, yPos);
        ctx.strokeStyle = `rgba(0, 255, 255, ${progress * 0.25})`;
        ctx.lineWidth = 1 + progress * 0.5;
        ctx.stroke();
      }

      // Fog gradient at the horizon to smoothly fade out the grid lines
      const fogGrad = ctx.createLinearGradient(0, horizonY - 10, 0, horizonY + height * 0.25);
      fogGrad.addColorStop(0, 'rgba(0, 0, 0, 1)'); // solid black at the horizon
      fogGrad.addColorStop(1, 'rgba(0, 0, 0, 0)'); // fades to transparent
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, horizonY - 10, width, height * 0.25);

      // Draw floating dust particles — very soft and subtle
      ctx.fillStyle = 'rgba(200, 255, 255, 0.2)';
      particles.forEach(p => {
        p.y += p.speed;
        if (p.y > 1) {
          p.y = horizonY / height;
          p.x = Math.random();
        }
        if (p.y > horizonY / height) {
           const px = p.x * width;
           const py = p.y * height;
           const depth = (py - horizonY) / (height - horizonY); 
           ctx.beginPath();
           ctx.arc(px, py, p.size * (1 + depth * 1.2), 0, Math.PI * 2);
           ctx.fill();
        }
      });

      // Draw the car with lighten — black bg becomes invisible, car body shows
      if (carImg.complete && carImg.naturalWidth > 0) {
        carBounce += 0.03;
        const bounceY = Math.sin(carBounce) * 2.5;

        const carW = width * 0.52;
        const carH = (carW / carImg.naturalWidth) * carImg.naturalHeight;
        const carX = (width - carW) / 2;
        const carY = height - carH * 0.78 + bounceY;

        ctx.save();
        ctx.globalCompositeOperation = 'lighten';
        ctx.drawImage(carImg, carX, carY, carW, carH);
        ctx.restore();

        // Step 3: Red taillight glow on road
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const glowGrad = ctx.createRadialGradient(
          width / 2, height * 0.92, 5,
          width / 2, height * 0.92, carW * 0.4
        );
        glowGrad.addColorStop(0, 'rgba(255, 30, 60, 0.15)');
        glowGrad.addColorStop(1, 'rgba(255, 30, 60, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, height * 0.7, width, height * 0.3);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
    </div>
  );
}
