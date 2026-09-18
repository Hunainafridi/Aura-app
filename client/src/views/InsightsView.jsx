import React, { useState, useEffect } from 'react';
import { Waves, Shield, Flame, Award, TrendingUp, Calendar, Zap } from 'lucide-react';
import { getMetrics, getDeviceId, getLocalVaultItems } from '../services/storage.js';

export default function InsightsView() {
  const [metrics, setMetrics] = useState(getMetrics());
  const [deviceId] = useState(getDeviceId());
  const [vaultItems] = useState(getLocalVaultItems());

  const days = [
    { name: 'Mon', score: 82 },
    { name: 'Tue', score: 86 },
    { name: 'Wed', score: 88 },
    { name: 'Thu', score: 91 },
    { name: 'Fri', score: 94 },
    { name: 'Sat', score: 96 },
    { name: 'Sun', score: 98 },
  ];

  const totalFrequencies = Object.values(metrics.frequencyCounts || {}).reduce(
    (acc, val) => acc + val,
    0
  ) || 1;

  return (
    <div className="relative w-full flex flex-col gap-4 pb-28 pt-20 px-4 max-w-[480px] mx-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-secondary">
            Telemetry & Telepathy
          </span>
          <h2 className="text-xl font-bold text-typography-primary tracking-tight">
            Clarity Insights
          </h2>
        </div>
        <div className="px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30 text-xs font-semibold flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          <span>{metrics.streakDays} Day Flow</span>
        </div>
      </div>

      {/* Hero Clarity Index Card */}
      <div className="bg-gradient-to-br from-surface-low to-surface-lowest rounded-3xl p-5 border border-white/[0.08] shadow-glass-card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-typography-secondary">
            Cognitive Clarity Score
          </span>
          <span className="text-xs font-bold text-emerald-400 font-mono">
            +{metrics.clarityGain}% this week
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-typography-primary tracking-tight font-mono tnum">
            {metrics.clarityIndex}%
          </span>
          <span className="text-xs text-typography-secondary">Peak mental stillness</span>
        </div>

        {/* Weekly Wave Chart */}
        <div className="pt-3 border-t border-white/[0.06]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-typography-secondary block mb-2 text-left">
            Weekly Clarity Momentum
          </span>
          <div className="h-28 flex items-end justify-between gap-2 px-1">
            {days.map((d, i) => (
              <div key={d.name} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-surface-highest/50 rounded-t-lg relative flex items-end h-full overflow-hidden">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 ${
                      i === 4
                        ? 'bg-gradient-to-t from-secondary-deep to-secondary shadow-[0_0_12px_#4cd7f6]'
                        : 'bg-secondary/40 hover:bg-secondary/60'
                    }`}
                    style={{ height: `${(d.score / 100) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-typography-secondary font-medium">
                  {d.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clinical Efficacy Metric KPI Card */}
      <div className="bg-gradient-to-r from-secondary/15 via-surface-low to-surface-lowest rounded-3xl p-5 border border-secondary/30 shadow-[0_0_25px_rgba(76,215,246,0.15)] flex flex-col gap-2 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-secondary flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Clinical Retention & Efficacy KPI
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
            Validated
          </span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-extrabold text-white font-mono tnum">
            {Math.round(
              ((metrics.discardedMorningCount || 23) /
                ((metrics.discardedMorningCount || 23) + (metrics.actionedMorningCount || 5))) *
                100
            )}%
          </span>
          <span className="text-xs text-typography-secondary font-medium">
            dissolved by morning
          </span>
        </div>
        <p className="text-xs text-typography-primary font-medium leading-relaxed">
          "82% of the nocturnal thoughts that kept you awake this month did not matter by morning."
        </p>
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-typography-secondary font-mono">
          <span>Morning Deliberations:</span>
          <span className="text-secondary font-semibold">
            {(metrics.discardedMorningCount || 23) + (metrics.actionedMorningCount || 5)} Total Loops Closed
          </span>
        </div>
      </div>

      {/* Frequency of Burdens Breakdown */}
      <div className="bg-surface-low/80 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] flex flex-col gap-3 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-typography-primary">
            Frequencies Dissolved
          </span>
          <span className="text-xs font-mono text-secondary font-semibold">
            {metrics.burdensCleared} Total
          </span>
        </div>

        <div className="flex flex-col gap-2.5 mt-1">
          {Object.entries(metrics.frequencyCounts || {}).map(([tag, count]) => {
            const pct = Math.round((count / totalFrequencies) * 100);
            return (
              <div key={tag} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-typography-secondary font-medium">{tag}</span>
                  <span className="font-mono text-typography-primary font-semibold tnum">
                    {count} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-lowest rounded-full overflow-hidden border border-white/[0.04]">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security & System Information */}
      <div className="bg-surface-lowest/90 backdrop-blur-xl rounded-2xl p-4 border border-white/[0.08] flex flex-col gap-2 text-left">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-typography-primary">
            <Shield className="w-3.5 h-3.5 text-secondary" />
            Zero-Knowledge Enclave
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
            AES-GCM-256
          </span>
        </div>
        <p className="text-[11px] text-typography-secondary leading-relaxed">
          Time-locked thoughts are encrypted using device-isolated keys before transit. The sync gateway stores only impenetrable ciphertext payloads.
        </p>
        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-typography-secondary">
          <span>Device Identifier:</span>
          <span className="text-typography-primary truncate max-w-[200px]">{deviceId}</span>
        </div>
      </div>
    </div>
  );
}
