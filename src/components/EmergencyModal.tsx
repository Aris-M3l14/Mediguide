import React from 'react';
import { AlertTriangle, PhoneCall, X, ShieldAlert, HeartPulse } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  customMessage?: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, customMessage }) => {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border-2 border-red-500 overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-red-700/80 rounded-lg animate-pulse">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{t('emergencyTitle')}</h2>
              <p className="text-xs text-red-100 font-medium">Critical Clinical Safety Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-red-100 hover:text-white hover:bg-red-700 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 text-sm leading-relaxed">
            <p className="font-semibold text-base mb-1 flex items-center gap-1.5 text-red-700">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              {customMessage || t('emergencyDesc')}
            </p>
            <p className="text-xs text-red-800 mt-2">
              MediGuide AI is an educational assistant. It cannot provide acute emergency medicine or call emergency dispatch for you.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              {language === 'hi' ? 'तुरंत आपातकालीन नंबर पर कॉल करें:' : language === 'it' ? 'Numeri Nazionali di Emergenza:' : 'Call Emergency Numbers Immediately:'}
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="tel:112"
                className="flex items-center justify-between p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5" />
                  <span>112</span>
                </div>
                <span className="text-xs font-normal opacity-90">India / EU / SOS</span>
              </a>

              {language === 'it' ? (
                <a
                  href="tel:118"
                  className="flex items-center justify-between p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-5 h-5" />
                    <span>118</span>
                  </div>
                  <span className="text-xs font-normal opacity-90">Emergenza Italia</span>
                </a>
              ) : language === 'hi' ? (
                <a
                  href="tel:102"
                  className="flex items-center justify-between p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-5 h-5" />
                    <span>102 / 108</span>
                  </div>
                  <span className="text-xs font-normal opacity-90">एंबुलेंस (भारत)</span>
                </a>
              ) : (
                <a
                  href="tel:911"
                  className="flex items-center justify-between p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-5 h-5" />
                    <span>911</span>
                  </div>
                  <span className="text-xs font-normal opacity-90">USA / Canada</span>
                </a>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-red-500" />
              {language === 'hi' ? 'गंभीर आपातकालीन चेतावनी संकेत:' : language === 'it' ? 'Sintomi di allarme per cui agire subito:' : 'Red-Flag Symptoms Requiring Urgent Care:'}
            </h5>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>{language === 'hi' ? 'सीने में भारी दबाव, दर्द जो बांह या जबड़े तक फैले' : language === 'it' ? 'Forte dolore o oppressione al petto o al braccio sinistro' : 'Crushing chest pressure, pain radiating to left arm or jaw'}</li>
              <li>{language === 'hi' ? 'सांस लेने में भारी कठिनाई या सांस का अचानक रुकना' : language === 'it' ? 'Respiro improvvisamente corto o sensazione di soffocamento' : 'Sudden severe shortness of breath or inability to speak full sentences'}</li>
              <li>{language === 'hi' ? 'चेहरे का लटकना, बोलने में लड़खड़ाहट, हाथ में अचानक कमजोरी' : language === 'it' ? 'Bocca storta, difficoltà improvvisa a parlare, debolezza a un braccio (FAST)' : 'Facial drooping, arm weakness, or slurred speech (Signs of Stroke)'}</li>
              <li>{language === 'hi' ? 'गंभीर एलर्जी: गले में सूजन, सांस में सीटी की आवाज' : language === 'it' ? 'Reazione allergica acuta: gonfiore a gola o lingua, respiro sibilante' : 'Severe allergic swelling of lips, tongue, or throat'}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium transition"
          >
            {t('dismiss')}
          </button>
        </div>
      </div>
    </div>
  );
};
