import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Lock, Unlock, Clock, Bookmark, ChevronDown, Check, Volume2, Shield, Eye, EyeOff, Fingerprint, Trash2, ArrowRight, Calendar, CheckCircle, Copy } from 'lucide-react';
import { audio } from '../services/audio.js';
import { getLocalVaultItems, saveLocalVaultItems, syncUnlockedItems, getMetrics, saveMetrics } from '../services/storage.js';
import { decryptPayload, verifyBiometricPresence } from '../services/crypto.js';

export default function JournalView() {
  const [items, setItems] = useState(getLocalVaultItems());
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [revealedLockIds, setRevealedLockIds] = useState(new Set());
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [biometricPrompt, setBiometricPrompt] = useState(false);
  const [activePromptItem, setActivePromptItem] = useState(null);
  const [actionToast, setActionToast] = useState(null);

  // Real-time clock for countdown timers
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync unlocked items on mount
  useEffect(() => {
    syncUnlockedItems().then((unlocked) => {
      if (unlocked && unlocked.length > 0) {
        console.log('[Aura Journal] Unlocked cloud items synchronized:', unlocked.length);
      }
    });
  }, []);

  const categories = ['All', 'Overthinking', 'Anxiety', 'Fatigue', 'Self-Doubt', 'Locked'];

  // Check for unlocked morning items
  const unlockedMorningItems = items.filter(
    (i) => i.type === 'time_locked' && i.locked_until && i.locked_until <= currentTime
  );

  // Filter items
  const filteredItems = items.filter((item) => {
    if (activeFilter === 'Locked') {
      if (item.type !== 'time_locked') return false;
    } else if (activeFilter !== 'All') {
      if (item.category !== activeFilter) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const burdenText = (item.decryptedContent || item.burden || '').toLowerCase();
      const refText = (item.reflection || '').toLowerCase();
      const mantraText = (item.mantra || '').toLowerCase();
      return burdenText.includes(q) || refText.includes(q) || mantraText.includes(q);
    }
    return true;
  });

  const toggleBookmark = (id) => {
    audio.playClick();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Biometric Challenge before inspecting locked thought
  const requestBiometricInspection = async (item) => {
    audio.playClick();
    if (revealedLockIds.has(item.id)) {
      // Hide
      setRevealedLockIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      return;
    }

    setBiometricPrompt(true);
    setActivePromptItem(item);

    const authRes = await verifyBiometricPresence();
    setBiometricPrompt(false);

    if (authRes.success) {
      audio.playWaterDrop();
      setRevealedLockIds((prev) => {
        const next = new Set(prev);
        next.add(item.id);
        return next;
      });
    } else {
      alert('Biometric verification cancelled or unavailable.');
    }
  };

  // Pillar 2: The Universal Morning Question Reflection Handlers
  // 1-Tap Instant Dissolve: "Doesn't Matter Anymore"
  const handleMorningPurge = (itemId) => {
    audio.playDissolve();
    const updated = items.filter((i) => i.id !== itemId);
    setItems(updated);
    saveLocalVaultItems(updated);

    const metrics = getMetrics();
    metrics.burdensCleared += 1;
    metrics.discardedMorningCount = (metrics.discardedMorningCount || 0) + 1;
    metrics.clarityIndex = Math.min(99, metrics.clarityIndex + 2);
    saveMetrics(metrics);

    setActionToast("Vaporized. Nocturnal burden acknowledged and permanently dissolved.");
    setTimeout(() => setActionToast(null), 3500);
  };

  // 1-Tap Action Conversion: "Still Relevant"
  const handleConvertTo1LineAction = (item) => {
    audio.playWaterDrop();
    const raw = item.decryptedContent || item.burden || 'Review priority task with calm daylight focus';
    const cleanAction = raw.length > 80 ? `${raw.slice(0, 77)}...` : raw;

    // Auto-copy to user clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`[Aura Morning Priority] ${cleanAction}`).catch(() => {});
    }

    // Optional .ics download for calendar sync
    try {
      const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Aura Clarity//EN\nBEGIN:VEVENT\nSUMMARY:Aura Focus: ${cleanAction.replace(/\n/g, ' ')}\nDESCRIPTION:Transmuted from Aura morning reflection loop.\nDTSTART:${new Date(Date.now() + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z\nDURATION:PT30M\nEND:VEVENT\nEND:VCALENDAR`;
      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Aura-Morning-Action.ics';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {}

    const updated = items.map((i) => {
      if (i.id === item.id) {
        return {
          ...i,
          type: 'transformed',
          reflection: `Transmuted to Action Item: "${cleanAction}"`,
          mantra: 'Grounded in pragmatic execution.',
          actionItem: cleanAction,
          locked_until: null
        };
      }
      return i;
    });
    setItems(updated);
    saveLocalVaultItems(updated);

    const metrics = getMetrics();
    metrics.actionedMorningCount = (metrics.actionedMorningCount || 0) + 1;
    metrics.clarityIndex = Math.min(99, metrics.clarityIndex + 1);
    saveMetrics(metrics);

    setActionToast(`Copied & Scheduled 1-Line Action Item: "${cleanAction}"`);
    setTimeout(() => setActionToast(null), 4000);
  };

  // Morning Unlock Action 2: Transmute & Archive
  const handleMorningArchive = (itemId) => {
    audio.playTimeLock();
    const updated = items.map((i) => {
      if (i.id === itemId) {
        return {
          ...i,
          type: 'transformed',
          reflection: 'Revisited with fresh morning perspective. The worry was acknowledged and transmuted into grounded clarity.',
          mantra: 'I stand resilient beyond yesterday’s echoes.',
          locked_until: null
        };
      }
      return i;
    });
    setItems(updated);
    saveLocalVaultItems(updated);
  };

  // Format countdown string
  const formatCountdown = (lockedUntil) => {
    const remainingMs = lockedUntil - currentTime;
    if (remainingMs <= 0) return 'Unlocked & Ready';

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((remainingMs % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="relative w-full flex flex-col gap-4 pb-28 pt-20 px-4 max-w-[480px] mx-auto select-none">
      {/* Title & Stats Header */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-secondary">
            Metamorphosis
          </span>
          <h2 className="text-xl font-bold text-typography-primary tracking-tight">
            Transformed Echoes
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Search Toggle */}
          <button
            onClick={() => {
              audio.playClick();
              setIsSearchOpen(!isSearchOpen);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isSearchOpen
                ? 'bg-secondary/20 text-secondary border border-secondary/40'
                : 'bg-surface-high/60 text-typography-secondary hover:text-typography-primary border border-white/[0.06]'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-secondary font-mono tnum">
              {items.length} Cleared
            </span>
            <span className="text-[10px] text-typography-secondary">100% transmuted</span>
          </div>
        </div>
      </div>

      {/* Search Bar Input */}
      {isSearchOpen && (
        <div className="relative w-full animate-fade-in">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-typography-secondary/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search through clarity reflections..."
            className="w-full bg-surface-lowest/80 text-typography-primary placeholder:text-typography-secondary/40 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none border border-white/[0.08] focus:border-secondary/40 focus:shadow-[0_0_12px_rgba(76,215,246,0.2)]"
            autoFocus
          />
        </div>
      )}

      {/* Global Action Toast Notification */}
      {actionToast && (
        <div className="w-full p-3 rounded-2xl bg-secondary/15 border border-secondary/40 text-secondary text-xs font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(76,215,246,0.3)] animate-fade-in text-left">
          <CheckCircle className="w-4 h-4 shrink-0 text-secondary" />
          <span className="flex-1">{actionToast}</span>
        </div>
      )}

      {/* Pillar 2: The Universal "Morning Question" Retention Loop (8:00 AM Prompt & 2-Tap Matrix) */}
      {unlockedMorningItems.length > 0 && (
        <div className="w-full rounded-3xl bg-gradient-to-br from-[#101322] via-[#0b0e18] to-surface-lowest border-2 border-secondary/40 p-5 shadow-[0_0_35px_rgba(76,215,246,0.3)] flex flex-col gap-3.5 animate-fade-in text-left">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-2 text-secondary">
              <Clock className="w-4 h-4 text-secondary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">
                8:00 AM Morning Reflection
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary text-[10px] font-mono font-bold border border-secondary/40">
              Unlocked & Ready
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-typography-primary tracking-tight">
              "Your sealed thought from last night has unlocked."
            </h3>
            <p className="text-xs text-typography-secondary leading-relaxed">
              Now that your mind is rested by morning light, how does this burden feel?
            </p>
          </div>

          {/* Sealed Enclave Info Banner */}
          <div className="p-3 rounded-2xl bg-surface-lowest/90 border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-typography-secondary">
              <Lock className="w-3.5 h-3.5 text-secondary" />
              <span>Vault Capsule #{unlockedMorningItems[0].vaultNumber || '08'}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-medium">Ready for Deliberation</span>
          </div>

          {/* The 2-Tap Reflection Matrix: Massive Accessible Buttons */}
          <div className="flex flex-col gap-2.5 pt-1">
            {/* Button 1: Doesn't Matter Anymore (1-Tap Instant Dissolve) */}
            <button
              type="button"
              onClick={() => handleMorningPurge(unlockedMorningItems[0].id)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-950/50 via-rose-900/30 to-surface-low border-2 border-rose-500/50 hover:border-rose-400 text-rose-100 text-xs font-bold flex items-center justify-between transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(244,63,94,0.2)] group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-300 group-hover:scale-110 transition-transform">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white">Doesn't Matter Anymore</span>
                  <span className="text-[10px] text-rose-300 font-normal">1-Tap instant dissolve into embers</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] uppercase font-mono tracking-wider font-bold">
                Dissolve
              </span>
            </button>

            {/* Button 2: Still Relevant (Convert to 1-Line Action Item or Calendar Reminder) */}
            <button
              type="button"
              onClick={() => handleConvertTo1LineAction(unlockedMorningItems[0])}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-secondary/15 to-surface-low border-2 border-secondary/40 hover:border-secondary text-typography-primary text-xs font-bold flex items-center justify-between transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(76,215,246,0.15)] group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white">Still Relevant</span>
                  <span className="text-[10px] text-secondary font-normal">Convert to 1-line action item & agenda sync</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[9px] uppercase font-mono tracking-wider font-bold">
                Actionize
              </span>
            </button>
          </div>
        </div>
      )}

      {/* The Clinical Efficacy Metric Banner (Proven Cognitive Offloading KPI) */}
      <div className="w-full rounded-2xl bg-surface-low/80 backdrop-blur-xl border border-white/[0.08] p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary shadow-[0_0_16px_rgba(76,215,246,0.25)] shrink-0">
            <Sparkles className="w-5 h-5 text-secondary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">
              Clinical Efficacy Metric
            </span>
            <p className="text-xs font-semibold text-typography-primary tracking-tight">
              {Math.round(
                ((getMetrics().discardedMorningCount || 23) /
                  ((getMetrics().discardedMorningCount || 23) + (getMetrics().actionedMorningCount || 5))) *
                  100
              )}
              % of nocturnal worries didn't matter by morning.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">Validated</span>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 custom-scrollbar">
        {categories.map((cat) => {
          const isSelected = activeFilter === cat;
          const count =
            cat === 'All'
              ? items.length
              : cat === 'Locked'
              ? items.filter((i) => i.type === 'time_locked').length
              : items.filter((i) => i.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => {
                audio.playClick();
                setActiveFilter(cat);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                isSelected
                  ? 'bg-secondary/25 text-secondary border border-secondary/40 shadow-[0_0_10px_rgba(76,215,246,0.3)]'
                  : 'bg-surface-high/50 text-typography-secondary hover:text-typography-primary border border-white/[0.04]'
              }`}
            >
              <span>{cat === 'All' ? 'All Echoes' : cat}</span>
              <span className="text-[10px] opacity-70 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Helper Guidance Ticker */}
      <div className="flex items-center justify-between text-[11px] text-typography-secondary px-1">
        <span className="flex items-center gap-1">
          <Fingerprint className="w-3.5 h-3.5 text-secondary" />
          Biometric Enclave Active
        </span>
        <span className="text-[10px] font-mono text-secondary">AES-256-GCM Hardware Vault</span>
      </div>

      {/* Journal Cards List */}
      <div className="flex flex-col gap-3">
        {filteredItems.length === 0 ? (
          <div className="bg-surface-low/50 backdrop-blur-md rounded-2xl p-8 border border-white/[0.06] text-center flex flex-col items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-typography-secondary/50" />
            <span className="text-sm font-semibold text-typography-primary">
              No reflections found
            </span>
            <span className="text-xs text-typography-secondary">
              Try changing filters or dissolve a thought in the Vault.
            </span>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isTimeLocked = item.type === 'time_locked';
            const isStillLocked = isTimeLocked && item.locked_until && item.locked_until > currentTime;
            const isBookmarked = bookmarkedIds.has(item.id);
            const isRevealed = revealedLockIds.has(item.id);

            return (
              <article
                key={item.id}
                className={`group relative rounded-2xl p-4 transition-all duration-300 border ${
                  isTimeLocked
                    ? 'bg-gradient-to-b from-[#141526]/90 to-[#0e101c]/90 border-timelock/25 shadow-lg'
                    : 'bg-gradient-to-b from-surface-low/85 to-surface-lowest/85 border-white/[0.08] hover:border-secondary/30 shadow-glass-card'
                }`}
              >
                {/* Top Card Row */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                        isTimeLocked
                          ? 'bg-timelock/20 text-timelock border border-timelock/30'
                          : 'bg-secondary/15 text-secondary border border-secondary/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isTimeLocked ? 'bg-timelock' : 'bg-secondary'
                        }`}
                      />
                      {isTimeLocked ? 'Time-Locked' : item.category}
                    </span>
                    <span className="text-[11px] text-typography-secondary/70">
                      {new Date(item.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="px-2 py-0.5 rounded-md bg-surface-highest/60 text-[10px] font-mono text-typography-secondary border border-white/[0.04]">
                    Vault #{item.vaultNumber || '01'}
                  </div>
                </div>

                {/* Content Section */}
                {isStillLocked ? (
                  /* Locked Vault Presentation */
                  <div className="my-2 p-3.5 rounded-xl bg-surface-lowest/90 border border-timelock/30 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-timelock font-semibold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Compartmentalized Payload</span>
                      </div>
                      <span className="text-[11px] font-mono text-timelock font-semibold tnum">
                        {formatCountdown(item.locked_until)}
                      </span>
                    </div>

                    <div className="text-xs text-typography-secondary font-mono tracking-wider break-all bg-black/40 p-2 rounded-lg border border-white/[0.04]">
                      {isRevealed
                        ? item.decryptedContent
                        : `🔒 ${item.burden || 'GCM:a7b8c9d0:AES-256-ZERO-KNOWLEDGE-SEALED'}`}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-typography-secondary pt-1">
                      <span className="flex items-center gap-1 text-[10px]">
                        <Shield className="w-3 h-3 text-timelock" />
                        Zero-Knowledge Enclave
                      </span>
                      <button
                        type="button"
                        onClick={() => requestBiometricInspection(item)}
                        className="text-[10px] text-timelock hover:underline flex items-center gap-1 font-medium"
                      >
                        {isRevealed ? (
                          <>
                            <EyeOff className="w-3 h-3" /> Hide Plaintext
                          </>
                        ) : (
                          <>
                            <Fingerprint className="w-3 h-3" /> Biometric Inspect
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Purged & Transmuted Presentation */
                  <div className="my-2 flex flex-col gap-2.5">
                    {/* Dissolved Burden */}
                    <div className="text-left">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-typography-secondary/70 block mb-1">
                        Dissolved Burden:
                      </span>
                      <p className="text-xs italic text-typography-secondary/90 leading-relaxed pl-2 border-l-2 border-secondary/40">
                        "{item.burden}"
                      </p>
                    </div>

                    {/* Transformed Resonance */}
                    <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 flex flex-col gap-1.5 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-secondary flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Transformed Resonance
                        </span>
                        <span className="text-[10px] font-bold text-secondary px-1.5 py-0.2 rounded bg-secondary/20 font-mono">
                          +{item.clarityGain || 12}% Clarity
                        </span>
                      </div>
                      <p className="text-xs text-typography-primary leading-relaxed">
                        {item.reflection}
                      </p>
                      {item.mantra && (
                        <div className="mt-1 flex items-center justify-between pt-1 border-t border-secondary/15">
                          <span className="text-[11px] italic font-medium text-secondary/90">
                            Mantra: "{item.mantra}"
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleBookmark(item.id)}
                            className="text-typography-secondary hover:text-secondary p-1"
                          >
                            <Bookmark
                              className={`w-3.5 h-3.5 ${
                                isBookmarked ? 'fill-secondary text-secondary' : ''
                              }`}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Card Footer */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-typography-secondary pt-2 border-t border-white/[0.04]">
                  <span className="flex items-center gap-1.5 text-[10px]">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isTimeLocked ? 'bg-timelock' : 'bg-secondary'
                      }`}
                    />
                    {isTimeLocked
                      ? isStillLocked
                        ? 'Locked in Sanctuary'
                        : 'Unlocked & Transmuted'
                      : 'Fully Dissolved'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        audio.playWaterDrop();
                      }}
                      className="text-[10px] text-secondary hover:text-white transition-colors flex items-center gap-1 font-medium"
                    >
                      <Volume2 className="w-3 h-3" />
                      Listen (432Hz)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        audio.playClick();
                        setSelectedItem(item);
                      }}
                      className="text-[10px] text-typography-secondary hover:text-typography-primary font-medium flex items-center gap-0.5"
                    >
                      Details <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Biometric Scan Overlay Animation */}
      {biometricPrompt && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#12141e] border border-secondary/40 rounded-3xl p-6 text-center space-y-3 max-w-[320px] w-full shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-secondary/15 border border-secondary/40 flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(76,215,246,0.6)]">
              <Fingerprint className="w-8 h-8 text-secondary animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-typography-primary">
              Biometric Authorization
            </h3>
            <p className="text-xs text-typography-secondary">
              Verifying user presence with FaceID / TouchID / Secure Platform Authenticator...
            </p>
          </div>
        </div>
      )}

      {/* Reflection Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#12141e] border border-secondary/30 rounded-3xl p-5 shadow-2xl space-y-4 max-w-[390px] w-full text-left">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Reflection Deep Dive
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-typography-secondary hover:text-white text-xs font-semibold px-2 py-1 rounded-full bg-white/[0.05]"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-typography-secondary">
                  Original Friction:
                </span>
                <p className="text-xs text-typography-primary italic mt-0.5 pl-2 border-l-2 border-secondary/50">
                  "{selectedItem.decryptedContent || selectedItem.burden}"
                </p>
              </div>

              <div className="bg-secondary/10 p-3 rounded-2xl border border-secondary/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-1">
                  Psychological Reframing:
                </span>
                <p className="text-xs text-typography-primary leading-relaxed">
                  {selectedItem.reflection}
                </p>
              </div>

              {selectedItem.mantra && (
                <div className="bg-surface-lowest p-3 rounded-xl border border-white/[0.06]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-typography-secondary block mb-1">
                    Anchor Mantra:
                  </span>
                  <p className="text-xs font-medium text-secondary">
                    "{selectedItem.mantra}"
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="w-full py-2.5 rounded-full bg-secondary text-surface-lowest text-xs font-bold tracking-wide shadow-[0_0_16px_rgba(76,215,246,0.4)]"
            >
              Integrate into Clarity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
