import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ChevronRight, 
  FileText, 
  MessageSquare, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { LabParameter } from '../types';

interface ReportExplanationViewProps {
  initialReportId?: string;
  onAskAiAboutReport: (prompt: string) => void;
}

export const ReportExplanationView: React.FC<ReportExplanationViewProps> = ({
  initialReportId,
  onAskAiAboutReport
}) => {
  const { t, language } = useLanguage();
  const { reports } = usePatient();

  // Find reports that have parameters (lab reports)
  const labReports = reports.filter(r => r.parameters && r.parameters.length > 0);
  const [selectedReportId, setSelectedReportId] = useState<string>(
    initialReportId || (labReports[0]?.id || '')
  );
  const [selectedParam, setSelectedParam] = useState<LabParameter | null>(
    labReports[0]?.parameters[0] || null
  );

  const currentReport = labReports.find(r => r.id === selectedReportId) || labReports[0];

  const getStatusBadge = (status: 'normal' | 'borderline' | 'abnormal') => {
    switch (status) {
      case 'normal':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: t('statusNormal'),
          icon: CheckCircle2
        };
      case 'borderline':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          label: t('statusBorderline'),
          icon: AlertCircle
        };
      case 'abnormal':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          label: t('statusAbnormal'),
          icon: AlertCircle
        };
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 text-teal-700">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('reportExplainerTitle')}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Simplified Clinical Test Breakdown & Reference Interpretation
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t('reportExplainerSubtitle')}
        </p>

        {/* Report Selector Dropdown */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs font-bold text-slate-700 flex-shrink-0">
            {t('selectReport')}
          </label>
          <select
            value={currentReport?.id || ''}
            onChange={(e) => {
              setSelectedReportId(e.target.value);
              const rep = labReports.find(r => r.id === e.target.value);
              if (rep && rep.parameters.length > 0) {
                setSelectedParam(rep.parameters[0]);
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
          >
            {labReports.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentReport && (
        <>
          {/* Executive AI Summary Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-teal-800 to-cyan-800 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2 text-teal-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>{t('aiSummaryTitle')}</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-teal-50">
              {currentReport.summary?.[language] || currentReport.summary?.en}
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-teal-200">
              <span>Diagnostic Facility: {currentReport.facility}</span>
              <button
                onClick={() => onAskAiAboutReport(`Please explain my ${currentReport.title} report in detail.`)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Discuss with AI Assistant</span>
              </button>
            </div>
          </div>

          {/* Main Grid: Parameters Table (Left) & Detail Card (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Parameters List (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Lab Parameters in This Panel ({currentReport.parameters.length})
              </h3>

              <div className="space-y-2.5">
                {currentReport.parameters.map((param, index) => {
                  const badge = getStatusBadge(param.status);
                  const isSelected = selectedParam?.name === param.name;

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedParam(param)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-teal-50/70 border-teal-500 shadow-sm ring-2 ring-teal-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">
                          {param.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Reference: {param.referenceRange}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-slate-900 block">
                            {param.result} <span className="text-xs font-normal text-slate-500">{param.unit}</span>
                          </span>
                        </div>

                        <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${badge.bg}`}>
                          {badge.label}
                        </span>

                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-teal-600 translate-x-0.5' : 'text-slate-300'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Parameter Detail View (5 cols) */}
            <div className="lg:col-span-5">
              {selectedParam ? (
                <div className="sticky top-24 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                      Parameter Analysis
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {selectedParam.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="px-3 py-1 rounded-xl bg-slate-100 font-extrabold text-sm text-slate-900">
                        {selectedParam.result} {selectedParam.unit}
                      </div>
                      <span className="text-xs text-slate-500">
                        Target: {selectedParam.referenceRange}
                      </span>
                    </div>
                  </div>

                  {/* Simple Meaning */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                      <span>{t('simpleMeaning')}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      {selectedParam.simpleExplanation[language] || selectedParam.simpleExplanation.en}
                    </p>
                  </div>

                  {/* Clinical Significance */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-teal-600" />
                      <span>{t('possibleSignificance')}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-teal-50/50 p-3.5 rounded-2xl border border-teal-100">
                      {selectedParam.possibleSignificance[language] || selectedParam.possibleSignificance.en}
                    </p>
                  </div>

                  {/* Questions for Doctor */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                    <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Discuss with Your Physician:</span>
                    </h4>
                    <p className="text-xs text-amber-900/90 leading-relaxed">
                      "Doctor, how does my {selectedParam.name} of {selectedParam.result} {selectedParam.unit} correlate with my current dietary habits and medications?"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400">
                  Select any test parameter from the left to view detailed insights.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
