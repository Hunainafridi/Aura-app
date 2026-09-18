import React, { useState, useEffect } from 'react';
import { Play, Pause, Disc } from 'lucide-react';
import { audio } from '../services/audio.js';

export default function AudioPlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = () => {
    audio.playClick();
    const active = audio.toggleBinauralResonance((state) => {
      setIsPlaying(state);
    });
    setIsPlaying(active);
  };

  return (
    <div className="bg-[#141622]/90 backdrop-blur-xl border border-secondary/25 rounded-2xl p-2.5 flex items-center justify-between shadow-xl transition-all hover:border-secondary/40">
      <div className="flex items-center space-x-2.5">
        <button
          onClick={togglePlayback}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-secondary text-surface-lowest shadow-[0_0_12px_rgba(76,215,246,0.8)] scale-105'
              : 'bg-secondary/15 text-secondary border border-secondary/30 hover:bg-secondary/25'
          }`}
          title={isPlaying ? 'Pause Sanctuary Waves' : 'Play 432Hz Binaural Theta'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
          )}
        </button>

        <div className="overflow-hidden text-left">
          <p className="text-[11px] font-medium text-typography-primary truncate">
            Solace of Let-Go
          </p>
          <p className="text-[9px] text-secondary font-mono flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full bg-secondary ${
                isPlaying ? 'animate-ping' : 'opacity-60'
              }`}
            />
            Binaural Theta (432Hz) • {isPlaying ? 'Harmonizing Sanctuary' : 'Ready'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1 pr-1.5">
        {/* Animated equalizer waves */}
        <div className="flex items-center space-x-0.5 h-3.5">
          <span
            className={`w-0.5 bg-secondary/70 rounded-full transition-all duration-300 ${
              isPlaying ? 'h-2 animate-pulse' : 'h-1 opacity-40'
            }`}
          />
          <span
            className={`w-0.5 bg-secondary rounded-full transition-all duration-300 ${
              isPlaying ? 'h-3.5 animate-pulse' : 'h-2 opacity-50'
            }`}
            style={{ animationDelay: '0.15s' }}
          />
          <span
            className={`w-0.5 bg-secondary/70 rounded-full transition-all duration-300 ${
              isPlaying ? 'h-1.5 animate-pulse' : 'h-1 opacity-40'
            }`}
            style={{ animationDelay: '0.3s' }}
          />
        </div>
      </div>
    </div>
  );
}
