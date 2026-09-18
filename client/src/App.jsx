import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import NavigationDock from './components/NavigationDock.jsx';
import AudioPlayerBar from './components/AudioPlayerBar.jsx';
import VaultView from './views/VaultView.jsx';
import JournalView from './views/JournalView.jsx';
import BreathwaveView from './views/BreathwaveView.jsx';
import InsightsView from './views/InsightsView.jsx';
import OnboardingModal from './components/OnboardingModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import CrisisSafetyModal from './components/CrisisSafetyModal.jsx';
import ClinicalAssessmentModal from './components/ClinicalAssessmentModal.jsx';
import PanicResetModal from './components/PanicResetModal.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [currentTab, setCurrentTab] = useState('vault');
  const [backendOnline, setBackendOnline] = useState(false);
  const [lastActionTime, setLastActionTime] = useState(Date.now());
  const [userName, setUserName] = useState(() => localStorage.getItem('aura_user_name') || '');
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('aura_user_name'));
  const [showSettings, setShowSettings] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showPanic, setShowPanic] = useState(false);
  const [isAirGapped, setIsAirGapped] = useState(() => localStorage.getItem('aura_air_gap') === 'true');

  // Check backend health periodically (skipped when air-gapped)
  useEffect(() => {
    if (isAirGapped) {
      setBackendOnline(false);
      return;
    }
    const checkBackend = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/health`);
        if (res.ok) {
          setBackendOnline(true);
          return;
        }
      } catch (e) {
        setBackendOnline(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleThoughtAction = () => {
    setLastActionTime(Date.now());
  };

  const handleOnboardingComplete = (name) => {
    setUserName(name);
    setShowOnboarding(false);
  };

  const handleNameUpdate = (name) => {
    setUserName(name);
  };

  return (
    <div className="min-h-screen bg-[#06070A] text-[#F8FAFC] flex justify-center items-center p-0 sm:p-4 selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Handheld Frame Container */}
      <div className="relative w-full max-w-[440px] min-h-screen sm:min-h-[860px] sm:h-[860px] bg-[#090A0F] overflow-y-auto overflow-x-hidden flex flex-col justify-between sm:rounded-[48px] border sm:border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] custom-scrollbar">
        {/* Ambient Glowing Nebulae Backdrop */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-cyan-500/15 blur-[65px] pointer-events-none" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-blue-600/15 blur-[70px] pointer-events-none" />
        <div className="absolute bottom-28 left-1/4 w-80 h-80 rounded-full bg-indigo-600/10 blur-[65px] pointer-events-none" />

        {/* Global Fixed Header with User Name & Settings Trigger */}
        <Header
          currentTab={currentTab}
          backendOnline={backendOnline}
          userName={userName}
          onOpenSettings={() => setShowSettings(true)}
          onOpenPanic={() => setShowPanic(true)}
          isAirGapped={isAirGapped}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col relative z-10 pt-20 pb-28">
          {currentTab === 'vault' && (
            <VaultView
              onThoughtAction={handleThoughtAction}
              userName={userName}
              onOpenPanic={() => setShowPanic(true)}
            />
          )}
          {currentTab === 'journal' && <JournalView />}
          {currentTab === 'breathwave' && <BreathwaveView />}
          {currentTab === 'insights' && <InsightsView />}
        </main>

        {/* Floating Audio Player floater (positioned right above the Bento Dock) */}
        <div className="fixed bottom-20 inset-x-0 z-30 px-4 max-w-[440px] mx-auto pointer-events-auto">
          <AudioPlayerBar />
        </div>

        {/* Bottom Bento Floating Dock */}
        <NavigationDock currentTab={currentTab} onTabChange={setCurrentTab} />

        {/* Onboarding Modal - Prompts user for name & GDPR consent on first launch */}
        {showOnboarding && (
          <OnboardingModal onComplete={handleOnboardingComplete} />
        )}

        {/* Sanctuary Profile & Governance Modal */}
        {showSettings && (
          <SettingsModal
            onClose={() => setShowSettings(false)}
            userName={userName}
            onNameUpdate={handleNameUpdate}
            onOpenCrisis={() => setShowCrisis(true)}
            onOpenAssessment={() => setShowAssessment(true)}
            isAirGapped={isAirGapped}
            onToggleAirGap={(val) => setIsAirGapped(val)}
          />
        )}

        {/* International Emergency Crisis Hotline Modal */}
        {showCrisis && (
          <CrisisSafetyModal onClose={() => setShowCrisis(false)} />
        )}

        {/* PHQ-4 & GAD-7 Validated Clinical Assessment Modal */}
        {showAssessment && (
          <ClinicalAssessmentModal onClose={() => setShowAssessment(false)} />
        )}

        {/* SOS 30-Second Panic Button Sensory Reset Modal */}
        {showPanic && (
          <PanicResetModal onClose={() => setShowPanic(false)} />
        )}
      </div>
    </div>
  );
}
