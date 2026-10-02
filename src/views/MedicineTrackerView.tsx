import React, { useState } from 'react';
import { 
  CalendarClock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Clock, 
  Utensils, 
  Calendar, 
  Sparkles, 
  Flame, 
  X,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { Medication } from '../types';

export const MedicineTrackerView: React.FC = () => {
  const { t } = useLanguage();
  const { medications, toggleMedicationTaken, addMedication } = usePatient();
  const [modalOpen, setModalOpen] = useState(false);

  // New medication form states
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [timing, setTiming] = useState<'before_food' | 'after_food' | 'with_food' | 'anytime'>('after_food');
  const [timeOfDay, setTimeOfDay] = useState<('morning' | 'afternoon' | 'evening' | 'night')[]>(['morning']);
  const [duration, setDuration] = useState('30 days');
  const [doctorNotes, setDoctorNotes] = useState('');

  const takenCount = medications.filter(m => m.takenToday).length;
  const totalCount = medications.length;
  const adherencePct = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 100;

  const handleCreateMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage) return;

    addMedication({
      name,
      dosage,
      frequency,
      timing,
      timeOfDay,
      duration,
      startDate: new Date().toISOString().split('T')[0],
      doctorNotes: doctorNotes || 'Follow prescription instructions.',
      prescribedBy: 'Self-Added / Physician'
    });

    // Reset
    setName('');
    setDosage('');
    setDoctorNotes('');
    setModalOpen(false);
  };

  const timeSlots: ('morning' | 'afternoon' | 'evening' | 'night')[] = ['morning', 'afternoon', 'evening', 'night'];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-teal-700">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {t('medicineTrackerTitle')}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Daily Dose Schedule & Medication Adherence
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addCustomMedicine')}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t('medicineTrackerSubtitle')}
        </p>

        {/* Adherence Bar & Streak */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-2/3 space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>{t('adherenceToday')}</span>
              <span>{takenCount} of {totalCount} Doses ({adherencePct}%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${adherencePct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>14 {t('streakDays')}</span>
          </div>
        </div>
      </div>

      {/* Schedule Grouped by Time of Day */}
      <div className="space-y-6">
        {timeSlots.map((slot) => {
          const medsInSlot = medications.filter(m => m.timeOfDay.includes(slot));

          return (
            <div key={slot} className="space-y-3">
              <div className="flex items-center gap-2 px-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  {t(slot)}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {medsInSlot.length}
                </span>
              </div>

              {medsInSlot.length === 0 ? (
                <div className="p-4 rounded-2xl bg-white border border-slate-200/60 text-center text-xs text-slate-400">
                  {t('noMedsForSlot')}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {medsInSlot.map((med) => (
                    <div
                      key={med.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        med.takenToday
                          ? 'bg-slate-50/80 border-slate-200 text-slate-500'
                          : 'bg-white border-slate-200 shadow-xs hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleMedicationTaken(med.id)}
                          className={`p-1 rounded-xl transition cursor-pointer ${
                            med.takenToday
                              ? 'text-emerald-600 hover:text-slate-400'
                              : 'text-slate-300 hover:text-teal-600'
                          }`}
                          aria-label="Toggle taken status"
                        >
                          {med.takenToday ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </button>

                        <div>
                          <h4 className={`text-sm font-bold ${med.takenToday ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {med.name} <span className="text-xs font-normal text-slate-500">({med.dosage})</span>
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Utensils className="w-3 h-3 text-teal-600" />
                              {med.timing === 'after_food' ? t('afterFood') : med.timing === 'before_food' ? t('beforeFood') : med.timing}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-teal-600" />
                              {med.duration}
                            </span>
                          </div>
                          {med.doctorNotes && (
                            <p className="text-[11px] text-slate-400 mt-1 italic">
                              "{med.doctorNotes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleMedicationTaken(med.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          med.takenToday
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {med.takenToday ? t('undoTaken') : t('markAsTaken')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Medication Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-teal-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-teal-200" />
                <h3 className="font-bold text-base">{t('addCustomMedicine')}</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-teal-200 hover:text-white hover:bg-teal-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMedication} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('medicineName')} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Atorvastatin"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('dosage')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 10 mg / 1 tab"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('duration')}
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 30 days"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('foodTiming')}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'before_food', label: t('beforeFood') },
                    { id: 'after_food', label: t('afterFood') },
                    { id: 'with_food', label: t('withFood') },
                    { id: 'anytime', label: t('anytime') },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTiming(item.id as any)}
                      className={`p-2 rounded-xl border text-center font-medium transition cursor-pointer ${
                        timing === item.id
                          ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Scheduled Time Slots (Select all that apply)
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {timeSlots.map((slot) => {
                    const isSelected = timeOfDay.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            if (timeOfDay.length > 1) {
                              setTimeOfDay(timeOfDay.filter(s => s !== slot));
                            }
                          } else {
                            setTimeOfDay([...timeOfDay, slot]);
                          }
                        }}
                        className={`p-2 rounded-xl border text-center font-medium capitalize transition cursor-pointer ${
                          isSelected
                            ? 'bg-teal-600 border-teal-600 text-white font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {t(slot)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('instructions')}
                </label>
                <textarea
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="e.g. Take with a glass of water before sleeping."
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
                  Save Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
