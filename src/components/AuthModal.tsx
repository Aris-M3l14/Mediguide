import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { t } = useLanguage();
  const { login, signup, loginAsDemo } = usePatient();
  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (tab === 'login') {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }
      login(email, password);
      onClose();
    } else if (tab === 'signup') {
      if (!email || !password || !name) {
        setError('Please fill in your name, email, and password.');
        return;
      }
      signup(email, password, name);
      onClose();
    } else if (tab === 'forgot') {
      if (!email) {
        setError('Please enter your email.');
        return;
      }
      setForgotSubmitted(true);
    }
  };

  const handleDemoAccess = () => {
    loginAsDemo();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-cyan-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {tab === 'forgot' ? t('forgotPasswordModalTitle') : tab === 'signup' ? t('signup') : t('loginTitle')}
              </h3>
              <p className="text-xs text-teal-100">MediGuide AI Secure Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instant Demo Access Banner */}
        <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between gap-3">
          <div className="text-xs text-emerald-900 leading-tight">
            <p className="font-bold">Instant Evaluation</p>
            <p className="text-emerald-700 mt-0.5">Explore pre-populated patient profile & lab records</p>
          </div>
          <button
            type="button"
            onClick={handleDemoAccess}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <span>Demo Patient</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {tab === 'forgot' && forgotSubmitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-800 text-sm">{t('resetEmailSent')}</h4>
              <p className="text-xs text-slate-500">
                In this local demo, your password can be reset instantly by clicking below to return to login.
              </p>
              <button
                type="button"
                onClick={() => { setForgotSubmitted(false); setTab('login'); }}
                className="mt-2 text-xs font-semibold text-teal-700 hover:underline"
              >
                {t('backToLogin')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {error}
                </div>
              )}

              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('fullName')}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {tab !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      {t('passwordLabel')}
                    </label>
                    {tab === 'login' && (
                      <button
                        type="button"
                        onClick={() => setTab('forgot')}
                        className="text-xs text-teal-600 hover:text-teal-700 hover:underline"
                      >
                        {t('forgotPassword')}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2"
              >
                {tab === 'forgot' ? (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>{t('sendResetLink')}</span>
                  </>
                ) : tab === 'signup' ? (
                  <span>{t('signup')}</span>
                ) : (
                  <span>{t('login')}</span>
                )}
              </button>
            </form>
          )}

          {/* Toggle between Login, Signup, and Forgot */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            {tab === 'login' ? (
              <p>
                {t('dontHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => setTab('signup')}
                  className="font-semibold text-teal-600 hover:underline"
                >
                  {t('signup')}
                </button>
              </p>
            ) : tab === 'signup' ? (
              <p>
                {t('alreadyHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="font-semibold text-teal-600 hover:underline"
                >
                  {t('login')}
                </button>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setTab('login')}
                className="font-semibold text-teal-600 hover:underline"
              >
                {t('backToLogin')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
