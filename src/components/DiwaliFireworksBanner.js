import React, { useRef, useEffect } from 'react';

// Premium Diwali Fireworks Banner (Canvas-based, ultra-HD, seamless loop)
export default function DiwaliFireworksBanner() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    let fireworks = [];
    let particles = [];
    let animationFrame;

    // Utility functions
    function random(min, max) { return Math.random() * (max - min) + min; }
    function colorSet() {
      const colors = [
        'rgba(255, 215, 0, 0.9)', // Gold
        'rgba(255, 50, 50, 0.9)', // Red
        'rgba(160, 32, 240, 0.9)', // Purple
        'rgba(30, 144, 255, 0.9)', // Blue
        'rgba(255, 255, 255, 0.9)' // White
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    // Firework class
    class Firework {
      constructor() {
        this.x = random(width * 0.1, width * 0.9);
        this.y = height;
        this.targetY = random(height * 0.2, height * 0.5);
        this.color = colorSet();
        this.speed = random(6, 9);
        this.state = 'rise';
        this.trail = [];
        this.smoke = [];
      }
      update() {
        if (this.state === 'rise') {
          this.trail.push({ x: this.x, y: this.y });
          if (this.trail.length > 20) this.trail.shift();
          this.y -= this.speed;
          this.smoke.push({ x: this.x + random(-8,8), y: this.y + random(-8,8), alpha: 0.2 + Math.random()*0.2 });
          if (this.smoke.length > 30) this.smoke.shift();
          if (this.y <= this.targetY) {
            this.state = 'burst';
            for (let i = 0; i < random(60, 100); i++) {
              particles.push(new Particle(this.x, this.y, this.color));
            }
          }
        }
      }
      draw(ctx) {
        // Trail
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i < this.trail.length; i++) {
          ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.stroke();
        ctx.restore();
        // Smoke
        for (let s of this.smoke) {
          ctx.save();
          ctx.globalAlpha = s.alpha;
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.beginPath();
          ctx.arc(s.x, s.y, random(6, 12), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // Rising firework
        if (this.state === 'rise') {
          ctx.save();
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 18;
          ctx.globalAlpha = 0.95;
          ctx.beginPath();
          ctx.arc(this.x, this.y, 7, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // Particle class (burst)
    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.angle = random(0, Math.PI * 2);
        this.speed = random(2, 7);
        this.radius = random(2, 4);
        this.color = color;
        this.alpha = 1;
        this.life = random(60, 120);
        this.age = 0;
        this.sparks = [];
      }
      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + 0.2; // gravity
        this.speed *= 0.97;
        this.alpha *= 0.98;
        this.age++;
        // Spark trail
        this.sparks.push({ x: this.x, y: this.y, alpha: this.alpha });
        if (this.sparks.length > 10) this.sparks.shift();
      }
      draw(ctx) {
        // Spark trail
        for (let s of this.sparks) {
          ctx.save();
          ctx.globalAlpha = s.alpha * 0.7;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.shadowColor = '#fff';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();
        }
        // Particle
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.restore();
      }
    }

    function render() {
      ctx.clearRect(0, 0, width, height);
      // Deep festive night sky
      let grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#1a0933');
      grad.addColorStop(1, '#2c1a4d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      // Fireworks
      for (let fw of fireworks) {
        fw.update();
        fw.draw(ctx);
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.age > p.life || p.alpha < 0.05) {
          particles.splice(i, 1);
        }
      }
      // Remove finished fireworks
      fireworks = fireworks.filter(fw => fw.state !== 'burst');
      // Add new fireworks
      if (fireworks.length < 3 && Math.random() < 0.04) {
        fireworks.push(new Firework());
      }
      animationFrame = requestAnimationFrame(render);
    }

    // Responsive resize
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
    <div style={{ width: '100%', height: '340px', position: 'relative', overflow: 'hidden', borderRadius: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', background: 'transparent' }} />
      {/* You can overlay text/components here if needed */}
    </div>
  );
}
