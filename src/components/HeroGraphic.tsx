import { useEffect, useRef } from 'react';

export default function HeroGraphic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let carBounce = 0;

    // Interactive mouse / cursor tracking physics
    let targetX = 0; // -1 to 1
    let targetY = 0; // -1 to 1
    let currentX = 0;
    let currentY = 0;
    let currentSteer = 0;
    
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

    // Mouse & touch interaction handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
      targetX = Math.max(-1, Math.min(1, normX));
      targetY = Math.max(-1, Math.min(1, normY));
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        const normX = ((e.touches[0].clientX - rect.left) / rect.width - 0.5) * 2;
        const normY = ((e.touches[0].clientY - rect.top) / rect.height - 0.5) * 2;
        targetX = Math.max(-1, Math.min(1, normX));
        targetY = Math.max(-1, Math.min(1, normY));
      }
    };

    const handleTouchEnd = () => {
      targetX = 0;
      targetY = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Smooth physics lerp for car movement & steering angle
      currentX += (targetX - currentX) * 0.065;
      currentY += (targetY - currentY) * 0.065;

      // Vehicle steering lean (drifts into turn when moving horizontally)
      const targetSteer = (targetX - currentX) * 0.12 + currentX * 0.035;
      currentSteer += (targetSteer - currentSteer) * 0.08;

      // Subtle parallax shift on background elements
      const parallaxX = -currentX * 12;

      // Clear to pure black (matches the car image background exactly)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Subtle blue horizon sky glow — softer
      const skyGrad = ctx.createRadialGradient(
        width / 2 + parallaxX * 0.5, height * 0.48, 0,
        width / 2 + parallaxX * 0.5, height * 0.48, width * 0.7
      );
      skyGrad.addColorStop(0, 'rgba(0, 80, 160, 0.15)');
      skyGrad.addColorStop(0.5, 'rgba(0, 30, 80, 0.06)');
      skyGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.55);

      const horizonY = height * 0.48;

      // Draw stars — gentle twinkling dots with subtle parallax
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.5 + 0.5;
        const alpha = star.brightness * (0.6 + twinkle * 0.4); // subtle brightness variation
        const sx = star.x * width + parallaxX * 0.3;
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

      // Draw realistic crescent moon — top-right corner with celestial tilt & parallax
      const moonRadius = Math.min(width, height) * 0.052;
      const moonX = width * 0.84 + parallaxX * 0.2;
      const moonY = height * 0.11;

      ctx.save();
      ctx.translate(moonX, moonY);
      ctx.rotate(-0.35); // Natural celestial orbital tilt (~20 degrees)

      // 1. Soft, seamless ambient moonlight glow
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
      ctx.arc(0, 0, moonRadius, -Math.PI / 2, Math.PI / 2, false);
      ctx.ellipse(0, 0, moonRadius * 0.52, moonRadius, 0, Math.PI / 2, -Math.PI / 2, true);
      ctx.closePath();

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
      fogGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      fogGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, horizonY - 10, width, height * 0.25);

      // Draw floating dust particles
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

      // ─────────────────────────────────────────────────────────────
      // DYNAMIC CURSOR-SYNCED VEHICLE & LIGHTING
      // ─────────────────────────────────────────────────────────────
      if (carImg.complete && carImg.naturalWidth > 0) {
        carBounce += 0.03;
        const bounceY = Math.sin(carBounce) * 2.2;

        const carW = width * 0.52;
        const carH = (carW / carImg.naturalWidth) * carImg.naturalHeight;
        
        // Horizontal lane glide (up to +/-24% of width) & subtle forward/back depth (+/-2.5% of height)
        const carCenterX = (width / 2) + currentX * (width * 0.24);
        const carCenterY = (height - carH * 0.78 + bounceY + (carH / 2)) + currentY * (height * 0.025);
        const carX = carCenterX - (carW / 2);
        const carY = carCenterY - (carH / 2);

        // Draw car with dynamic steering tilt and lighten blend mode
        ctx.save();
        ctx.translate(carCenterX, carCenterY);
        ctx.rotate(currentSteer);
        ctx.translate(-carCenterX, -carCenterY);

        ctx.globalCompositeOperation = 'lighten';
        ctx.drawImage(carImg, carX, carY, carW, carH);
        ctx.restore();

        // Red taillight ground glow tracking car position
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        // Undercarriage ambient glow
        const glowGrad = ctx.createRadialGradient(
          carCenterX, height * 0.92, 5,
          carCenterX, height * 0.92, carW * 0.42
        );
        glowGrad.addColorStop(0, 'rgba(255, 30, 60, 0.22)');
        glowGrad.addColorStop(0.4, 'rgba(255, 20, 50, 0.08)');
        glowGrad.addColorStop(1, 'rgba(255, 30, 60, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, height * 0.7, width, height * 0.3);

        // Dual left and right taillight ground spot reflections
        const leftLightX = carCenterX - (carW * 0.24);
        const rightLightX = carCenterX + (carW * 0.24);
        const spotY = height * 0.91;

        [leftLightX, rightLightX].forEach((lx) => {
          const spotGrad = ctx.createRadialGradient(lx, spotY, 0, lx, spotY, carW * 0.16);
          spotGrad.addColorStop(0, 'rgba(255, 60, 80, 0.28)');
          spotGrad.addColorStop(0.5, 'rgba(255, 20, 50, 0.08)');
          spotGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');
          ctx.fillStyle = spotGrad;
          ctx.beginPath();
          ctx.arc(lx, spotY, carW * 0.16, 0, Math.PI * 2);
          ctx.fill();
        });

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
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '500px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-xl)',
        cursor: 'crosshair'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
    </div>
  );
}
