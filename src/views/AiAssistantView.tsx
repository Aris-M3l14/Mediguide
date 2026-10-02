import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  User, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { aiService } from '../services/aiService';
import { ChatMessage } from '../types';

interface AiAssistantViewProps {
  initialPrompt?: string;
  onOpenEmergency: () => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ initialPrompt = '', onOpenEmergency }) => {
  const { t, language } = useLanguage();
  const { profile, medications, reports } = usePatient();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting based on language
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    let welcomeText = `Hello ${profile.name}! I am your MediGuide AI health assistant. I have reviewed your profile, doctor prescriptions, and recent lab panel (HbA1c 6.2%, Fasting Glucose 118 mg/dL). How can I assist you with your health today?`;
    if (language === 'hi') {
      welcomeText = `नमस्ते ${profile.name}! मैं आपका मेडिगाइड एआई स्वास्थ्य सहायक हूँ। मैंने आपके प्रोफाइल, डॉक्टर के पर्चे और हालिया लैब रिपोर्ट (फास्टिंग शुगर 118 mg/dL, HbA1c 6.2%) की समीक्षा कर ली है। आज मैं आपके स्वास्थ्य संबंधी किस प्रश्न में मदद कर सकता हूँ?`;
    } else if (language === 'it') {
      welcomeText = `Salve ${profile.name}! Sono il tuo assistente clinico MediGuide AI. Ho esaminato il tuo profilo, le prescrizioni del medico e gli ultimi esami di laboratorio. Come posso aiutarti oggi a comprendere i tuoi referti e le terapie?`;
    }

    return [
      {
        id: 'msg_0',
        sender: 'ai',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  // Handle initial prompt passed from dashboard or other views
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.sendChatMessage({
        message: text,
        history: messages.map(m => ({ sender: m.sender, text: m.text })),
        language,
        patientProfile: profile,
        medications,
        recentReports: reports
      });

      const aiMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergencyAlert: response.isEmergencyAlert
      };

      setMessages(prev => [...prev, aiMsg]);
      if (response.isEmergencyAlert) {
        onOpenEmergency();
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        text: language === 'hi'
          ? 'चैट रीसेट कर दी गई है। आप कोई भी नया प्रश्न पूछ सकते हैं।'
          : language === 'it'
          ? 'Conversazione ripristinata. Fammi pure un’altra domanda.'
          : 'Conversation cleared. How can I help you understand your records today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const sampleQuestions = [
    t('suggestedQ1'),
    t('suggestedQ2'),
    t('suggestedQ3'),
    t('suggestedQ4'),
  ];

  return (
    <div className="space-y-4 pb-12 animate-fade-in max-w-4xl mx-auto flex flex-col h-[calc(100vh-8.5rem)]">
      {/* Header bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">{t('aiAssistantTitle')}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {t('aiAssistantSubtitle')}
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition text-xs font-semibold flex items-center gap-1 cursor-pointer"
          title={t('clearChat')}
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">{t('clearChat')}</span>
        </button>
      </div>

      {/* Safety Notice Strip */}
      <div className="px-4 py-2 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs flex items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="truncate">{t('aiChatDisclaimer')}</span>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-tr-xs'
                  : msg.isEmergencyAlert
                  ? 'bg-red-50 border-2 border-red-500 text-red-950 font-medium rounded-tl-xs'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs'
              }`}
            >
              {msg.isEmergencyAlert && (
                <div className="flex items-center gap-1.5 text-red-600 font-bold mb-1.5 text-xs">
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                  <span>EMERGENCY ALERT TRIGGERED</span>
                </div>
              )}
              <p>{msg.text}</p>
              <div
                className={`mt-2 text-[10px] text-right ${
                  msg.sender === 'user' ? 'text-teal-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-teal-600 animate-pulse delay-75" />
              <div className="w-2 h-2 rounded-full bg-teal-600 animate-pulse delay-150" />
              <span className="text-slate-600 font-medium ml-1">{t('typingIndicator')}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex-shrink-0 overflow-x-auto pb-1 flex gap-2">
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-teal-300 hover:bg-teal-50 text-slate-700 hover:text-teal-800 font-medium transition cursor-pointer flex-shrink-0 shadow-xs"
          >
            💡 {q}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 flex-shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chatInputPlaceholder')}
          className="flex-1 px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-sm transition flex items-center gap-1.5 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t('send')}</span>
        </button>
      </form>
    </div>
  );
};
