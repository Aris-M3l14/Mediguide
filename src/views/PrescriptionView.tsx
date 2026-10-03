import React, { useState } from 'react';
import { 
  Pill, 
  ShieldAlert, 
  Clock, 
  Calendar, 
  Utensils, 
  CheckCircle2, 
  ArrowRight, 
  FileText,
  Plus,
  Stethoscope,
  Apple,
  Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { SynchronizedContextBar } from '../components/HealthSyncCenter';

interface PrescriptionViewProps {
  onNavigateToTracker: () => void;
  onNavigate?: (view: string) => void;
  onOpenSyncCenter?: () => void;
}

export const PrescriptionView: React.FC<PrescriptionViewProps> = ({ 
  onNavigateToTracker,
  onNavigate,
  onOpenSyncCenter
}) => {
  const { t } = useLanguage();
  const { medications } = usePatient();
  const [synced, setSynced] = useState(false);

  const handleSyncAll = () => {
    setSynced(true);
    setTimeout(() => setSynced(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 text-teal-700">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('prescriptionTitle')}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Extracted from Physician Prescription Documents
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t('prescriptionSubtitle')}
        </p>

        {/* Clear Legal / Clinical Disclaimer */}
        <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-blue-950 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <span>
            {t('doctorPrescriptionNotice')}
          </span>
        </div>
      </div>

      {/* Synchronized Health Context Bar across the 5 modules */}
      <SynchronizedContextBar
        currentModule="medicine_tracker"
        onOpenSyncCenter={onOpenSyncCenter || (() => {})}
        onNavigate={onNavigate || onNavigateToTracker}
      />

      {/* Doctor Meta Header */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {t('prescribedBy')}
          </span>
          <h3 className="text-base font-bold text-slate-900">
            Dr. Anita Roy, MD (Consultant Cardiologist & Physician)
          </h3>
          <p className="text-xs text-slate-500">
            Apex Cardiology Institute • Reg No: MED-884920
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          {synced ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('syncedSuccess')}</span>
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              <span>{t('addToDailySchedule')}</span>
            </>
          )}
        </button>
      </div>

      {/* Medication List */}
      <div className="space-y-4">
        {medications.map((med, index) => (
          <div
            key={med.id}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {med.name}
                  </h3>
                  <span className="text-xs font-semibold text-teal-700">
                    {med.dosage}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  {med.frequency}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  med.timing === 'after_food'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : med.timing === 'before_food'
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {med.timing === 'after_food' ? t('afterFood') : med.timing === 'before_food' ? t('beforeFood') : med.timing}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  Scheduled Slot:
                </span>
                <span className="font-bold text-slate-800 capitalize">
                  {med.timeOfDay.join(', ')}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  {t('duration')}:
                </span>
                <span className="font-bold text-slate-800">
                  {med.duration}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5 text-teal-600" />
                  Food Rule:
                </span>
                <span className="font-bold text-slate-800">
                  {med.timing === 'before_food' ? 'Take 15-20 min before meals' : 'Take within 30 min after meals'}
                </span>
              </div>
            </div>

            {/* Doctor instructions */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700">
              <strong className="text-slate-900 block mb-0.5">{t('instructions')}:</strong>
              {med.doctorNotes}
            </div>

            {/* Cross-Module Synchronization Links */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs">
              <span className="text-[11px] text-slate-400 font-medium">Interconnected Clinical Links:</span>
              <div className="flex flex-wrap gap-1.5">
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('symptoms')}
                    className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Stethoscope className="w-3 h-3 text-teal-600" />
                    <span>Check Side-Effects in Symptoms</span>
                  </button>
                )}
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('diet_lifestyle')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Apple className="w-3 h-3 text-emerald-600" />
                    <span>Food Timing & Diet Plan</span>
                  </button>
                )}
                <button
                  onClick={onNavigateToTracker}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Pill className="w-3 h-3 text-indigo-600" />
                  <span>Dose Schedule</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to Medicine Tracker */}
      <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-teal-950 text-center sm:text-left">
          <p className="font-bold">Ready to track today’s doses?</p>
          <p className="text-teal-700">Check off your morning, afternoon, evening, and night doses in the tracker.</p>
        </div>
        <button
          onClick={onNavigateToTracker}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <span>Open Daily Tracker</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
