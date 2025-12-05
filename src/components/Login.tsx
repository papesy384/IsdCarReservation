import React, { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { authAPI, supabase } from '../utils/api';
import { ImageWithFallback } from './figma/ImageWithFallback';
import schoolLogo from 'figma:asset/4bd846bf67c44fcbc0a58285b6a6f879210a7b3c.png';
import { AnimatedBackground } from './AnimatedBackground';
import { Language } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Mail, Lock, Loader2, Eye, EyeOff, Globe, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (accessToken: string) => void;
  onSwitchToSignup: () => void;
  language: Language;
  setLanguage?: (lang: Language) => void;
}

const translations = {
  en: {
    title: 'ISD Car Reservation',
    subtitle: 'Professional Vehicle Booking System',
    loginTitle: 'Welcome Back',
    loginDescription: 'Sign in to access your account',
    email: 'Email Address',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    loginButton: 'Sign In',
    signingIn: 'Signing in...',
    noAccount: "Don't have an account?",
    signUp: 'Create account',
    error: 'Error signing in. Please check your credentials.',
    testAccounts: 'Test Accounts',
    admin: 'Admin',
    employee: 'Employee',
    driver: 'Driver',
    forgotPassword: 'Forgot password?',
  },
  fr: {
    title: 'Réservation de Voitures ISD',
    subtitle: 'Système de Réservation de Véhicules Professionnel',
    loginTitle: 'Bon Retour',
    loginDescription: 'Connectez-vous pour accéder à votre compte',
    email: 'Adresse e-mail',
    emailPlaceholder: 'vous@exemple.com',
    password: 'Mot de passe',
    passwordPlaceholder: '••••••••',
    loginButton: 'Se connecter',
    signingIn: 'Connexion en cours...',
    noAccount: "Vous n'avez pas de compte?",
    signUp: 'Créer un compte',
    error: 'Erreur de connexion. Veuillez vérifier vos identifiants.',
    testAccounts: 'Comptes de Test',
    admin: 'Administrateur',
    employee: 'Employé',
    driver: 'Chauffeur',
    forgotPassword: 'Mot de passe oublié?',
  },
};

export function Login({ onLogin, onSwitchToSignup, language, setLanguage }: LoginProps) {
  const t = translations[language];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login(email, password);

      if (!data.success) {
        setError(data.error || t.error);
        setLoading(false);
        return;
      }

      onLogin(data.accessToken);
    } catch (err) {
      console.error('Login error:', err);
      setError(t.error);
      setLoading(false);
    }
  };

  const quickLogin = (role: 'admin' | 'employee' | 'driver') => {
    const credentials = {
      admin: { email: 'admin@school.edu', password: 'password123' },
      employee: { email: 'employee@school.edu', password: 'password123' },
      driver: { email: 'driver@school.edu', password: 'password123' },
    };
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Language Switcher - Top Right */}
      {setLanguage && (
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            <Globe className="w-4 h-4 text-[#FFD700]" />
            <span className="text-sm font-medium">{language === 'en' ? 'FR' : 'EN'}</span>
          </button>
        </div>
      )}

      {/* Animated Background */}
      <AnimatedBackground />

      <div className="w-full max-w-6xl relative z-10 grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:block space-y-8 text-white">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FFD700]/20">
                <ImageWithFallback src={schoolLogo} alt="ISD Logo" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFD700] to-white bg-clip-text text-transparent">
                  {t.title}
                </h1>
                <p className="text-gray-400 mt-1">{t.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center group-hover:bg-[#FFD700]/20 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Smart Booking System</h3>
                <p className="text-gray-400 text-sm">Streamlined vehicle reservation process</p>
              </div>
            </div>

            <div className="flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center group-hover:bg-[#FFD700]/20 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Real-time Updates</h3>
                <p className="text-gray-400 text-sm">Instant approval notifications and status tracking</p>
              </div>
            </div>

            <div className="flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center group-hover:bg-[#FFD700]/20 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Comprehensive Analytics</h3>
                <p className="text-gray-400 text-sm">Advanced reporting and insights dashboard</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
            <div>
              <div className="text-3xl font-bold text-[#FFD700]">24/7</div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#FFD700]">100%</div>
              <div className="text-sm text-gray-400">Secure</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#FFD700]">Fast</div>
              <div className="text-sm text-gray-400">Approval</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-[#FFD700]/20">
              <ImageWithFallback src={schoolLogo} alt="ISD Logo" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFD700] to-white bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-gray-400 mt-1 text-sm">{t.subtitle}</p>
          </div>

          {/* Login Card */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-white text-2xl">{t.loginTitle}</CardTitle>
              <CardDescription className="text-gray-400">{t.loginDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-sm font-medium">
                    {t.email}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 pl-10 h-12 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-white text-sm font-medium">
                      {t.password}
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-[#FFD700] hover:underline"
                    >
                      {t.forgotPassword}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 pl-10 pr-10 h-12 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90 h-12 font-semibold shadow-lg shadow-[#FFD700]/20 transition-all hover:shadow-xl hover:shadow-[#FFD700]/30"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.signingIn}
                    </>
                  ) : (
                    t.loginButton
                  )}
                </Button>

                <div className="text-center pt-2">
                  <span className="text-gray-400 text-sm">{t.noAccount} </span>
                  <button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="text-[#FFD700] hover:underline text-sm font-medium"
                  >
                    {t.signUp}
                  </button>
                </div>
              </form>

              {/* Quick Login - Test Accounts */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-3 text-center">{t.testAccounts}</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => quickLogin('admin')}
                    className="px-3 py-2 text-xs rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors"
                  >
                    {t.admin}
                  </button>
                  <button
                    type="button"
                    onClick={() => quickLogin('employee')}
                    className="px-3 py-2 text-xs rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors"
                  >
                    {t.employee}
                  </button>
                  <button
                    type="button"
                    onClick={() => quickLogin('driver')}
                    className="px-3 py-2 text-xs rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors"
                  >
                    {t.driver}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            © 2024 ISD Car Reservation. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}