import React, { useState, useEffect, useRef } from 'react';
import { Wind, Play, Pause, RotateCcw, Sparkles, Heart } from 'lucide-react';
import { audio } from '../services/audio.js';

export default function BreathwaveView() {
  const [isActive, setIsActive] = useState(false);
  const [pattern, setPattern] = useState('box'); // 'box' (4-4-4-4) or 'relax' (4-7-8)
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const timerRef = useRef(null);

  const patterns = {
    box: [
      { name: 'Inhale', duration: 4, label: 'Fill with tranquil sapphire light' },
      { name: 'Hold', duration: 4, label: 'Sustain the stillness within' },
      { name: 'Exhale', duration: 4, label: 'Dissolve tension into the void' },
      { name: 'Hold', duration: 4, label: 'Embrace clear emptiness' },
    ],
    relax: [
      { name: 'Inhale', duration: 4, label: 'Draw calm into your center' },
      { name: 'Hold', duration: 7, label: 'Allow tranquility to settle' },
      { name: 'Exhale', duration: 8, label: 'Release completely through soft lips' },
    ],
  };

  const currentPhases = patterns[pattern];
  const currentPhase = currentPhases[phaseIndex];

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      audio.restoreAudio(0.8);
      return;
    }

    audio.playBreathCue(currentPhase.name.toLowerCase());

    // Auto-duck audio during deep somatic breath expansions
    if (currentPhase.name === 'Inhale' || currentPhase.name === 'Exhale') {
      audio.duckAudio(0.02, 1.2);
    } else {
      audio.restoreAudio(1.0);
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          const nextIndex = (phaseIndex + 1) % currentPhases.length;
          if (nextIndex === 0) {
            setCyclesCompleted((c) => c + 1);
          }
          setPhaseIndex(nextIndex);
          return currentPhases[nextIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phaseIndex, pattern]);

  const toggleSession = () => {
    audio.playClick();
    if (!isActive) {
      setPhaseIndex(0);
      setSecondsLeft(currentPhases[0].duration);
    }
    setIsActive(!isActive);
  };

  const resetSession = () => {
    audio.playClick();
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsLeft(currentPhases[0].duration);
    setCyclesCompleted(0);
  };

  const handlePatternChange = (newPattern) => {
    if (newPattern === pattern) return;
    audio.playClick();
    setIsActive(false);
    setPattern(newPattern);
    setPhaseIndex(0);
    setSecondsLeft(patterns[newPattern][0].duration);
  };

  // Determine expansion scale based on phase
  const getScaleClass = () => {
    if (!isActive) return 'scale-100';
    if (currentPhase.name === 'Inhale') return 'scale-125 transition-transform duration-[4000ms] ease-out';
    if (currentPhase.name === 'Hold') return 'scale-125';
    if (currentPhase.name === 'Exhale') return 'scale-90 transition-transform duration-[4000ms] ease-in';
    return 'scale-90';
  };

  return (
    <div className="relative w-full flex flex-col items-center gap-5 pb-28 pt-20 px-4 max-w-[480px] mx-auto select-none">
      {/* Header */}
      <div className="text-center">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-secondary">
          Somatic Equilibrium
        </span>
        <h2 className="text-xl font-bold text-typography-primary tracking-tight">
          Breathwave Sanctuary
        </h2>
      </div>

      {/* Pattern Selector */}
      <div className="flex items-center bg-surface-lowest/90 p-1 rounded-full border border-white/[0.08] shadow-inner">
        <button
          type="button"
          onClick={() => handlePatternChange('box')}
          className={`px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${
            pattern === 'box'
              ? 'bg-secondary text-surface-lowest shadow-[0_0_12px_rgba(76,215,246,0.6)]'
              : 'text-typography-secondary hover:text-typography-primary'
          }`}
        >
          Box Breathing (4-4-4-4)
        </button>
        <button
          type="button"
          onClick={() => handlePatternChange('relax')}
          className={`px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${
            pattern === 'relax'
              ? 'bg-secondary text-surface-lowest shadow-[0_0_12px_rgba(76,215,246,0.6)]'
              : 'text-typography-secondary hover:text-typography-primary'
          }`}
        >
          4-7-8 Deep Rest
        </button>
      </div>

      {/* Central Breathing Orb / Halo */}
      <div className="relative w-64 h-64 flex items-center justify-center my-4">
        {/* Ambient atmospheric backglow */}
        <div className="absolute inset-0 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

        {/* Concentric Aura Rings with continuous expansion */}
        <div
          className={`absolute inset-4 rounded-full border-2 border-secondary/20 transition-all ${getScaleClass()}`}
        />
        <div
          className={`absolute inset-10 rounded-full border border-secondary/40 transition-all ${getScaleClass()}`}
        />
        <div
          className={`absolute inset-16 rounded-full bg-gradient-to-tr from-secondary/20 via-primary/10 to-transparent backdrop-blur-xl border border-secondary/50 shadow-[0_0_35px_rgba(76,215,246,0.4)] flex flex-col items-center justify-center transition-all ${getScaleClass()}`}
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-secondary">
            {isActive ? currentPhase.name : 'Ready'}
          </span>
          <span className="text-4xl font-bold text-typography-primary font-mono tnum my-1">
            {isActive ? secondsLeft : '4'}s
          </span>
          <span className="text-[10px] text-typography-secondary/80 font-medium">
            {pattern === 'box' ? 'Box Cycle' : 'Rest Cycle'}
          </span>
        </div>
      </div>

      {/* Prompt Label */}
      <p className="text-xs text-typography-secondary italic max-w-xs text-center min-h-[32px] leading-relaxed">
        {isActive ? currentPhase.label : 'Tap start to synchronize your nervous system into restorative Theta flow.'}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={resetSession}
          className="w-10 h-10 rounded-full bg-surface-high/60 border border-white/[0.08] flex items-center justify-center text-typography-secondary hover:text-white transition-all active:scale-95"
          title="Reset breath cadence"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggleSession}
          className="py-3 px-8 rounded-full bg-gradient-to-r from-primary-dark via-secondary to-secondary-deep text-surface-lowest font-bold text-sm tracking-wide shadow-[0_0_24px_rgba(76,215,246,0.5)] flex items-center gap-2 hover:shadow-[0_0_32px_rgba(76,215,246,0.8)] active:scale-95 transition-all"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Breath</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Begin Cadence</span>
            </>
          )}
        </button>
      </div>

      {/* Somatic Metrics Row */}
      <div className="grid grid-cols-2 gap-3 w-full mt-2">
        <div className="bg-surface-low/70 backdrop-blur-xl rounded-2xl p-3.5 border border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold text-typography-secondary">
              Cycles Done
            </span>
            <span className="text-lg font-bold text-typography-primary font-mono tnum">
              {cyclesCompleted}
            </span>
          </div>
        </div>

        <div className="bg-surface-low/70 backdrop-blur-xl rounded-2xl p-3.5 border border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-400">
            <Heart className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold text-typography-secondary">
              Heart Rate Rhythm
            </span>
            <span className="text-lg font-bold text-typography-primary font-mono tnum">
              Vagal Coherence
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
