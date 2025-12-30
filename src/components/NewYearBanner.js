import React, { useRef, useEffect } from 'react';

// Happy New Year 2026 Banner with animated text, confetti, shimmer & fade-in words
export default function NewYearBanner() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    let animationFrame;
    let startTime = Date.now();

    // Words for fade animation
    const words = ["Happy", "New", "Year", "2026"];
    let wordIndex = 0;
    let showWord = false;
    let wordOpacity = 0;

    // Slow golden particles
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.r = Math.random() * 2.5 + 1.5;
        this.alpha = Math.random() * 0.5 + 0.5;
        this.speed = Math.random() * 0.12 + 0.04;
        this.angle = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha += (Math.random() - 0.5) * 0.01;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
        }
        this.alpha = Math.max(0.3, Math.min(1, this.alpha));
      }
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.restore();
      }
    }

    // Minimal fireworks
    class Firework {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height * 0.5 + 20;
        this.particles = [];
        this.exploded = false;
        this.color = `hsl(${Math.random() * 40 + 45}, 90%, 60%)`;
        this.startTime = Date.now();
        this.duration = Math.random() * 600 + 800;
        for (let i = 0; i < 12; i++) {
          const angle = (Math.PI * 2 * i) / 12;
          this.particles.push({
            x: this.x,
            y: this.y,
            r: Math.random() * 2.2 + 1.2,
            alpha: 1,
            speed: Math.random() * 2.2 + 1.2,
            angle,
            color: this.color,
          });
        }
      }
      update() {
        const elapsed = Date.now() - this.startTime;
        if (elapsed > this.duration) {
          this.exploded = true;
        }
        for (let p of this.particles) {
          p.x += Math.cos(p.angle) * p.speed;
          p.y += Math.sin(p.angle) * p.speed;
          p.alpha -= 0.018;
        }
      }
      draw(ctx) {
        for (let p of this.particles) {
          if (p.alpha > 0) {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.restore();
          }
        }
      }
    }

    // Initialize particles and fireworks
    let particles = Array.from({ length: 32 }, () => new Particle());
    let fireworks = [];

    // Word fade timing
    let lastWordChange = Date.now();

    function render() {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;

      // Background gradient
      let grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#181A2A');
      grad.addColorStop(0.5, '#23243A');
      grad.addColorStop(1, '#0a0a23');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Golden particles
      particles.forEach(p => { p.update(); p.draw(ctx); });

      // Fireworks
      if (Math.random() < 0.012 && fireworks.length < 2) {
        fireworks.push(new Firework());
      }
      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw(ctx);
        if (fireworks[i].exploded) fireworks.splice(i, 1);
      }

      // Word fade logic: 750ms per word (fade in/out)
      if (now - lastWordChange > 375) { // fade toggle every half interval
        showWord = !showWord;
        lastWordChange = now;
        if (!showWord) wordIndex = (wordIndex + 1) % words.length;
      }
      wordOpacity = showWord ? Math.min(1, wordOpacity + 0.05) : Math.max(0, wordOpacity - 0.05);

      // Draw words directly on canvas
      ctx.save();
      ctx.globalAlpha = wordOpacity;
      ctx.font = 'bold 56px Montserrat, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 48;
      ctx.fillStyle = '#FFD700';
      ctx.fillText(words[wordIndex], width / 2, height / 2);
      ctx.restore();

      // Shimmer overlay (optional)
      let shimmerPos = 1 - ((elapsed % 2) / 2);
      let gradText = ctx.createLinearGradient(width / 2 + 220, height / 2, width / 2 - 220, height / 2);
      gradText.addColorStop(Math.max(0, shimmerPos - 0.08), 'rgba(255,215,0,0)');
      gradText.addColorStop(shimmerPos, 'rgba(255,255,255,0.7)');
      gradText.addColorStop(Math.min(1, shimmerPos + 0.08), 'rgba(255,215,0,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.save();
      ctx.font = 'bold 56px Montserrat, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = gradText;
      ctx.lineWidth = 6;
      ctx.strokeText(words[wordIndex], width / 2, height / 2);
      ctx.restore();
      ctx.globalCompositeOperation = 'source-over';

      animationFrame = requestAnimationFrame(render);
    }

    // Responsive
    function handleResize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '220px', position: 'relative', overflow: 'hidden', borderRadius: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', marginBottom: '1.5rem', background: 'linear-gradient(90deg, #181A2A 0%, #23243A 50%, #3C2A4D 100%)' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', background: 'transparent' }} />
    </div>
  );
}