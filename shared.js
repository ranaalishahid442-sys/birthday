/* ═══════════════════════════════════════════════════════════════
   NOOR & ISHQ - ROSY FLORAL & CELEBRATION ENGINE (shared.js)
   Falling Rose Petals, Celebration Audio Engine & 5-Chapter Nav
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── 1. WEB AUDIO CELEBRATION SOUND ENGINE ───
  class RosyAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = localStorage.getItem('birthday_muted') === 'true';
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    // Film Projector Ticking Sound (for 3-2-1 countdown)
    playFilmProjectorTick() {
      if (this.isMuted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    }

    // Theater Curtain Opening Whoosh
    playCurtainWhoosh() {
      if (this.isMuted) return;
      this.init();
      const bufferSize = this.ctx.sampleRate * 0.7;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.25));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(700, this.ctx.currentTime + 0.35);
      filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.7);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.7);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    }

    // Gentle harp chords
    playHarpChime(chord = [523.25, 659.25, 783.99, 1046.5]) {
      if (this.isMuted) return;
      this.init();
      chord.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.16, this.ctx.currentTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.6);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 1.6);
        }, idx * 70);
      });
    }

    // Candle blow-out wind sound effect
    playBlowCandles() {
      if (this.isMuted) return;
      this.init();
      const bufferSize = this.ctx.sampleRate * 0.6;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.2));
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.5);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      whiteNoise.start();
    }

    // Cake slice swoosh sound
    playCakeSlice() {
      if (this.isMuted) return;
      this.init();
      const notes = [659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 1.2);
        }, idx * 60);
      });
    }

    // "Happy 20th Birthday" celebration fanfare
    playBirthdayMelody() {
      if (this.isMuted) return;
      this.init();
      const notes = [
        { f: 392.00, d: 200 },
        { f: 392.00, d: 200 },
        { f: 440.00, d: 350 },
        { f: 392.00, d: 350 },
        { f: 523.25, d: 400 },
        { f: 493.88, d: 600 }
      ];
      let delay = 0;
      notes.forEach(note => {
        setTimeout(() => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note.f, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.2, this.ctx.currentTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (note.d / 1000));
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + (note.d / 1000));
        }, delay);
        delay += note.d + 30;
      });
    }

    // Wax seal break
    playSealBreak() {
      if (this.isMuted) return;
      this.init();
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.05));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, this.ctx.currentTime);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    }

    // Mechanical Click
    playMechanicalClick() {
      if (this.isMuted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    }

    // Toggle Mute
    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem('birthday_muted', this.isMuted);
      return this.isMuted;
    }
  }

  const audio = new RosyAudioEngine();
  window.BirthdayAudio = audio;

  // ─── 2. HAPTIC FEEDBACK ───
  window.triggerHaptic = function (pattern = 15) {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  };

  // ─── 3. FLOATING ROSE PETALS CANVAS ENGINE ───
  function initPetalsCanvas() {
    let canvas = document.getElementById('canvas-petals');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'canvas-petals';
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createPetals();
    });

    let petals = [];
    const petalColors = [
      'rgba(255, 182, 193, 0.75)',
      'rgba(255, 105, 180, 0.65)',
      'rgba(255, 192, 203, 0.8)',
      'rgba(255, 228, 225, 0.7)',
      'rgba(248, 165, 194, 0.75)'
    ];

    function createPetals() {
      petals = [];
      const numPetals = Math.min(Math.floor(width * 0.06), 24);
      for (let i = 0; i < numPetals; i++) {
        petals.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 10 + 10,
          speedY: Math.random() * 0.9 + 0.5,
          speedX: Math.random() * 0.6 - 0.3,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 1.5,
          sway: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.02 + 0.01,
          color: petalColors[Math.floor(Math.random() * petalColors.length)]
        });
      }
    }
    createPetals();

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, 0, 0, p.size * 1.4);
      ctx.bezierCurveTo(-p.size, 0, -p.size / 2, -p.size / 2, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    function render() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.sway += p.swaySpeed;
        p.x += Math.sin(p.sway) * 0.8 + p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y > height + 25) {
          p.y = -25;
          p.x = Math.random() * width;
        }
        if (p.x > width + 25) p.x = -25;
        if (p.x < -25) p.x = width + 25;

        drawPetal(p);
      }
      requestAnimationFrame(render);
    }
    render();
  }

  // ─── 4. TOUCH BLOOMING FLOWERS ───
  function initTouchInteractions() {
    const flowers = ['🌸', '🌹', '💐', '✨', '💖', '🎂', '🌷'];
    function createFlower(x, y) {
      const fl = document.createElement('div');
      fl.className = 'touch-flower';
      fl.style.left = `${x}px`;
      fl.style.top = `${y}px`;
      fl.style.fontSize = `${Math.floor(Math.random() * 12 + 16)}px`;
      fl.textContent = flowers[Math.floor(Math.random() * flowers.length)];
      document.body.appendChild(fl);
      setTimeout(() => fl.remove(), 1100);
    }

    window.addEventListener('click', (e) => {
      if (e.target.closest('button, input, a, video, .cake-container, #cakeStage, .cinema-stage-wrapper')) return;
      createFlower(e.clientX, e.clientY);
    });

    window.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      if (touch && !e.target.closest('button, input, a, video, .cake-container, #cakeStage, .cinema-stage-wrapper')) {
        createFlower(touch.clientX, touch.clientY);
      }
    }, { passive: true });
  }

  // ─── 5. INJECT 5-CHAPTER BOTTOM NAVIGATION & SOUND CONTROLS ───
  function injectSharedComponents() {
    const currentPath = window.location.pathname.toLowerCase();
    let currentChapter = 1;

    if (currentPath.includes('blessing.html')) currentChapter = 2;
    else if (currentPath.includes('cake.html')) currentChapter = 3;
    else if (currentPath.includes('cinema.html')) currentChapter = 4;
    else if (currentPath.includes('vault.html')) currentChapter = 5;

    // Top Bar Sound Toggle
    const soundToggle = document.getElementById('soundToggleBtn');
    if (soundToggle) {
      if (!audio.isMuted) soundToggle.classList.add('active');
      soundToggle.innerHTML = audio.isMuted ? '🔇' : '🎵';
      soundToggle.addEventListener('click', () => {
        window.triggerHaptic(20);
        const isMuted = audio.toggleMute();
        soundToggle.innerHTML = isMuted ? '🔇' : '🎵';
        soundToggle.classList.toggle('active', !isMuted);
        if (!isMuted) audio.playHarpChime();
      });
    }

    // Inject 5-Item Bottom Navigation
    if (!document.querySelector('.bottom-nav-bar')) {
      const nav = document.createElement('nav');
      nav.className = 'bottom-nav-bar';
      nav.innerHTML = `
        <a href="index.html" class="nav-item ${currentChapter === 1 ? 'active' : ''}">
          <span class="nav-item-icon">💌</span>
          <span class="nav-item-label">Invite</span>
        </a>
        <a href="blessing.html" class="nav-item ${currentChapter === 2 ? 'active' : ''}">
          <span class="nav-item-icon">🕊️</span>
          <span class="nav-item-label">Noor</span>
        </a>
        <a href="cake.html" class="nav-item ${currentChapter === 3 ? 'active' : ''}">
          <span class="nav-item-icon">🎂</span>
          <span class="nav-item-label">Cake</span>
        </a>
        <a href="cinema.html" class="nav-item ${currentChapter === 4 ? 'active' : ''}">
          <span class="nav-item-icon">🎬</span>
          <span class="nav-item-label">Cinema</span>
        </a>
        <a href="vault.html" class="nav-item ${currentChapter === 5 ? 'active' : ''}">
          <span class="nav-item-icon">🔐</span>
          <span class="nav-item-label">Vault</span>
        </a>
      `;
      document.body.appendChild(nav);

      nav.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
          window.triggerHaptic(15);
          audio.playHarpChime([659.25, 783.99, 1046.5]);
        });
      });
    }
  }

  // Load fireworks script dynamically if not present
  if (!window.Fireworks) {
    const fwScript = document.createElement('script');
    fwScript.src = 'assets/fireworks.js';
    document.head.appendChild(fwScript);
  }

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initPetalsCanvas();
      initTouchInteractions();
      injectSharedComponents();
    });
  } else {
    initPetalsCanvas();
    initTouchInteractions();
    injectSharedComponents();
  }
})();
