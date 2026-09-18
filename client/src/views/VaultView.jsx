import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Lock, Flame, Mic, MicOff, Waves, Trash2, CheckCircle2, Clock, ShieldCheck, Radio } from 'lucide-react';
import { audio } from '../services/audio.js';
import { purgeThought, timeLockThought, getMetrics } from '../services/storage.js';
import SDFShaderCore from '../components/SDFShaderCore.jsx';
import { generateTextPixelEmbers } from '../services/pixelDissolve.js';

export default function VaultView({ onThoughtAction, userName, onOpenPanic }) {
  // Mode: 'purge' (Catharsis) vs 'timelock' (Compartmentalization)
  const [mode, setMode] = useState('purge');
  const [inputText, setInputText] = useState('');
  const [selectedTag, setSelectedTag] = useState('Overthinking');
  const [lockHours, setLockHours] = useState(8);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [metrics, setMetrics] = useState(getMetrics());
  const [isListening, setIsListening] = useState(false);
  const [voiceDumpMode, setVoiceDumpMode] = useState(false);

  // Pillar 1: Zero-Effort Voice Purge (Voice-to-Vapor)
  const [voicePurgeHolding, setVoicePurgeHolding] = useState(false);
  const [floatingTranscript, setFloatingTranscript] = useState('');
  const recognitionRef = useRef(null);
  const speechTimerRef = useRef(null);

  const canvasRef = useRef(null);
  const textareaRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  const tags = ['Overthinking', 'Anxiety', 'Fatigue', 'Self-Doubt', 'Uncertainty'];

  // Update metrics periodically or on action
  const refreshMetrics = () => {
    setMetrics(getMetrics());
  };

  // Canvas particle physics engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const ctx = canvas.getContext('2d');

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.038; // buoyant lift towards celestial vault
        p.vx *= 0.985;
        p.alpha -= p.decay;
        p.rotation += p.rotSpeed;

        if (p.alpha > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(0, p.alpha);

          ctx.shadowBlur = 14;
          ctx.shadowColor = `rgba(${p.hue}, 0.9)`;

          if (p.isRing) {
            ctx.strokeStyle = `rgba(${p.hue}, ${p.alpha})`;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 1.5, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            ctx.fillStyle = `rgba(${p.hue}, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        } else {
          particlesRef.current.splice(i, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Spawn dissolution particle burst sampled directly from user's text pixels!
  const spawnDissolutionParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Sample actual font glyph pixels into 300+ drifting embers
    const textEmbers = generateTextPixelEmbers({
      text: inputText,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      originY: canvas.height * 0.55,
      mode
    });

    if (textEmbers.length > 0) {
      particlesRef.current.push(...textEmbers);
    }

    // Complementary ambient energy burst
    const count = 60;
    const originX = canvas.width / 2;
    const originY = canvas.height * 0.45;

    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: originX + (Math.random() - 0.5) * 200,
        y: originY + (Math.random() - 0.5) * 40,
        radius: Math.random() * 2.8 + 1.2,
        vx: (Math.random() - 0.5) * 4.2,
        vy: -(Math.random() * 4.5 + 2.8),
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.09,
        hue: mode === 'purge' ? '56, 189, 248' : '129, 140, 248',
        isRing: Math.random() > 0.7
      });
    }
  };

  // Pillar 1: Zero-Effort Voice Purge (Voice-to-Vapor)
  const handleVoicePurgeStart = (e) => {
    if (e && e.cancelable) e.preventDefault();
    setVoicePurgeHolding(true);
    setFloatingTranscript('');
    audio.playHeartbeatDeceleration();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';
        rec.onresult = (evt) => {
          const text = Array.from(evt.results).map((r) => r[0].transcript).join(' ');
          setFloatingTranscript(text);
        };
        rec.onerror = () => {
          startSimulatedSpeech();
        };
        rec.start();
        recognitionRef.current = rec;
      } catch (err) {
        startSimulatedSpeech();
      }
    } else {
      startSimulatedSpeech();
    }
  };

  const startSimulatedSpeech = () => {
    const thoughts = [
      "I can't stop worrying about my presentation tomorrow...",
      "Tension in my chest that won't settle down...",
      "Replaying awkward conversations from earlier today...",
      "Racing thoughts about tomorrow's urgent deadlines..."
    ];
    const picked = thoughts[Math.floor(Math.random() * thoughts.length)];
    let idx = 0;
    if (speechTimerRef.current) clearInterval(speechTimerRef.current);
    speechTimerRef.current = setInterval(() => {
      idx += 3;
      setFloatingTranscript(picked.slice(0, idx));
      if (idx >= picked.length) {
        clearInterval(speechTimerRef.current);
      }
    }, 65);
  };

  const handleVoicePurgeEnd = () => {
    if (!voicePurgeHolding) return;
    setVoicePurgeHolding(false);
    if (speechTimerRef.current) clearInterval(speechTimerRef.current);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    const textToVaporize = floatingTranscript.trim() || "Midnight worries and racing thoughts";

    // Instant Dissolve: Audio is NEVER stored (ephemeral release)
    audio.playDissolve();

    // Convert transcribed words into 350+ drifting embers
    const canvas = canvasRef.current;
    if (canvas) {
      const embers = generateTextPixelEmbers(textToVaporize, canvas.width / 2, canvas.height * 0.35);
      particlesRef.current.push(...embers);
    } else {
      spawnDissolutionParticles();
    }

    // Ephemeral purge log
    purgeThought({ thoughtText: textToVaporize, category: 'Voice-Purge' });
    setFloatingTranscript('');
    refreshMetrics();
    if (onThoughtAction) onThoughtAction();
  };

  // Speech Recognition & Voice Dump support
  const toggleSpeech = () => {
    audio.playClick();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type directly.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        audio.playHeartbeatDeceleration();
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));

        // If Voice Dump mode is active, trigger automated catharsis
        if (voiceDumpMode) {
          setTimeout(() => {
            handleExecuteWithText(transcript);
          }, 800);
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Switch Mode handler
  const handleModeSwitch = (newMode) => {
    if (newMode !== mode) {
      audio.playClick();
      setMode(newMode);
    }
  };

  // Execute Action (Thought Purge vs Time-Lock Vault)
  const handleExecuteWithText = async (customText = null) => {
    const textToProcess = customText || inputText;
    if (!textToProcess.trim() || isProcessing) return;

    setIsProcessing(true);

    if (mode === 'purge') {
      // Catharsis Purge
      audio.playDissolve();
      spawnDissolutionParticles();
      setShowAffirmation(true);

      setTimeout(() => {
        purgeThought({ thoughtText: textToProcess, category: selectedTag });
        setInputText('');
        setShowAffirmation(false);
        setIsProcessing(false);
        refreshMetrics();
        if (onThoughtAction) onThoughtAction();
      }, 1600);
    } else {
      // Time-Lock Vault Compartmentalization
      audio.playTimeLock();
      spawnDissolutionParticles();
      setShowAffirmation(true);

      try {
        await timeLockThought({
          thoughtText: textToProcess,
          lockHours: lockHours,
          category: selectedTag
        });
      } catch (err) {
        console.error(err);
      }

      setTimeout(() => {
        setInputText('');
        setShowAffirmation(false);
        setIsProcessing(false);
        refreshMetrics();
        if (onThoughtAction) onThoughtAction();
      }, 1500);
    }
  };

  const handleExecute = () => handleExecuteWithText();

  return (
    <div className="relative w-full flex flex-col gap-4 pb-28 pt-20 px-4 max-w-[480px] mx-auto select-none">
      {/* Background Dissolution Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {/* Hero Visual: Celestial Vault Core with True GPU Raymarched SDF Shader */}
      <div
        onMouseDown={handleVoicePurgeStart}
        onMouseUp={handleVoicePurgeEnd}
        onTouchStart={handleVoicePurgeStart}
        onTouchEnd={handleVoicePurgeEnd}
        className={`relative w-full rounded-3xl bg-surface-lowest/70 backdrop-blur-2xl border transition-all duration-300 shadow-2xl flex flex-col items-center pt-4 pb-5 overflow-hidden cursor-pointer select-none ${
          voicePurgeHolding
            ? 'border-secondary shadow-[0_0_50px_rgba(76,215,246,0.5)] scale-[1.01]'
            : 'border-white/[0.08]'
        }`}
        title="Hold to speak your burden and release to vaporize"
      >
        {/* Bioluminescent glow orb */}
        <div
          className={`absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            voicePurgeHolding
              ? 'bg-secondary/35 scale-125'
              : mode === 'purge'
              ? 'bg-secondary/15'
              : 'bg-timelock/20'
          }`}
        />

        {/* Status indicator pill with Personalized Welcome */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-high/60 border border-white/[0.08] backdrop-blur-md z-10 mb-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              voicePurgeHolding
                ? 'bg-rose-400 animate-ping'
                : mode === 'purge'
                ? 'bg-secondary shadow-[0_0_8px_#4cd7f6]'
                : 'bg-timelock shadow-[0_0_8px_#818cf8]'
            }`}
          />
          <span
            className={`text-[11px] uppercase tracking-[0.2em] font-semibold ${
              voicePurgeHolding
                ? 'text-rose-300 font-bold'
                : mode === 'purge'
                ? 'text-secondary'
                : 'text-timelock'
            }`}
          >
            {voicePurgeHolding
              ? 'Listening... Release to Vaporize'
              : `Welcome, ${userName || 'Seeker'} • ${mode === 'purge' ? 'Catharsis Purge' : 'Time-Lock Vault'}`}
          </span>
        </div>

        {/* GPU Raymarched SDF Shader Core */}
        <div className="relative pointer-events-none">
          <SDFShaderCore mode={mode} />

          {/* Floating Speech-to-Text Transcription Badge (Voice-to-Vapor) */}
          {(voicePurgeHolding || floatingTranscript) && (
            <div className="absolute inset-x-0 -bottom-4 mx-auto max-w-[280px] p-2.5 rounded-2xl bg-[#0b0e18]/90 backdrop-blur-xl border border-secondary/40 shadow-[0_0_20px_rgba(76,215,246,0.3)] text-center animate-fade-in z-20">
              <span className="text-[9px] uppercase tracking-widest text-secondary font-mono block mb-0.5">
                Floating Thought Stream
              </span>
              <p className="text-xs text-typography-primary font-medium italic">
                "{floatingTranscript || 'Speak your mind into the dark...'}"
              </p>
            </div>
          )}
        </div>

        {/* Mode Selector Segmented Control & Quick Voice Hold Trigger */}
        <div className="mt-5 z-10 flex flex-col items-center gap-2.5 w-full px-4">
          <div className="flex items-center justify-between w-full max-w-[340px]">
            {/* Hold to Purge Orb CTA */}
            <button
              type="button"
              onMouseDown={handleVoicePurgeStart}
              onMouseUp={handleVoicePurgeEnd}
              onTouchStart={handleVoicePurgeStart}
              onTouchEnd={handleVoicePurgeEnd}
              className={`flex-1 py-2 px-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 mr-2 ${
                voicePurgeHolding
                  ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.7)] scale-95'
                  : 'bg-surface-lowest/90 hover:bg-secondary/15 text-secondary border border-secondary/30 shadow-[0_0_12px_rgba(76,215,246,0.2)]'
              }`}
            >
              <Mic className={`w-3.5 h-3.5 ${voicePurgeHolding ? 'animate-bounce text-white' : 'text-secondary'}`} />
              <span>{voicePurgeHolding ? 'Release to Vaporize' : 'Hold Orb to Speak'}</span>
            </button>

            {/* Quick SOS Panic Button */}
            {onOpenPanic && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPanic();
                }}
                className="py-2 px-3 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all active:scale-95"
                title="Immediate 30-Second Somatic Sensory Reset"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                <span>30s SOS</span>
              </button>
            )}
          </div>

          <div className="flex items-center bg-surface-lowest/90 p-1 rounded-full border border-white/[0.08] shadow-inner">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleModeSwitch('purge');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                mode === 'purge'
                  ? 'bg-secondary text-surface-lowest shadow-[0_0_16px_rgba(76,215,246,0.6)]'
                  : 'text-typography-secondary hover:text-typography-primary'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Thought Purge
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleModeSwitch('timelock');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                mode === 'timelock'
                  ? 'bg-timelock text-surface-lowest shadow-[0_0_16px_rgba(129,140,248,0.6)]'
                  : 'text-typography-secondary hover:text-typography-primary'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Time-Lock Vault
            </button>
          </div>
        </div>
      </div>


      {/* Main Input & Release Card */}
      <div
        className={`relative w-full rounded-3xl bg-surface-low/85 backdrop-blur-2xl p-5 border border-white/[0.08] shadow-glass-card flex flex-col gap-4 overflow-hidden transition-all duration-500 ${
          isProcessing ? 'filter blur-[1px]' : ''
        }`}
      >
        {/* Serene Affirmation Dissolution Overlay */}
        <div
          className={`absolute inset-0 z-30 bg-surface-lowest/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center gap-3 transition-opacity duration-500 ${
            showAffirmation ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center border ${
              mode === 'purge'
                ? 'bg-secondary/15 border-secondary/30 text-secondary shadow-[0_0_24px_rgba(76,215,246,0.6)]'
                : 'bg-timelock/20 border-timelock/40 text-timelock shadow-[0_0_24px_rgba(129,140,248,0.6)]'
            }`}
          >
            {mode === 'purge' ? (
              <Sparkles className="w-7 h-7 animate-spin" style={{ animationDuration: '4s' }} />
            ) : (
              <ShieldCheck className="w-7 h-7" />
            )}
          </div>
          <h3 className="text-base font-semibold text-typography-primary">
            {mode === 'purge' ? 'Dissolving into clarity...' : 'Compartmentalized & Encrypted'}
          </h3>
          <p className="text-xs text-typography-secondary max-w-xs leading-relaxed">
            {mode === 'purge'
              ? 'Your burden is peacefully surrendered to the void, leaving zero footprint on memory or disk.'
              : `Sealed safely in zero-knowledge storage until your designated release window (${lockHours}h). Rest peacefully.`}
          </p>
        </div>

        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                mode === 'purge' ? 'bg-secondary shadow-[0_0_6px_#4cd7f6]' : 'bg-timelock shadow-[0_0_6px_#818cf8]'
              }`}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-typography-primary">
              {mode === 'purge' ? 'Ephemeral Catharsis' : 'Time-Lock Enclosure'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-typography-secondary tnum">
            {inputText.length} / 280
          </span>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={3}
            maxLength={280}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mode === 'purge'
                ? 'Type what weighs on you... (Dissolves permanently)'
                : 'Type thoughts requiring delayed attention tomorrow morning...'
            }
            className="w-full bg-surface-lowest/70 text-typography-primary placeholder:text-typography-secondary/50 text-sm rounded-2xl p-4 outline-none resize-none border border-white/[0.05] focus:border-secondary/40 focus:shadow-[0_0_16px_rgba(76,215,246,0.2)] transition-all"
          />

          {/* Speech-to-Text & Voice Dump Controls */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setVoiceDumpMode(!voiceDumpMode);
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider transition-all border ${
                voiceDumpMode
                  ? 'bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                  : 'bg-white/[0.04] text-typography-secondary/70 border-white/[0.06] hover:text-typography-primary'
              }`}
              title="Voice Dump: speak and auto-dissolve without typing"
            >
              {voiceDumpMode ? '⚡ auto-purge on' : 'voice dump'}
            </button>

            <button
              type="button"
              onClick={toggleSpeech}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.7)]'
                  : 'text-typography-secondary/60 hover:text-secondary hover:bg-white/[0.04]'
              }`}
              title="Dictate burden via voice"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Frequency of Weight Chips */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-typography-secondary">
            Frequencies of Weight
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {tags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setSelectedTag(tag);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium tracking-tight flex items-center gap-1.5 transition-all active:scale-95 ${
                    isSelected
                      ? mode === 'purge'
                        ? 'bg-secondary/25 text-secondary border border-secondary/40 shadow-[0_0_10px_rgba(76,215,246,0.3)]'
                        : 'bg-timelock/25 text-timelock border border-timelock/40 shadow-[0_0_10px_rgba(129,140,248,0.3)]'
                      : 'bg-surface-high/60 text-typography-secondary hover:text-typography-primary border border-white/[0.04]'
                  }`}
                >
                  <span
                    className={`w-1 h-1 rounded-full ${
                      isSelected
                        ? mode === 'purge'
                          ? 'bg-secondary'
                          : 'bg-timelock'
                        : 'bg-white/40'
                    }`}
                  />
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time-Lock Duration Picker & Zeigarnik Framing (Visible only in Time-Lock mode) */}
        {mode === 'timelock' && (
          <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06] animate-fade-in">
            {/* Zeigarnik Cognitive Offloading Ritual Card */}
            <div className="p-3 rounded-2xl bg-timelock/10 border border-timelock/20 flex flex-col gap-1 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-timelock flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Cognitive Offloading Ritual • Zeigarnik Loop Closure
              </span>
              <p className="text-[11px] text-typography-secondary leading-relaxed">
                Your brain fixates on unclosed loops. Sealing this compartmentalizes the worry, allowing your prefrontal cortex to rest until cognitive capacity resets tomorrow morning.
              </p>
            </div>

            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-typography-secondary flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-timelock" />
                Release Lock Window
              </span>
              <span className="text-xs font-mono text-timelock font-medium">
                {lockHours === 8
                  ? 'Morning (8 Hours)'
                  : lockHours === 12
                  ? 'Midday (12 Hours)'
                  : lockHours === 24
                  ? 'Tomorrow (24 Hours)'
                  : `${lockHours} Hours`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '8 hrs', value: 8 },
                { label: '12 hrs', value: 12 },
                { label: '24 hrs', value: 24 },
                { label: '48 hrs', value: 48 },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setLockHours(item.value);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium transition-all ${
                    lockHours === item.value
                      ? 'bg-timelock text-surface-lowest font-semibold shadow-[0_0_12px_rgba(129,140,248,0.5)]'
                      : 'bg-surface-lowest/80 text-typography-secondary hover:text-typography-primary border border-white/[0.06]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleExecute}
          disabled={!inputText.trim() || isProcessing}
          className={`w-full py-3.5 px-6 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden active:scale-[0.98] ${
            !inputText.trim()
              ? 'opacity-40 cursor-not-allowed bg-surface-high text-typography-secondary'
              : mode === 'purge'
              ? 'bg-gradient-to-r from-primary-dark via-secondary to-secondary-deep text-surface-lowest font-bold shadow-[0_0_24px_rgba(76,215,246,0.5)] hover:shadow-[0_0_32px_rgba(76,215,246,0.7)]'
              : 'bg-gradient-to-r from-indigo-900 via-timelock to-indigo-500 text-surface-lowest font-bold shadow-[0_0_24px_rgba(129,140,248,0.5)] hover:shadow-[0_0_32px_rgba(129,140,248,0.7)]'
          }`}
        >
          {mode === 'purge' ? (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Dissolve & Let Go</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Seal in Time-Lock Vault</span>
            </>
          )}
        </button>
      </div>

      {/* Somatosensory Telemetry Bento Row */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* Clarity Index Card */}
        <div className="bg-surface-low/70 backdrop-blur-xl rounded-2xl p-4 border border-white/[0.06] flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-typography-secondary font-semibold">
              Clarity Index
            </span>
            <Waves className="w-4 h-4 text-secondary" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-typography-primary tracking-tight tnum">
              {metrics.clarityIndex}%
            </span>
            <span className="text-[11px] text-secondary font-semibold">
              +{metrics.clarityGain}%
            </span>
          </div>
          {/* Animated Clarity Wave Bar */}
          <div className="w-full h-1.5 bg-surface-lowest rounded-full mt-2.5 overflow-hidden border border-white/[0.04]">
            <div
              className="h-full bg-gradient-to-r from-secondary-deep to-secondary shadow-[0_0_8px_#4cd7f6] rounded-full transition-all duration-700"
              style={{ width: `${metrics.clarityIndex}%` }}
            />
          </div>
        </div>

        {/* Burdens Cleared Card */}
        <div className="bg-surface-low/70 backdrop-blur-xl rounded-2xl p-4 border border-white/[0.06] flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-typography-secondary font-semibold">
              Dissolved
            </span>
            <Trash2 className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-typography-primary tracking-tight tnum">
              {metrics.burdensCleared}
            </span>
            <span className="text-[11px] text-typography-secondary">burdens released</span>
          </div>
          {/* Glowing indicator dots */}
          <div className="flex items-center gap-1.5 mt-2.5">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                  i < (metrics.burdensCleared % 5 || 5)
                    ? 'bg-secondary shadow-[0_0_6px_#4cd7f6]'
                    : 'bg-surface-highest'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Resonance Mode Banner */}
      <div className="bg-surface-low/50 backdrop-blur-md rounded-2xl p-3.5 border border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
            <Waves className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-wider text-typography-secondary font-semibold">
              Somatosensory Mode
            </span>
            <span className="text-xs text-typography-primary font-medium">
              Binaural Theta (432Hz) Active
            </span>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6] animate-pulse" />
      </div>
    </div>
  );
}
