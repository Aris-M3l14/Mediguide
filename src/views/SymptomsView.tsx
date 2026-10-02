import React, { useState } from 'react';
import { 
  Stethoscope, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle, 
  Clock, 
  HeartHandshake, 
  PhoneCall, 
  Sparkles, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { aiService } from '../services/aiService';
import { SymptomAnalysisResult } from '../types';

interface SymptomsViewProps {
  initialQuery?: string;
  onOpenEmergency: () => void;
}

export const SymptomsView: React.FC<SymptomsViewProps> = ({ initialQuery = '', onOpenEmergency }) => {
  const { t, language } = useLanguage();
  const { profile } = usePatient();
  const [symptomInput, setSymptomInput] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomAnalysisResult | null>(() => {
    if (initialQuery) {
      // Trigger initial analysis
      return null;
    }
    return null;
  });

  const sampleChips = [
    {
      en: 'Mild fever and persistent dry cough for 2 days',
      hi: 'दो दिनों से हल्का बुखार और लगातार सूखी खांसी',
      it: 'Febbre lieve e tosse secca persistente da 2 giorni'
    },
    {
      en: 'Sudden severe crushing chest pain and breathlessness (Emergency Test)',
      hi: 'सीने में अचानक तेज दर्द और सांस फूलना (आपातकालीन परीक्षण)',
      it: 'Forte dolore improvviso al torace e affanno (Test Emergenza)'
    },
    {
      en: 'Dizziness and lightheadedness after morning blood pressure pill',
      hi: 'सुबह की बीपी की गोली लेने के बाद चक्कर और कमजोरी',
      it: 'Vertigini e stordimento dopo il farmaco antiipertensivo del mattino'
    },
    {
      en: 'Burning stomach pain and acid reflux after meals',
      hi: 'भोजन के बाद पेट में जलन और एसिडिटी',
      it: 'Bruciore di stomaco e reflusso acido dopo i pasti'
    }
  ];

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze || symptomInput;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await aiService.analyzeSymptoms({
        symptoms: text,
        language,
        patientProfile: profile
      });
      setResult(res);
      if (res.isEmergency) {
        onOpenEmergency();
      }
    } catch {
      // error handled in service
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (level: string) => {
    switch (level) {
      case 'emergency':
        return {
          bg: 'bg-red-100 text-red-800 border-red-300',
          label: t('severityEmergency'),
          icon: AlertTriangle
        };
      case 'high':
        return {
          bg: 'bg-orange-100 text-orange-800 border-orange-300',
          label: t('severityHigh'),
          icon: AlertTriangle
        };
      case 'moderate':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          label: t('severityModerate'),
          icon: Info
        };
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          label: t('severityLow'),
          icon: CheckCircle2
        };
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 text-teal-700">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('symptomCheckerTitle')}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Educational Severity Triage & Care Guidance
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t('symptomCheckerSubtitle')}
        </p>

        {/* Warning pill */}
        <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-amber-900 text-xs flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Clinical Safety Protocol:</strong> MediGuide AI evaluates potential causes and signs of urgency. It does NOT generate a formal medical diagnosis or prescribe drugs.
          </span>
        </div>
      </div>

      {/* Input box */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <label className="block text-sm font-bold text-slate-800">
          {t('symptomsInputLabel')}
        </label>

        <textarea
          value={symptomInput}
          onChange={(e) => setSymptomInput(e.target.value)}
          placeholder={t('describeSymptomsPlaceholder')}
          rows={4}
          className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition resize-none leading-relaxed"
        />

        {/* Quick select common chips */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {t('symptomsCommonChips')}
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleChips.map((chip, idx) => {
              const text = chip[language] || chip.en;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSymptomInput(text);
                    handleAnalyze(text);
                  }}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium transition cursor-pointer border border-transparent hover:border-teal-200 text-left"
                >
                  {text}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => handleAnalyze()}
          disabled={loading || !symptomInput.trim()}
          className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t('analyzingSymptoms')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t('checkSymptomsBtn')}</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Result Display */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Emergency Alert Banner if critical */}
          {result.isEmergency && (
            <div className="p-6 rounded-3xl bg-red-600 text-white shadow-xl space-y-4 border-2 border-red-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl animate-pulse">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold">{t('severityEmergency')}</h3>
                  <p className="text-xs text-red-100">Immediate In-Person Medical Attention Required</p>
                </div>
              </div>

              <p className="text-sm font-medium leading-relaxed bg-red-700/60 p-4 rounded-xl border border-red-500">
                {result.emergencyInstructions || 'Please call emergency dispatch (112 / 911 / 102) right away.'}
              </p>

              <button
                onClick={onOpenEmergency}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-red-700 hover:bg-red-50 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{t('callEmergency')}</span>
              </button>
            </div>
          )}

          {/* Results Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            {/* Top status bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {t('enteredSymptomsLabel')}
                </span>
                <p className="text-base font-bold text-slate-800 italic mt-0.5">
                  "{result.enteredSymptoms}"
                </p>
              </div>

              {/* Severity badge */}
              {(() => {
                const badge = getSeverityBadge(result.severity);
                const Icon = badge.icon;
                return (
                  <div className={`px-4 py-2 rounded-xl border font-bold text-xs flex items-center gap-2 flex-shrink-0 ${badge.bg}`}>
                    <Icon className="w-4 h-4" />
                    <span>{badge.label}</span>
                  </div>
                );
              })()}
            </div>

            {/* Possible Explanations */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                <span>{t('possibleExplanations')}</span>
              </h4>
              <div className="space-y-2">
                {result.explanations.map((exp, i) => (
                  <p key={i} className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {exp}
                  </p>
                ))}
              </div>
            </div>

            {/* Potential Causes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Possible Common Considerations
              </h4>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc list-inside bg-slate-50/50 p-4 rounded-xl">
                {result.possibleCauses.map((cause, i) => (
                  <li key={i}>{cause}</li>
                ))}
              </ul>
            </div>

            {/* When to see doctor */}
            <div className="space-y-2 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-amber-950">
              <h4 className="text-sm font-bold flex items-center gap-2 text-amber-900">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{t('whenToSeeDoctor')}</span>
              </h4>
              <ul className="text-xs sm:text-sm space-y-1.5 list-disc list-inside">
                {result.whenToConsultDoctor.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Self-care tips */}
            <div className="space-y-2 p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-teal-950">
              <h4 className="text-sm font-bold flex items-center gap-2 text-teal-900">
                <HeartHandshake className="w-4 h-4 text-teal-700" />
                <span>{t('selfCareTips')}</span>
              </h4>
              <ul className="text-xs sm:text-sm space-y-1.5 list-disc list-inside">
                {result.selfCareAdvice.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Disclaimer footer */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 italic">
              {t('symptomDisclaimerNote')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
