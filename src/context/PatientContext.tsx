import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PatientProfile, 
  Medication, 
  MedicalReport, 
  HealthMetricEntry, 
  SymptomCheckRecord, 
  SyncInsight,
  UserAccount,
  SignupData,
  HEALTH_PARAM_LIMITS 
} from '../types';
import { initialPatientProfile, initialMedications, initialMedicalReports, initialHealthMetrics } from '../data/demoData';

interface UserAuth {
  isLoggedIn: boolean;
  email: string;
  name: string;
}

const defaultDemoAccount: UserAccount = {
  id: 'user_demo_01',
  email: 'rajesh.sharma@example.com',
  password: 'password123',
  name: 'Rajesh Sharma',
  profile: initialPatientProfile,
  createdAt: '2026-01-01'
};

const initialSyncInsights: SyncInsight[] = [
  {
    id: 'sync_1',
    sourceModule: 'report_explainer',
    targetModules: ['diet_lifestyle', 'medicine_tracker'],
    title: 'Lab Findings Synced to Diet Plan',
    description: 'Fasting Glucose 118 mg/dL and LDL 138 mg/dL from your Metabolic Panel have updated Diet & Lifestyle rules to DASH low-sodium & high soluble fiber.',
    severity: 'important',
    actionLabel: 'View Diet Adjustments',
    actionTargetView: 'diet_lifestyle',
    timestamp: 'Just now'
  },
  {
    id: 'sync_2',
    sourceModule: 'medical_recorder',
    targetModules: ['medicine_tracker', 'report_explainer'],
    title: 'Dr. Roy Prescription Synced to Medicine Tracker',
    description: 'Prescription document on file has synchronized 4 active medications (Telmisartan, Metformin, Vitamin D3, Paracetamol) into your daily dose slots.',
    severity: 'info',
    actionLabel: 'Check Today\'s Doses',
    actionTargetView: 'medicines',
    timestamp: 'Today, 08:00 AM'
  },
  {
    id: 'sync_3',
    sourceModule: 'medicine_tracker',
    targetModules: ['symptom_checker', 'diet_lifestyle'],
    title: 'Medication Food Timings & Safety Cross-Reference',
    description: 'Metformin scheduled before meals and Telmisartan after breakfast. Symptom Checker monitors for postural dizziness or GI sensitivity.',
    severity: 'caution',
    actionLabel: 'Check Correlated Symptoms',
    actionTargetView: 'symptoms',
    timestamp: 'Today, 09:15 AM'
  },
  {
    id: 'sync_4',
    sourceModule: 'symptom_checker',
    targetModules: ['diet_lifestyle', 'medical_recorder'],
    title: 'Symptom Triage Linked to Health Profile',
    description: 'Past symptom check for mild tension headache cross-referenced with your blood pressure history (128/82 mmHg) and low-sodium diet.',
    severity: 'info',
    actionLabel: 'Review Triage History',
    actionTargetView: 'symptoms',
    timestamp: 'Yesterday'
  }
];

const initialSymptomHistory: SymptomCheckRecord[] = [
  {
    id: 'hist_demo_1',
    timestamp: '2026-01-20 14:30',
    symptoms: 'Mild headache and feeling slightly fatigued after morning pill',
    bodyRegion: 'Head & Brain',
    duration: '1-3 days',
    intensity: 4,
    result: {
      enteredSymptoms: 'Mild headache and feeling slightly fatigued after morning pill',
      isEmergency: false,
      severity: 'moderate',
      timeframe: 'Consult within 24-48 hours if unresolved',
      recommendedSpecialist: 'Primary Care Physician / Cardiologist',
      explanations: [
        'Possible transient drop in blood pressure or dehydration after Telmisartan.',
        'Adequate hydration and blood pressure logs advised.'
      ],
      possibleCauses: ['Medication timing effect', 'Mild dehydration', 'Lack of restorative sleep'],
      selfCareAdvice: ['Drink 250ml water immediately', 'Rest for 20 minutes', 'Log sitting vs standing BP'],
      whenToConsultDoctor: ['If dizziness causes unsteadiness', 'If headache becomes severe or throbbing'],
      disclaimer: 'Educational triage record.'
    }
  }
];

interface PatientContextType {
  user: UserAuth;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  signup: (data: SignupData) => { success: boolean; error?: string };
  loginAsDemo: () => void;
  logout: () => void;
  registeredAccounts: UserAccount[];
  
  profile: PatientProfile;
  updateProfile: (profile: PatientProfile) => void;
  resetProfile: () => void;
  
  medications: Medication[];
  toggleMedicationTaken: (id: string) => void;
  addMedication: (med: Omit<Medication, 'id' | 'takenToday'>) => void;
  
  reports: MedicalReport[];
  addReport: (report: MedicalReport) => void;
  deleteReport: (id: string) => void;
  
  healthMetrics: HealthMetricEntry[];
  addHealthMetric: (metric: HealthMetricEntry) => void;
  
  hydrationCount: number;
  incrementHydration: () => void;

  // Integrated Synchronization Engine across the 5 modules
  symptomHistory: SymptomCheckRecord[];
  addSymptomCheck: (record: SymptomCheckRecord) => void;
  deleteSymptomCheck: (id: string) => void;
  syncInsights: SyncInsight[];
  addSyncInsight: (insight: SyncInsight) => void;
  dismissSyncInsight: (id: string) => void;
  dietFocus: string;
  setDietFocus: (focus: string) => void;
  lastSyncTime: string;
  triggerFullSync: () => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication state (Starts logged in with demo profile so the user can immediately experience the entire app)
  const [user, setUser] = useState<UserAuth>(() => {
    const saved = localStorage.getItem('mediguide_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Ignore JSON error
      }
    }
    return {
      isLoggedIn: true,
      email: 'rajesh.sharma@example.com',
      name: 'Rajesh Sharma'
    };
  });

  // Profile state
  const [profile, setProfileState] = useState<PatientProfile>(() => {
    const saved = localStorage.getItem('mediguide_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return initialPatientProfile;
  });

  // Medications state
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('mediguide_medications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return initialMedications;
  });

  // Reports state
  const [reports, setReports] = useState<MedicalReport[]>(() => {
    const saved = localStorage.getItem('mediguide_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return initialMedicalReports;
  });

  // Health metrics state
  const [healthMetrics, setHealthMetrics] = useState<HealthMetricEntry[]>(() => {
    const saved = localStorage.getItem('mediguide_metrics');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return initialHealthMetrics;
  });

  // Hydration state
  const [hydrationCount, setHydrationCount] = useState<number>(() => {
    const saved = localStorage.getItem('mediguide_hydration');
    return saved ? parseInt(saved, 10) : 5; // default 5 glasses logged
  });

  // Synchronized Symptom History across all 5 modules
  const [symptomHistory, setSymptomHistory] = useState<SymptomCheckRecord[]>(() => {
    const saved = localStorage.getItem('mediguide_symptom_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return initialSymptomHistory;
  });

  // Cross-module Synchronized Insights
  const [syncInsights, setSyncInsights] = useState<SyncInsight[]>(() => {
    const saved = localStorage.getItem('mediguide_sync_insights');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return initialSyncInsights;
  });

  // Registered accounts state for persistent local multi-account login/signup
  const [registeredAccounts, setRegisteredAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('mediguide_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback
      }
    }
    return [defaultDemoAccount];
  });

  // Active Diet Focus synchronized with Report Explainer and Symptom Checker
  const [dietFocus, setDietFocus] = useState<string>(() => {
    return localStorage.getItem('mediguide_diet_focus') || 'DASH (Blood Pressure) & Low Glycemic (Pre-diabetes)';
  });

  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mediguide_accounts', JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  useEffect(() => {
    localStorage.setItem('mediguide_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mediguide_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('mediguide_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('mediguide_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('mediguide_metrics', JSON.stringify(healthMetrics));
  }, [healthMetrics]);

  useEffect(() => {
    localStorage.setItem('mediguide_hydration', hydrationCount.toString());
  }, [hydrationCount]);

  useEffect(() => {
    localStorage.setItem('mediguide_symptom_history', JSON.stringify(symptomHistory));
  }, [symptomHistory]);

  useEffect(() => {
    localStorage.setItem('mediguide_sync_insights', JSON.stringify(syncInsights));
  }, [syncInsights]);

  useEffect(() => {
    localStorage.setItem('mediguide_diet_focus', dietFocus);
  }, [dietFocus]);

  const login = (email: string, pass: string): { success: boolean; error?: string } => {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if demo user shortcut
    if (normalizedEmail === 'rajesh.sharma@example.com') {
      loginAsDemo();
      return { success: true };
    }

    const account = registeredAccounts.find(a => a.email.toLowerCase() === normalizedEmail);

    if (!account) {
      return {
        success: false,
        error: 'No account found with this email. Please check your spelling or sign up.'
      };
    }

    if (account.password !== pass) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials and try again.'
      };
    }

    // Set authenticated state
    setUser({
      isLoggedIn: true,
      email: account.email,
      name: account.name
    });
    setProfileState(account.profile);

    const insight: SyncInsight = {
      id: `sync_login_${Date.now()}`,
      sourceModule: 'medical_recorder',
      targetModules: ['diet_lifestyle', 'symptom_checker'],
      title: `User Signed In: ${account.name}`,
      description: `Loaded personalized health profile (Age ${account.profile.age}, ${account.profile.bloodGroup}). Health systems synchronized.`,
      severity: 'info',
      actionLabel: 'View Dashboard',
      actionTargetView: 'dashboard',
      timestamp: 'Just now'
    };
    setSyncInsights(prev => [insight, ...prev]);

    return { success: true };
  };

  const signup = (data: SignupData): { success: boolean; error?: string } => {
    const normalizedEmail = data.email.trim().toLowerCase();

    // Validate email
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // Check if account already exists
    if (registeredAccounts.some(a => a.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: 'An account with this email is already registered. Please log in.' };
    }

    // Parameter limit checks
    if (!data.password || data.password.length < HEALTH_PARAM_LIMITS.passwordLength.min || data.password.length > HEALTH_PARAM_LIMITS.passwordLength.max) {
      return { 
        success: false, 
        error: `Password must be between ${HEALTH_PARAM_LIMITS.passwordLength.min} and ${HEALTH_PARAM_LIMITS.passwordLength.max} characters.` 
      };
    }

    if (data.age < HEALTH_PARAM_LIMITS.age.min || data.age > HEALTH_PARAM_LIMITS.age.max) {
      return { 
        success: false, 
        error: `Age must be between ${HEALTH_PARAM_LIMITS.age.min} and ${HEALTH_PARAM_LIMITS.age.max} years.` 
      };
    }

    if (data.heightCm < HEALTH_PARAM_LIMITS.heightCm.min || data.heightCm > HEALTH_PARAM_LIMITS.heightCm.max) {
      return { 
        success: false, 
        error: `Height must be between ${HEALTH_PARAM_LIMITS.heightCm.min} cm and ${HEALTH_PARAM_LIMITS.heightCm.max} cm.` 
      };
    }

    if (data.weightKg < HEALTH_PARAM_LIMITS.weightKg.min || data.weightKg > HEALTH_PARAM_LIMITS.weightKg.max) {
      return { 
        success: false, 
        error: `Weight must be between ${HEALTH_PARAM_LIMITS.weightKg.min} kg and ${HEALTH_PARAM_LIMITS.weightKg.max} kg.` 
      };
    }

    if (data.fastingBloodGlucose !== undefined && (data.fastingBloodGlucose < HEALTH_PARAM_LIMITS.fastingGlucose.min || data.fastingBloodGlucose > HEALTH_PARAM_LIMITS.fastingGlucose.max)) {
      return { 
        success: false, 
        error: `Fasting Blood Sugar must be between ${HEALTH_PARAM_LIMITS.fastingGlucose.min} and ${HEALTH_PARAM_LIMITS.fastingGlucose.max} mg/dL.` 
      };
    }

    if (data.hba1c !== undefined && (data.hba1c < HEALTH_PARAM_LIMITS.hba1c.min || data.hba1c > HEALTH_PARAM_LIMITS.hba1c.max)) {
      return { 
        success: false, 
        error: `HbA1c must be between ${HEALTH_PARAM_LIMITS.hba1c.min}% and ${HEALTH_PARAM_LIMITS.hba1c.max}%.` 
      };
    }

    if (data.systolicBp !== undefined && (data.systolicBp < HEALTH_PARAM_LIMITS.systolicBp.min || data.systolicBp > HEALTH_PARAM_LIMITS.systolicBp.max)) {
      return { 
        success: false, 
        error: `Systolic Blood Pressure must be between ${HEALTH_PARAM_LIMITS.systolicBp.min} and ${HEALTH_PARAM_LIMITS.systolicBp.max} mmHg.` 
      };
    }

    if (data.diastolicBp !== undefined && (data.diastolicBp < HEALTH_PARAM_LIMITS.diastolicBp.min || data.diastolicBp > HEALTH_PARAM_LIMITS.diastolicBp.max)) {
      return { 
        success: false, 
        error: `Diastolic Blood Pressure must be between ${HEALTH_PARAM_LIMITS.diastolicBp.min} and ${HEALTH_PARAM_LIMITS.diastolicBp.max} mmHg.` 
      };
    }

    // Build new PatientProfile
    const newProfile: PatientProfile = {
      id: `patient_${Date.now()}`,
      name: data.name.trim(),
      age: data.age,
      gender: data.gender,
      bloodGroup: data.bloodGroup || 'Unknown',
      heightCm: data.heightCm,
      weightKg: data.weightKg,
      diabeticStatus: data.diabeticStatus,
      fastingBloodGlucose: data.fastingBloodGlucose,
      hba1c: data.hba1c,
      systolicBp: data.systolicBp,
      diastolicBp: data.diastolicBp,
      activityLevel: data.activityLevel || 'moderate',
      medicalHistoryNotes: data.medicalHistoryNotes || '',
      allergies: data.allergies.length > 0 ? data.allergies : ['None reported'],
      existingConditions: data.existingConditions.length > 0 ? data.existingConditions : ['None reported'],
      emergencyContact: data.emergencyContact || {
        name: '',
        relationship: '',
        phone: ''
      }
    };

    const newAccount: UserAccount = {
      id: `user_${Date.now()}`,
      email: normalizedEmail,
      password: data.password,
      name: data.name.trim(),
      profile: newProfile,
      createdAt: new Date().toISOString()
    };

    setRegisteredAccounts(prev => [...prev, newAccount]);
    setUser({
      isLoggedIn: true,
      email: newAccount.email,
      name: newAccount.name
    });
    setProfileState(newProfile);

    // Auto-adapt Diet Focus
    let adaptedDiet = 'Balanced Whole-Food Nutrition & Mediterranean Lifestyle';
    if (data.diabeticStatus === 'type_1' || data.diabeticStatus === 'type_2' || data.diabeticStatus === 'pre_diabetic') {
      adaptedDiet = `Low Glycemic Index & Carbohydrate Moderation (${data.diabeticStatus === 'pre_diabetic' ? 'Pre-diabetes' : 'Diabetes'} Protocol)`;
    } else if (data.existingConditions.some(c => c.toLowerCase().includes('hypertension') || c.toLowerCase().includes('pressure'))) {
      adaptedDiet = 'DASH Low-Sodium Protocol (Blood Pressure & Cardiovascular Management)';
    }
    setDietFocus(adaptedDiet);

    // Add initial biometric entry
    const initialMetric: HealthMetricEntry = {
      date: new Date().toISOString().split('T')[0],
      weight: data.weightKg,
      systolic: data.systolicBp || 120,
      diastolic: data.diastolicBp || 80,
      glucose: data.fastingBloodGlucose || (data.diabeticStatus === 'non_diabetic' ? 88 : 115),
      notes: 'Registration baseline health metrics.'
    };
    setHealthMetrics(prev => [...prev, initialMetric]);

    // Sync Insight
    const heightM = data.heightCm / 100;
    const bmiVal = (data.weightKg / (heightM * heightM)).toFixed(1);
    const insight: SyncInsight = {
      id: `sync_signup_${Date.now()}`,
      sourceModule: 'medical_recorder',
      targetModules: ['diet_lifestyle', 'symptom_checker', 'medicine_tracker'],
      title: `Registration Complete: ${data.name}`,
      description: `Configured health profile: Age ${data.age}, BMI ${bmiVal}, Diabetic: ${data.diabeticStatus.replace('_', ' ')}. Vitals and diet plan synchronized.`,
      severity: 'important',
      actionLabel: 'Review Diet Plan',
      actionTargetView: 'diet_lifestyle',
      timestamp: 'Just now'
    };
    setSyncInsights(prev => [insight, ...prev]);

    return { success: true };
  };

  const loginAsDemo = () => {
    setUser({
      isLoggedIn: true,
      email: 'rajesh.sharma@example.com',
      name: 'Rajesh Sharma'
    });
    setProfileState(initialPatientProfile);
    setMedications(initialMedications);
    setReports(initialMedicalReports);
    setHealthMetrics(initialHealthMetrics);
    setHydrationCount(5);
    setSymptomHistory(initialSymptomHistory);
    setSyncInsights(initialSyncInsights);
    setDietFocus('DASH (Blood Pressure) & Low Glycemic (Pre-diabetes)');
  };

  const logout = () => {
    setUser({
      isLoggedIn: false,
      email: '',
      name: ''
    });
  };

  const updateProfile = (newProfile: PatientProfile) => {
    setProfileState(newProfile);
    setUser(prev => ({ ...prev, name: newProfile.name }));
    setRegisteredAccounts(prev =>
      prev.map(acc => (acc.email.toLowerCase() === user.email.toLowerCase() ? { ...acc, name: newProfile.name, profile: newProfile } : acc))
    );
  };

  const resetProfile = () => {
    setProfileState(initialPatientProfile);
  };

  const toggleMedicationTaken = (id: string) => {
    setMedications(prev =>
      prev.map(med => (med.id === id ? { ...med, takenToday: !med.takenToday } : med))
    );
  };

  const addMedication = (newMed: Omit<Medication, 'id' | 'takenToday'>) => {
    const created: Medication = {
      ...newMed,
      id: `med_${Date.now()}`,
      takenToday: false,
    };
    setMedications(prev => [created, ...prev]);

    // Generate cross-sync insight into Diet and Symptoms
    const insight: SyncInsight = {
      id: `sync_med_${Date.now()}`,
      sourceModule: 'medicine_tracker',
      targetModules: ['diet_lifestyle', 'symptom_checker'],
      title: `New Medication Synced: ${newMed.name}`,
      description: `Added ${newMed.name} (${newMed.dosage}). Dietary rules and symptom checker cross-references updated.`,
      severity: 'info',
      actionLabel: 'Review Diet Rules',
      actionTargetView: 'diet_lifestyle',
      timestamp: 'Just now'
    };
    setSyncInsights(prev => [insight, ...prev]);
  };

  const addReport = (newReport: MedicalReport) => {
    setReports(prev => [newReport, ...prev]);

    // Cross-sync insight
    const insight: SyncInsight = {
      id: `sync_rep_${Date.now()}`,
      sourceModule: 'medical_recorder',
      targetModules: ['report_explainer', 'diet_lifestyle', 'symptom_checker'],
      title: `Medical Record Synchronized: ${newReport.title}`,
      description: `Diagnostic findings processed. Biomarkers are now available in Report Explainer, Diet & Lifestyle, and Symptom Triage.`,
      severity: 'important',
      actionLabel: 'Analyze in Report Explainer',
      actionTargetView: 'report_explanation',
      timestamp: 'Just now'
    };
    setSyncInsights(prev => [insight, ...prev]);
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const addHealthMetric = (newEntry: HealthMetricEntry) => {
    setHealthMetrics(prev => [...prev, newEntry]);
  };

  const incrementHydration = () => {
    setHydrationCount(prev => prev + 1);
  };

  // Symptom History methods
  const addSymptomCheck = (record: SymptomCheckRecord) => {
    setSymptomHistory(prev => [record, ...prev]);

    // Cross-sync insight to Diet & Medicine Tracker
    const isEmerg = record.result.isEmergency;
    const insight: SyncInsight = {
      id: `sync_symp_${Date.now()}`,
      sourceModule: 'symptom_checker',
      targetModules: ['diet_lifestyle', 'medicine_tracker', 'medical_recorder'],
      title: isEmerg ? 'EMERGENCY Symptom Alert Synchronized' : `Symptom Check: ${record.symptoms.slice(0, 35)}...`,
      description: isEmerg 
        ? 'Critical symptoms logged. Immediate emergency care recommended.'
        : `Evaluated ${record.symptoms}. Cross-referenced with active medications (${medications.map(m => m.name).join(', ')}) and lab biomarkers.`,
      severity: isEmerg ? 'important' : 'caution',
      actionLabel: 'Inspect in Symptom Checker',
      actionTargetView: 'symptoms',
      timestamp: 'Just now'
    };
    setSyncInsights(prev => [insight, ...prev]);

    // If digestive symptom, adapt diet focus
    const lower = record.symptoms.toLowerCase();
    if (lower.includes('stomach') || lower.includes('acid') || lower.includes('reflux') || lower.includes('nausea') || lower.includes('gas')) {
      setDietFocus('Gentle GI / Anti-Reflux & DASH (Temporary Digestive Adjustment)');
    }
  };

  const deleteSymptomCheck = (id: string) => {
    setSymptomHistory(prev => prev.filter(h => h.id !== id));
  };

  const addSyncInsight = (insight: SyncInsight) => {
    setSyncInsights(prev => [insight, ...prev]);
  };

  const dismissSyncInsight = (id: string) => {
    setSyncInsights(prev => prev.filter(i => i.id !== id));
  };

  const triggerFullSync = () => {
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <PatientContext.Provider
      value={{
        user,
        login,
        signup,
        loginAsDemo,
        logout,
        registeredAccounts,
        profile,
        updateProfile,
        resetProfile,
        medications,
        toggleMedicationTaken,
        addMedication,
        reports,
        addReport,
        deleteReport,
        healthMetrics,
        addHealthMetric,
        hydrationCount,
        incrementHydration,
        symptomHistory,
        addSymptomCheck,
        deleteSymptomCheck,
        syncInsights,
        addSyncInsight,
        dismissSyncInsight,
        dietFocus,
        setDietFocus,
        lastSyncTime,
        triggerFullSync,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
