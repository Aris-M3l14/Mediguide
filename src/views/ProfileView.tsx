import React, { useState, useEffect } from 'react';
import { 
  UserCircle2, 
  HeartHandshake, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { PatientProfile } from '../types';

export const ProfileView: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile, updateProfile, resetProfile } = usePatient();

  const [formData, setFormData] = useState<PatientProfile>(profile);
  const [allergiesText, setAllergiesText] = useState(profile.allergies.join(', '));
  const [conditionsText, setConditionsText] = useState(profile.existingConditions.join(', '));
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData(profile);
    setAllergiesText(profile.allergies.join(', '));
    setConditionsText(profile.existingConditions.join(', '));
  }, [profile]);

  const heightM = formData.heightCm ? formData.heightCm / 100 : 1.75;
  const bmi = formData.weightKg && heightM > 0
    ? (formData.weightKg / (heightM * heightM)).toFixed(1)
    : '25.5';

  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-amber-600 bg-amber-50' };
    if (val < 25) return { label: 'Normal Weight', color: 'text-emerald-700 bg-emerald-50' };
    if (val < 30) return { label: 'Overweight (Pre-obese)', color: 'text-amber-700 bg-amber-50' };
    return { label: 'Obese', color: 'text-rose-700 bg-rose-50' };
  };

  const bmiCat = getBmiCategory(parseFloat(bmi));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PatientProfile = {
      ...formData,
      allergies: allergiesText.split(',').map(s => s.trim()).filter(Boolean),
      existingConditions: conditionsText.split(',').map(s => s.trim()).filter(Boolean),
    };
    updateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    resetProfile();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2.5 text-teal-700">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <UserCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('patientProfileTitle')}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Vitals, Demographics, Chronic Conditions & Emergency Contacts
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t('patientProfileSubtitle')}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{t('profileSavedSuccess')}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Demographics Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            <span>Demographics & Anthropometrics</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('fullName')} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('age')} *
              </label>
              <input
                type="number"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('gender')}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                <option value="male">{t('male')}</option>
                <option value="female">{t('female')}</option>
                <option value="other">{t('other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('bloodGroup')}
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('height')}
              </label>
              <input
                type="number"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('weight')}
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
          </div>

          {/* BMI Live Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              {t('bmi')}: <strong className="text-base text-slate-900 ml-1">{bmi}</strong>
            </span>
            <span className={`px-3 py-1 rounded-xl text-xs font-bold ${bmiCat.color}`}>
              {bmiCat.label}
            </span>
          </div>
        </div>

        {/* Clinical History & Allergies */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Clinical History & Known Sensitivities</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('allergies')}
            </label>
            <input
              type="text"
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
              placeholder="e.g. Penicillin, Peanuts, Sulfa"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">{t('allergiesHelp')}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('conditions')}
            </label>
            <input
              type="text"
              value={conditionsText}
              onChange={(e) => setConditionsText(e.target.value)}
              placeholder="e.g. Hypertension, Pre-diabetes, Asthma"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">{t('conditionsHelp')}</p>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4" />
            <span>Emergency Contact Protocol</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('emergencyContactName')}
              </label>
              <input
                type="text"
                value={formData.emergencyContact.name}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('emergencyContactRelation')}
              </label>
              <input
                type="text"
                value={formData.emergencyContact.relationship}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('emergencyContactPhone')}
              </label>
              <input
                type="tel"
                value={formData.emergencyContact.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('resetDemoProfile')}</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t('saveProfileBtn')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
