import React from 'react';
import { Box, BookOpen, Wind, BarChart2 } from 'lucide-react';
import { audio } from '../services/audio.js';

export default function NavigationDock({ currentTab, onTabChange }) {
  const tabs = [
    { id: 'vault', label: 'Vault', icon: Box },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'breathwave', label: 'Breathwave', icon: Wind },
    { id: 'insights', label: 'Insights', icon: BarChart2 },
  ];

  const handleSelect = (tabId) => {
    audio.playClick();
    onTabChange(tabId);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#090a0f]/85 backdrop-blur-2xl border-t border-white/[0.08] px-6 py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
      <div className="max-w-[440px] mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`flex flex-col items-center justify-center relative py-1 px-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'text-secondary scale-105'
                  : 'text-typography-secondary hover:text-typography-primary active:scale-95'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 mb-0.5 transition-all duration-300 ${
                    isActive
                      ? 'drop-shadow-[0_0_10px_rgba(76,215,246,0.7)] text-secondary stroke-[2.2]'
                      : 'stroke-[1.7]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6]" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight transition-all ${
                  isActive ? 'font-semibold text-secondary' : 'opacity-80'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* iOS Home Indicator Bar */}
      <div className="w-28 h-1 bg-white/20 rounded-full mx-auto mt-2 pointer-events-none" />
    </nav>
  );
}
