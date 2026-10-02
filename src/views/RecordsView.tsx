import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  AlertCircle,
  File,
  Eye,
  Filter
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { MedicalReport } from '../types';

interface RecordsViewProps {
  onNavigateToExplanation: (reportId: string) => void;
  onNavigateToPrescription: () => void;
}

export const RecordsView: React.FC<RecordsViewProps> = ({
  onNavigateToExplanation,
  onNavigateToPrescription
}) => {
  const { t } = useLanguage();
  const { reports, addReport, deleteReport } = usePatient();
  const [filter, setFilter] = useState<string>('all');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previewModalReport, setPreviewModalReport] = useState<MedicalReport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const isImage = ['png', 'jpg', 'jpeg'].includes(extension);

    const newReport: MedicalReport = {
      id: `rep_${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, ' '),
      date: new Date().toISOString().split('T')[0],
      category: isImage ? 'Prescription' : 'Metabolic & Lipid',
      doctor: 'Dr. Anita Roy, MD',
      facility: 'Apex Diagnostics & Medical Center',
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      fileType: (isImage ? 'png' : 'pdf') as 'pdf' | 'png' | 'jpg',
      status: 'analyzed',
      summary: {
        en: `Uploaded ${file.name} successfully analyzed. Ready for clinical review.`,
        hi: `अपलोड किया गया दस्तावेज़ (${file.name}) सफलतापूर्वक विश्लेषित कर लिया गया है।`,
        it: `Documento (${file.name}) caricato ed elaborato con successo.`
      },
      parameters: []
    };

    addReport(newReport);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 4000);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredReports = filter === 'all'
    ? reports
    : reports.filter(r => r.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2.5 text-teal-700">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('recordsTitle')}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Prescriptions, Blood Panels, Imaging & Diagnostic Reports
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t('recordsSubtitle')}
        </p>
      </div>

      {/* Upload Zone */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-dashed border-teal-300/80 hover:border-teal-500 bg-teal-50/20 hover:bg-teal-50/40 transition-all text-center space-y-3 cursor-pointer relative">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
        />

        <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-xs">
          <Upload className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">
            {t('dragDropText')}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {t('uploadLimitNotice')}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs">
          <FileCheck className="w-4 h-4 text-teal-600" />
          <span>Select from device (.PDF, .PNG, .JPG)</span>
        </div>
      </div>

      {/* Feedback banner */}
      {uploadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 animate-fade-in font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{t('uploadSuccessMsg')}</span>
        </div>
      )}

      {/* Filter and List Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-teal-600" />
            <span>Filter by Type:</span>
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            {['all', 'Prescription', 'Metabolic', 'Complete Blood Count'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                  filter === cat
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat === 'all' ? t('allRecordsFilter') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table / Cards */}
        <div className="space-y-3">
          {filteredReports.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No medical records match this filter.
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-slate-50/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* File info */}
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-2xl flex-shrink-0 ${
                    report.fileType === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <File className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {report.title}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-700">
                        {report.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {report.fileName} • {report.fileSize} • Uploaded on {report.date}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {report.facility} ({report.doctor})
                    </p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Analyzed</span>
                  </span>

                  <button
                    onClick={() => setPreviewModalReport(report)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                    title="View Document"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (report.category === 'Prescription') {
                        onNavigateToPrescription();
                      } else {
                        onNavigateToExplanation(report.id);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('analyzeWithAi')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteReport(report.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title={t('deleteRecord')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Document View Modal */}
      {previewModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">{previewModalReport.title}</h3>
                <p className="text-xs text-slate-400">{previewModalReport.fileName} • {previewModalReport.facility}</p>
              </div>
              <button
                onClick={() => setPreviewModalReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Authorizing Clinician: <strong>{previewModalReport.doctor}</strong></span>
                  <span>Date: <strong>{previewModalReport.date}</strong></span>
                </div>
                <div className="border-t border-slate-200 pt-2 text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-900 mb-1">Diagnostic Abstract:</p>
                  <p>{previewModalReport.summary?.en}</p>
                </div>
              </div>

              {previewModalReport.parameters && previewModalReport.parameters.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Included Lab Parameters ({previewModalReport.parameters.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {previewModalReport.parameters.map((p, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                        <span className="font-medium text-slate-800">{p.name}</span>
                        <span className="font-bold text-teal-700">{p.result} {p.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => {
                  const id = previewModalReport.id;
                  setPreviewModalReport(null);
                  if (previewModalReport.category === 'Prescription') {
                    onNavigateToPrescription();
                  } else {
                    onNavigateToExplanation(id);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition"
              >
                Open in Full Explainer View
              </button>
              <button
                onClick={() => setPreviewModalReport(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
