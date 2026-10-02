import React, { useState } from 'react';
import { 
  HeartPulse, 
  Activity, 
  Pill, 
  FileText, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  AlertTriangle, 
  Bot, 
  Send, 
  TrendingUp, 
  CalendarClock, 
  Apple, 
  Sparkles,
  Clock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onQuickSymptomCheck: (symptoms: string) => void;
  onQuickAiChat: (query: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onQuickSymptomCheck,
  onQuickAiChat
}) => {
  const { t, language } = useLanguage();
  const { profile, medications, reports, toggleMedicationTaken, healthMetrics } = usePatient();
  const [quickSymptomsText, setQuickSymptomsText] = useState('');
  const [quickAiText, setQuickAiText] = useState('');

  const takenCount = medications.filter(m => m.takenToday).length;
  const totalMeds = medications.length;
  const adherencePct = totalMeds > 0 ? Math.round((takenCount / totalMeds) * 100) : 100;

  const nextMed = medications.find(m => !m.takenToday) || medications[0];
  const latestMetric = healthMetrics[healthMetrics.length - 1] || {};

  const handleSymptomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSymptomsText.trim()) return;
    onQuickSymptomCheck(quickSymptomsText);
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAiText.trim()) return;
    onQuickAiChat(quickAiText);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Health Record Active • {profile.bloodGroup} • {profile.age} yrs</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('welcomeBack')} {profile.name}
          </h1>

          <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
            {t('healthStatusGood')}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            {profile.existingConditions.map((cond, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-teal-900/60 border border-teal-500/30 text-teal-100 font-medium">
                {cond}
              </span>
            ))}
            {profile.allergies.map((allergy, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-900/40 border border-rose-400/30 text-rose-200 font-medium">
                Allergy: {allergy}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next Medication */}
        <div 
          onClick={() => onNavigate('medicines')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-sm transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t('nextMedication')}</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:scale-105 transition-transform">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
            {nextMed ? nextMed.name : 'All done'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-teal-600" />
            <span>{nextMed ? `${nextMed.dosage} (${nextMed.timing.replace('_', ' ')})` : 'All doses taken'}</span>
          </p>
        </div>

        {/* Latest BP */}
        <div 
          onClick={() => onNavigate('health_trends')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-sm transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t('latestBloodPressure')}</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {latestMetric.systolic}/{latestMetric.diastolic}
            </h3>
            <span className="text-xs text-slate-500">mmHg</span>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Optimal (Down from 142/90)</span>
          </p>
        </div>

        {/* Fasting Glucose */}
        <div 
          onClick={() => onNavigate('health_trends')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-sm transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t('latestBloodSugar')}</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {latestMetric.glucose}
            </h3>
            <span className="text-xs text-slate-500">mg/dL</span>
          </div>
          <p className="text-xs text-amber-600 font-semibold mt-1">
            Borderline (Target: &lt;100)
          </p>
        </div>

        {/* Active Prescriptions */}
        <div 
          onClick={() => onNavigate('prescription')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-sm transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t('activePrescriptions')}</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {medications.length} Rx
            </h3>
            <span className="text-xs text-slate-500">Dr. Anita Roy</span>
          </div>
          <p className="text-xs text-teal-600 font-semibold mt-1 flex items-center gap-1">
            <span>{reports.length} Lab Reports on File</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Medicine Schedule & Quick Symptom Checker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Medicine Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Medicines Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {t('todaysMedicines')}
                </h2>
                <p className="text-xs text-slate-500">
                  {takenCount} of {totalMeds} taken today ({adherencePct}% adherence)
                </p>
              </div>
              <button
                onClick={() => onNavigate('medicines')}
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
              >
                <span>Full Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${adherencePct}%` }}
              />
            </div>

            {/* Medication list */}
            <div className="space-y-2.5">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    med.takenToday
                      ? 'bg-slate-50/70 border-slate-200/80 text-slate-500'
                      : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleMedicationTaken(med.id)}
                      className={`p-1 rounded-lg transition ${
                        med.takenToday
                          ? 'text-emerald-600 hover:text-slate-400'
                          : 'text-slate-300 hover:text-teal-600'
                      }`}
                      aria-label="Toggle taken status"
                    >
                      {med.takenToday ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-sm font-bold ${med.takenToday ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {med.name} <span className="text-xs font-semibold text-slate-500">{med.dosage}</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        {med.frequency} • {med.timing === 'after_food' ? t('afterFood') : med.timing === 'before_food' ? t('beforeFood') : med.timing} • {med.timeOfDay.join(', ')}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                    med.takenToday
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {med.takenToday ? t('markedTaken') : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports Widget */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {t('recentReports')}
                </h2>
                <p className="text-xs text-slate-500">
                  Translated into plain language with clinical ranges
                </p>
              </div>
              <button
                onClick={() => onNavigate('report_explanation')}
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
              >
                <span>{t('viewDetails')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reports.slice(0, 2).map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => onNavigate('report_explanation')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-slate-50/50 transition cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 px-2 py-0.5 rounded bg-teal-50">
                      {rep.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors mt-1">
                      {rep.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {rep.summary?.[language] || rep.summary?.en}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>{rep.date}</span>
                    <span className="text-teal-600 font-semibold group-hover:underline">Explore values →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Quick AI Assistant & Quick Symptoms */}
        <div className="space-y-6">
          {/* Quick Symptoms Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-teal-700">
              <HeartPulse className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">{t('quickSymptomCheck')}</h2>
            </div>
            <p className="text-xs text-slate-500">
              Type what you are experiencing to check severity and when to seek care.
            </p>
            <form onSubmit={handleSymptomSubmit} className="space-y-2.5">
              <textarea
                value={quickSymptomsText}
                onChange={(e) => setQuickSymptomsText(e.target.value)}
                placeholder={t('describeSymptomsPlaceholder')}
                rows={3}
                className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition resize-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>{t('checkSymptomsBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Quick AI Health Assistant Shortcut */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
                  <Bot className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold">{t('navAiAssistant')}</h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300">
                Context-Aware
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Ask questions about your blood test results, medication food timings, or diet.
            </p>

            <form onSubmit={handleAiSubmit} className="relative">
              <input
                type="text"
                value={quickAiText}
                onChange={(e) => setQuickAiText(e.target.value)}
                placeholder={t('askAiPrompt')}
                className="w-full pr-10 pl-3 py-2.5 text-xs bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/15 transition"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 transition"
                aria-label="Send AI Query"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onQuickAiChat(language === 'hi' ? 'मेरी ब्लड रिपोर्ट को आसान शब्दों में समझाएं' : language === 'it' ? 'Spiegami le analisi del sangue' : 'Explain my blood report')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-teal-200 transition text-left cursor-pointer"
              >
                💬 {language === 'hi' ? 'ब्लड रिपोर्ट समझाएं' : language === 'it' ? 'Spiega referto' : 'Explain blood report'}
              </button>
              <button
                type="button"
                onClick={() => onQuickAiChat(language === 'hi' ? 'डॉक्टर ने कौन सी दवाएं लिखी हैं?' : language === 'it' ? 'Cosa ha prescritto il medico?' : 'What did my doctor prescribe?')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-teal-200 transition text-left cursor-pointer"
              >
                💊 {language === 'hi' ? 'डॉक्टर का पर्चा' : language === 'it' ? 'Farmaci prescritti' : 'Prescribed medicines'}
              </button>
            </div>
          </div>

          {/* Quick Diet & Lifestyle Tip */}
          <div 
            onClick={() => onNavigate('diet_lifestyle')}
            className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs hover:border-emerald-300 transition cursor-pointer flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <Apple className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {t('navDietLifestyle')}
                </h4>
                <p className="text-xs text-emerald-950 font-medium mt-0.5">
                  Low sodium DASH & high soluble fiber plan active
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </div>
        </div>
      </div>
    </div>
  );
};
