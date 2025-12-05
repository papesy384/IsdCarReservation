import React, { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { authAPI, supabase } from '../utils/api';
import { AnimatedBackground } from './AnimatedBackground';
import { ImageWithFallback } from './figma/ImageWithFallback';
import schoolLogo from 'figma:asset/4bd846bf67c44fcbc0a58285b6a6f879210a7b3c.png';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Mail, Lock, User, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Language } from '../App';

interface SignupProps {
  onSignup: (accessToken: string) => void;
  onSwitchToLogin: () => void;
  language: Language;
}

const translations = {
  en: {
    title: 'ISD Car Reservation',
    signupTitle: 'Create Account',
    signupDescription: 'Sign up for a new account',
    name: 'Full Name',
    namePlaceholder: 'John Doe',
    email: 'Email Address',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    passwordPlaceholder: 'At least 6 characters',
    phone: 'Phone Number',
    phonePlaceholder: '+1234567890',
    department: 'Department',
    departmentPlaceholder: 'Select your department',
    role: 'Role',
    signupButton: 'Create Account',
    signingUp: 'Creating account...',
    haveAccount: 'Already have an account?',
    signIn: 'Sign in',
    error: 'Error creating account. Please try again.',
    employee: 'Employee',
    admin: 'Administrator',
    driver: 'Driver',
  },
  fr: {
    title: 'Hub de Transport Scolaire',
    signupTitle: 'Créer un compte',
    signupDescription: 'Inscrivez-vous pour un nouveau compte',
    name: 'Nom complet',
    namePlaceholder: 'Jean Dupont',
    email: 'Adresse e-mail',
    emailPlaceholder: 'vous@exemple.com',
    password: 'Mot de passe',
    passwordPlaceholder: 'Au moins 6 caractères',
    phone: 'Numéro de téléphone',
    phonePlaceholder: '+1234567890',
    department: 'Département',
    departmentPlaceholder: 'Sélectionnez votre département',
    role: 'Rôle',
    signupButton: 'Créer un compte',
    signingUp: 'Création du compte...',
    haveAccount: 'Vous avez déjà un compte?',
    signIn: 'Se connecter',
    error: 'Erreur lors de la création du compte. Veuillez réessayer.',
    employee: 'Employé',
    admin: 'Administrateur',
    driver: 'Conducteur',
  },
};

const departments = [
  'Administration',
  'Teaching',
  'Maintenance',
  'IT',
  'Security',
  'Transportation',
];

export function Signup({ onSignup, onSwitchToLogin, language }: SignupProps) {
  const t = translations[language];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    role: 'employee',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.signup(formData);

      if (!data.success) {
        setError(data.error || t.error);
        setLoading(false);
        return;
      }

      onSignup(data.accessToken);
    } catch (err) {
      console.error('Signup error:', err);
      setError(t.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <AnimatedBackground />
      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-[#FFD700]/20">
            <ImageWithFallback src={schoolLogo} alt="ISD Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent">{t.title}</h1>
        </div>

        {/* Signup Card */}
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-2xl">{t.signupTitle}</CardTitle>
            <CardDescription className="text-gray-400">{t.signupDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-500/20 border border-red-500/30">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">{t.name}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  minLength={6}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">{t.phone}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-white">{t.department}</Label>
                <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#FFD700]">
                    <SelectValue placeholder={t.departmentPlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10">
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept} className="text-white hover:bg-white/10">
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-white">{t.role}</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#FFD700]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10">
                    <SelectItem value="employee" className="text-white hover:bg-white/10">{t.employee}</SelectItem>
                    <SelectItem value="admin" className="text-white hover:bg-white/10">{t.admin}</SelectItem>
                    <SelectItem value="driver" className="text-white hover:bg-white/10">{t.driver}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90 h-12 shadow-lg shadow-[#FFD700]/20"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.signingUp}
                  </>
                ) : (
                  t.signupButton
                )}
              </Button>

              <div className="text-center mt-4">
                <span className="text-gray-400">{t.haveAccount} </span>
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-[#FFD700] hover:underline font-semibold"
                >
                  {t.signIn}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}