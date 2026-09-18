// Aura Somatosensory Audio & Binaural Resonance Engine (Web Audio API)

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isResonancePlaying = false;
    this.resonanceNodes = null;
    this.nominalMasterGain = 0.12;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // 1. Subtle Mode Switch Click (Haptic: SelectionAsync)
  playClick() {
    try {
      const ctx = this.ensureContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  }

  // 2. Thought Purge Dissolution Feedback (Haptic: Purge Dissolve)
  playDissolve() {
    try {
      const ctx = this.ensureContext();
      const now = ctx.currentTime;

      // Soft white-noise ethereal breath
      const bufferSize = ctx.sampleRate * 1.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 1.2);
      filter.Q.value = 3.0;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 1.2);

      // Harmonious ascending crystal chime
      [432, 540, 648, 864].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        g.gain.setValueAtTime(0, now + idx * 0.12);
        g.gain.linearRampToValueAtTime(0.06, now + idx * 0.12 + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.8);

        osc.connect(g);
        g.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.85);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // 3. Time-Lock Secure Impulse (Haptic: Time Lock Heavy)
  playTimeLock() {
    try {
      const ctx = this.ensureContext();
      const now = ctx.currentTime;

      // Deep resonant sub-bass lock impulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.4);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);

      // Metallic latch resonance
      const latch = ctx.createOscillator();
      const latchGain = ctx.createGain();
      latch.type = 'triangle';
      latch.frequency.setValueAtTime(950, now);
      latch.frequency.exponentialRampToValueAtTime(320, now + 0.15);

      latchGain.gain.setValueAtTime(0.09, now);
      latchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      latch.connect(latchGain);
      latchGain.connect(ctx.destination);

      latch.start(now);
      latch.stop(now + 0.16);
    } catch (e) {
      console.error(e);
    }
  }

  // 4. Somatosensory Waveform: Heartbeat Deceleration (Calms Vagus Nerve)
  playHeartbeatDeceleration() {
    try {
      const ctx = this.ensureContext();
      const now = ctx.currentTime;

      [0, 0.45].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(75 - idx * 15, now + offset);
        osc.frequency.exponentialRampToValueAtTime(35, now + offset + 0.25);

        g.gain.setValueAtTime(0.2, now + offset);
        g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.3);

        osc.connect(g);
        g.connect(ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.32);
      });
    } catch (e) {}
  }

  // 5. Somatosensory Waveform: Waterdrop Ping (Clarity Cue)
  playWaterDrop() {
    try {
      const ctx = this.ensureContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  // 6. Breathwave Cadence Bell
  playBreathCue(type = 'inhale') {
    try {
      const ctx = this.ensureContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = type === 'inhale' ? 432 : 324;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);
    } catch (e) {}
  }

  // 7. Binaural Theta (432Hz Carrier with 4Hz Theta beat + Brown Noise Bed)
  toggleBinauralResonance(onStateChange) {
    const ctx = this.ensureContext();

    if (this.isResonancePlaying) {
      this.stopBinauralResonance();
      if (onStateChange) onStateChange(false);
      return false;
    }

    try {
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(this.nominalMasterGain, ctx.currentTime + 1.5);
      masterGain.connect(ctx.destination);

      // Left Channel: 432Hz
      const merger = ctx.createChannelMerger(2);
      const oscLeft = ctx.createOscillator();
      oscLeft.type = 'sine';
      oscLeft.frequency.value = 432.0;

      const gainLeft = ctx.createGain();
      gainLeft.gain.value = 0.65;
      oscLeft.connect(gainLeft);
      gainLeft.connect(merger, 0, 0); // left channel

      // Right Channel: 436Hz (4Hz Theta Frequency)
      const oscRight = ctx.createOscillator();
      oscRight.type = 'sine';
      oscRight.frequency.value = 436.0;

      const gainRight = ctx.createGain();
      gainRight.gain.value = 0.65;
      oscRight.connect(gainRight);
      gainRight.connect(merger, 0, 1); // right channel

      // Procedural Brown Noise Generator (Warm oceanic wash)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 240;

      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.08;

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      merger.connect(masterGain);

      oscLeft.start();
      oscRight.start();
      noiseSource.start();

      this.resonanceNodes = {
        masterGain,
        oscLeft,
        oscRight,
        noiseSource
      };

      this.isResonancePlaying = true;
      if (onStateChange) onStateChange(true);
      return true;
    } catch (err) {
      console.error('Failed starting binaural generator:', err);
      return false;
    }
  }

  // Dynamic Audio Ducking during deep breathing cycles
  duckAudio(targetGain = 0.03, duration = 1.0) {
    if (!this.resonanceNodes || !this.ctx) return;
    try {
      const { masterGain } = this.resonanceNodes;
      masterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + duration);
    } catch (e) {}
  }

  // Restore Audio to nominal sanctuary volume
  restoreAudio(duration = 1.2) {
    if (!this.resonanceNodes || !this.ctx) return;
    try {
      const { masterGain } = this.resonanceNodes;
      masterGain.gain.linearRampToValueAtTime(this.nominalMasterGain, this.ctx.currentTime + duration);
    } catch (e) {}
  }

  stopBinauralResonance() {
    if (!this.resonanceNodes) return;
    try {
      const { masterGain, oscLeft, oscRight, noiseSource } = this.resonanceNodes;
      const ctx = this.ctx;
      if (ctx) {
        masterGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        setTimeout(() => {
          try {
            oscLeft.stop();
            oscRight.stop();
            if (noiseSource) noiseSource.stop();
          } catch (e) {}
        }, 850);
      }
    } catch (e) {}
    this.resonanceNodes = null;
    this.isResonancePlaying = false;
  }
}

export const audio = new SoundEngine();
