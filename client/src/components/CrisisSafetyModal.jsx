import React from 'react';
import { Phone, ShieldAlert, Heart, ExternalLink, X } from 'lucide-react';
import { audio } from '../services/audio.js';

export default function CrisisSafetyModal({ onClose }) {
  const hotlines = [
    { country: 'United States & Canada', number: '988', desc: 'Suicide & Crisis Lifeline (24/7 Call or Text)', tel: '988' },
    { country: 'Crisis Text Line', number: '741741', desc: 'Text HOME to 741741 for free 24/7 crisis support', tel: 'sms:741741' },
    { country: 'United Kingdom', number: '111', desc: 'NHS Mental Health Services (or Samaritans 116 123)', tel: '111' },
    { country: 'Australia', number: '13 11 14', desc: 'Lifeline Crisis Support & Suicide Prevention', tel: '131114' },
    { country: 'European Union & Global', number: '112', desc: 'Emergency response or visit Befrienders Worldwide', tel: '112' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-[#11131d] border border-rose-500/30 rounded-3xl p-5 max-w-[400px] w-full shadow-2xl flex flex-col gap-3.5 text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-sm font-bold tracking-wide uppercase">
              Emergency Crisis Directory
            </h2>
          </div>
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-typography-secondary flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Regulatory HealthKit Disclaimer */}
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-200 leading-relaxed">
          <span className="font-bold block mb-0.5">Clinical Disclaimer:</span>
          Aura is an educational mindfulness tool designed for emotional offloading. It is not a diagnostic device or psychiatric crisis intervention system. If you are experiencing thoughts of self-harm or acute distress, please reach out to the professional resources below immediately.
        </div>

        {/* Hotlines Directory */}
        <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto custom-scrollbar">
          {hotlines.map((h) => (
            <a
              key={h.country}
              href={`tel:${h.tel}`}
              className="p-3 rounded-xl bg-surface-lowest hover:bg-surface-high border border-white/[0.06] hover:border-rose-500/40 transition-all flex items-center justify-between group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-typography-primary group-hover:text-rose-300 transition-colors">
                  {h.country}
                </span>
                <span className="text-[10px] text-typography-secondary">
                  {h.desc}
                </span>
              </div>
              <div className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold text-xs flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{h.number}</span>
              </div>
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            audio.playClick();
            onClose();
          }}
          className="w-full py-2.5 rounded-full bg-surface-high hover:bg-surface-highest text-typography-primary text-xs font-semibold"
        >
          Return to Sanctuary
        </button>
      </div>
    </div>
  );
}
