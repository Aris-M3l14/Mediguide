import React, { useState } from 'react';
import { 
  LineChart, 
  HeartPulse, 
  Activity, 
  Scale, 
  TrendingDown, 
  TrendingUp, 
  Plus, 
  X,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { HealthMetricEntry } from '../types';

export const HealthTrendsView: React.FC = () => {
  const { t } = useLanguage();
  const { healthMetrics, addHealthMetric } = usePatient();
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'bp' | 'glucose' | 'weight' | 'hr'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // New reading form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [systolic, setSystolic] = useState('128');
  const [diastolic, setDiastolic] = useState('82');
  const [glucose, setGlucose] = useState('112');
  const [weight, setWeight] = useState('77.8');
  const [heartRate, setHeartRate] = useState('72');
  const [notes, setNotes] = useState('');

  const handleAddReading = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: HealthMetricEntry = {
      date,
      systolic: systolic ? parseInt(systolic, 10) : undefined,
      diastolic: diastolic ? parseInt(diastolic, 10) : undefined,
      glucose: glucose ? parseInt(glucose, 10) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      heartRate: heartRate ? parseInt(heartRate, 10) : undefined,
      notes: notes || undefined,
    };
    addHealthMetric(entry);
    setModalOpen(false);
  };

  // Helper for responsive SVG line chart
  const renderLineChart = (
    data: { label: string; value: number }[],
    color: string,
    minVal: number,
    maxVal: number,
    unit: string
  ) => {
    if (data.length === 0) return null;

    const width = 600;
    const height = 200;
    const padding = 35;

    const range = maxVal - minVal || 1;
    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((d.value - minVal) / range) * (height - 2 * padding);
      return { x, y, ...d };
    });

    const pathD = points.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 select-none">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f1f5f9" strokeWidth="1" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#f1f5f9" strokeWidth="1" />

          {/* Reference labels */}
          <text x={padding - 5} y={padding + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
            {maxVal}
          </text>
          <text x={padding - 5} y={height / 2 + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
            {Math.round((maxVal + minVal) / 2)}
          </text>
          <text x={padding - 5} y={height - padding + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
            {minVal}
          </text>

          {/* Gradient Area under line */}
          <defs>
            <linearGradient id={`grad_${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
            fill={`url(#grad_${color})`}
          />

          {/* Main Line */}
          <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots and Labels */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="4.5" fill="#ffffff" stroke={color} strokeWidth="2.5" />
              <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">
                {p.value}
              </text>
              <text x={p.x} y={height - 12} textAnchor="middle" fontSize="9.5" fill="#64748b">
                {p.label.slice(5)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const bpDataSystolic = healthMetrics.filter(m => m.systolic).map(m => ({ label: m.date, value: m.systolic! }));
  const glucoseData = healthMetrics.filter(m => m.glucose).map(m => ({ label: m.date, value: m.glucose! }));
  const weightData = healthMetrics.filter(m => m.weight).map(m => ({ label: m.date, value: m.weight! }));
  const hrData = healthMetrics.filter(m => m.heartRate).map(m => ({ label: m.date, value: m.heartRate! }));

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-teal-700">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <LineChart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {t('trendsTitle')}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Biometric Timeline & Health Trend Indicators
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('logNewReading')}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t('trendsSubtitle')}
        </p>

        {/* Insight Banner */}
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-start gap-3 text-teal-950 text-xs sm:text-sm">
          <Sparkles className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t('trendSummary')}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 pt-1 text-xs">
          {[
            { id: 'all', label: 'All Indicators' },
            { id: 'bp', label: t('metricBP') },
            { id: 'glucose', label: t('metricGlucose') },
            { id: 'weight', label: t('metricWeight') },
            { id: 'hr', label: t('metricHR') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedMetric(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedMetric === tab.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="space-y-6">
        {/* Blood Pressure Chart */}
        {(selectedMetric === 'all' || selectedMetric === 'bp') && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">{t('metricBP')}</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800">
                Target: &lt;130/80 mmHg
              </span>
            </div>
            {renderLineChart(bpDataSystolic, '#0d9488', 110, 150, 'mmHg')}
            <p className="text-[11px] text-slate-400 text-center">
              Systolic trend across 6 periodic evaluations (Demonstrating positive response to Telmisartan 40mg).
            </p>
          </div>
        )}

        {/* Blood Glucose Chart */}
        {(selectedMetric === 'all' || selectedMetric === 'glucose') && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">{t('metricGlucose')}</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800">
                Target: 70 - 99 mg/dL
              </span>
            </div>
            {renderLineChart(glucoseData, '#f59e0b', 90, 140, 'mg/dL')}
            <p className="text-[11px] text-slate-400 text-center">
              Fasting blood sugar trend showing gradual normalization from 130 to 114 mg/dL.
            </p>
          </div>
        )}

        {/* Weight Chart */}
        {(selectedMetric === 'all' || selectedMetric === 'weight') && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">{t('metricWeight')}</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800">
                BMI: 25.5 (Overweight threshold)
              </span>
            </div>
            {renderLineChart(weightData, '#2563eb', 75, 82, 'kg')}
            <p className="text-[11px] text-slate-400 text-center">
              Weight evolution (79.5 kg down to 78.0 kg with dietary moderation).
            </p>
          </div>
        )}

        {/* Heart Rate Chart */}
        {(selectedMetric === 'all' || selectedMetric === 'hr') && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">{t('metricHR')}</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800">
                Normal: 60 - 100 bpm
              </span>
            </div>
            {renderLineChart(hrData, '#e11d48', 60, 90, 'bpm')}
            <p className="text-[11px] text-slate-400 text-center">
              Resting heart rate consistently stable in the low 70s.
            </p>
          </div>
        )}
      </div>

      {/* Log Reading Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-teal-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-teal-200" />
                <h3 className="font-bold text-base">{t('logNewReading')}</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-teal-200 hover:text-white hover:bg-teal-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReading} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Measurement Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    placeholder="120"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    placeholder="80"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fasting Glucose (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    placeholder="100"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="78.0"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  placeholder="72"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes / Observations
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Measured before breakfast."
                  rows={2}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm"
                >
                  Save Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
