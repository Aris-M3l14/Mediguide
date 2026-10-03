import { supabase } from '../services/supabase';
import React, { useState, useMemo } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  KeyRound, 
  Eye, 
  EyeOff, 
  Activity, 
  Scale, 
  Ruler, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  HeartPulse, 
  FileText, 
  Phone, 
  AlertTriangle,
  Flame,
  Check,
  Plus
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { 
  HEALTH_PARAM_LIMITS, 
  SignupData, 
  DiabeticStatus, 
  ActivityLevel 
} from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

const COMMON_ALLERGIES = [
  'Penicillin',
  'Sulfa Drugs',
  'Aspirin',
  'NSAIDs',
  'Peanuts',
  'Tree Nuts',
  'Shellfish',
  'Dairy / Lactose',
  'Latex',
  'Pollen / Dust'
];

const COMMON_CONDITIONS = [
  'Hypertension (High BP)',
  'Type 2 Diabetes',
  'Pre-Diabetes',
  'Asthma / Respiratory',
  'High Cholesterol (Dyslipidemia)',
  'Thyroid Disorder',
  'Heart Disease / CAD',
  'GERD / Acid Reflux',
  'Chronic Kidney Disease',
  'Migraines'
];

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialTab = 'login' 
}) => {
  const { t } = useLanguage();
  const { login, signup, loginAsDemo, registeredAccounts, user } = usePatient();

  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>(initialTab);
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Signup Step 1: Account
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Signup Step 2: Physical Vitals & Limits
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [heightCm, setHeightCm] = useState<number>(172);
  const [weightKg, setWeightKg] = useState<number>(68);
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  // Signup Step 3: Medical History & Chronic Conditions
  const [diabeticStatus, setDiabeticStatus] = useState<DiabeticStatus>('non_diabetic');
  const [fastingGlucose, setFastingGlucose] = useState<string>('');
  const [hba1c, setHba1c] = useState<string>('');
  const [systolicBp, setSystolicBp] = useState<string>('');
  const [diastolicBp, setDiastolicBp] = useState<string>('');
  
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [customAllergyInput, setCustomAllergyInput] = useState('');
  
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [customConditionInput, setCustomConditionInput] = useState('');
  const [medicalHistoryNotes, setMedicalHistoryNotes] = useState('');

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // General error state
  const [error, setError] = useState<string>('');

  // Live BMI calculation
  const bmiInfo = useMemo(() => {
    if (!heightCm || !weightKg || heightCm <= 0) return null;
    const heightM = heightCm / 100;
    const val = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
    let cat = 'Normal Weight';
    let color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (val < 18.5) {
      cat = 'Underweight';
      color = 'text-amber-700 bg-amber-50 border-amber-200';
    } else if (val >= 25 && val < 30) {
      cat = 'Overweight';
      color = 'text-amber-700 bg-amber-50 border-amber-200';
    } else if (val >= 30) {
      cat = 'Obese';
      color = 'text-rose-700 bg-rose-50 border-rose-200';
    }
    return { val, cat, color };
  }, [heightCm, weightKg]);

  if (!isOpen) return null;

  // Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!loginEmail.trim() || !loginPassword) {
      setError('Please provide both your registered email and password.');
      return;
    }

    // Supabase Authentication
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    console.log('User logged in:', data.user);
    onClose();
  }; 

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!forgotEmail.trim()) {
      setError('Please enter your registered email address.');
      return;
    }
    setForgotSubmitted(true);
  };

  const handleDemoAccess = () => {
    loginAsDemo();
    onClose();
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    setError('');
    if (!signupName.trim() || signupName.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return false;
    }
    if (!signupEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (registeredAccounts.some(a => a.email.toLowerCase() === signupEmail.trim().toLowerCase())) {
      setError('An account with this email is already registered. Please sign in instead.');
      return false;
    }
    if (signupPassword.length < HEALTH_PARAM_LIMITS.passwordLength.min) {
      setError(`Password must be at least ${HEALTH_PARAM_LIMITS.passwordLength.min} characters.`);
      return false;
    }
    if (signupPassword.length > HEALTH_PARAM_LIMITS.passwordLength.max) {
      setError(`Password must not exceed ${HEALTH_PARAM_LIMITS.passwordLength.max} characters.`);
      return false;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return false;
    }
    return true;
  };

  // Step 2 Validation (Parameter lower & upper limits)
  const validateStep2 = (): boolean => {
    setError('');
    if (age < HEALTH_PARAM_LIMITS.age.min || age > HEALTH_PARAM_LIMITS.age.max) {
      setError(`Age must be between ${HEALTH_PARAM_LIMITS.age.min} and ${HEALTH_PARAM_LIMITS.age.max} years.`);
      return false;
    }
    if (heightCm < HEALTH_PARAM_LIMITS.heightCm.min || heightCm > HEALTH_PARAM_LIMITS.heightCm.max) {
      setError(`Height must be between ${HEALTH_PARAM_LIMITS.heightCm.min} cm and ${HEALTH_PARAM_LIMITS.heightCm.max} cm.`);
      return false;
    }
    if (weightKg < HEALTH_PARAM_LIMITS.weightKg.min || weightKg > HEALTH_PARAM_LIMITS.weightKg.max) {
      setError(`Weight must be between ${HEALTH_PARAM_LIMITS.weightKg.min} kg and ${HEALTH_PARAM_LIMITS.weightKg.max} kg.`);
      return false;
    }
    return true;
  };

  // Step 3 Validation & Final Submission
  const handleFinalSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Optional parameter bounds check
    let parsedGlucose: number | undefined = undefined;
    if (fastingGlucose.trim()) {
      const g = parseFloat(fastingGlucose);
      if (isNaN(g) || g < HEALTH_PARAM_LIMITS.fastingGlucose.min || g > HEALTH_PARAM_LIMITS.fastingGlucose.max) {
        setError(`Fasting Blood Sugar must be between ${HEALTH_PARAM_LIMITS.fastingGlucose.min} and ${HEALTH_PARAM_LIMITS.fastingGlucose.max} mg/dL.`);
        return;
      }
      parsedGlucose = g;
    }

    let parsedHba1c: number | undefined = undefined;
    if (hba1c.trim()) {
      const h = parseFloat(hba1c);
      if (isNaN(h) || h < HEALTH_PARAM_LIMITS.hba1c.min || h > HEALTH_PARAM_LIMITS.hba1c.max) {
        setError(`HbA1c must be between ${HEALTH_PARAM_LIMITS.hba1c.min}% and ${HEALTH_PARAM_LIMITS.hba1c.max}%.`);
        return;
      }
      parsedHba1c = h;
    }

    let parsedSystolic: number | undefined = undefined;
    if (systolicBp.trim()) {
      const s = parseInt(systolicBp, 10);
      if (isNaN(s) || s < HEALTH_PARAM_LIMITS.systolicBp.min || s > HEALTH_PARAM_LIMITS.systolicBp.max) {
        setError(`Systolic Blood Pressure must be between ${HEALTH_PARAM_LIMITS.systolicBp.min} and ${HEALTH_PARAM_LIMITS.systolicBp.max} mmHg.`);
        return;
      }
      parsedSystolic = s;
    }

    let parsedDiastolic: number | undefined = undefined;
    if (diastolicBp.trim()) {
      const d = parseInt(diastolicBp, 10);
      if (isNaN(d) || d < HEALTH_PARAM_LIMITS.diastolicBp.min || d > HEALTH_PARAM_LIMITS.diastolicBp.max) {
        setError(`Diastolic Blood Pressure must be between ${HEALTH_PARAM_LIMITS.diastolicBp.min} and ${HEALTH_PARAM_LIMITS.diastolicBp.max} mmHg.`);
        return;
      }
      parsedDiastolic = d;
    }

    // Phone format check if provided
    if (emergencyPhone.trim()) {
      const cleanPhone = emergencyPhone.replace(/\D/g, '');
      if (cleanPhone.length < HEALTH_PARAM_LIMITS.phoneLength.min || cleanPhone.length > HEALTH_PARAM_LIMITS.phoneLength.max) {
        setError(`Emergency contact phone number should be between ${HEALTH_PARAM_LIMITS.phoneLength.min} and ${HEALTH_PARAM_LIMITS.phoneLength.max} digits.`);
        return;
      }
    }

    // Assemble allergies & conditions
    const finalAllergies = [...selectedAllergies];
    if (customAllergyInput.trim()) {
      finalAllergies.push(customAllergyInput.trim());
    }

    const finalConditions = [...selectedConditions];
    if (customConditionInput.trim()) {
      finalConditions.push(customConditionInput.trim());
    }

    const payload: SignupData = {
      email: signupEmail.trim(),
      password: signupPassword,
      name: signupName.trim(),
      age,
      gender,
      bloodGroup,
      heightCm,
      weightKg,
      diabeticStatus,
      fastingBloodGlucose: parsedGlucose,
      hba1c: parsedHba1c,
      systolicBp: parsedSystolic,
      diastolicBp: parsedDiastolic,
      allergies: finalAllergies,
      existingConditions: finalConditions,
      medicalHistoryNotes: medicalHistoryNotes.trim(),
      activityLevel,
      emergencyContact: emergencyName.trim() ? {
        name: emergencyName.trim(),
        relationship: emergencyRelation.trim() || 'Emergency Contact',
        phone: emergencyPhone.trim()
      } : undefined
    };

    // Supabase Registration
    // 1. Supabase Authentication
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    if (!authData.user) {
      setError('Failed to generate user session.');
      return;
    }

    // 2. Insert Medical Profile into the Database
    const { error: dbError } = await supabase
      .from('patients')
      .insert([
        {
          id: authData.user.id,
          name: payload.name,
          email: payload.email,
          age: payload.age,
          gender: payload.gender,
          height_cm: payload.heightCm,
          weight_kg: payload.weightKg,
          blood_group: payload.bloodGroup,
          activity_level: payload.activityLevel,
          diabetic_status: payload.diabeticStatus,
          fasting_blood_glucose: payload.fastingBloodGlucose,
          hba1c: payload.hba1c,
          systolic_bp: payload.systolicBp,
          diastolic_bp: payload.diastolicBp,
          allergies: payload.allergies,
          existing_conditions: payload.existingConditions,
          medical_history_notes: payload.medicalHistoryNotes,
          emergency_contact: payload.emergencyContact,
        }
      ]);

    if (dbError) {
      console.error("Database Insert Error:", dbError);
      setError('Account created, but failed to save medical profile. ' + dbError.message);
      return;
    }

    console.log('Account and Medical Profile created successfully!');
    alert('Account created! Please sign in.');
    setTab('login');
  };
  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies(prev => 
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className={`relative w-full ${tab === 'signup' ? 'max-w-2xl' : 'max-w-md'} bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto transition-all duration-200 max-h-[95vh] flex flex-col`}>
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 px-6 py-4 sm:py-5 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-xs">
              <ShieldCheck className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                {tab === 'forgot'
                  ? (t('forgotPasswordModalTitle') || 'Reset Password')
                  : tab === 'signup'
                  ? (t('signupTitle') || 'Create Patient Account')
                  : (t('loginTitle') || 'Sign In to MediGuide AI')}
              </h3>
              <p className="text-xs text-teal-100">
                {tab === 'signup' 
                  ? `Step ${signupStep} of 3: ${signupStep === 1 ? 'Credentials' : signupStep === 2 ? 'Vitals & Limits' : 'Medical Profile'}` 
                  : 'Clinical Safety Protocol • Encrypted Storage'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-teal-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Access Bar (On Login Tab) */}
        {tab === 'login' && (
          <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between gap-3 flex-shrink-0">
            <div className="text-xs text-emerald-950">
              <p className="font-bold">Instant Prototype Mode</p>
              <p className="text-[11px] text-emerald-700">Explore pre-loaded patient Rajesh Sharma (48y)</p>
            </div>
            <button
              type="button"
              onClick={handleDemoAccess}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Demo Patient</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Signup Stepper Progress */}
        {tab === 'signup' && (
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-shrink-0">
            {[
              { num: 1, label: 'Credentials' },
              { num: 2, label: 'Physical Vitals & Limits' },
              { num: 3, label: 'Medical History' },
            ].map((st) => (
              <div 
                key={st.num}
                className={`flex items-center gap-2 text-xs font-bold ${
                  signupStep === st.num 
                    ? 'text-teal-700' 
                    : signupStep > st.num 
                    ? 'text-emerald-600' 
                    : 'text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                  signupStep === st.num 
                    ? 'bg-teal-600 text-white shadow-2xs' 
                    : signupStep > st.num 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {signupStep > st.num ? '✓' : st.num}
                </span>
                <span className="hidden sm:inline">{st.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2 shadow-2xs">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ===================== TAB 1: LOGIN ===================== */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('emailLabel') || 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="rajesh.sharma@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    {t('passwordLabel') || 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => { setError(''); setTab('forgot'); }}
                    className="text-xs text-teal-600 hover:text-teal-700 hover:underline font-semibold cursor-pointer"
                  >
                    {t('forgotPassword') || 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-600/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{t('login') || 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Accounts Switcher if other registered accounts exist */}
              {registeredAccounts.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Available Accounts on this device:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {registeredAccounts.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          setLoginEmail(acc.email);
                          setLoginPassword(acc.password);
                          setError('');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs cursor-pointer ${
                          loginEmail === acc.email 
                            ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold' 
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <User className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                          <span className="font-semibold truncate">{acc.name}</span>
                          <span className="text-[11px] text-slate-400 truncate">({acc.email})</span>
                        </div>
                        <span className="text-[10px] text-teal-600 font-bold flex-shrink-0">Use →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          )}

          {/* ===================== TAB 2: SIGNUP (3-STEP WIZARD) ===================== */}
          {tab === 'signup' && (
            <div>
              {/* STEP 1: Account Credentials */}
              {signupStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200 text-teal-950 text-xs space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-teal-900">
                      <Lock className="w-3.5 h-3.5 text-teal-600" />
                      <span>Security & Profile Activation</span>
                    </p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Enter your name and login credentials. On the next steps we will ask for your core physical vitals and medical history with clinical upper/lower limits.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('fullName') || 'Full Name'} *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="e.g. John Doe / Rajesh Sharma"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('emailLabel') || 'Email Address'} *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700">
                          {t('passwordLabel') || 'Password'} *
                        </label>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Min: {HEALTH_PARAM_LIMITS.passwordLength.min} chars
                        </span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="At least 6 chars"
                          className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t('confirmPassword') || 'Confirm Password'} *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep1()) {
                          setSignupStep(2);
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                    >
                      <span>Proceed to Physical Vitals (Step 2)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Physical Vitals & Parameter Limits */}
              {signupStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200 text-teal-950 text-xs space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-teal-900">
                      <Scale className="w-3.5 h-3.5 text-teal-600" />
                      <span>Physical Parameters & Clinical Validation Boundaries</span>
                    </p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      All clinical metrics must fall within safe physiological boundaries. Minimum and maximum valid bounds are enforced for each entry.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Age */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" />
                          <span>Age (years) *</span>
                        </label>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700">
                          {HEALTH_PARAM_LIMITS.age.min} – {HEALTH_PARAM_LIMITS.age.max} yrs
                        </span>
                      </div>
                      <input
                        type="number"
                        min={HEALTH_PARAM_LIMITS.age.min}
                        max={HEALTH_PARAM_LIMITS.age.max}
                        value={age || ''}
                        onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
                        className={`w-full p-2 text-sm bg-white border rounded-xl font-bold transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          age < HEALTH_PARAM_LIMITS.age.min || age > HEALTH_PARAM_LIMITS.age.max
                            ? 'border-rose-400 text-rose-700'
                            : 'border-slate-200 text-slate-900'
                        }`}
                        required
                      />
                      {(age < HEALTH_PARAM_LIMITS.age.min || age > HEALTH_PARAM_LIMITS.age.max) && (
                        <p className="text-[10px] text-rose-600 font-semibold">
                          Must be between {HEALTH_PARAM_LIMITS.age.min} and {HEALTH_PARAM_LIMITS.age.max}
                        </p>
                      )}
                    </div>

                    {/* Sex / Gender */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <label className="text-xs font-bold text-slate-800 block">
                        Sex / Biological Gender *
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                        {(['male', 'female', 'other'] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            className={`py-2 px-1 text-xs font-bold rounded-xl border transition cursor-pointer capitalize text-center ${
                              gender === g 
                                ? 'bg-teal-600 text-white border-teal-600 shadow-2xs' 
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Height */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <Ruler className="w-3.5 h-3.5 text-teal-600" />
                          <span>Height (cm) *</span>
                        </label>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700">
                          {HEALTH_PARAM_LIMITS.heightCm.min} – {HEALTH_PARAM_LIMITS.heightCm.max} cm
                        </span>
                      </div>
                      <input
                        type="number"
                        min={HEALTH_PARAM_LIMITS.heightCm.min}
                        max={HEALTH_PARAM_LIMITS.heightCm.max}
                        value={heightCm || ''}
                        onChange={(e) => setHeightCm(parseInt(e.target.value, 10) || 0)}
                        className={`w-full p-2 text-sm bg-white border rounded-xl font-bold transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          heightCm < HEALTH_PARAM_LIMITS.heightCm.min || heightCm > HEALTH_PARAM_LIMITS.heightCm.max
                            ? 'border-rose-400 text-rose-700'
                            : 'border-slate-200 text-slate-900'
                        }`}
                        required
                      />
                      {(heightCm < HEALTH_PARAM_LIMITS.heightCm.min || heightCm > HEALTH_PARAM_LIMITS.heightCm.max) && (
                        <p className="text-[10px] text-rose-600 font-semibold">
                          Must be between {HEALTH_PARAM_LIMITS.heightCm.min} and {HEALTH_PARAM_LIMITS.heightCm.max} cm
                        </p>
                      )}
                    </div>

                    {/* Weight */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <Scale className="w-3.5 h-3.5 text-teal-600" />
                          <span>Weight (kg) *</span>
                        </label>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700">
                          {HEALTH_PARAM_LIMITS.weightKg.min} – {HEALTH_PARAM_LIMITS.weightKg.max} kg
                        </span>
                      </div>
                      <input
                        type="number"
                        min={HEALTH_PARAM_LIMITS.weightKg.min}
                        max={HEALTH_PARAM_LIMITS.weightKg.max}
                        value={weightKg || ''}
                        onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                        className={`w-full p-2 text-sm bg-white border rounded-xl font-bold transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          weightKg < HEALTH_PARAM_LIMITS.weightKg.min || weightKg > HEALTH_PARAM_LIMITS.weightKg.max
                            ? 'border-rose-400 text-rose-700'
                            : 'border-slate-200 text-slate-900'
                        }`}
                        required
                      />
                      {(weightKg < HEALTH_PARAM_LIMITS.weightKg.min || weightKg > HEALTH_PARAM_LIMITS.weightKg.max) && (
                        <p className="text-[10px] text-rose-600 font-semibold">
                          Must be between {HEALTH_PARAM_LIMITS.weightKg.min} and {HEALTH_PARAM_LIMITS.weightKg.max} kg
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Live BMI Preview Card */}
                  {bmiInfo && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-slate-50 border border-teal-200 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-teal-700" />
                        <div>
                          <span className="font-bold text-slate-800">Dynamic BMI Indicator:</span>
                          <span className="ml-1 font-extrabold text-teal-900">{bmiInfo.val} kg/m²</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] ${bmiInfo.color}`}>
                        {bmiInfo.cat}
                      </span>
                    </div>
                  )}

                  {/* Blood Group & Activity Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Blood Group *
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Activity Level (Lifestyle)
                      </label>
                      <select
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                        className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                      >
                        <option value="sedentary">Sedentary (Little or no exercise)</option>
                        <option value="light">Lightly Active (1–3 days/week)</option>
                        <option value="moderate">Moderately Active (3–5 days/week)</option>
                        <option value="very_active">Very Active (6–7 days/week)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep2()) {
                          setSignupStep(3);
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                    >
                      <span>Proceed to Medical Profile (Step 3)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Medical History & Chronic Conditions */}
              {signupStep === 3 && (
                <form onSubmit={handleFinalSignup} className="space-y-4 animate-fade-in">
                  <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200 text-teal-950 text-xs space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-teal-900">
                      <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
                      <span>Diabetic Status & Clinical History</span>
                    </p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      These parameters feed the Symptom Checker, Diet & Lifestyle engine, and AI Assistant. Numeric values strictly adhere to clinical limits.
                    </p>
                  </div>

                  {/* Diabetic Status */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        {t('diabeticStatusLabel') || 'Diabetic Status'} *
                      </label>
                      <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                        Guides glycemic diet rules
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {[
                        { id: 'non_diabetic' as DiabeticStatus, label: 'Non-Diabetic' },
                        { id: 'pre_diabetic' as DiabeticStatus, label: 'Pre-Diabetic' },
                        { id: 'type_2' as DiabeticStatus, label: 'Type 2 Diabetes' },
                        { id: 'type_1' as DiabeticStatus, label: 'Type 1 Diabetes' },
                        { id: 'gestational' as DiabeticStatus, label: 'Gestational' },
                        { id: 'unknown' as DiabeticStatus, label: 'Not Sure / Other' },
                      ].map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setDiabeticStatus(d.id)}
                          className={`py-2 px-2 text-xs font-bold rounded-xl border transition cursor-pointer text-center ${
                            diabeticStatus === d.id
                              ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Baseline Blood Tests (Fasting Glucose & HbA1c) */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <span className="text-xs font-bold text-slate-800 block">
                      Baseline Metabolic Readings (Optional if available)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-600">
                            Fasting Blood Sugar (mg/dL)
                          </label>
                          <span className="text-[9px] font-bold text-slate-400">
                            {HEALTH_PARAM_LIMITS.fastingGlucose.min}–{HEALTH_PARAM_LIMITS.fastingGlucose.max} mg/dL
                          </span>
                        </div>
                        <input
                          type="number"
                          min={HEALTH_PARAM_LIMITS.fastingGlucose.min}
                          max={HEALTH_PARAM_LIMITS.fastingGlucose.max}
                          value={fastingGlucose}
                          onChange={(e) => setFastingGlucose(e.target.value)}
                          placeholder="e.g. 95 (target <100)"
                          className="w-full p-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-600">
                            HbA1c Glycated Hemoglobin (%)
                          </label>
                          <span className="text-[9px] font-bold text-slate-400">
                            {HEALTH_PARAM_LIMITS.hba1c.min}%–{HEALTH_PARAM_LIMITS.hba1c.max}%
                          </span>
                        </div>
                        <input
                          type="number"
                          step="0.1"
                          min={HEALTH_PARAM_LIMITS.hba1c.min}
                          max={HEALTH_PARAM_LIMITS.hba1c.max}
                          value={hba1c}
                          onChange={(e) => setHba1c(e.target.value)}
                          placeholder="e.g. 5.6 (normal <5.7%)"
                          className="w-full p-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Optional Blood Pressure */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <span className="text-xs font-bold text-slate-800 block">
                      Resting Blood Pressure (Optional if known)
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-600">
                            Systolic (mmHg)
                          </label>
                          <span className="text-[9px] font-bold text-slate-400">
                            {HEALTH_PARAM_LIMITS.systolicBp.min}–{HEALTH_PARAM_LIMITS.systolicBp.max}
                          </span>
                        </div>
                        <input
                          type="number"
                          min={HEALTH_PARAM_LIMITS.systolicBp.min}
                          max={HEALTH_PARAM_LIMITS.systolicBp.max}
                          value={systolicBp}
                          onChange={(e) => setSystolicBp(e.target.value)}
                          placeholder="e.g. 120"
                          className="w-full p-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-600">
                            Diastolic (mmHg)
                          </label>
                          <span className="text-[9px] font-bold text-slate-400">
                            {HEALTH_PARAM_LIMITS.diastolicBp.min}–{HEALTH_PARAM_LIMITS.diastolicBp.max}
                          </span>
                        </div>
                        <input
                          type="number"
                          min={HEALTH_PARAM_LIMITS.diastolicBp.min}
                          max={HEALTH_PARAM_LIMITS.diastolicBp.max}
                          value={diastolicBp}
                          onChange={(e) => setDiastolicBp(e.target.value)}
                          placeholder="e.g. 80"
                          className="w-full p-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Allergies Chips & Custom */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Known Allergies (Click to toggle)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_ALLERGIES.map((allergy) => {
                        const isSelected = selectedAllergies.includes(allergy);
                        return (
                          <button
                            key={allergy}
                            type="button"
                            onClick={() => toggleAllergy(allergy)}
                            className={`text-xs px-2.5 py-1 rounded-xl font-medium transition cursor-pointer border flex items-center gap-1 ${
                              isSelected
                                ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold shadow-2xs'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-rose-700" />}
                            <span>{allergy}</span>
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={customAllergyInput}
                      onChange={(e) => setCustomAllergyInput(e.target.value)}
                      placeholder="Other allergies (comma-separated)..."
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Existing Medical Conditions / Medical History */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Medical History / Chronic Conditions (Optional)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_CONDITIONS.map((cond) => {
                        const isSelected = selectedConditions.includes(cond);
                        return (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => toggleCondition(cond)}
                            className={`text-xs px-2.5 py-1 rounded-xl font-medium transition cursor-pointer border flex items-center gap-1 ${
                              isSelected
                                ? 'bg-teal-100 text-teal-900 border-teal-300 font-bold shadow-2xs'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-teal-700" />}
                            <span>{cond}</span>
                          </button>
                        );
                      })}
                    </div>
                    <textarea
                      value={medicalHistoryNotes}
                      onChange={(e) => setMedicalHistoryNotes(e.target.value)}
                      rows={2}
                      placeholder="Additional medical history, past surgeries, or family history notes (optional)..."
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    />
                  </div>

                  {/* Emergency Contact */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span>Emergency Contact (Recommended)</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        placeholder="Contact Name"
                        className="p-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                        type="text"
                        value={emergencyRelation}
                        onChange={(e) => setEmergencyRelation(e.target.value)}
                        placeholder="Relationship (e.g. Spouse)"
                        className="p-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                        type="tel"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder="Phone (7-15 digits)"
                        className="p-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSignupStep(2)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Vitals</span>
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-extrabold text-xs sm:text-sm transition flex items-center gap-2 shadow-md shadow-teal-600/20 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('createAccountBtn') || 'Complete Registration'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ===================== TAB 3: FORGOT PASSWORD ===================== */}
          {tab === 'forgot' && (
            <div>
              {forgotSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-xs">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    {t('resetEmailSent') || 'Password reset link sent!'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    In this browser-based prototype, your accounts are stored locally in your browser storage. You can immediately return to sign in.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setForgotSubmitted(false); setTab('login'); }}
                    className="mt-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    {t('backToLogin') || 'Back to Sign In'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t('forgotPasswordInstructions') || 'Enter your registered email address and we will provide a reset link.'}
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('emailLabel') || 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{t('sendResetLink') || 'Send Reset Link'}</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer (Toggle between Login and Signup) */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-600 flex-shrink-0">
          {tab === 'login' ? (
            <p>
              {t('dontHaveAccount') || "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setTab('signup');
                  setSignupStep(1);
                }}
                className="font-bold text-teal-700 hover:underline cursor-pointer ml-1"
              >
                {t('signup') || 'Sign Up'} (Register with Vitals)
              </button>
            </p>
          ) : tab === 'signup' ? (
            <p>
              {t('alreadyHaveAccount') || 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setTab('login');
                }}
                className="font-bold text-teal-700 hover:underline cursor-pointer ml-1"
              >
                {t('login') || 'Sign In'}
              </button>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => {
                setError('');
                setTab('login');
              }}
              className="font-bold text-teal-700 hover:underline cursor-pointer"
            >
              {t('backToLogin') || 'Back to Sign In'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
