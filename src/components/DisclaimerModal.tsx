import React from 'react';
import { ShieldCheck, AlertCircle, X, Stethoscope, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-teal-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-teal-800 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Medical & Privacy Terms</h3>
              <p className="text-xs text-teal-100">MediGuide AI Patient Governance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-teal-200 hover:text-white hover:bg-teal-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm text-slate-600 leading-relaxed">
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-800 text-sm">Not a Doctor or Diagnostic Device</h4>
              <p className="text-xs mt-1 text-amber-900/90">
                {t('globalDisclaimerText')}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Stethoscope className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Prescription & Report Extraction</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'hi'
                    ? 'सभी दवाएं और खुराक केवल आपके डॉक्टर द्वारा जारी किए गए पर्चे से ली गई हैं। मेडिगाइड एआई कभी भी दवा की खुराक नहीं बदलता या नई दवाएं नहीं लिखता।'
                    : language === 'it'
                    ? 'Tutti i farmaci e le indicazioni sono trascritti fedelmente dalla ricetta del medico. MediGuide AI non altera né prescrive terapie in autonomia.'
                    : 'All medication records are parsed from doctor-authored prescriptions. MediGuide AI never independently recommends or changes pharmaceutical dosages.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Privacy & Local Storage First</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('privacyNotice')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm transition"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
