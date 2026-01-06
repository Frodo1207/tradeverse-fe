import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import ImmersiveBackground from './components/effects/ImmersiveBackground';
import IntroSequence from './components/effects/IntroSequence';
import GameTransition from './components/effects/GameTransition';
import { PlayerProgressProvider } from './contexts/PlayerProgressContext';
import { WalletProvider } from './contexts/WalletContext';
import HomeView from './views/HomeView';
import LobbyView from './views/LobbyView';
import LeaderboardView from './views/LeaderboardView';
import ProfileView from './views/ProfileView';
import ReferralView from './views/ReferralView';
import SwapView from './views/SwapView';
import WalletConnectButton from './components/ui/WalletConnectButton';

const App = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'Single Player', 'Competitive', 'Card Games', 'Prediction', 'Poker'
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);

  const [transition, setTransition] = useState({
    isActive: false,
    theme: 'blue',
    title: 'Loading...',
    type: 'slide'
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = (i18n.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';

  const handleIntroComplete = () => {
    setLoading(false);
  };

  const handleViewChange = (viewName) => {
    setMobileMenuOpen(false); // Close mobile menu on navigation
    if (viewName === currentView) return;

    // Define themes based on view
    let theme = 'blue';
    let title = 'Loading...';
    let type = 'slide';

    switch (viewName) {
      case 'Rankings':
        theme = 'orange';
        title = 'Daily Rankings';
        type = 'shutter';
        break;
      case 'Profile':
        theme = 'cyan';
        title = 'Personal Center';
        type = 'circle';
        break;
      case 'Referral':
        theme = 'purple';
        title = 'Partner Program';
        type = 'shutter';
        break;
      case 'Swap':
        theme = 'purple';
        title = 'Token Swap';
        type = 'circle';
        break;
      case 'Lobby':
        theme = 'purple';
        title = 'Game Lobby';
        type = 'door';
        break;
      case 'home':
        theme = 'blue';
        title = 'Home';
        type = 'circle';
        break;
    }

    // Start Transition
    setTransition({ isActive: true, theme, title, type });

    // Wait for enter animation + progress bar (approx 1.5s)
    setTimeout(() => {
      setCurrentView(viewName);
      window.scrollTo(0, 0);

      // Wait 1.5s at 100% before exiting (Explicit Pause)
      setTimeout(() => {
        setTransition(prev => ({ ...prev, isActive: false }));
      }, 1500);
    }, 2000);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onCategorySelect={() => handleViewChange('Lobby')} />;
      case 'Rankings':
        return <LeaderboardView onBack={() => handleViewChange('home')} />;
      case 'Profile':
        return <ProfileView onBack={() => handleViewChange('home')} />;
      case 'Referral':
        return <ReferralView onBack={() => handleViewChange('home')} />;
      case 'Swap':
        return <SwapView onBack={() => handleViewChange('home')} />;
      case 'Lobby':
        return <LobbyView />;
      default:
        return <HomeView onCategorySelect={() => handleViewChange('Lobby')} />;
    }
  };

  if (loading) {
    return <IntroSequence onComplete={handleIntroComplete} />;
  }

  return (
    <WalletProvider>
      <PlayerProgressProvider>
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#8B5CF6] selection:text-white">

          {/* Background Effects */}
          <ImmersiveBackground mode={currentView} />

          <GameTransition
            isVisible={transition.isActive}
            theme={transition.theme}
            title={transition.title}
            type={transition.type}
          />

          {/* Navigation */}
          <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || currentView !== 'home' ? 'bg-black/30 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => handleViewChange('home')}
              >
                <div className="w-10 h-10 bg-[#8B5CF6] rounded-lg flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                  <Gamepad2 className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-bold tracking-tight font-mono group-hover:text-white transition-colors">NEXUS<span className="text-[#8B5CF6]">.GG</span></span>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wider uppercase">
                <button
                  onClick={() => handleViewChange('Lobby')}
                  className={`hover:text-[#8B5CF6] transition-colors relative group ${currentView === 'Lobby' ? 'text-[#8B5CF6]' : ''}`}
                >
                  {t('nav.games')}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#8B5CF6] transition-all ${currentView === 'Lobby' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>

                <button
                  onClick={() => handleViewChange('Swap')}
                  className={`hover:text-[#8B5CF6] transition-colors relative group ${currentView === 'Swap' ? 'text-[#8B5CF6]' : ''}`}
                >
                  {t('nav.swap')}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#8B5CF6] transition-all ${currentView === 'Swap' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>

                <div className="relative" ref={langMenuRef}>
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={langMenuOpen}
                    aria-label={currentLang === 'zh' ? t('lang.zh') : t('lang.en')}
                    onClick={() => setLangMenuOpen((v) => !v)}
                    className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 text-white flex items-center justify-center hover:bg-[#1a1a1a] hover:border-white/20 transition-all"
                  >
                    <Globe size={18} className="opacity-90" />
                  </button>
                  {langMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-3 w-56 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      <button
                        role="menuitem"
                        type="button"
                        onClick={() => { i18n.changeLanguage('en'); setLangMenuOpen(false); }}
                        className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-black normal-case hover:bg-white/5 transition-colors"
                      >
                        <span>{t('lang.en')}</span>
                        {currentLang === 'en' ? <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> : <span className="w-2 h-2 rounded-full bg-transparent" />}
                      </button>
                      <button
                        role="menuitem"
                        type="button"
                        onClick={() => { i18n.changeLanguage('zh'); setLangMenuOpen(false); }}
                        className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-black normal-case hover:bg-white/5 transition-colors"
                      >
                        <span>{t('lang.zh')}</span>
                        {currentLang === 'zh' ? <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> : <span className="w-2 h-2 rounded-full bg-transparent" />}
                      </button>
                    </div>
                  )}
                </div>

                <WalletConnectButton onNavigate={handleViewChange} />
              </div>

              {/* Mobile Nav Toggle */}
              <div className="flex md:hidden items-center gap-4">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white active:scale-95 transition-all"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Menu Overlay */}
          <div className={`fixed inset-0 z-40 bg-[#050505] transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'} md:hidden flex flex-col pt-32 px-6`}>
            <div className="flex flex-col gap-6 text-2xl font-black uppercase tracking-tighter">
              <button onClick={() => handleViewChange('home')} className={`text-left py-4 border-b border-white/10 ${currentView === 'home' ? 'text-[#8B5CF6]' : 'text-white'}`}>{t('nav.home')}</button>
              <button onClick={() => handleViewChange('Lobby')} className={`text-left py-4 border-b border-white/10 ${currentView === 'Lobby' ? 'text-[#8B5CF6]' : 'text-white'}`}>{t('nav.games')}</button>
              <button onClick={() => handleViewChange('Swap')} className={`text-left py-4 border-b border-white/10 ${currentView === 'Swap' ? 'text-[#8B5CF6]' : 'text-white'}`}>{t('nav.swap')}</button>
              <div className="py-4 border-b border-white/10">
                <div className="text-xs text-gray-500 font-bold tracking-widest mb-3">LANGUAGE</div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => i18n.changeLanguage('en')}
                    className={`px-4 py-2 rounded-full text-xs font-black transition-all ${currentLang === 'en' ? 'bg-white text-black shadow-lg' : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'}`}
                  >
                    {t('lang.en')}
                  </button>
                  <button
                    onClick={() => i18n.changeLanguage('zh')}
                    className={`px-4 py-2 rounded-full text-xs font-black transition-all ${currentLang === 'zh' ? 'bg-white text-black shadow-lg' : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'}`}
                  >
                    {t('lang.zh')}
                  </button>
                </div>
              </div>
              <div className="py-4 border-b border-white/10">
                <WalletConnectButton onNavigate={handleViewChange} mobile={true} />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="relative z-10">
            {renderView()}
          </main>

        </div >
      </PlayerProgressProvider >
    </WalletProvider>
  );
};

export default App;
