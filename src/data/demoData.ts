import { PatientProfile, Medication, MedicalReport, HealthMetricEntry, DietLifestyleRecommendation } from '../types';

export const initialPatientProfile: PatientProfile = {
  id: 'patient_demo_01',
  name: 'Rajesh Sharma',
  age: 48,
  gender: 'male',
  bloodGroup: 'O+',
  heightCm: 175,
  weightKg: 78,
  allergies: ['Penicillin', 'Sulfa drugs (mild rash)'],
  existingConditions: ['Hypertension (Mild)', 'Type 2 Diabetes (Borderline / Early stage)'],
  emergencyContact: {
    name: 'Priya Sharma',
    relationship: 'Spouse',
    phone: '+91 98765 43210'
  }
};

export const initialMedications: Medication[] = [
  {
    id: 'med_01',
    name: 'Telmisartan',
    dosage: '40 mg',
    frequency: 'Once daily (OD)',
    timing: 'after_food',
    timeOfDay: ['morning'],
    duration: '90 days',
    startDate: '2026-01-15',
    doctorNotes: 'Take regularly at breakfast. Check blood pressure once a week.',
    takenToday: true,
    prescribedBy: 'Dr. Anita Roy, MD (Cardiology)'
  },
  {
    id: 'med_02',
    name: 'Metformin Hydrochloride',
    dosage: '500 mg',
    frequency: 'Twice daily (BD)',
    timing: 'before_food',
    timeOfDay: ['morning', 'night'],
    duration: '60 days',
    startDate: '2026-01-15',
    doctorNotes: 'Take 15-20 minutes before breakfast and dinner. Do not skip meals.',
    takenToday: true,
    prescribedBy: 'Dr. Anita Roy, MD (Cardiology)'
  },
  {
    id: 'med_03',
    name: 'Cholecalciferol (Vitamin D3)',
    dosage: '60,000 IU',
    frequency: 'Once weekly',
    timing: 'after_food',
    timeOfDay: ['afternoon'],
    duration: '8 weeks',
    startDate: '2026-02-01',
    doctorNotes: 'Take every Sunday after lunch with milk or a meal with good fats.',
    takenToday: false,
    prescribedBy: 'Dr. Anita Roy, MD (Cardiology)'
  },
  {
    id: 'med_04',
    name: 'Paracetamol (SOS)',
    dosage: '650 mg',
    frequency: 'As needed (Max 3/day)',
    timing: 'after_food',
    timeOfDay: ['evening'],
    duration: 'As needed',
    startDate: '2026-02-10',
    doctorNotes: 'Only for headache or mild body ache. Leave 6 hours gap between tablets.',
    takenToday: false,
    prescribedBy: 'Dr. Anita Roy, MD (Cardiology)'
  }
];

export const initialMedicalReports: MedicalReport[] = [
  {
    id: 'rep_01',
    title: 'Comprehensive Metabolic & Lipid Panel',
    date: '2026-01-12',
    category: 'Metabolic & Lipid',
    doctor: 'Dr. Anita Roy, MD',
    facility: 'Apex Diagnostics & Heart Institute',
    fileName: 'Apex_Lab_Metabolic_Lipid_Jan2026.pdf',
    fileSize: '1.4 MB',
    fileType: 'pdf',
    status: 'analyzed',
    summary: {
      en: 'Blood sugar (118 mg/dL) and HbA1c (6.2%) indicate borderline pre-diabetes. Total cholesterol and LDL are slightly above target. Kidney markers (creatinine 0.9 mg/dL) are healthy.',
      hi: 'ब्लड शुगर (118 mg/dL) और एचबीए1सी (6.2%) प्री-डायबिटीज की सीमा दर्शाते हैं। कोलेस्ट्रॉल और एलडीएल लक्ष्य से थोड़े अधिक हैं। गुर्दे की स्थिति (क्रिएटिनिन 0.9 mg/dL) बिल्कुल सामान्य है।',
      it: 'Glicemia a digiuno (118 mg/dL) ed emoglobina glicata (6.2%) mostrano un quadro di pre-diabete. Colesterolo totale e LDL sono leggermente sopra la norma. Funzione renale (creatinina 0.9 mg/dL) ottimale.'
    },
    parameters: [
      {
        name: 'Fasting Blood Sugar (Glucose)',
        result: 118,
        unit: 'mg/dL',
        referenceRange: '70 - 99 mg/dL',
        status: 'borderline',
        simpleExplanation: {
          en: 'Measures sugar circulating in your blood after an overnight fast of 8-10 hours.',
          hi: 'यह रात भर 8-10 घंटे भूखे रहने के बाद आपके खून में शर्करा (शुगर) के स्तर को मापता है।',
          it: 'Misura la quantità di glucosio nel sangue dopo un digiuno notturno di almeno 8-10 ore.'
        },
        possibleSignificance: {
          en: '100-125 mg/dL indicates impaired fasting glucose (pre-diabetes). Dietary adjustments and Metformin help normalize this.',
          hi: '100-125 mg/dL प्रीडायबिटीज का संकेत है। संतुलित खानपान और मेटफॉर्मिन इसे सामान्य करने में सहायक होते हैं।',
          it: 'I valori tra 100 e 125 mg/dL indicano prediabete. Dieta a basso indice glicemico e metformina aiutano a regolarizzarlo.'
        }
      },
      {
        name: 'HbA1c (Glycated Hemoglobin)',
        result: 6.2,
        unit: '%',
        referenceRange: '< 5.7 %',
        status: 'borderline',
        simpleExplanation: {
          en: 'Reflects your average blood sugar levels over the past 2 to 3 months.',
          hi: 'यह पिछले 2 से 3 महीनों में आपके औसत ब्लड शुगर स्तर का सटीक रिकॉर्ड देता है।',
          it: 'Rappresenta la media dei tuoi livelli di zucchero nel sangue negli ultimi 2-3 mesi.'
        },
        possibleSignificance: {
          en: '5.7% to 6.4% is the pre-diabetic window. Good lifestyle changes can prevent progression to overt diabetes.',
          hi: '5.7% से 6.4% प्रीडायबिटीज सीमा है। सक्रिय जीवनशैली और कम चीनी से डायबिटीज को रोका जा सकता है।',
          it: 'Tra 5.7% e 6.4% rientra nel pre-diabete. Piccoli cambiamenti nello stile di vita prevengono l’insorgenza del diabete conclamato.'
        }
      },
      {
        name: 'Total Cholesterol',
        result: 215,
        unit: 'mg/dL',
        referenceRange: '< 200 mg/dL',
        status: 'borderline',
        simpleExplanation: {
          en: 'Total measure of all cholesterol fats carried in your bloodstream.',
          hi: 'आपके रक्तप्रवाह में मौजूद सभी प्रकार के कोलेस्ट्रॉल वसा का कुल माप।',
          it: 'Misura complessiva di tutti i tipi di colesterolo presenti nel circolo ematico.'
        },
        possibleSignificance: {
          en: 'Mildly elevated (borderline high). Emphasize soluble fiber, oats, olive oil, and limit saturated/fried foods.',
          hi: 'हल्का सा बढ़ा हुआ है। घुलनशील फाइबर, ओट्स और हरी सब्जियों का सेवन बढ़ाएं तथा तली हुई चीजों से बचें।',
          it: 'Lievemente elevato. Si consiglia di consumare fibre solubili, olio extravergine d’oliva e limitare cibi fritti.'
        }
      },
      {
        name: 'LDL Cholesterol ("Bad" Cholesterol)',
        result: 138,
        unit: 'mg/dL',
        referenceRange: '< 100 mg/dL',
        status: 'abnormal',
        simpleExplanation: {
          en: 'Low-Density Lipoprotein: builds plaque in arterial blood vessels if elevated over long periods.',
          hi: 'यह हानिकारक वसा है जो लंबे समय तक अधिक रहने पर धमनियों में जमा हो सकती है।',
          it: 'Lipoproteine a bassa densità: se elevate a lungo possono depositarsi sulle pareti delle arterie.'
        },
        possibleSignificance: {
          en: 'Elevated. Doctor may monitor and discuss if a statin or dedicated diet is appropriate alongside your blood pressure medication.',
          hi: 'बढ़ा हुआ है। डॉक्टर से आहार नियंत्रण और कोलेस्ट्रॉल कम करने पर चर्चा करें।',
          it: 'Elevato. Da discutere con il medico curante per valutare interventi dietetici mirati o statine.'
        }
      },
      {
        name: 'HDL Cholesterol ("Good" Cholesterol)',
        result: 46,
        unit: 'mg/dL',
        referenceRange: '> 40 mg/dL',
        status: 'normal',
        simpleExplanation: {
          en: 'High-Density Lipoprotein: scavenges excess cholesterol and carries it back to the liver for disposal.',
          hi: 'यह स्वास्थ्यवर्धक कोलेस्ट्रॉल है जो रक्त वाहिकाओं से अतिरिक्त वसा को साफ करता है।',
          it: 'Lipoproteine ad alta densità: rimuovono il colesterolo in eccesso dai vasi sanguigni proteggendo il cuore.'
        },
        possibleSignificance: {
          en: 'Adequate protective level. Regular aerobic walking helps boost this further.',
          hi: 'सुरक्षित स्तर पर है। रोजाना 30 मिनट तेज टहलने से यह और बेहतर होता है।',
          it: 'Livello adeguato e protettivo. Camminate a passo svelto favoriscono un ulteriore incremento.'
        }
      },
      {
        name: 'Serum Creatinine',
        result: 0.9,
        unit: 'mg/dL',
        referenceRange: '0.7 - 1.2 mg/dL',
        status: 'normal',
        simpleExplanation: {
          en: 'A waste byproduct of muscle metabolism filtered out continuously by healthy kidneys.',
          hi: 'यह मांसपेशियों के चयापचय का उत्पाद है जिसे स्वस्थ गुर्दे (किडनी) साफ करते हैं।',
          it: 'Un sottoprodotto del metabolismo muscolare filtrato costantemente dai reni sani.'
        },
        possibleSignificance: {
          en: 'Completely normal, indicating stable kidney filtration rate (eGFR > 90).',
          hi: 'पूरी तरह से सामान्य है, जो स्वस्थ किडनी कार्यप्रणाली को दर्शाता है।',
          it: 'Perfettamente normale, indica un’ottima funzionalità dei reni.'
        }
      }
    ]
  },
  {
    id: 'rep_02',
    title: 'Complete Blood Count (CBC) & Hemogram',
    date: '2026-01-12',
    category: 'Complete Blood Count',
    doctor: 'Dr. Anita Roy, MD',
    facility: 'Apex Diagnostics & Heart Institute',
    fileName: 'CBC_Hemogram_Report_Jan2026.pdf',
    fileSize: '950 KB',
    fileType: 'pdf',
    status: 'analyzed',
    summary: {
      en: 'Hemoglobin (14.8 g/dL), White Blood Cells (6,400 /mcL), and Platelet count (230,000 /mcL) are in excellent normal ranges with no signs of infection or anemia.',
      hi: 'हीमोग्लोबिन (14.8 g/dL), श्वेत रक्त कोशिकाएं (6,400) और प्लेटलेट्स (2.3 लाख) बिल्कुल सामान्य हैं। एनीमिया या संक्रमण का कोई लक्षण नहीं है।',
      it: 'Emoglobina (14.8 g/dL), globuli bianchi (6.400 /mcL) e piastrine (230.000 /mcL) sono ottimali senza alcun segno di infezione o anemia.'
    },
    parameters: [
      {
        name: 'Hemoglobin (Hb)',
        result: 14.8,
        unit: 'g/dL',
        referenceRange: '13.5 - 17.5 g/dL',
        status: 'normal',
        simpleExplanation: {
          en: 'The protein in red blood cells that transports oxygen to your brain and body organs.',
          hi: 'लाल रक्त कोशिकाओं का वह प्रोटीन जो पूरे शरीर में ऑक्सीजन पहुंचाता है।',
          it: 'Proteina presente nei globuli rossi che trasporta ossigeno in tutti i tessuti del corpo.'
        },
        possibleSignificance: {
          en: 'Healthy oxygen-carrying capacity. No anemia detected.',
          hi: 'ऑक्सीजन वहन करने की क्षमता उत्तम है। खून की कोई कमी नहीं है।',
          it: 'Ottima capacità di ossigenazione dei tessuti. Nessuna anemia.'
        }
      },
      {
        name: 'White Blood Cell Count (WBC)',
        result: 6400,
        unit: '/mcL',
        referenceRange: '4,000 - 11,000 /mcL',
        status: 'normal',
        simpleExplanation: {
          en: 'Immune defense cells that fight bacterial and viral infections.',
          hi: 'रोग प्रतिरोधक क्षमता वाली कोशिकाएं जो संक्रमण से लड़ती हैं।',
          it: 'Cellule del sistema immunitario deputate a combattere infezioni batteriche e virali.'
        },
        possibleSignificance: {
          en: 'Normal. Indicates no active systemic infection or acute inflammation.',
          hi: 'सामान्य है। शरीर में किसी गंभीर सक्रिय संक्रमण का संकेत नहीं है।',
          it: 'Normale. Esclude infezioni acute o infiammazioni sistemiche in corso.'
        }
      },
      {
        name: 'Platelet Count',
        result: 235000,
        unit: '/mcL',
        referenceRange: '150,000 - 450,000 /mcL',
        status: 'normal',
        simpleExplanation: {
          en: 'Cell fragments that form blood clots to stop cuts and bleeding.',
          hi: 'रक्त के थक्के बनाने और रक्तस्राव रोकने वाली कोशिकाएं।',
          it: 'Frammenti cellulari responsabili della coagulazione del sangue per arrestare le emorragie.'
        },
        possibleSignificance: {
          en: 'Normal clotting mechanism intact.',
          hi: 'रक्त का थक्का बनने की सामान्य प्रणाली ठीक है।',
          it: 'Normale capacità coagulativa.'
        }
      }
    ]
  },
  {
    id: 'rep_03',
    title: 'Cardiology Prescription & ECG Note',
    date: '2026-01-15',
    category: 'Prescription',
    doctor: 'Dr. Anita Roy, MD',
    facility: 'Apex Cardiology Clinic',
    fileName: 'Dr_Roy_Prescription_Jan2026.png',
    fileSize: '2.1 MB',
    fileType: 'png',
    status: 'analyzed',
    summary: {
      en: 'Prescription detailing Telmisartan 40mg (morning) and Metformin 500mg (twice daily before food). ECG shows normal sinus rhythm.',
      hi: 'टेल्मिसार्टन 40mg (सुबह) और मेटफॉर्मिन 500mg (दिन में दो बार) की सलाह दी गई है। ईसीजी रिपोर्ट सामान्य है।',
      it: 'Prescrizione con Telmisartan 40mg al mattino e Metformina 500mg due volte al dì prima dei pasti. ECG nel limite della norma.'
    },
    parameters: []
  }
];

export const initialHealthMetrics: HealthMetricEntry[] = [
  {
    date: '2025-08-15',
    weight: 79.5,
    systolic: 142,
    diastolic: 90,
    glucose: 130,
    heartRate: 78,
    notes: 'Initial checkup with Dr. Roy'
  },
  {
    date: '2025-09-15',
    weight: 79.0,
    systolic: 138,
    diastolic: 88,
    glucose: 126,
    heartRate: 76,
    notes: 'Started low sodium diet'
  },
  {
    date: '2025-10-15',
    weight: 78.4,
    systolic: 135,
    diastolic: 85,
    glucose: 122,
    heartRate: 74,
    notes: 'Daily 25-minute morning walks'
  },
  {
    date: '2025-11-15',
    weight: 78.8,
    systolic: 132,
    diastolic: 84,
    glucose: 118,
    heartRate: 72,
    notes: 'Telmisartan well tolerated'
  },
  {
    date: '2025-12-15',
    weight: 78.2,
    systolic: 130,
    diastolic: 82,
    glucose: 116,
    heartRate: 75,
    notes: 'Holiday season, controlled carbs'
  },
  {
    date: '2026-01-15',
    weight: 78.0,
    systolic: 128,
    diastolic: 82,
    glucose: 114,
    heartRate: 72,
    notes: 'Recent lab follow-up; BP within goal'
  }
];

export const demoDietAndLifestyle: Record<string, DietLifestyleRecommendation> = {
  en: {
    diet: {
      summary: 'DASH (Dietary Approaches to Stop Hypertension) and Low-Glycemic Index plan tailored for blood pressure control and borderline glucose.',
      foodsToInclude: [
        'Soluble fiber: Rolled oats, barley, chia seeds, and legumes to help lower LDL and glucose spikes.',
        'Potassium-rich vegetables: Steamed spinach, broccoli, bottle gourd, tomatoes, and pumpkin.',
        'Healthy fats: Extra virgin olive oil, 4-5 unsalted walnuts, and ground flaxseeds.',
        'Lean proteins: Moong dal, tofu, grilled chicken/fish, or low-fat unsweetened paneer/yogurt.'
      ],
      foodsToAvoidOrLimit: [
        'High sodium products: Pickles, processed papads, canned soups, and salty snacks.',
        'Refined carbohydrates: White bread, refined flour (maida), sweets, bakery pastries, and sweetened beverages.',
        'Trans fats & deep-fried foods: Limit fried street snacks and reheated oils.'
      ],
      tips: [
        'Keep sodium intake under 2,000 mg (less than 1 level teaspoon of salt per day).',
        'Eat a plate consisting of 50% non-starchy vegetables, 25% lean protein, and 25% whole grains.',
        'Do not skip meals, especially when taking Metformin before meals.'
      ]
    },
    hydration: {
      recommendedDailyLiters: 2.5,
      tip: 'Drink water evenly across the day. Avoid sugary juices or excessive caffeine which may temporarily elevate heart rate.'
    },
    sleep: {
      recommendedHours: '7 to 8 hours per night',
      routineTip: 'Maintain a fixed bedtime. Poor sleep directly elevates morning cortisol and blood pressure.'
    },
    exercise: {
      intensity: 'Moderate Aerobic & Light Resistance',
      frequency: '30 minutes a day, 5 days per week (150 minutes weekly)',
      suggestions: [
        'Brisk outdoor walking or treadmill at comfortable conversational pace.',
        'Light bodyweight squats and stretching to enhance insulin sensitivity in large muscle groups.',
        'Pranayama (deep breathing) or 10 minutes of evening meditation to support blood pressure calming.'
      ],
      precautions: [
        'Do not engage in sudden heavy straining or breath holding (Valsalva maneuver).',
        'Stay hydrated before and after physical activity.'
      ]
    },
    disclaimer: 'These suggestions are general evidence-based wellness guidelines. Always follow specific instructions given by your doctor or clinical dietitian.'
  },
  hi: {
    diet: {
      summary: 'डैश (DASH) आहार एवं कम ग्लाइसेमिक इंडेक्स योजना, जो रक्तचाप नियंत्रण और प्रीडायबिटीज के लिए अनुकूलित है।',
      foodsToInclude: [
        'घुलनशील फाइबर: ओट्स, दलिया, अलसी के बीज और हरी दालें जो शुगर और खराब कोलेस्ट्रॉल घटाने में सहायक हैं।',
        'पोटैशियम युक्त सब्जियां: पालक, लौकी, तोरी, ब्रोकली और टमाटर।',
        'स्वास्थ्यवर्धक वसा: 4-5 अखरोट, बादाम और कच्ची घानी का सरसों या जैतून का तेल।',
        'प्रोटीन: मूंग दाल, अंकुरित अनाज, टोफू या कम वसा वाला पनीर।',
      ],
      foodsToAvoidOrLimit: [
        'अत्यधिक नमक: अचार, पापड़, डिब्बाबंद सूप और नमकीन चिप्स।',
        'रिफाइंड कार्ब्स: सफेद मैदा, सफेद चीनी, मिठाइयां और कोल्ड ड्रिंक्स।',
        'तली-भुनी चीजें: समोसे, पकोड़े और बार-बार गर्म किया गया तेल।'
      ],
      tips: [
        'दिन भर में नमक की कुल मात्रा 1 चम्मच (2000 मिग्रा) से कम रखें।',
        'अपनी थाली का 50% हिस्सा हरी सब्जियों और सलाद से भरें।',
        'दवा लेने के समय भोजन छोड़ना नहीं चाहिए।'
      ]
    },
    hydration: {
      recommendedDailyLiters: 2.5,
      tip: 'दिन भर में नियमित रूप से पानी पिएं। मीठे पेय पदार्थों से बचें।'
    },
    sleep: {
      recommendedHours: '7 से 8 घंटे प्रतिदिन',
      routineTip: 'सोने और जागने का एक निश्चित समय बनाएं। अधूरी नींद से रक्तचाप बढ़ सकता है।'
    },
    exercise: {
      intensity: 'मध्यम एरोबिक व्यायाम',
      frequency: 'रोजाना 30 मिनट, सप्ताह में 5 दिन',
      suggestions: [
        'रोज सुबह 30 मिनट तेज गति से टहलना (Brisk Walking)।',
        'हल्के स्ट्रेचिंग व्यायाम और योग (जैसे अनुलोम-विलोम)।',
        'दिन में 10 मिनट ध्यान या गहरी सांस लेना जो तनाव और बीपी घटाता है।'
      ],
      precautions: [
        'अचानक बहुत भारी वजन न उठाएं।',
        'व्यायाम से पहले और बाद में पर्याप्त पानी पिएं।'
      ]
    },
    disclaimer: 'यह केवल सामान्य स्वास्थ्य सुझाव है। अपने डॉक्टर या आहार विशेषज्ञ की सलाह का हमेशा पालन करें।'
  },
  it: {
    diet: {
      summary: 'Dieta stile DASH e Dieta Mediterranea a basso indice glicemico per il controllo della pressione e della glicemia.',
      foodsToInclude: [
        'Fibre solubili: Avena integrale, legumi, semi di chia e verdure a foglia verde.',
        'Verdure ricche di potassio: Spinaci, zucchine, pomodori freschi e finocchi.',
        'Grassi sani: Olio extravergine di oliva a crudo, 4 noci non salate al giorno.',
        'Proteine magre: Pesce azzurro (orata, salmone), legumi misti, carni bianche.'
      ],
      foodsToAvoidOrLimit: [
        'Sodio in eccesso: Insaccati, formaggi molto stagionati, cibi in scatola e snack salati.',
        'Zuccheri semplici: Dolci industriali, farine raffinate e bevande zuccherate.',
        'Grassi idrogenati e fritti frequenti.'
      ],
      tips: [
        'Limitare il sale da cucina a meno di 5 grammi al giorno (circa un cucchiaino).',
        'Comporre il piatto per metà con verdure, un quarto con cereali integrali e un quarto con proteine.',
        'Assumere i pasti con regolarità senza saltare la colazione.'
      ]
    },
    hydration: {
      recommendedDailyLiters: 2.5,
      tip: 'Bere acqua regolarmente durante la giornata; evitare bevande zuccherate o alcoliche.'
    },
    sleep: {
      recommendedHours: '7 - 8 ore a notte',
      routineTip: 'Coricarsi alla stessa ora in un ambiente buio e silenzioso per proteggere la pressione notturna.'
    },
    exercise: {
      intensity: 'Attività aerobica moderata',
      frequency: '30 minuti al giorno per 5 giorni a settimana',
      suggestions: [
        'Camminata a passo svelto o cyclette leggera.',
        'Esercizi di stretching e mobilità articolare.',
        'Tecniche di respirazione diaframmatica per rilassare il sistema nervoso autonomo.'
      ],
      precautions: [
        'Evitare sforzi isometrici massimali improvvisi.',
        'Idratarsi prima, durante e dopo l’esercizio.'
      ]
    },
    disclaimer: 'Questi consigli hanno solo scopo educativo generale. Seguire sempre il parere del proprio medico curante o nutrizionista.'
  }
};
