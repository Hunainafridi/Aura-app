import React, { useState, useEffect } from 'react';
import { Sparkles, Wifi, WifiOff, User, ShieldCheck } from 'lucide-react';
import { audio } from '../services/audio.js';

export default function Header({ currentTab, backendOnline, userName, onOpenSettings, onOpenPanic, isAirGapped }) {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const tabLabels = {
    vault: 'Thought Vault',
    journal: 'Clarity Archive',
    breathwave: 'Sanctuary',
    insights: 'Cognitive Flow'
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-surface-dim/85 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_16px_rgba(0,0,0,0.4)]">
      <div className="max-w-[480px] mx-auto w-full">
        {/* Top Status Info Row */}
        <div className="h-6 px-5 flex items-center justify-between text-xs text-typography-secondary select-none pt-1">
          <span className="font-semibold text-typography-primary tracking-tight tnum">{time}</span>
          <div className="flex items-center gap-2">
            {isAirGapped ? (
              <span className="flex items-center gap-1 text-[11px] text-cyan-400 font-mono">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                air-gap-guarantee
              </span>
            ) : backendOnline ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                cloud-sync
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                local-wal
              </span>
            )}
            <Wifi className={`w-3.5 h-3.5 ${isAirGapped ? 'text-cyan-400/50 line-through' : 'text-typography-secondary'}`} />
          </div>
        </div>

        {/* Main Brand & Personalized User Welcome Bar */}
        <div className="h-14 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-lg uppercase tracking-[0.25em] text-white drop-shadow-[0_0_12px_rgba(173,198,255,0.4)]">
              AURA
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-high/60 border border-white/[0.08] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6] animate-pulse" />
              <span className="text-[11px] text-secondary font-medium tracking-wide">
                Welcome, {userName || 'Seeker'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* SOS 30-Second Panic Button */}
            {onOpenPanic && (
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  onOpenPanic();
                }}
                className="px-2.5 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(244,63,94,0.3)] transition-all active:scale-95 animate-pulse"
                title="SOS 30-Second Sensory Panic Reset"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                <span>SOS 30s</span>
              </button>
            )}

            {/* Interactive User Avatar & Settings Trigger */}
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                if (onOpenSettings) onOpenSettings();
              }}
              className="w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_14px_rgba(173,198,255,0.3)] transition-all active:scale-95 group"
              title="Open Sanctuary Settings & Governance"
            >
              <User className="w-4 h-4 text-primary-light group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
