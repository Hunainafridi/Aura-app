import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, X, Heart, Wind, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audio } from '../services/audio.js';

export default function PanicResetModal({ onClose }) {
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [phase, setPhase] = useState('Inhale'); // Inhale (4s), Hold (4s), Exhale (4s), Hold (4s)
  const [phaseTime, setPhaseTime] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const cycleCountRef = useRef(0);

  // Play soothing theta sound on mount
  useEffect(() => {
    audio.playWaterDrop();
    audio.duckAudio();

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          audio.playDissolve();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      audio.unduckAudio();
    };
  }, []);

  // 4-4-4-4 Box Breathing Cycle Engine
  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const cyclePhase = (secondsRemaining) % 16;
    if (cyclePhase > 12) {
      setPhase('Inhale');
      setPhaseTime(cyclePhase - 12);
    } else if (cyclePhase > 8) {
      setPhase('Hold');
      setPhaseTime(cyclePhase - 8);
    } else if (cyclePhase > 4) {
      setPhase('Exhale');
      setPhaseTime(cyclePhase - 4);
    } else {
      setPhase('Rest');
      setPhaseTime(cyclePhase);
    }
  }, [secondsRemaining]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (soundEnabled) {
      audio.stopSoundscape();
    } else {
      audio.playSoundscape('theta');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050609]/95 backdrop-blur-3xl flex flex-col items-center justify-between p-6 select-none animate-fade-in text-center">
      {/* Top Header Controls */}
      <div className="w-full max-w-[420px] flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
          <span className="uppercase tracking-wider">30s Sensory Reset</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-typography-secondary flex items-center justify-center transition-all"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-typography-secondary flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Dynamic Breathing Sphere Engine */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Concentric Glow Ripples */}
        <div
          className={`absolute rounded-full border border-secondary/20 transition-all duration-1000 ease-in-out pointer-events-none ${
            phase === 'Inhale'
              ? 'w-72 h-72 scale-125 bg-secondary/10 shadow-[0_0_80px_rgba(76,215,246,0.3)]'
              : phase === 'Hold'
              ? 'w-72 h-72 scale-120 bg-indigo-500/15 shadow-[0_0_60px_rgba(129,140,248,0.35)]'
              : 'w-48 h-48 scale-90 bg-rose-500/5 shadow-[0_0_40px_rgba(244,63,94,0.15)]'
          }`}
        />

        <div
          className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ease-in-out border border-white/20 shadow-2xl ${
            phase === 'Inhale'
              ? 'scale-110 bg-gradient-to-tr from-secondary-deep/40 via-secondary/30 to-primary-light/40 border-secondary'
              : phase === 'Hold'
              ? 'scale-105 bg-gradient-to-tr from-indigo-900/50 via-primary/30 to-secondary/30 border-indigo-400'
              : 'scale-90 bg-gradient-to-tr from-[#0a0c16] via-[#101428] to-[#151936] border-white/15'
          }`}
        >
          <Wind className={`w-8 h-8 mb-2 transition-transform duration-700 ${phase === 'Inhale' ? 'scale-125 text-secondary' : 'text-typography-secondary'}`} />
          <span className="text-xl font-bold text-white tracking-widest uppercase">
            {phase}
          </span>
          <span className="text-3xl font-extrabold font-mono text-secondary mt-1">
            {secondsRemaining}s
          </span>
        </div>

        {/* Dynamic Vagus Nerve Activation Directive */}
        <div className="mt-8 flex flex-col items-center gap-1.5 max-w-[280px]">
          <p className="text-xs text-typography-primary font-medium tracking-wide">
            {phase === 'Inhale' && 'Slowly draw air through your nose...'}
            {phase === 'Hold' && 'Gently hold. Soften your shoulders.'}
            {phase === 'Exhale' && 'Release through your lips like blowing out embers.'}
            {phase === 'Rest' && 'Feel your heart rate decelerating...'}
          </p>
          <span className="text-[10px] text-typography-secondary/70 uppercase tracking-widest font-mono">
            Vagus Nerve Reset • Somatic Grounding
          </span>
        </div>
      </div>

      {/* Bottom Completion / Exit Action */}
      <div className="w-full max-w-[340px] pb-4">
        {secondsRemaining === 0 ? (
          <button
            type="button"
            onClick={() => {
              audio.playWaterDrop();
              onClose();
            }}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-secondary-deep via-secondary to-primary-light text-surface-lowest font-bold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(76,215,246,0.6)] animate-pulse"
          >
            Sanctuary Restored • Return
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-typography-secondary text-xs font-semibold tracking-wider uppercase transition-all"
          >
            Dismiss Early
          </button>
        )}
      </div>
    </div>
  );
}
