import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Emergency keywords check
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'shortness of breath', 'can\'t breathe', 'difficulty breathing',
  'stroke', 'slurred speech', 'facial drooping', 'sudden weakness', 'paralysis',
  'unconscious', 'fainting', 'severe bleeding', 'coughing blood', 'anaphylaxis',
  'सीने में दर्द', 'सांस लेने में तकलीफ', 'सांस फूलना', 'लकवा', 'बेहोश',
  'dolore al petto', 'infarto', 'difficoltà respiratoria', 'ictus', 'paralisi'
];

function isEmergency(text: string): boolean {
  const lower = (text || '').toLowerCase();
  return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw.toLowerCase()));
}

// 1. Symptom Analysis Endpoint
app.post('/api/ai/symptoms', async (req, res) => {
  try {
    const { symptoms, language = 'en', patientProfile } = req.body;
    const hasEmergency = isEmergency(symptoms);

    if (ai) {
      const systemInstruction = `You are MediGuide AI, an educational clinical triage assistant.
IMPORTANT SAFETY INSTRUCTIONS:
- You are NOT a doctor and must NOT give a definitive diagnosis.
- Do NOT prescribe medications.
- If emergency symptoms are present, set isEmergency to true and urge immediate medical attention (911/112/102/118).
- The user requested the language: ${language} (en = English, hi = Hindi, it = Italian). Output all string fields in this language!
- Return strictly valid JSON matching this schema:
{
  "enteredSymptoms": string,
  "isEmergency": boolean,
  "severity": "low" | "moderate" | "high" | "emergency",
  "explanations": string[],
  "possibleCauses": string[],
  "selfCareAdvice": string[],
  "whenToConsultDoctor": string[],
  "emergencyInstructions": string,
  "disclaimer": string
}`;

      const prompt = `Patient: ${patientProfile?.name || 'Patient'}, Age: ${patientProfile?.age || 48}, Existing conditions: ${(patientProfile?.existingConditions || []).join(', ')}, Allergies: ${(patientProfile?.allergies || []).join(', ')}.
Symptoms described: "${symptoms}".
Evaluate possible causes, severity, self-care, and when to seek medical help in ${language === 'hi' ? 'Hindi' : language === 'it' ? 'Italian' : 'English'}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (hasEmergency) {
          parsed.isEmergency = true;
          parsed.severity = 'emergency';
        }
        return res.json(parsed);
      }
    }

    // Default fallback if no AI key or parse failure
    res.status(503).json({ fallbackNeeded: true });
  } catch (err: any) {
    console.error('Error analyzing symptoms:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// 2. Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history, language = 'en', patientProfile, medications, recentReports } = req.body;
    const hasEmergency = isEmergency(message);

    if (hasEmergency) {
      let warning = '⚠️ Critical Emergency Warning: Your message indicates potentially life-threatening symptoms. Please immediately call 911 / 112 / 102 or proceed to the nearest emergency room!';
      if (language === 'hi') {
        warning = '⚠️ आपातकालीन चेतावनी: आपके संदेश में गंभीर आपातकालीन लक्षण पाए गए हैं। तुरंत 112 / 102 पर संपर्क करें अथवा नजदीकी अस्पताल जाएं!';
      } else if (language === 'it') {
        warning = '⚠️ Avviso di Emergenza: I sintomi descritti richiedono soccorso immediato. Chiama subito il 118 o il 112!';
      }
      return res.json({ text: warning, isEmergencyAlert: true });
    }

    if (ai) {
      const systemInstruction = `You are MediGuide AI, a helpful, empathetic, educational healthcare assistant.
Language to respond in: ${language} (en = English, hi = Hindi, it = Italian).
Patient Profile: ${JSON.stringify(patientProfile || {})}
Current Prescriptions: ${JSON.stringify(medications || [])}
Recent Lab Reports: ${JSON.stringify(recentReports || [])}
RULES:
1. Explain medical terms, doctor prescriptions, and blood work simply and clearly in ${language}.
2. Remind the user that medicines are extracted from doctor prescriptions and you do NOT prescribe or alter doses.
3. If they describe emergency signs, advise calling emergency services immediately.
4. Keep explanations concise, scannable, and encouraging.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction
        }
      });

      return res.json({
        text: response.text || 'I am ready to help you understand your medical reports.',
        isEmergencyAlert: false
      });
    }

    res.status(503).json({ fallbackNeeded: true });
  } catch (err: any) {
    console.error('Error in chat:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// 3. Explain Report Endpoint
app.post('/api/ai/explain-report', async (req, res) => {
  try {
    const { report, language = 'en' } = req.body;
    if (ai) {
      const prompt = `Explain the following diagnostic lab report in simple patient-friendly language in ${language === 'hi' ? 'Hindi' : language === 'it' ? 'Italian' : 'English'}:
Title: ${report.title}
Parameters: ${JSON.stringify(report.parameters)}
Include: Overall interpretation, what borderline or abnormal values indicate, and what to ask their doctor.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      return res.json({ explanation: response.text });
    }
    res.status(503).json({ fallbackNeeded: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Setup Vite middleware in dev, or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MediGuide AI server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
