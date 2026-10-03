import React, { useState } from 'react';
import { 
  HeartPulse, 
  Globe, 
  AlertTriangle, 
  Menu, 
  X, 
  User, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  ChevronDown,
  Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { Language } from '../types';

interface HeaderProps {
  onOpenEmergency: () => void;
  onOpenAuth: () => void;
  onOpenDisclaimer: () => void;
  onOpenSyncCenter?: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenEmergency,
  onOpenAuth,
  onOpenDisclaimer,
  onOpenSyncCenter,
  sidebarOpen,
  setSidebarOpen,
  setActiveView
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = usePatient();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string; native: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸', native: 'English' },
    { code: 'hi', label: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
    { code: 'it', label: 'Italian', flag: '🇮🇹', native: 'Italiano' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Clinical Safety Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-slate-300 font-medium truncate">
              {t('notADoctorBadge')}
            </span>
          </div>
          <button
            onClick={onOpenDisclaimer}
            className="text-xs text-teal-400 hover:text-teal-300 underline underline-offset-2 flex-shrink-0 flex items-center gap-1 cursor-pointer font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Safety Guidelines</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            aria-label="Toggle Navigation Menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 bg-clip-text text-transparent">
                MediGuide AI
              </span>
              <span className="hidden sm:block text-[10px] font-medium text-slate-500 tracking-wide uppercase">
                Clinical Health Assistant
              </span>
            </div>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Synchronized Health Engine Quick Access */}
          {onOpenSyncCenter && (
            <button
              onClick={onOpenSyncCenter}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-teal-50 border border-teal-200/90 hover:bg-teal-100/80 text-teal-900 text-xs sm:text-sm font-bold transition shadow-2xs cursor-pointer group"
              title="Integrated 5-System Health Synchronization Hub"
            >
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">{t('syncHub') || 'Sync Hub'}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-teal-600 text-white uppercase tracking-tight">
                5 Live
              </span>
            </button>
          )}

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenEmergency}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm shadow-red-500/20 transition-all hover:scale-[1.02]"
          >
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span className="whitespace-nowrap">{t('emergencyButton')}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              aria-label="Change Language"
            >
              <Globe className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline">{currentLang.flag} {currentLang.native}</span>
              <span className="sm:hidden">{currentLang.flag}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setLangDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-fade-in">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Select Language
                  </div>
                  {languages.map(item => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-teal-50 transition ${
                        language === item.code ? 'text-teal-700 bg-teal-50/60 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{item.flag}</span>
                        <span>{item.native}</span>
                      </span>
                      {language === item.code && (
                        <span className="w-2 h-2 rounded-full bg-teal-600" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User profile / Auth Button */}
          {user.isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('profile')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition"
              >
                <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
              </button>
              <button
                onClick={logout}
                title={t('logout')}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('login')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
