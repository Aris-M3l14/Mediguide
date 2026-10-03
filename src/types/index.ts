export type Language = 'en' | 'hi' | 'it';

export type SeverityLevel = 'low' | 'moderate' | 'high' | 'emergency';

export const HEALTH_PARAM_LIMITS = {
  age: { min: 1, max: 120, unit: 'years', label: 'Age', defaultVal: 35 },
  heightCm: { min: 50, max: 250, unit: 'cm', label: 'Height', defaultVal: 170 },
  weightKg: { min: 20, max: 300, unit: 'kg', label: 'Weight', defaultVal: 70 },
  fastingGlucose: { min: 40, max: 500, unit: 'mg/dL', label: 'Fasting Blood Sugar', defaultVal: 95 },
  hba1c: { min: 3.0, max: 16.0, unit: '%', label: 'HbA1c', defaultVal: 5.4 },
  systolicBp: { min: 70, max: 240, unit: 'mmHg', label: 'Systolic Blood Pressure', defaultVal: 120 },
  diastolicBp: { min: 40, max: 140, unit: 'mmHg', label: 'Diastolic Blood Pressure', defaultVal: 80 },
  passwordLength: { min: 6, max: 64, unit: 'characters', label: 'Password' },
  phoneLength: { min: 7, max: 15, unit: 'digits', label: 'Phone Number' }
} as const;

export type DiabeticStatus = 'non_diabetic' | 'pre_diabetic' | 'type_1' | 'type_2' | 'gestational' | 'unknown';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active';

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
  diabeticStatus?: DiabeticStatus;
  fastingBloodGlucose?: number;
  hba1c?: number;
  systolicBp?: number;
  diastolicBp?: number;
  activityLevel?: ActivityLevel;
  medicalHistoryNotes?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  profile: PatientProfile;
  createdAt: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
  diabeticStatus: DiabeticStatus;
  fastingBloodGlucose?: number;
  hba1c?: number;
  systolicBp?: number;
  diastolicBp?: number;
  allergies: string[];
  existingConditions: string[];
  medicalHistoryNotes?: string;
  activityLevel?: ActivityLevel;
  emergencyContact?: {
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
  timeframe?: string;
  redFlags?: string[];
  recommendedSpecialist?: string;
  questionsForDoctor?: string[];
  relatedConditionsInProfile?: string[];
}

export interface SymptomCheckRecord {
  id: string;
  timestamp: string;
  symptoms: string;
  bodyRegion: string;
  duration: string;
  intensity: number;
  result: SymptomAnalysisResult;
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

export type SyncModuleType = 
  | 'symptom_checker' 
  | 'medical_recorder' 
  | 'diet_lifestyle' 
  | 'medicine_tracker' 
  | 'report_explainer';

export interface SyncInsight {
  id: string;
  sourceModule: SyncModuleType;
  targetModules: SyncModuleType[];
  title: string;
  description: string;
  severity: 'info' | 'caution' | 'important';
  actionLabel?: string;
  actionTargetView?: string;
  timestamp: string;
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
