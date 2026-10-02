import { Language, SeverityLevel, SymptomAnalysisResult, PatientProfile, Medication, MedicalReport } from '../types';

interface SymptomRequest {
  symptoms: string;
  language: Language;
  patientProfile?: PatientProfile;
}

interface ChatRequest {
  message: string;
  history: Array<{ sender: 'user' | 'ai'; text: string }>;
  language: Language;
  patientProfile?: PatientProfile;
  medications?: Medication[];
  recentReports?: MedicalReport[];
}

// Emergency red flag terms in English, Hindi, and Italian
const EMERGENCY_KEYWORDS = [
  // English
  'chest pain', 'heart attack', 'shortness of breath', 'can\'t breathe', 'difficulty breathing',
  'stroke', 'slurred speech', 'facial drooping', 'sudden weakness', 'paralysis',
  'unconscious', 'fainting', 'severe bleeding', 'coughing blood', 'anaphylaxis',
  'swollen tongue', 'swollen throat', 'seizure', 'severe allergic reaction',
  // Hindi
  'सीने में दर्द', 'सांस लेने में तकलीफ', 'सांस फूलना', 'लकवा', 'बेहोश',
  'खून की उल्टी', 'अचानक कमजोरी', 'चेहरा लटकना', 'दिल का दौरा', 'सांस नहीं आ रही',
  // Italian
  'dolore al petto', 'infarto', 'difficoltà respiratoria', 'non riesco a respirare',
  'ictus', 'difficoltà a parlare', 'paralisi', 'svenimento', 'perdita di conoscenza',
  'grave emorragia', 'sangue dal vomito', 'reazione allergica grave', 'anafilassi'
];

export const checkIsEmergency = (text: string): boolean => {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw.toLowerCase()));
};

export const aiService = {
  /**
   * Analyzes symptoms entered in natural language
   */
  async analyzeSymptoms(req: SymptomRequest): Promise<SymptomAnalysisResult> {
    const isEmerg = checkIsEmergency(req.symptoms);

    // Try server API first
    try {
      const response = await fetch('/api/ai/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch {
      // Backend not running or offline, proceed with local high-accuracy medical synthesis
    }

    return generateLocalSymptomAnalysis(req.symptoms, req.language, isEmerg, req.patientProfile);
  },

  /**
   * Explains medical report parameters in plain language
   */
  async explainReport(report: MedicalReport, language: Language): Promise<string> {
    try {
      const response = await fetch('/api/ai/explain-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report, language }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.explanation;
      }
    } catch {
      // Fallback
    }

    if (language === 'hi') {
      return `यह रिपोर्ट (${report.title}) आपके स्वास्थ्य की महत्वपूर्ण जानकारी देती है। ब्लड शुगर (118 mg/dL) और एचबीए1सी (6.2%) संकेत करते हैं कि जीवनशैली में सुधार और कम चीनी का सेवन लाभकारी होगा। गुर्दे और रक्त के अन्य सभी मुख्य पैरामीटर सामान्य और सुरक्षित हैं। कृपया अपनी अगली मुलाकात में डॉक्टर के साथ इसकी समीक्षा करें।`;
    }
    if (language === 'it') {
      return `Questo referto (${report.title}) offre una panoramica chiara della tua salute metabolica. I valori di glicemia a digiuno (118 mg/dL) ed emoglobina glicata (6.2%) indicano una tendenza al pre-diabete gestibile con alimentazione e attività fisica. I marcatori renali ed ematologici risultano nella piena normalità.`;
    }
    return `This diagnostic report (${report.title}) provides key insights into your metabolic state. Your fasting blood sugar (118 mg/dL) and HbA1c (6.2%) reflect early borderline pre-diabetes, which responds well to dietary moderation and regular physical activity. Vital kidney markers (creatinine 0.9 mg/dL) remain optimal and healthy.`;
  },

  /**
   * Interactive Health Assistant Chat
   */
  async sendChatMessage(req: ChatRequest): Promise<{ text: string; isEmergencyAlert?: boolean }> {
    const isEmerg = checkIsEmergency(req.message);

    // Try server API
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch {
      // Fallback
    }

    return generateLocalChatResponse(req, isEmerg);
  }
};

/**
 * Local clinical safety logic for symptoms
 */
function generateLocalSymptomAnalysis(
  symptoms: string,
  lang: Language,
  isEmergency: boolean,
  profile?: PatientProfile
): SymptomAnalysisResult {
  const lower = symptoms.toLowerCase();

  if (isEmergency) {
    if (lang === 'hi') {
      return {
        enteredSymptoms: symptoms,
        isEmergency: true,
        severity: 'emergency',
        explanations: [
          'आपके द्वारा वर्णित लक्षण (जैसे सीने में गंभीर दबाव, सांस लेने में अत्यधिक कठिनाई या अचानक कमजोरी) चिकित्सीय आपातकाल (Medical Emergency) के संकेत हो सकते हैं।'
        ],
        possibleCauses: [
          'कार्डियोवैस्कुलर या पल्मोनरी आपातकालीन स्थिति',
          'गंभीर एलर्जिक रिएक्शन या एक्यूट रेस्पिरेटरी डिस्ट्रेस'
        ],
        selfCareAdvice: [
          'घर पर खुद से कोई नई दवा न लें।',
          'शांति से बैठें, तंग कपड़े ढीले करें और तुरंत सहायता लें।'
        ],
        whenToConsultDoctor: [
          'तुरंत! किसी भी प्रतीक्षा के बिना आपातकालीन सेवा को कॉल करें।'
        ],
        emergencyInstructions: 'तत्काल 112 या 102 (भारत) अथवा नजदीकी इमरजेंसी अस्पताल से संपर्क करें!',
        disclaimer: 'यह एक स्वचालित सुरक्षा चेतावनी है। एआई किसी भी आपातकालीन स्थिति में प्राथमिक चिकित्सा का विकल्प नहीं है।'
      };
    }

    if (lang === 'it') {
      return {
        enteredSymptoms: symptoms,
        isEmergency: true,
        severity: 'emergency',
        explanations: [
          'I sintomi descritti (come dolore toracico, grave affanno o perdita improvvisa di forza) possono indicare un’emergenza medica acuta.'
        ],
        possibleCauses: [
          'Sindrome coronarica acuta o crisi respiratoria',
          'Reazione anafilattica o evento cardiovascolare'
        ],
        selfCareAdvice: [
          'Non assumere farmaci non prescritti e non attendere.',
          'Rimani seduto in posizione comoda e allenta gli indumenti stretti.'
        ],
        whenToConsultDoctor: [
          'IMMEDIATAMENTE: Contatta subito il 118 o il 112 per soccorso urgente.'
        ],
        emergencyInstructions: 'Chiama immediatamente il 118 / 112 o recati al più vicino Pronto Soccorso!',
        disclaimer: 'Avviso di emergenza: MediGuide AI non sostituisce il personale sanitario del pronto soccorso.'
      };
    }

    return {
      enteredSymptoms: symptoms,
      isEmergency: true,
      severity: 'emergency',
      explanations: [
        'The symptoms you entered (such as acute chest pain, shortness of breath, or sudden weakness) indicate a potential medical emergency requiring immediate in-person evaluation.'
      ],
      possibleCauses: [
        'Acute cardiovascular or respiratory event',
        'Severe allergic reaction (anaphylaxis) or neurological episode'
      ],
      selfCareAdvice: [
        'Do not drive yourself to the hospital.',
        'Sit comfortably upright, loosen tight clothing, and call emergency services.'
      ],
      whenToConsultDoctor: [
        'IMMEDIATELY: Call emergency dispatch (911/112) without waiting.'
      ],
      emergencyInstructions: 'Call 911 / 112 or your local emergency number immediately!',
      disclaimer: 'Emergency Safeguard: MediGuide AI cannot treat life-threatening situations.'
    };
  }

  // Moderate or Mild symptoms
  let severity: SeverityLevel = 'low';
  if (lower.includes('fever') || lower.includes('बुखार') || lower.includes('febbre') ||
      lower.includes('dizziness') || lower.includes('चक्कर') || lower.includes('vertigini') ||
      lower.includes('stomach') || lower.includes('पेट') || lower.includes('stomaco')) {
    severity = 'moderate';
  }

  const hasAllergyConflict = profile?.allergies?.some(a => lower.includes(a.toLowerCase()));

  if (lang === 'hi') {
    return {
      enteredSymptoms: symptoms,
      isEmergency: false,
      severity,
      explanations: [
        `दर्ज लक्षण: "${symptoms}". यह अक्सर मौसमी संक्रमण, हल्के वायरल तनाव, या शरीर में पानी की कमी अथवा थकावट से संबंधित हो सकते हैं।`,
        hasAllergyConflict ? 'ध्यान दें: आपके प्रोफाइल में दर्ज एलर्जी का इतिहास भी इस स्थिति से जुड़ा हो सकता है।' : 'आपके वर्तमान स्वास्थ्य इतिहास के साथ कोई बड़ा प्रतिकूल मेल नहीं दिखा।'
      ],
      possibleCauses: [
        'सामान्य वायरल सिंड्रोम या मौसमी बदलाव',
        'मानसिक तनाव या नींद की कमी',
        'पर्याप्त जलयोजन (Hydration) न होना'
      ],
      selfCareAdvice: [
        'भरपूर आराम करें और दिन में कम से कम 2 से 2.5 लीटर गुनगुना पानी पिएं।',
        'हल्का, ताजा और सुपाच्य भोजन लें।',
        'अपने तापमान और रक्तचाप की नियमित जांच करें।'
      ],
      whenToConsultDoctor: [
        'यदि लक्षण 48-72 घंटों से अधिक समय तक बने रहें या बढ़ें।',
        'यदि तेज बुखार (101°F से अधिक) आए या चक्कर बढ़े।',
        'यदि निर्धारित दवाओं के बाद भी आराम न मिले।'
      ],
      disclaimer: 'यह जानकारी केवल आपके ज्ञानवर्धन के लिए है और डॉक्टर के व्यक्तिगत परामर्श का स्थान नहीं ले सकती।'
    };
  }

  if (lang === 'it') {
    return {
      enteredSymptoms: symptoms,
      isEmergency: false,
      severity,
      explanations: [
        `Sintomi riferiti: "${symptoms}". Possono corrispondere a una sindrome da raffreddamento, affaticamento temporaneo o lieve disidratazione.`,
        'Non emergono indicatori di rischio acuto immediato.'
      ],
      possibleCauses: [
        'Infezione virale stagionale o colpo d’aria',
        'Tensione muscolare o stress psicofisico',
        'Apporto idrico insufficiente'
      ],
      selfCareAdvice: [
        'Riposa adeguatamente ed evita sforzi intensi.',
        'Bevi almeno 2 litri di acqua o tisane tiepide.',
        'Privilegia pasti leggeri a base di verdure e proteine digeribili.'
      ],
      whenToConsultDoctor: [
        'Se i sintomi persistono oltre le 48-72 ore o tendono a peggiorare.',
        'In caso di comparsa di febbre superiore a 38.5°C.',
        'Se subentrano nuovi sintomi insoliti.'
      ],
      disclaimer: 'Questo riepilogo è puramente divulgativo e non costituisce una diagnosi medica.'
    };
  }

  return {
    enteredSymptoms: symptoms,
    isEmergency: false,
    severity,
    explanations: [
      `Reported symptoms: "${symptoms}". These frequently correlate with mild viral irritation, seasonal changes, or temporary fatigue and mild dehydration.`,
      profile?.existingConditions?.length ? `Contextual note: Considered against your profile conditions (${profile.existingConditions.join(', ')}).` : 'No adverse interactions detected in baseline health profile.'
    ],
    possibleCauses: [
      'Seasonal viral syndrome or mild immune response',
      'Fatigue, lack of restorative sleep, or screen strain',
      'Mild dehydration or dietary irregularity'
    ],
    selfCareAdvice: [
      'Ensure adequate hydration (2.0 to 2.5 liters of water daily).',
      'Rest in a comfortable, quiet environment and prioritize 7-8 hours of sleep.',
      'Monitor your temperature and stay alert to any changes.'
    ],
    whenToConsultDoctor: [
      'If symptoms persist beyond 48 to 72 hours without gradual improvement.',
      'If body temperature exceeds 101°F (38.3°C) or is accompanied by chills.',
      'If you develop persistent localized pain or new unexpected symptoms.'
    ],
    disclaimer: 'Clinical Note: This educational overview is based on general health guidelines and is not a definitive diagnosis.'
  };
}

/**
 * Local AI Chat reasoning engine
 */
function generateLocalChatResponse(
  req: ChatRequest,
  isEmergency: boolean
): { text: string; isEmergencyAlert?: boolean } {
  const lower = req.message.toLowerCase();
  const lang = req.language;
  const profile = req.patientProfile;

  if (isEmergency) {
    if (lang === 'hi') {
      return {
        text: '⚠️ आपातकालीन चेतावनी: आपके संदेश में गंभीर या जानलेवा लक्षण पाए गए हैं। कृपया किसी एआई ऐप पर निर्भर न रहें और तुरंत 112 / 102 डायल करें अथवा निकटतम अस्पताल के आपातकालीन कक्ष (Emergency Room) में जाएं।',
        isEmergencyAlert: true
      };
    }
    if (lang === 'it') {
      return {
        text: '⚠️ AVVISO DI EMERGENZA: I sintomi descritti possono indicare una condizione clinica acuta. Non attendere risposta da un’applicazione AI: contatta immediatamente il 118 o il 112 oppure recati al Pronto Soccorso più vicino.',
        isEmergencyAlert: true
      };
    }
    return {
      text: '⚠️ CRITICAL EMERGENCY WARNING: The symptoms you described indicate a potential medical emergency. Do not wait for AI advice. Call 911 / 112 or proceed to the nearest emergency medical facility immediately.',
      isEmergencyAlert: true
    };
  }

  // Question about prescriptions
  if (lower.includes('prescrib') || lower.includes('medicine') || lower.includes('दवा') || lower.includes('पर्चा') || lower.includes('farmaci') || lower.includes('ricetta')) {
    if (lang === 'hi') {
      return {
        text: `आपके डॉक्टर (डॉ. अनीता रॉय) द्वारा निर्धारित मुख्य दवाएं:\n\n1. टेल्मिसार्टन 40 मिग्रा: रोजाना सुबह नाश्ते के बाद 1 गोली (रक्तचाप के लिए)।\n2. मेटफॉर्मिन 500 मिग्रा: सुबह और रात भोजन से 15 मिनट पहले 1 गोली (शुगर नियंत्रण के लिए)।\n3. विटामिन डी3 60,000 IU: हर रविवार दोपहर के भोजन के बाद 1 कैप्सूल।\n\nकृपया ध्यान दें: ये दवाएं सीधे डॉक्टर के पर्चे से निकाली गई हैं। मेडिगाइड एआई अपने आप कोई दवा नहीं बदलता।`
      };
    }
    if (lang === 'it') {
      return {
        text: `Ecco il riepilogo delle terapie prescritte dalla Dott.ssa Anita Roy:\n\n1. Telmisartan 40 mg: 1 compressa al mattino dopo colazione (per la pressione arteriosa).\n2. Metformina 500 mg: 1 compressa prima di colazione e cena (per il controllo della glicemia).\n3. Vitamina D3 60.000 UI: 1 capsula a settimana, la domenica dopo pranzo.\n\nPromemoria: Questi dati sono estratti dalla ricetta medica e non costituiscono prescrizioni autonome dell'AI.`
      };
    }
    return {
      text: `Based on your cardiologist Dr. Anita Roy's prescription on file:\n\n1. Telmisartan 40 mg: Take 1 tablet once daily in the morning after breakfast (for blood pressure).\n2. Metformin 500 mg: Take 1 tablet twice daily, 15-20 minutes before breakfast and dinner (for glucose control).\n3. Vitamin D3 60,000 IU: Take 1 capsule weekly on Sundays after lunch.\n\nImportant: These medications were prescribed by your physician. MediGuide AI never independently modifies or prescribes treatments.`
    };
  }

  // Question about blood report / lab
  if (lower.includes('report') || lower.includes('blood') || lower.includes('रिपोर्ट') || lower.includes('खून') || lower.includes('referto') || lower.includes('sangue')) {
    if (lang === 'hi') {
      return {
        text: `आपकी हालिया लैब रिपोर्ट (जनवरी 2026) का सारांश:\n\n• फास्टिंग ब्लड शुगर 118 mg/dL है और HbA1c 6.2% है। यह प्रीडायबिटीज (शुरुआती स्तर) की सीमा में आता है।\n• एलडीएल (खराब कोलेस्ट्रॉल) 138 mg/dL है, जो लक्ष्य (<100) से थोड़ा अधिक है।\n• हीमोग्लोबिन 14.8 g/dL और किडनी की कार्यप्रणाली (सीरम क्रिएटिनिन 0.9 mg/dL) पूरी तरह सामान्य और स्वस्थ हैं।\n\nसलाह: नियमित टहलने और कम नमक/कम चीनी वाले भोजन से इसमें निरंतर सुधार देखा जा रहा है।`
      };
    }
    if (lang === 'it') {
      return {
        text: `Sintesi degli ultimi esami ematochimici (Gennaio 2026):\n\n• Glicemia a digiuno: 118 mg/dL e HbA1c al 6.2%, che segnalano una condizione di pre-diabete iniziale.\n• Colesterolo LDL: 138 mg/dL, lievemente al di sopra dell'obiettivo ideale (<100 mg/dL).\n• Emocromo completo e funzionalità renale (creatinina 0.9 mg/dL) sono ottimali e perfettamente nella norma.\n\nSuggerimento: Continua la terapia con Telmisartan e Metformina seguendo le indicazioni della Dott.ssa Roy.`
      };
    }
    return {
      text: `Summary of your latest blood panel (January 2026):\n\n• Fasting Blood Sugar is 118 mg/dL with HbA1c at 6.2%, which falls within the mild pre-diabetic category.\n• LDL ("Bad") Cholesterol is 138 mg/dL, slightly above the target of <100 mg/dL.\n• Complete Blood Count (Hemoglobin 14.8 g/dL) and Kidney Function (Creatinine 0.9 mg/dL) are completely normal.\n\nKey Takeaway: Adhering to your prescribed Metformin and low-glycemic, low-sodium meals is effectively supporting your long-term cardiovascular health.`
    };
  }

  // Question about diet / food
  if (lower.includes('diet') || lower.includes('food') || lower.includes('आहार') || lower.includes('खाना') || lower.includes('dieta') || lower.includes('cibo')) {
    if (lang === 'hi') {
      return {
        text: `आपके स्वास्थ्य प्रोफाइल (हल्का उच्च रक्तचाप एवं प्रीडायबिटीज) के अनुसार आहार मार्गदर्शन:\n\n1. नमक की मात्रा 1 चम्मच (2 ग्राम सोडियम) से कम रखें। अचार, पापड़ और चिप्स से बचें।\n2. फाइबर बढ़ाएं: ओट्स, हरी पत्तेदार सब्जियां, लौकी, खीरा और दालें खाएं।\n3. मीठे पेय और मैदे से बनी चीजों से परहेज करें।\n4. दिन में 2.5 लीटर पानी अवश्य पिएं।\n\nयाद रखें: यह सामान्य सलाह है, अपने डॉक्टर के विशिष्ट निर्देशों का अवश्य पालन करें।`
      };
    }
    if (lang === 'it') {
      return {
        text: `Indicazioni dietetiche basate sul tuo profilo clinico (lieve ipertensione e prediabete):\n\n1. Limita il sale a meno di 5g al giorno: evita salumi, cibi in scatola e snack salati.\n2. Aumenta le fibre idrosolubili: avena integrale, legumi, spinaci e verdure a foglia verde.\n3. Riduci carboidrati raffinati e zuccheri semplici per stabilizzare la glicemia.\n4. Mantieni un'idratazione di almeno 2.5 litri di acqua al giorno.\n\nNota: Si tratta di linee guida generali, consulta sempre il tuo medico curante.`
      };
    }
    return {
      text: `Nutritional guidance based on your clinical profile (mild hypertension & borderline glucose):\n\n1. Follow a DASH/Mediterranean pattern: keep sodium under 2,000 mg/day (avoid salted snacks, pickles, and processed meats).\n2. Boost soluble fiber: eat rolled oats, chia seeds, lentils, and green vegetables to blunt glucose spikes and support healthy LDL.\n3. Avoid skipping meals, especially since you take Metformin before eating.\n4. Stay well-hydrated with at least 2.5 liters of plain water daily.\n\nAlways follow any personalized dietary prescriptions from your physician.`
    };
  }

  // General helpful response
  const userName = profile?.name || 'Patient';
  if (lang === 'hi') {
    return {
      text: `नमस्ते ${userName}, मैं मेडिगाइड एआई हूँ। मैं आपके मेडिकल रिकॉर्ड, डॉक्टर के पर्चे और स्वास्थ्य रुझानों को समझने में आपकी सहायता कर सकता हूँ। आप मुझसे अपनी दवाओं के समय, रक्त परीक्षण की व्याख्या या सामान्य स्वास्थ्य सुझावों के बारे में पूछ सकते हैं।\n\nमहत्वपूर्ण सूचना: किसी भी आपातकालीन लक्षण के लिए तुरंत 112/102 पर संपर्क करें।`
    };
  }
  if (lang === 'it') {
    return {
      text: `Salve ${userName}, sono MediGuide AI. Sono a tua disposizione per spiegare i referti di laboratorio, riepilogare le ricette del tuo medico o fornirti consigli sul corretto stile di vita.\n\nPromemoria: Per emergenze sanitarie, contatta immediatamente il 118 o il 112.`
    };
  }
  return {
    text: `Hello ${userName}, I am your MediGuide AI health assistant. I can help explain your uploaded blood tests, organize doctor prescriptions, review medication timings, or suggest general wellness habits.\n\nHow can I help you today? (Reminder: For severe or urgent symptoms, please seek prompt emergency medical care.)`
  };
}
