import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { PatientProvider, usePatient } from './context/PatientContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EmergencyModal } from './components/EmergencyModal';
import { DisclaimerModal } from './components/DisclaimerModal';
import { AuthModal } from './components/AuthModal';

import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { SymptomsView } from './views/SymptomsView';
import { RecordsView } from './views/RecordsView';
import { PrescriptionView } from './views/PrescriptionView';
import { ReportExplanationView } from './views/ReportExplanationView';
import { MedicineTrackerView } from './views/MedicineTrackerView';
import { DietLifestyleView } from './views/DietLifestyleView';
import { AiAssistantView } from './views/AiAssistantView';
import { HealthTrendsView } from './views/HealthTrendsView';
import { ProfileView } from './views/ProfileView';

import { 
  LayoutDashboard, 
  Stethoscope, 
  FileText, 
  CalendarClock, 
  Bot, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { t } = useLanguage();
  const { user } = usePatient();

  // Navigation state
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Modals state
  const [emergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);
  const [emergencyCustomMsg, setEmergencyCustomMsg] = useState<string>('');
  const [disclaimerModalOpen, setDisclaimerModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Dynamic parameters for sub-view transitions
  const [symptomQuery, setSymptomQuery] = useState<string>('');
  const [aiAssistantPrompt, setAiAssistantPrompt] = useState<string>('');
  const [reportParamId, setReportParamId] = useState<string>('');

  const triggerEmergency = (msg?: string) => {
    if (msg) setEmergencyCustomMsg(msg);
    setEmergencyModalOpen(true);
  };

  const handleQuickSymptomCheck = (text: string) => {
    setSymptomQuery(text);
    setActiveView('symptoms');
  };

  const handleQuickAiChat = (query: string) => {
    setAiAssistantPrompt(query);
    setActiveView('ai_assistant');
  };

  const handleNavigateToExplanation = (reportId: string) => {
    setReportParamId(reportId);
    setActiveView('report_explanation');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenEmergency={() => triggerEmergency()}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDisclaimer={() => setDisclaimerModalOpen(true)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6">
        {/* Sidebar (Desktop sticky / Mobile drawer) */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          onOpenEmergency={() => triggerEmergency()}
          onOpenDisclaimer={() => setDisclaimerModalOpen(true)}
        />

        {/* Dynamic Main Viewport */}
        <main className="flex-1 py-6 md:pl-8 max-w-full overflow-hidden">
          {activeView === 'landing' && (
            <LandingView
              onGetStarted={() => setActiveView('dashboard')}
              onOpenDisclaimer={() => setDisclaimerModalOpen(true)}
            />
          )}

          {activeView === 'dashboard' && (
            <DashboardView
              onNavigate={(view) => setActiveView(view)}
              onQuickSymptomCheck={handleQuickSymptomCheck}
              onQuickAiChat={handleQuickAiChat}
            />
          )}

          {activeView === 'symptoms' && (
            <SymptomsView
              initialQuery={symptomQuery}
              onOpenEmergency={() => triggerEmergency('Emergency Red-Flag Symptoms Detected in Symptom Checker!')}
            />
          )}

          {activeView === 'records' && (
            <RecordsView
              onNavigateToExplanation={handleNavigateToExplanation}
              onNavigateToPrescription={() => setActiveView('prescription')}
            />
          )}

          {activeView === 'prescription' && (
            <PrescriptionView
              onNavigateToTracker={() => setActiveView('medicines')}
            />
          )}

          {activeView === 'report_explanation' && (
            <ReportExplanationView
              initialReportId={reportParamId}
              onAskAiAboutReport={handleQuickAiChat}
            />
          )}

          {activeView === 'medicines' && (
            <MedicineTrackerView />
          )}

          {activeView === 'diet_lifestyle' && (
            <DietLifestyleView />
          )}

          {activeView === 'ai_assistant' && (
            <AiAssistantView
              initialPrompt={aiAssistantPrompt}
              onOpenEmergency={() => triggerEmergency('Critical symptoms mentioned in AI chat. Immediate emergency dispatch recommended!')}
            />
          )}

          {activeView === 'health_trends' && (
            <HealthTrendsView />
          )}

          {activeView === 'profile' && (
            <ProfileView />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {[
          { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
          { id: 'symptoms', label: 'Symptoms', icon: Stethoscope },
          { id: 'prescription', label: 'Rx', icon: FileText },
          { id: 'medicines', label: 'Meds', icon: CalendarClock },
          { id: 'ai_assistant', label: 'AI Chat', icon: Bot },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                isActive ? 'text-teal-600 font-extrabold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
              <span className="truncate max-w-[54px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white text-xs text-slate-500 py-6 mb-12 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">MediGuide AI</span>
            <span>•</span>
            <span>Personal Health Records & Clinical Assistant</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() => setDisclaimerModalOpen(true)}
              className="hover:text-teal-600 transition underline underline-offset-2 cursor-pointer"
            >
              Medical Disclaimer
            </button>
            <button
              onClick={() => setDisclaimerModalOpen(true)}
              className="hover:text-teal-600 transition underline underline-offset-2 cursor-pointer"
            >
              Privacy Notice
            </button>
            <button
              onClick={() => setActiveView('landing')}
              className="hover:text-teal-600 transition underline underline-offset-2 cursor-pointer"
            >
              About MediGuide
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        customMessage={emergencyCustomMsg}
      />

      <DisclaimerModal
        isOpen={disclaimerModalOpen}
        onClose={() => setDisclaimerModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <PatientProvider>
        <MainAppContent />
      </PatientProvider>
    </LanguageProvider>
  );
}
