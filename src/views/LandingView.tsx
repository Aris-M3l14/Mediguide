import React from 'react';
import { 
  HeartPulse, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Pill, 
  Activity, 
  Stethoscope, 
  CalendarClock, 
  Bot, 
  Lock, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';

interface LandingViewProps {
  onGetStarted: () => void;
  onOpenDisclaimer: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onGetStarted, onOpenDisclaimer }) => {
  const { t, language } = useLanguage();
  const { loginAsDemo } = usePatient();

  const handleStartDemo = () => {
    loginAsDemo();
    onGetStarted();
  };

  const features = [
    {
      icon: Pill,
      title: t('feature1Title'),
      desc: t('feature1Desc'),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Activity,
      title: t('feature2Title'),
      desc: t('feature2Desc'),
      color: 'from-teal-500 to-emerald-500',
    },
    {
      icon: Stethoscope,
      title: t('feature3Title'),
      desc: t('feature3Desc'),
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: CalendarClock,
      title: t('feature4Title'),
      desc: t('feature4Desc'),
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Bot,
      title: t('feature5Title'),
      desc: t('feature5Desc'),
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: FileText,
      title: t('feature6Title'),
      desc: t('feature6Desc'),
      color: 'from-cyan-500 to-teal-500',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-teal-50/60 via-white to-slate-50 border-b border-slate-200/80 rounded-3xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Multilingual Healthcare Assistant • English • हिन्दी • Italiano</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            {t('heroTitle')}
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {t('heroSubtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartDemo}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm sm:text-base shadow-md shadow-teal-600/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{t('getStartedBtn')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenDisclaimer}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm sm:text-base transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Clinical Safety Pledge</span>
            </button>
          </div>

          {/* Safety Micro-Notice */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Zero paid lock-in. Works directly with realistic demo patient records.</span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-700">Comprehensive Health Toolset</h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {language === 'hi' ? 'आपके स्वास्थ्य प्रबंधन के लिए आधुनिक सुविधाएं' : language === 'it' ? 'Strumenti Moderni per la Tua Salute Quotidiana' : 'Everything You Need to Master Your Medical Records'}
          </h3>
          <p className="text-sm text-slate-600">
            {t('trustedByHeading')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-300 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {f.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Clinical Safeguards Enabled</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Patient Privacy & Safety Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Strict Clinical Governance</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              {language === 'hi' ? 'रोगी सुरक्षा और निष्पक्ष चिकित्सीय मार्गदर्शन' : language === 'it' ? 'Sicurezza del Paziente e Trasparenza Clinica' : 'Patient Safety & Clinical Boundary Principles'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              MediGuide AI assists in comprehension and medication management. It never prescribes drugs, guarantees diagnosis, or delays emergency care.
            </p>
          </div>

          <button
            onClick={handleStartDemo}
            className="flex-shrink-0 px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            Launch Live Demo
          </button>
        </div>
      </section>
    </div>
  );
};
