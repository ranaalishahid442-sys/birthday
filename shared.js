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

    // Sacred Pearl Tasbih Click Sound (natural mother-of-pearl acoustic tap)
    playPearlClick() {
      if (this.isMuted) return;
      this.init();
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(2200, now);
      osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(3200, now);
      osc2.frequency.exponentialRampToValueAtTime(800, now + 0.05);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.055);
      osc2.stop(now + 0.055);
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

    // Heavy Wax Fracture & Crunch Sound
    playWaxCrackHeavy() {
      if (this.isMuted) return;
      this.init();
      const now = this.ctx.currentTime;
      // High snap
      const osc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);
      snapGain.gain.setValueAtTime(0.4, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(snapGain);
      snapGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);

      // Crunch noise
      const bufferSize = this.ctx.sampleRate * 0.18;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.035));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    }

    // Silk Ribbon Untying Whoosh
    playRibbonUntie() {
      if (this.isMuted) return;
      this.init();
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.45;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin(i / 15);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.2);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.45);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    }

    // Golden Locket Opening Hinge & Chime
    playLocketHinge() {
      if (this.isMuted) return;
      this.init();
      const now = this.ctx.currentTime;
      // Metallic latch click
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1600, now);
      osc1.frequency.exponentialRampToValueAtTime(600, now + 0.04);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.05);

      // Music box magical chime
      const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
      notes.forEach((freq, idx) => {
        const time = now + 0.06 + (idx * 0.07);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(0.2, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.8);
      });
    }

    // Kiss Stamp Sound (cute smooch pop + chime)
    playKissSmooch() {
      if (this.isMuted) return;
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.06);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);

      // Soft high harmonic
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1760, now + 0.05);
      gain2.gain.setValueAtTime(0.12, now + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.4);
    }

    // Stardust Sparkle Chime
    playStardustChime() {
      if (this.isMuted) return;
      this.init();
      const now = this.ctx.currentTime;
      const freqs = [1760, 2093, 2349, 2637];
      const freq = freqs[Math.floor(Math.random() * freqs.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
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
