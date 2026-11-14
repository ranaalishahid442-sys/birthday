/* ═══════════════════════════════════════════════════════════════
   NOOR & ISHQ - LUXURY CELESTIAL FIREWORKS ENGINE
   Realistic Particle Physics, Heart Fireworks & Audio Booms
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  class BirthdayFireworks {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.particles = [];
      this.rockets = [];
      this.isRunning = false;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.colors = [
        '#ff75a0', '#e84393', '#ffd700', '#ff9ff3', 
        '#feca57', '#54a0ff', '#ff6b6b', '#a29bfe', '#ffffff'
      ];
      this.init();
    }

    init() {
      this.canvas = document.getElementById('fireworks-canvas');
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'fireworks-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9998';
        document.body.appendChild(this.canvas);
      }
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    // Play fireworks sound via Web Audio API
    playBoom(pitch = 1) {
      if (window.BirthdayAudio && !window.BirthdayAudio.isMuted) {
        try {
          const ctx = window.BirthdayAudio.ctx;
          if (!ctx) return;
          
          // Low frequency boom
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(140 * pitch, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5);

          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.55);

          // Crackle sound
          const bufferSize = ctx.sampleRate * 0.4;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(1500, ctx.currentTime);
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.15, ctx.currentTime);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(ctx.destination);
          noise.start();
        } catch (e) {}
      }
    }

    // Launch rocket towards target
    launch(startX, startY, targetX, targetY, isHeart = false) {
      const rocket = {
        x: startX || Math.random() * (this.width - 100) + 50,
        y: startY || this.height,
        targetX: targetX || Math.random() * (this.width * 0.8) + this.width * 0.1,
        targetY: targetY || Math.random() * (this.height * 0.4) + this.height * 0.15,
        speed: 8 + Math.random() * 4,
        angle: 0,
        isHeart: isHeart,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        trail: []
      };

      const dx = rocket.targetX - rocket.x;
      const dy = rocket.targetY - rocket.y;
      rocket.angle = Math.atan2(dy, dx);
      this.rockets.push(rocket);

      if (!this.isRunning) {
        this.isRunning = true;
        this.loop();
      }
    }

    explode(x, y, isHeart, baseColor) {
      this.playBoom(isHeart ? 1.2 : 0.9);
      if (window.triggerHaptic) window.triggerHaptic([30, 40]);

      const count = isHeart ? 65 : 75;
      const color = baseColor || this.colors[Math.floor(Math.random() * this.colors.length)];

      for (let i = 0; i < count; i++) {
        let vx, vy;
        if (isHeart) {
          // Heart curve parametric formula
          const t = (Math.PI * 2 * i) / count;
          const hx = 16 * Math.pow(Math.sin(t), 3);
          const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          const speedFactor = 0.22 + Math.random() * 0.05;
          vx = hx * speedFactor;
          vy = hy * speedFactor;
        } else {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5 + 1.5;
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed;
        }

        this.particles.push({
          x: x,
          y: y,
          vx: vx,
          vy: vy,
          color: color,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.012,
          size: Math.random() * 2.5 + 1.5,
          gravity: 0.06,
          friction: 0.98
        });
      }
    }

    // Grand Celebration Burst (multiple rockets at once)
    grandCelebration(num = 6) {
      for (let i = 0; i < num; i++) {
        setTimeout(() => {
          const targetX = Math.random() * (this.width * 0.8) + this.width * 0.1;
          const targetY = Math.random() * (this.height * 0.35) + this.height * 0.1;
          this.launch(null, null, targetX, targetY, i % 2 === 0);
        }, i * 350);
      }
    }

    loop() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Update & Draw Rockets
      for (let i = this.rockets.length - 1; i >= 0; i--) {
        const r = this.rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 6) r.trail.shift();

        // Draw trail
        this.ctx.beginPath();
        for (let j = 0; j < r.trail.length; j++) {
          const pt = r.trail[j];
          this.ctx.lineTo(pt.x, pt.y);
        }
        this.ctx.strokeStyle = r.color;
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();

        r.x += Math.cos(r.angle) * r.speed;
        r.y += Math.sin(r.angle) * r.speed;

        // Check if reached target
        if (r.y <= r.targetY || r.x < 0 || r.x > this.width) {
          this.explode(r.x, r.y, r.isHeart, r.color);
          this.rockets.splice(i, 1);
        }
      }

      // Update & Draw Particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();

        // Shimmer glow
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = p.color;
        this.ctx.fill();
        this.ctx.restore();
      }

      if (this.rockets.length > 0 || this.particles.length > 0) {
        requestAnimationFrame(() => this.loop());
      } else {
        this.isRunning = false;
        this.ctx.clearRect(0, 0, this.width, this.height);
      }
    }
  }

  window.Fireworks = new BirthdayFireworks();
})();
