import React, { createContext, useContext, useState, useEffect } from 'react';
import { PatientProfile, Medication, MedicalReport, HealthMetricEntry } from '../types';
import { initialPatientProfile, initialMedications, initialMedicalReports, initialHealthMetrics } from '../data/demoData';

interface UserAuth {
  isLoggedIn: boolean;
  email: string;
  name: string;
}

interface PatientContextType {
  user: UserAuth;
  login: (email: string, pass: string) => boolean;
  signup: (email: string, pass: string, name: string) => boolean;
  loginAsDemo: () => void;
  logout: () => void;
  
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

  // Sync to localStorage
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

  const login = (email: string): boolean => {
    const newUser = {
      isLoggedIn: true,
      email,
      name: email.split('@')[0] || 'User'
    };
    setUser(newUser);
    return true;
  };

  const signup = (email: string, _pass: string, name: string): boolean => {
    const newUser = {
      isLoggedIn: true,
      email,
      name: name || 'User'
    };
    setUser(newUser);
    return true;
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
  };

  const addReport = (newReport: MedicalReport) => {
    setReports(prev => [newReport, ...prev]);
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

  return (
    <PatientContext.Provider
      value={{
        user,
        login,
        signup,
        loginAsDemo,
        logout,
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
