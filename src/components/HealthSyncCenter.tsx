import React, { useState } from 'react';
import { 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Stethoscope, 
  FileText, 
  Apple, 
  CalendarClock, 
  Activity, 
  X, 
  Sparkles,
  Zap,
  Info,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { SyncModuleType } from '../types';

interface HealthSyncCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const HealthSyncCenterModal: React.FC<HealthSyncCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { 
    medications, 
    reports, 
    symptomHistory, 
    dietFocus, 
    syncInsights, 
    lastSyncTime, 
    triggerFullSync 
  } = usePatient();

  const [syncing, setSyncing] = useState(false);
  const [selectedModule, setSelectedModule] = useState<SyncModuleType>('symptom_checker');

  if (!isOpen) return null;

  const handleManualSync = () => {
    setSyncing(true);
    setTimeout(() => {
      triggerFullSync();
      setSyncing(false);
    }, 600);
  };

  const modules = [
    {
      id: 'symptom_checker' as SyncModuleType,
      view: 'symptoms',
      name: '1. Symptom Checker',
      icon: Stethoscope,
      color: 'teal',
      badge: `${symptomHistory.length} checks logged`,
      incoming: 'Informed by Medicine Tracker (active doses) and Report Explainer (abnormal biomarkers).',
      outgoing: 'Sends incident records to Medical Recorder and adapts digestive recommendations in Diet & Lifestyle.'
    },
    {
      id: 'medical_recorder' as SyncModuleType,
      view: 'records',
      name: '2. Medical Recorder',
      icon: FileText,
      color: 'blue',
      badge: `${reports.length} records on file`,
      incoming: 'Receives diagnostic PDFs, prescription photos, and user symptom check summaries.',
      outgoing: 'Feeds prescription medications to Medicine Tracker and lab panels into Report Explainer.'
    },
    {
      id: 'diet_lifestyle' as SyncModuleType,
      view: 'diet_lifestyle',
      name: '3. Diet & Lifestyle',
      icon: Apple,
      color: 'emerald',
      badge: dietFocus.slice(0, 22) + '...',
      incoming: 'Directly driven by Report Explainer biomarkers (Glucose/LDL) and Symptom Checker digestive alerts.',
      outgoing: 'Guides medication food timings (before/after meals) in Medicine Tracker.'
    },
    {
      id: 'medicine_tracker' as SyncModuleType,
      view: 'medicines',
      name: '4. Medicine Tracker',
      icon: CalendarClock,
      color: 'indigo',
      badge: `${medications.length} active meds`,
      incoming: 'Populated from Medical Recorder prescriptions and synchronized with Diet meal schedules.',
      outgoing: 'Supplies dose times and side-effect profiles to Symptom Checker.'
    },
    {
      id: 'report_explainer' as SyncModuleType,
      view: 'report_explanation',
      name: '5. Report Explainer',
      icon: Activity,
      color: 'amber',
      badge: '9 parameters live',
      incoming: 'Decodes diagnostic documents from Medical Recorder into simplified plain language.',
      outgoing: 'Provides critical biomarker triggers (HbA1c, Cholesterol, Creatinine) to Diet, Lifestyle & Triage.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 px-6 py-5 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-xs">
              <Zap className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  Integrated Health Synchronization Engine
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-slate-950 uppercase">
                  5 Systems Live
                </span>
              </div>
              <p className="text-xs text-teal-100 mt-0.5">
                Real-time bidirectional synchronization between Symptoms, Records, Diet, Medicines & Reports
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync All Now</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-teal-200 hover:text-white hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sync Status Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800">Interconnected Health Pipeline:</span>
            <span>All 5 systems synced simultaneously</span>
          </div>
          <span className="text-slate-400">Last synchronized: <strong>{lastSyncTime}</strong></span>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Interactive Flow Visualizer (5 Connected Nodes) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Interactive System Synchronization Map (Select a module to inspect connections):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {modules.map((mod) => {
                const Icon = mod.icon;
                const isSelected = selectedModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setSelectedModule(mod.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-28 ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 shadow-sm ring-2 ring-teal-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {mod.name.replace(/^\d+\.\s*/, '')}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {mod.badge}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Module Detail Inspector */}
          {(() => {
            const currentMod = modules.find(m => m.id === selectedModule) || modules[0];
            const Icon = currentMod.icon;
            return (
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-teal-600 text-white shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {currentMod.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Status: <strong className="text-emerald-700">Synchronized & Autonomous</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onNavigate(currentMod.view);
                    }}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <span>Launch {currentMod.name.replace(/^\d+\.\s*/, '')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Incoming */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                    <span className="font-bold text-teal-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>Incoming Synchronized Signals:</span>
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {currentMod.incoming}
                    </p>
                  </div>

                  {/* Outgoing */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                    <span className="font-bold text-indigo-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Outgoing Synchronized Signals:</span>
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {currentMod.outgoing}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Real-time Cross-Module Insights Log */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Cross-Module Data Signals ({syncInsights.length}):
            </h3>

            <div className="space-y-2.5">
              {syncInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        insight.severity === 'important'
                          ? 'bg-rose-100 text-rose-800'
                          : insight.severity === 'caution'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {insight.severity}
                      </span>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                        {insight.title}
                      </h5>
                      <span className="text-[10px] text-slate-400">• {insight.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>

                  {insight.actionLabel && insight.actionTargetView && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate(insight.actionTargetView!);
                      }}
                      className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer self-end sm:self-auto"
                    >
                      <span>{insight.actionLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <span>MediGuide Synchronous Health Kernel v2.4</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition"
          >
            Close Synchronization Center
          </button>
        </div>
      </div>
    </div>
  );
};

interface SynchronizedContextBarProps {
  currentModule: SyncModuleType;
  onOpenSyncCenter: () => void;
  onNavigate: (view: string) => void;
}

export const SynchronizedContextBar: React.FC<SynchronizedContextBarProps> = ({
  currentModule,
  onOpenSyncCenter,
  onNavigate
}) => {
  const { medications, reports, symptomHistory, dietFocus } = usePatient();

  const getModuleSummary = () => {
    switch (currentModule) {
      case 'symptom_checker':
        return {
          pill: 'Symptom Triage Active',
          detail: `Cross-referencing ${medications.length} active medications for known side-effects & ${reports.length} lab records for underlying causes.`,
          relatedLinks: [
            { label: 'Medicine Tracker', view: 'medicines' },
            { label: 'Lab Reports', view: 'report_explanation' },
          ]
        };
      case 'medical_recorder':
        return {
          pill: 'Records Hub Synchronized',
          detail: `${reports.length} documents decoded: Prescriptions auto-populate Medicine Tracker; blood tests stream to Report Explainer & Diet rules.`,
          relatedLinks: [
            { label: 'View in Report Explainer', view: 'report_explanation' },
            { label: 'Daily Medicine Schedule', view: 'medicines' },
          ]
        };
      case 'diet_lifestyle':
        return {
          pill: 'Diet Synchronized',
          detail: `Focus: "${dietFocus}". Automatically adjusted to your latest Fasting Glucose (118 mg/dL) & Metformin meal timings.`,
          relatedLinks: [
            { label: 'Inspect Lab Biomarkers', view: 'report_explanation' },
            { label: 'Review Medication Timings', view: 'medicines' },
          ]
        };
      case 'medicine_tracker':
        return {
          pill: 'Medicines Synchronized',
          detail: `${medications.length} medications synced from Dr. Roy prescription. Timed with Diet meals. Cross-referenced in Symptom Checker.`,
          relatedLinks: [
            { label: 'View Doctor Prescription', view: 'prescription' },
            { label: 'Check Side Effects in Symptoms', view: 'symptoms' },
          ]
        };
      case 'report_explainer':
        return {
          pill: 'Biomarkers Synchronized',
          detail: `9 parameters decoded from Medical Recorder. Borderline Fasting Sugar (118) and LDL (138) actively guide Diet & Lifestyle.`,
          relatedLinks: [
            { label: 'Sync to Diet & Lifestyle', view: 'diet_lifestyle' },
            { label: 'Correlate with Symptoms', view: 'symptoms' },
          ]
        };
    }
  };

  const info = getModuleSummary();

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 via-cyan-50/50 to-white border border-teal-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-xl bg-teal-600 text-white shadow-2xs flex-shrink-0">
          <Zap className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-teal-950 uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-teal-100/80 text-teal-800">
              {info.pill}
            </span>
            <span className="text-[11px] text-teal-700 font-semibold hidden md:inline">
              Integrated Sync Active
            </span>
          </div>
          <p className="text-slate-600 text-[11px] sm:text-xs">
            {info.detail}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
        <div className="hidden lg:flex items-center gap-1.5">
          {info.relatedLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(link.view)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-teal-300 hover:text-teal-700 text-slate-700 text-[11px] font-semibold transition cursor-pointer"
            >
              {link.label} →
            </button>
          ))}
        </div>

        <button
          onClick={onOpenSyncCenter}
          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Sync Hub</span>
        </button>
      </div>
    </div>
  );
};
