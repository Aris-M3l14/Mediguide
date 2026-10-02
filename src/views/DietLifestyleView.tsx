import React from 'react';
import { 
  Apple, 
  Droplet, 
  Moon, 
  Activity, 
  ShieldAlert, 
  Check, 
  X, 
  Plus, 
  Sparkles,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { demoDietAndLifestyle } from '../data/demoData';

export const DietLifestyleView: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile, hydrationCount, incrementHydration } = usePatient();

  const recommendations = demoDietAndLifestyle[language] || demoDietAndLifestyle.en;
  const hydrationTargetGlasses = 10; // 10 x 250ml = 2.5L
  const hydrationProgress = Math.min(Math.round((hydrationCount / hydrationTargetGlasses) * 100), 100);

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 text-emerald-700">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Apple className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('dietTitle')}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Evidence-based Nutrition, Hydration, Sleep & Activity Guidance
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t('dietSubtitle')}
        </p>

        {/* Clinical Disclaimer Notice */}
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-amber-950 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>{t('dietGeneralNotice')}</span>
        </div>
      </div>

      {/* Patient Specific Context Chip */}
      <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-teal-900">Active Profile Filters:</span>
        {profile.existingConditions.map((c, i) => (
          <span key={i} className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-medium">
            {c}
          </span>
        ))}
        {profile.allergies.map((a, i) => (
          <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-medium">
            Avoid: {a}
          </span>
        ))}
      </div>

      {/* Diet / Nutrition Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2 text-teal-800">
          <Apple className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-900">{t('dietSectionTitle')}</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
          {recommendations.diet.summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Foods to include */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>{t('foodsToInclude')}</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-950">
              {recommendations.diet.foodsToInclude.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Foods to limit */}
          <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
              <X className="w-4 h-4 text-rose-600 stroke-[3]" />
              <span>{t('foodsToLimit')}</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-rose-950">
              {recommendations.diet.foodsToAvoidOrLimit.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Practical tips */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Practical Daily Guidelines
          </h4>
          <ul className="text-xs sm:text-sm text-slate-700 space-y-1 list-disc list-inside">
            {recommendations.diet.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Hydration Tracker Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Droplet className="w-5 h-5 fill-cyan-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">{t('hydrationTitle')}</h2>
              <p className="text-xs text-slate-500">
                {t('dailyTarget')}: {recommendations.hydration.recommendedDailyLiters} Liters (~10 glasses)
              </p>
            </div>
          </div>

          <button
            onClick={incrementHydration}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('logGlassBtn')}</span>
          </button>
        </div>

        {/* Hydration Visual Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>{hydrationCount} {t('glassesLogged')} ({(hydrationCount * 0.25).toFixed(1)}L)</span>
            <span>{hydrationProgress}% of Daily Goal</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${hydrationProgress}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-500 italic">
          💡 {recommendations.hydration.tip}
        </p>
      </div>

      {/* Sleep & Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sleep Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-700">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Moon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('sleepTitle')}</h3>
          </div>
          <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
              {t('sleepGoal')}:
            </span>
            <span className="text-sm font-bold text-indigo-950">
              {recommendations.sleep.recommendedHours}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {recommendations.sleep.routineTip}
          </p>
        </div>

        {/* Exercise Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-teal-700">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('exerciseTitle')}</h3>
          </div>
          <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
              Intensity & Frequency:
            </span>
            <span className="text-xs font-bold text-teal-950 block">
              {recommendations.exercise.intensity} • {recommendations.exercise.frequency}
            </span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
            {recommendations.exercise.suggestions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
