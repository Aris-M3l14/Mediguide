import React from 'react';
import { 
  LayoutDashboard, 
  Stethoscope, 
  FileText, 
  Pill, 
  Activity, 
  CalendarClock, 
  Apple, 
  Bot, 
  LineChart, 
  UserCircle2,
  ShieldCheck,
  PhoneCall,
  Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenEmergency: () => void;
  onOpenDisclaimer: () => void;
  onOpenSyncCenter?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isOpen,
  setIsOpen,
  onOpenEmergency,
  onOpenDisclaimer,
  onOpenSyncCenter
}) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'symptoms', label: t('navSymptoms'), icon: Stethoscope },
    { id: 'records', label: t('navRecords'), icon: FileText },
    { id: 'prescription', label: t('navPrescription'), icon: Pill },
    { id: 'report_explanation', label: t('navReportExplanation'), icon: Activity },
    { id: 'medicines', label: t('navMedicines'), icon: CalendarClock },
    { id: 'diet_lifestyle', label: t('navDietLifestyle'), icon: Apple },
    { id: 'ai_assistant', label: t('navAiAssistant'), icon: Bot, badge: 'AI' },
    { id: 'health_trends', label: t('navHealthTrends'), icon: LineChart },
    { id: 'profile', label: t('navProfile'), icon: UserCircle2 },
  ];

  const handleSelect = (id: string) => {
    setActiveView(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-16 md:top-24 z-30 h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="p-3 space-y-1 overflow-y-auto flex-1">
          {/* Synchronized Health Hub Trigger */}
          {onOpenSyncCenter && (
            <button
              onClick={() => {
                onOpenSyncCenter();
                setIsOpen(false);
              }}
              className="w-full mb-2 p-2.5 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200/90 text-left hover:border-teal-400 hover:shadow-xs transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-teal-600 text-white shadow-2xs group-hover:scale-105 transition-transform">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {t('navSyncCenter') || 'Health Sync Hub'}
                    </h4>
                    <p className="text-[10px] text-teal-700 font-medium">5 Systems Interconnected</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </button>
          )}

          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isActive
                        ? 'bg-teal-500/80 text-white'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Safety Box & Disclaimers */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 space-y-2">
          <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-1">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Medical Safety</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              MediGuide AI is educational. For emergencies, seek medical help.
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <button
                onClick={onOpenEmergency}
                className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Call 112 / 911</span>
              </button>
              <button
                onClick={onOpenDisclaimer}
                className="text-teal-600 hover:underline cursor-pointer"
              >
                Privacy & Terms
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
