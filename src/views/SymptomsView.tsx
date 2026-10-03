import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Calendar,
  MessageSquare,
  Copy,
  Save,
  Trash2,
  Activity,
  History,
  RotateCcw,
  UserCheck,
  Flame,
  Check,
  Zap,
  CalendarClock,
  Apple,
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { aiService } from '../services/aiService';
import { SymptomAnalysisResult, SymptomCheckRecord } from '../types';
import { SynchronizedContextBar } from '../components/HealthSyncCenter';

interface SymptomsViewProps {
  initialQuery?: string;
  onOpenEmergency: () => void;
  onAskAiAboutSymptoms?: (summary: string) => void;
  onNavigate?: (view: string) => void;
  onOpenSyncCenter?: () => void;
}

interface BodySystemGroup {
  id: string;
  icon: string;
  label: { en: string; hi: string; it: string };
  symptoms: { en: string; hi: string; it: string }[];
}

export const SymptomsView: React.FC<SymptomsViewProps> = ({ 
  initialQuery = '', 
  onOpenEmergency,
  onAskAiAboutSymptoms,
  onNavigate,
  onOpenSyncCenter
}) => {
  const { t, language } = useLanguage();
  const { 
    profile, 
    medications, 
    reports, 
    symptomHistory, 
    addSymptomCheck, 
    deleteSymptomCheck, 
    setDietFocus 
  } = usePatient();

  // Active view tab: 'checker' | 'history' | 'emergency_guide'
  const [activeTab, setActiveTab] = useState<'checker' | 'history' | 'emergency_guide'>('checker');

  // Input states
  const [symptomInput, setSymptomInput] = useState(initialQuery);
  const [selectedSystem, setSelectedSystem] = useState<string>('head');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>('1-3 days');
  const [intensity, setIntensity] = useState<number>(3); // 1-10
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomAnalysisResult | null>(null);
  const [copyToast, setCopyToast] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const bodySystems: BodySystemGroup[] = [
    {
      id: 'head',
      icon: '🧠',
      label: {
        en: 'Head & Brain',
        hi: 'सिर एवं तंत्रिका',
        it: 'Testa e Sistema Nervoso'
      },
      symptoms: [
        { en: 'Dull tension headache', hi: 'सिर में भारीपन और खिंचाव', it: 'Cefalea tensiva' },
        { en: 'Dizziness when standing up', hi: 'खड़े होने पर चक्कर आना', it: 'Vertigini posturali' },
        { en: 'Migraine with light sensitivity', hi: 'आधा सीसी का दर्द (माइग्रेन)', it: 'Emicrania con fotofobia' },
        { en: 'Difficulty concentrating / brain fog', hi: 'एकाग्रता में कमी / मानसिक थकान', it: 'Nebbia mentale / difficoltà di concentrazione' },
      ]
    },
    {
      id: 'chest',
      icon: '🫁',
      label: {
        en: 'Chest & Respiration',
        hi: 'छाती एवं श्वसन',
        it: 'Torace e Respirazione'
      },
      symptoms: [
        { en: 'Persistent dry cough', hi: 'लगातार सूखी खांसी', it: 'Tosse secca persistente' },
        { en: 'Mild chest tightness / pressure', hi: 'सीने में भारीपन या कसाव', it: 'Oppressione toracica' },
        { en: 'Shortness of breath on walking', hi: 'चलने पर सांस फूलना', it: 'Fiato corto dopo sforzo' },
        { en: 'Sore throat & scratchiness', hi: 'गले में खराश और दर्द', it: 'Bruciore alla gola' },
      ]
    },
    {
      id: 'heart',
      icon: '❤️',
      label: {
        en: 'Heart & Pulse',
        hi: 'हृदय एवं रक्तचाप',
        it: 'Cuore e Circolazione'
      },
      symptoms: [
        { en: 'Rapid or fluttering heartbeats (Palpitations)', hi: 'दिल की धड़कन तेज होना (घबराहट)', it: 'Palpitazioni / battito accelerato' },
        { en: 'Swelling in ankles/feet', hi: 'पैरों या टखनों में सूजन', it: 'Gonfiore a piedi o caviglie' },
        { en: 'Feeling faint or lightheaded', hi: 'बेहोशी जैसा लगना / कमजोरी', it: 'Sensazione di svenimento' },
      ]
    },
    {
      id: 'stomach',
      icon: '🥣',
      label: {
        en: 'Stomach & Digestion',
        hi: 'पेट एवं पाचन',
        it: 'Stomaco e Digestione'
      },
      symptoms: [
        { en: 'Burning stomach pain / acid reflux', hi: 'पेट में जलन और खट्टी डकार', it: 'Bruciore gastrico / reflusso acido' },
        { en: 'Nausea after meals', hi: 'भोजन के बाद जी मिचलाना', it: 'Nausea post-prandiale' },
        { en: 'Abdominal bloating & gas', hi: 'पेट फूलना और गैस बनना', it: 'Gonfiore addominale' },
        { en: 'Mild diarrhea or loose stools', hi: 'दस्त या पेट में मरोड़', it: 'Feci liquide / crampi addominali' },
      ]
    },
    {
      id: 'body',
      icon: '🦴',
      label: {
        en: 'Muscles & Whole Body',
        hi: 'मांसपेशियां एवं शरीर',
        it: 'Muscoli e Corpo'
      },
      symptoms: [
        { en: 'Persistent generalized fatigue', hi: 'पूरे शरीर में लगातार थकान', it: 'Stanchezza cronica' },
        { en: 'Lower back stiffness', hi: 'कमर में दर्द और जकड़न', it: 'Rigidità lombare' },
        { en: 'Muscle aches / soreness', hi: 'मांसपेशियों में दर्द', it: 'Dolori muscolari diffusi' },
        { en: 'Joint pain in knees or fingers', hi: 'जोड़ों या घुटनों में दर्द', it: 'Dolori articolari' },
      ]
    },
    {
      id: 'fever',
      icon: '🌡️',
      label: {
        en: 'Fever & Infection',
        hi: 'बुखार एवं संक्रमण',
        it: 'Febbre e Infezione'
      },
      symptoms: [
        { en: 'Low-grade fever (99°-100.4°F)', hi: 'हल्का बुखार (99°-100.4°F)', it: 'Lieve febbre (37.5°-38°C)' },
        { en: 'Chills and shivering', hi: 'कंपकंपी और ठंड लगना', it: 'Brividi di freddo' },
        { en: 'Night sweats', hi: 'रात में पसीना आना', it: 'Sudorazioni notturne' },
      ]
    },
    {
      id: 'skin',
      icon: '🛡️',
      label: {
        en: 'Skin & Allergies',
        hi: 'त्वचा एवं एलर्जी',
        it: 'Pelle e Allergie'
      },
      symptoms: [
        { en: 'Itchy skin rash or hives', hi: 'त्वचा पर खुजली वाले लाल दाने (पित्ती)', it: 'Eruzione cutanea pruriginosa / orticaria' },
        { en: 'Dry peeling patches', hi: 'त्वचा का सूखापन व पपड़ी', it: 'Secchezza cutanea' },
        { en: 'Facial swelling or lip irritation', hi: 'होठों या चेहरे पर सूजन', it: 'Gonfiore al viso o labbra' },
      ]
    }
  ];

  const durations = [
    { id: '< 24 hours', label: { en: '< 24 Hours', hi: '< 24 घंटे', it: '< 24 Ore' } },
    { id: '1-3 days', label: { en: '1 - 3 Days', hi: '1 - 3 दिन', it: '1 - 3 Giorni' } },
    { id: '4-7 days', label: { en: '4 - 7 Days', hi: '4 - 7 दिन', it: '4 - 7 Giorni' } },
    { id: '> 1 week', label: { en: '> 1 Week', hi: '> 1 सप्ताह', it: '> 1 Settimana' } },
    { id: 'Sudden onset', label: { en: 'Sudden Onset', hi: 'अचानक शुरू हुआ', it: 'Esordio Improvviso' } },
  ];

  // Auto-analyze if initialQuery is passed
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setSymptomInput(initialQuery);
      handleAnalyze(initialQuery);
    }
  }, [initialQuery]);

  // Toggle quick tag in symptom query
  const handleToggleTag = (tagText: string) => {
    let updatedTags: string[];
    if (selectedTags.includes(tagText)) {
      updatedTags = selectedTags.filter(t => t !== tagText);
    } else {
      updatedTags = [...selectedTags, tagText];
    }
    setSelectedTags(updatedTags);

    // Update input text
    const customParts = symptomInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s && !selectedTags.includes(s));

    const combined = [...customParts, ...updatedTags].join(', ');
    setSymptomInput(combined);
  };

  const handleAnalyze = async (overrideText?: string) => {
    const text = overrideText || symptomInput;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const enrichedQuery = `${text}. Duration: ${duration}. Discomfort Level: ${intensity}/10.`;
      const res = await aiService.analyzeSymptoms({
        symptoms: enrichedQuery,
        language,
        patientProfile: profile
      });

      setResult(res);

      if (res.isEmergency) {
        onOpenEmergency();
      }
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHistory = () => {
    if (!result) return;
    const newRecord: SymptomCheckRecord = {
      id: `hist_${Date.now()}`,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      symptoms: symptomInput,
      bodyRegion: bodySystems.find(b => b.id === selectedSystem)?.label[language] || 'General',
      duration,
      intensity,
      result
    };
    addSymptomCheck(newRecord);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleDeleteHistoryItem = (id: string) => {
    deleteSymptomCheck(id);
  };

  const handleCopySummary = () => {
    if (!result) return;
    const summary = `--- MediGuide AI Symptom Triage Report ---
Date: ${new Date().toLocaleDateString()}
Patient: ${profile.name} (${profile.age}y, ${profile.gender})
Conditions: ${profile.existingConditions.join(', ')}
Allergies: ${profile.allergies.join(', ')}

Symptoms: ${result.enteredSymptoms}
Duration: ${duration} | Severity: ${result.severity.toUpperCase()} | Discomfort: ${intensity}/10
Recommended Action: ${result.timeframe || 'Consult physician'}
Specialist: ${result.recommendedSpecialist || 'General Physician'}

Possible Explanations:
${result.explanations.map(e => `• ${e}`).join('\n')}

When to Consult Doctor:
${result.whenToConsultDoctor.map(w => `• ${w}`).join('\n')}

Self-Care Advice:
${result.selfCareAdvice.map(s => `• ${s}`).join('\n')}

*Note: Educational triage, not an official diagnosis.*`;

    navigator.clipboard.writeText(summary);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 3000);
  };

  const handleDiscussInChat = () => {
    if (!result || !onAskAiAboutSymptoms) return;
    const prompt = `I just analyzed my symptoms with MediGuide AI:\n"${result.enteredSymptoms}".\nSeverity assessed: ${result.severity}. Timeframe: ${result.timeframe}.\nCan you give me deeper advice on what questions to ask my doctor and what self-care precautions I should take based on my profile?`;
    onAskAiAboutSymptoms(prompt);
  };

  const getSeverityBadge = (level: string) => {
    switch (level) {
      case 'emergency':
        return {
          bg: 'bg-red-600 text-white border-red-700 shadow-sm shadow-red-500/30',
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
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
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

  const getIntensityLabel = (val: number) => {
    if (val <= 3) return { text: 'Mild Discomfort (1–3)', color: 'text-emerald-700' };
    if (val <= 6) return { text: 'Moderate Pain (4–6)', color: 'text-amber-700' };
    return { text: 'Severe / Intense Discomfort (7–10)', color: 'text-rose-700' };
  };

  const currentSystemObj = bodySystems.find(b => b.id === selectedSystem) || bodySystems[0];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-teal-700">
            <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600 shadow-xs">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {t('symptomCheckerTitle')}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 uppercase">
                  Interactive Triage
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Clinical Safety Protocol • Severity Grading • Medical Triage Guidance
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('checker')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'checker' ? 'bg-white text-teal-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Check Symptoms
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history' ? 'bg-white text-teal-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History ({symptomHistory.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('emergency_guide')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'emergency_guide' ? 'bg-white text-red-600 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span className="text-red-700">Emergency Red Flags</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t('symptomCheckerSubtitle')}
        </p>

        {/* Live Patient Context Indicator */}
        <div className="p-3 bg-teal-50/80 border border-teal-200/80 rounded-2xl text-teal-950 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>
              <strong>Evaluating for:</strong> {profile.name} ({profile.age}y, {profile.bloodGroup})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.existingConditions.map((c, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-teal-200/60 text-teal-900 text-[10px] font-semibold">
                {c}
              </span>
            ))}
            {profile.allergies.map((a, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-rose-200/60 text-rose-900 text-[10px] font-semibold">
                Allergy: {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Synchronized Health Context Bar across the 5 modules */}
      <SynchronizedContextBar
        currentModule="symptom_checker"
        onOpenSyncCenter={onOpenSyncCenter || (() => {})}
        onNavigate={onNavigate || (() => {})}
      />

      {/* TAB 1: SYMPTOM CHECKER */}
      {activeTab === 'checker' && (
        <div className="space-y-6">
          {/* Step 1: Body System Navigation */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
                <span>Step 1: Choose Affected Body System</span>
              </span>
              <span className="text-[11px] text-slate-400">Click to explore quick symptoms</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {bodySystems.map((system) => {
                const isSelected = selectedSystem === system.id;
                return (
                  <button
                    key={system.id}
                    onClick={() => setSelectedSystem(system.id)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs scale-102 font-bold'
                        : 'bg-slate-50 border-slate-200/80 hover:bg-teal-50 hover:border-teal-200 text-slate-700'
                    }`}
                  >
                    <span className="text-xl">{system.icon}</span>
                    <span className="text-[11px] font-semibold leading-tight line-clamp-1">
                      {system.label[language] || system.label.en}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Step 2: Interactive Symptom Tags for chosen system */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>Quick-Select Symptoms for {currentSystemObj.label[language] || currentSystemObj.label.en}:</span>
              </span>

              <div className="flex flex-wrap gap-2">
                {currentSystemObj.symptoms.map((symptom, idx) => {
                  const label = symptom[language] || symptom.en;
                  const isChecked = selectedTags.includes(label);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleTag(label)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition cursor-pointer flex items-center gap-1.5 border ${
                        isChecked
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 3: Natural Language Input & Duration & Pain Slider */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold text-slate-800">
                  {t('symptomsInputLabel')}
                </label>
                {symptomInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSymptomInput('');
                      setSelectedTags([]);
                      setResult(null);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear text</span>
                  </button>
                )}
              </div>
              <textarea
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder={t('describeSymptomsPlaceholder')}
                rows={3}
                className="w-full p-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition resize-none leading-relaxed"
              />
            </div>

            {/* Duration Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                How long have these symptoms persisted?
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {durations.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDuration(d.id)}
                    className={`py-2 px-3 rounded-xl border font-semibold transition cursor-pointer text-center ${
                      duration === d.id
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {d.label[language] || d.label.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Pain / Discomfort Intensity Slider */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Pain / Discomfort Intensity Scale:</span>
                </span>
                <span className={`text-xs font-extrabold ${getIntensityLabel(intensity).color}`}>
                  {getIntensityLabel(intensity).text}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                <span>1 - Barely noticeable</span>
                <span>5 - Distracting / Moderate</span>
                <span>10 - Incapacitating / Severe</span>
              </div>
            </div>

            {/* Submit Button */}
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
                  <span>Run Clinical Symptom Analysis</span>
                </>
              )}
            </button>
          </div>

          {/* Analysis Results Display */}
          {result && (
            <div className="space-y-4 animate-fade-in">
              {/* Emergency Alert Banner if critical */}
              {result.isEmergency && (
                <div className="p-6 rounded-3xl bg-red-600 text-white shadow-xl space-y-4 border-2 border-red-700 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/20 rounded-2xl">
                      <AlertTriangle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">{t('severityEmergency')}</h3>
                      <p className="text-xs text-red-100 font-medium">Critical Triage: Do not rely on AI advice. Immediate Emergency Dispatch Required.</p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold leading-relaxed bg-red-700/80 p-4 rounded-2xl border border-red-500">
                    {result.emergencyInstructions || 'Please call emergency dispatch (112 / 911 / 102) right away.'}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={onOpenEmergency}
                      className="px-6 py-3 rounded-xl bg-white text-red-700 hover:bg-red-50 font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>{t('callEmergency')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Structured Results Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                {/* Top status bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {t('enteredSymptomsLabel')}
                    </span>
                    <p className="text-base font-bold text-slate-900 italic">
                      "{result.enteredSymptoms}"
                    </p>
                    <p className="text-xs text-slate-500">
                      Duration: <strong>{duration}</strong> • Intensity: <strong>{intensity}/10</strong>
                    </p>
                  </div>

                  {/* Severity badge */}
                  {(() => {
                    const badge = getSeverityBadge(result.severity);
                    const Icon = badge.icon;
                    return (
                      <div className={`px-4 py-2.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center gap-2 flex-shrink-0 ${badge.bg}`}>
                        <Icon className="w-4 h-4" />
                        <span>{badge.label}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Triage Urgency Timeline Banner */}
                {result.timeframe && (
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm text-teal-950 font-bold">
                      <Clock className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span>Recommended Action Timeline:</span>
                      <span className="text-teal-700 underline underline-offset-2">{result.timeframe}</span>
                    </div>
                    {result.recommendedSpecialist && (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-teal-300 text-teal-800">
                        👨‍⚕️ {result.recommendedSpecialist}
                      </span>
                    )}
                  </div>
                )}

                {/* Patient Profile Correlation Alert */}
                {result.relatedConditionsInProfile && result.relatedConditionsInProfile.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Patient Profile Risk Correlation:</span>
                    </div>
                    <p className="leading-relaxed">
                      These symptoms may intersect with your registered condition(s): <strong>{result.relatedConditionsInProfile.join(', ')}</strong>. Monitor blood pressure and blood glucose closely.
                    </p>
                  </div>
                )}

                {/* Possible Explanations */}
                <div className="space-y-2.5">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                    <span>{t('possibleExplanations')}</span>
                  </h4>
                  <div className="space-y-2">
                    {result.explanations.map((exp, i) => (
                      <p key={i} className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        {exp}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Common Diagnostic Considerations */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Common Differential Considerations
                  </h4>
                  <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc list-inside bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    {result.possibleCauses.map((cause, i) => (
                      <li key={i}>{cause}</li>
                    ))}
                  </ul>
                </div>

                {/* When to see a doctor */}
                <div className="space-y-2 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950">
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

                {/* Questions for Doctor */}
                {result.questionsForDoctor && result.questionsForDoctor.length > 0 && (
                  <div className="space-y-2 p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 text-blue-950">
                    <h4 className="text-sm font-bold flex items-center gap-2 text-blue-900">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span>Suggested Questions to Ask Your Physician:</span>
                    </h4>
                    <ul className="text-xs sm:text-sm space-y-1 list-disc list-inside text-blue-900/90">
                      {result.questionsForDoctor.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Supportive Home Care Tips */}
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

                {/* 5-Module Interconnection Hub */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 via-slate-50 to-indigo-50 border border-teal-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-teal-600" />
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">Synchronized System Cross-References:</span>
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 uppercase bg-teal-100 px-2 py-0.5 rounded">
                      Live Signals
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {/* Medicine Tracker connection */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <CalendarClock className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Medicine Tracker</span>
                        </span>
                        {onNavigate && (
                          <button
                            onClick={() => onNavigate('medicines')}
                            className="text-[11px] text-indigo-600 hover:underline font-semibold cursor-pointer"
                          >
                            Check Doses →
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {medications.length} active medications on file ({medications.map(m => m.name).join(', ')}). Cross-checked for dose timing & side-effects.
                      </p>
                    </div>

                    {/* Report Explainer connection */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-amber-600" />
                          <span>Report Explainer</span>
                        </span>
                        {onNavigate && (
                          <button
                            onClick={() => onNavigate('report_explanation')}
                            className="text-[11px] text-amber-700 hover:underline font-semibold cursor-pointer"
                          >
                            View Lab Values →
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Latest fasting glucose: 118 mg/dL & LDL: 138 mg/dL. Evaluated against systemic metabolic indicators.
                      </p>
                    </div>

                    {/* Diet & Lifestyle connection */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Apple className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Diet & Lifestyle</span>
                        </span>
                        {onNavigate && (
                          <button
                            onClick={() => {
                              setDietFocus('Gentle GI / Anti-Reflux & DASH (Temporary Digestive Adjustment)');
                              onNavigate('diet_lifestyle');
                            }}
                            className="text-[11px] text-emerald-700 hover:underline font-semibold cursor-pointer"
                          >
                            Sync to Diet Plan →
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Click to adapt your nutritional and hydration plan automatically based on these reported symptoms.
                      </p>
                    </div>

                    {/* Medical Recorder connection */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>Medical Recorder</span>
                        </span>
                        {onNavigate && (
                          <button
                            onClick={() => onNavigate('records')}
                            className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                          >
                            View Records →
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Incident safely queued with diagnostic and cardiology prescription archives on record.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Bar (Save, Copy, Discuss in AI Chat) */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleSaveToHistory}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 text-teal-600" />
                      <span>Save to History</span>
                    </button>

                    <button
                      onClick={handleCopySummary}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-teal-600" />
                      <span>Copy for Doctor</span>
                    </button>
                  </div>

                  {onAskAiAboutSymptoms && (
                    <button
                      onClick={handleDiscussInChat}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Discuss with AI Assistant</span>
                    </button>
                  )}
                </div>

                {copyToast && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold animate-fade-in flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Formatted clinical summary copied to clipboard!</span>
                  </div>
                )}

                {saveToast && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold animate-fade-in flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Symptom check saved to your timeline!</span>
                  </div>
                )}

                {/* Disclaimer footer */}
                <div className="pt-2 text-[11px] text-slate-400 italic">
                  {t('symptomDisclaimerNote')}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SYMPTOM HISTORY */}
      {activeTab === 'history' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">Your Symptom Check History</h2>
            </div>
            <span className="text-xs text-slate-500">{symptomHistory.length} records logged</span>
          </div>

          {symptomHistory.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <History className="w-8 h-8 mx-auto text-slate-300" />
              <p>No saved symptom checks yet. Run an evaluation and click "Save to History".</p>
            </div>
          ) : (
            <div className="space-y-3">
              {symptomHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all space-y-2 bg-slate-50/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">{item.timestamp}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                        {item.bodyRegion}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.result.severity === 'emergency' ? 'bg-red-600 text-white' : item.result.severity === 'high' ? 'bg-orange-100 text-orange-800' : item.result.severity === 'moderate' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.result.severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          setSymptomInput(item.symptoms);
                          setResult(item.result);
                          setActiveTab('checker');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold transition cursor-pointer"
                      >
                        Reload Review
                      </button>
                      <button
                        onClick={() => handleDeleteHistoryItem(item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    "{item.symptoms}"
                  </p>

                  <div className="text-xs text-slate-500 flex flex-wrap gap-4 pt-1">
                    <span>Duration: <strong>{item.duration}</strong></span>
                    <span>Pain Scale: <strong>{item.intensity}/10</strong></span>
                    <span>Action: <strong>{item.result.timeframe || 'Doctor Consultation'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EMERGENCY RED FLAGS REFERENCE */}
      {activeTab === 'emergency_guide' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Clinical Emergency Red Flags</h2>
                <p className="text-xs text-slate-500">Conditions that require calling 911 / 112 / 102 immediately</p>
              </div>
            </div>
            <button
              onClick={onOpenEmergency}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Emergency Dispatch</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
              <h3 className="text-sm font-bold text-red-900">1. Cardiovascular (Heart Attack)</h3>
              <ul className="text-xs text-red-950 space-y-1 list-disc list-inside">
                <li>Heavy crushing pressure, squeezing in center of chest</li>
                <li>Pain radiating to left arm, back, neck, or jaw</li>
                <li>Cold sweats accompanied by nausea and lightheadedness</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
              <h3 className="text-sm font-bold text-red-900">2. Neurological (Stroke - FAST Signs)</h3>
              <ul className="text-xs text-red-950 space-y-1 list-disc list-inside">
                <li><strong>F</strong>ace drooping on one side</li>
                <li><strong>A</strong>rm drift or sudden unilateral weakness</li>
                <li><strong>S</strong>peech slurred or inability to comprehend</li>
                <li><strong>T</strong>ime to call emergency dispatch immediately</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
              <h3 className="text-sm font-bold text-red-900">3. Severe Respiratory Distress</h3>
              <ul className="text-xs text-red-950 space-y-1 list-disc list-inside">
                <li>Gasping for air or unable to complete short sentences</li>
                <li>Bluish lips or fingertips (cyanosis)</li>
                <li>Stridor or audible high-pitched whistling during inhalation</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
              <h3 className="text-sm font-bold text-red-900">4. Anaphylaxis (Severe Allergy)</h3>
              <ul className="text-xs text-red-950 space-y-1 list-disc list-inside">
                <li>Rapid swelling of tongue, lips, or throat</li>
                <li>Sudden severe hives spreading rapidly with breathlessness</li>
                <li>Severe dizziness, hypotension, or loss of consciousness</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
