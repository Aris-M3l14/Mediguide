export type Language = 'en' | 'hi' | 'it';

export type SeverityLevel = 'low' | 'moderate' | 'high' | 'emergency';

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
  allergies: string[];
  existingConditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: 'before_food' | 'after_food' | 'with_food' | 'anytime';
  timeOfDay: ('morning' | 'afternoon' | 'evening' | 'night')[];
  duration: string;
  startDate: string;
  doctorNotes: string;
  takenToday: boolean;
  prescribedBy?: string;
}

export interface LabParameter {
  name: string;
  result: number | string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'borderline' | 'abnormal';
  simpleExplanation: {
    en: string;
    hi: string;
    it: string;
  };
  possibleSignificance: {
    en: string;
    hi: string;
    it: string;
  };
}

export interface MedicalReport {
  id: string;
  title: string;
  date: string;
  category: 'Metabolic & Lipid' | 'Complete Blood Count' | 'Renal Function' | 'Prescription' | 'Cardiology' | 'Imaging';
  doctor: string;
  facility: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'png' | 'jpg';
  status: 'analyzed' | 'pending' | 'review_needed';
  summary?: {
    en: string;
    hi: string;
    it: string;
  };
  parameters: LabParameter[];
}

export interface SymptomAnalysisResult {
  enteredSymptoms: string;
  isEmergency: boolean;
  severity: SeverityLevel;
  explanations: string[];
  possibleCauses: string[];
  selfCareAdvice: string[];
  whenToConsultDoctor: string[];
  emergencyInstructions?: string;
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isEmergencyAlert?: boolean;
  sources?: string[];
}

export interface HealthMetricEntry {
  date: string;
  weight?: number;
  systolic?: number;
  diastolic?: number;
  glucose?: number;
  heartRate?: number;
  notes?: string;
}

export interface DietLifestyleRecommendation {
  diet: {
    summary: string;
    foodsToInclude: string[];
    foodsToAvoidOrLimit: string[];
    tips: string[];
  };
  hydration: {
    recommendedDailyLiters: number;
    tip: string;
  };
  sleep: {
    recommendedHours: string;
    routineTip: string;
  };
  exercise: {
    intensity: string;
    frequency: string;
    suggestions: string[];
    precautions: string[];
  };
  disclaimer: string;
}
