import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { audio } from '../services/audio.js';

export default function OnboardingModal({ onComplete }) {
  const [name, setName] = useState('');
  const [gdprConsent, setGdprConsent] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    audio.playWaterDrop();
    const cleanName = name.trim();
    localStorage.setItem('aura_user_name', cleanName);
    localStorage.setItem('aura_gdpr_consent_v1', 'true');
    onComplete(cleanName);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-[#11131c] border border-secondary/30 rounded-3xl p-6 max-w-[390px] w-full shadow-2xl flex flex-col gap-4 text-left">
        {/* Header Glyph */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-secondary/20 to-primary/20 border border-secondary/40 flex items-center justify-center text-secondary shadow-[0_0_16px_rgba(76,215,246,0.3)]">
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
              Sanctuary Initiation
            </span>
            <h2 className="text-base font-bold text-typography-primary tracking-tight">
              Welcome to Aura
            </h2>
          </div>
        </div>

        <p className="text-xs text-typography-secondary leading-relaxed">
          Aura is an offline-first sanctuary designed to dissolve nocturnal anxiety loops and compartmentalize unclosed mental loops.
        </p>

        {/* User Name Input */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-typography-primary uppercase tracking-wider">
              What should we call you?
            </label>
            <input
              type="text"
              maxLength={24}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name or moniker..."
              className="w-full bg-surface-lowest/80 text-typography-primary placeholder:text-typography-secondary/40 text-sm rounded-xl px-4 py-3 outline-none border border-white/[0.08] focus:border-secondary/40 focus:shadow-[0_0_12px_rgba(76,215,246,0.25)] transition-all font-medium"
              autoFocus
            />
          </div>

          {/* GDPR Article 9 Special Category Consent */}
          <div className="p-3 rounded-xl bg-surface-lowest/70 border border-white/[0.06] flex items-start gap-2.5">
            <input
              type="checkbox"
              id="consent-check"
              checked={gdprConsent}
              onChange={(e) => setGdprConsent(e.target.checked)}
              className="mt-0.5 rounded border-white/20 text-secondary focus:ring-secondary/40 cursor-pointer"
            />
            <label htmlFor="consent-check" className="text-[10px] text-typography-secondary leading-normal cursor-pointer">
              <span className="font-semibold text-typography-primary block">
                GDPR Article 9 Special Category Health Data Consent:
              </span>
              I acknowledge that my emotional offloading records are stored in a zero-knowledge hardware enclave with no remote plaintext access.
            </label>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !gdprConsent}
            className={`w-full py-3 px-6 rounded-full font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
              name.trim() && gdprConsent
                ? 'bg-gradient-to-r from-primary-dark via-secondary to-secondary-deep text-surface-lowest shadow-[0_0_20px_rgba(76,215,246,0.5)] active:scale-95'
                : 'bg-surface-high text-typography-secondary/50 cursor-not-allowed'
            }`}
          >
            <span>Enter Your Sanctuary</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
