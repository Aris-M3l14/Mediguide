import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
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
  // ... (keeping your demo insights)
  {
    id: 'sync_1',
    sourceModule: 'report_explainer',
    targetModules: ['diet_lifestyle', 'medicine_tracker'],
    title: 'Lab Findings Synced to Diet Plan',
    description: 'Fasting Glucose 118 mg/dL and LDL 138 mg/dL from your Metabolic Panel have updated Diet & Lifestyle rules.',
    severity: 'important',
    actionLabel: 'View Diet Adjustments',
    actionTargetView: 'diet_lifestyle',
    timestamp: 'Just now'
  }
];

const initialSymptomHistory: SymptomCheckRecord[] = [];

interface PatientContextType {
  user: UserAuth;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  signup: (data: SignupData) => { success: boolean; error?: string };
  loginAsDemo: () => void;
  logout: () => Promise<void>;
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
  // Start with a blank, logged-out state. Supabase will update this immediately if a session exists.
  const [user, setUser] = useState<UserAuth>({
    isLoggedIn: false,
    email: '',
    name: ''
  });

  const [profile, setProfileState] = useState<PatientProfile>(initialPatientProfile);
  
  // Keep your local state for the other modules for now
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [reports, setReports] = useState<MedicalReport[]>(initialMedicalReports);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetricEntry[]>(initialHealthMetrics);
  const [hydrationCount, setHydrationCount] = useState<number>(0);
  const [symptomHistory, setSymptomHistory] = useState<SymptomCheckRecord[]>(initialSymptomHistory);
  const [syncInsights, setSyncInsights] = useState<SyncInsight[]>(initialSyncInsights);
  const [registeredAccounts, setRegisteredAccounts] = useState<UserAccount[]>([defaultDemoAccount]);
  const [dietFocus, setDietFocus] = useState<string>('Standard Balanced Diet');
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // ==========================================
  // SUPABASE AUTHENTICATION & DATABASE LISTENER
  // ==========================================
  useEffect(() => {
    let mounted = true;

    const fetchPatientProfile = async (userId: string, email: string) => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching live profile from Supabase:", error);
        return;
      }

      if (data && mounted) {
        // Update user auth state
        setUser({
          isLoggedIn: true,
          email: email,
          name: data.name
        });
        
        // Map the snake_case database columns to your camelCase PatientProfile types
        setProfileState({
          id: data.id,
          name: data.name,
          age: data.age,
          gender: data.gender,
          bloodGroup: data.blood_group || 'Unknown',
          heightCm: data.height_cm,
          weightKg: data.weight_kg,
          diabeticStatus: data.diabetic_status,
          fastingBloodGlucose: data.fasting_blood_glucose,
          hba1c: data.hba1c,
          systolicBp: data.systolic_bp,
          diastolicBp: data.diastolic_bp,
          activityLevel: data.activity_level || 'moderate',
          medicalHistoryNotes: data.medical_history_notes || '',
          allergies: data.allergies || [],
          existingConditions: data.existing_conditions || [],
          emergencyContact: data.emergency_contact || { name: '', relationship: '', phone: '' }
        });

        // Generate a sync insight to prove it loaded
        const insight: SyncInsight = {
          id: `sync_db_load_${Date.now()}`,
          sourceModule: 'medical_recorder',
          targetModules: ['diet_lifestyle', 'symptom_checker'],
          title: `Live Database Connected: ${data.name}`,
          description: `Successfully fetched profile from Supabase. Health systems synchronized.`,
          severity: 'info',
          actionLabel: 'View Dashboard',
          actionTargetView: 'dashboard',
          timestamp: 'Just now'
        };
        setSyncInsights(prev => [insight, ...prev]);
      }
    };

    // 1. Check for an active session on first load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && mounted) {
        fetchPatientProfile(session.user.id, session.user.email || '');
      }
    });

    // 2. Set up a listener for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchPatientProfile(session.user.id, session.user.email || '');
      } else if (mounted) {
        // Clear state on logout
        setUser({ isLoggedIn: false, email: '', name: '' });
        setProfileState(initialPatientProfile);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ==========================================

  // Legacy local functions (Left intact to prevent TS errors in other files)
  const login = (email: string, pass: string) => { return { success: true }; };
  const signup = (data: SignupData) => { return { success: true }; };

  const loginAsDemo = () => {
    setUser({
      isLoggedIn: true,
      email: 'rajesh.sharma@example.com',
      name: 'Rajesh Sharma (Prototype)'
    });
    setProfileState(initialPatientProfile);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser({ isLoggedIn: false, email: '', name: '' });
    setProfileState(initialPatientProfile);
  };

  const updateProfile = (newProfile: PatientProfile) => {
    setProfileState(newProfile);
  };

  const resetProfile = () => {
    setProfileState(initialPatientProfile);
  };

  const toggleMedicationTaken = (id: string) => {
    setMedications(prev => prev.map(med => (med.id === id ? { ...med, takenToday: !med.takenToday } : med)));
  };

  const addMedication = (newMed: Omit<Medication, 'id' | 'takenToday'>) => {
    const created: Medication = { ...newMed, id: `med_${Date.now()}`, takenToday: false };
    setMedications(prev => [created, ...prev]);
  };

  const addReport = (newReport: MedicalReport) => setReports(prev => [newReport, ...prev]);
  const deleteReport = (id: string) => setReports(prev => prev.filter(r => r.id !== id));
  const addHealthMetric = (newEntry: HealthMetricEntry) => setHealthMetrics(prev => [...prev, newEntry]);
  const incrementHydration = () => setHydrationCount(prev => prev + 1);
  const addSymptomCheck = (record: SymptomCheckRecord) => setSymptomHistory(prev => [record, ...prev]);
  const deleteSymptomCheck = (id: string) => setSymptomHistory(prev => prev.filter(h => h.id !== id));
  const addSyncInsight = (insight: SyncInsight) => setSyncInsights(prev => [insight, ...prev]);
  const dismissSyncInsight = (id: string) => setSyncInsights(prev => prev.filter(i => i.id !== id));
  const triggerFullSync = () => setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  return (
    <PatientContext.Provider
      value={{
        user, login, signup, loginAsDemo, logout, registeredAccounts,
        profile, updateProfile, resetProfile, medications, toggleMedicationTaken,
        addMedication, reports, addReport, deleteReport, healthMetrics,
        addHealthMetric, hydrationCount, incrementHydration, symptomHistory,
        addSymptomCheck, deleteSymptomCheck, syncInsights, addSyncInsight,
        dismissSyncInsight, dietFocus, setDietFocus, lastSyncTime, triggerFullSync,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (!context) throw new Error('usePatient must be used within a PatientProvider');
  return context;
};