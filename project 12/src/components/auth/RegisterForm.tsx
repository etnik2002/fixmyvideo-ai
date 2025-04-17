import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

const RegisterForm: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      return 'Passwort muss mindestens 8 Zeichen lang sein';
    }
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(''); // Clear any previous email errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (password !== confirmPassword) {
      setPasswordError('Passwörter stimmen nicht überein');
      return;
    }

    if (passwordError) {
      return;
    }

    if (!agreeTerms) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      await register(email, password, displayName);
      setShowVerificationAlert(true);
    } catch (error: any) {
      // Email already exists error is handled by the AuthContext
      // but we can check for it here to set a specific field error
      if (error.message.includes('bereits verwendet') || error.message.includes('already exists')) {
        setEmailError('Sie besitzen bereits einen Account mit dieser E-Mail-Adresse. Bitte nutzen Sie die Login-Funktion oder die \'Passwort vergessen\'-Option, falls Sie Ihr Passwort nicht mehr wissen.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-fmv-silk/80 mb-2">
          Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={18} className="text-fmv-carbon-light" />
          </div>
          <input
            id="displayName"
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-fmv-carbon-light/30 rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50"
            placeholder="Ihr Name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-fmv-silk/80 mb-2">
          E-Mail
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={18} className="text-fmv-carbon-light" />
          </div>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={handleEmailChange}
            className={`block w-full pl-10 pr-3 py-2 border ${
              emailError ? 'border-red-500' : 'border-fmv-carbon-light/30'
            } rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50`}
            placeholder="your@email.com"
          />
        </div>
        {emailError && (
          <p className="mt-1 text-xs text-red-400">{emailError}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-fmv-silk/80 mb-2">
          Passwort
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-fmv-carbon-light" />
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={handlePasswordChange}
            className={`block w-full pl-10 pr-3 py-2 border ${passwordError ? 'border-red-500' : 'border-fmv-carbon-light/30'} rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50`}
            placeholder="••••••••"
          />
        </div>
        {passwordError && (
          <p className="mt-1 text-xs text-red-400">{passwordError}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-fmv-silk/80 mb-2">
          Passwort bestätigen
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-fmv-carbon-light" />
          </div>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`block w-full pl-10 pr-3 py-2 border ${password !== confirmPassword ? 'border-red-500' : 'border-fmv-carbon-light/30'} rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50`}
            placeholder="••••••••"
          />
        </div>
        {password !== confirmPassword && confirmPassword && (
          <p className="mt-1 text-xs text-red-400">Passwörter stimmen nicht überein</p>
        )}
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            required
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="focus:ring-fmv-orange h-4 w-4 text-fmv-orange border-gray-600 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="text-fmv-silk/70">
            Ich stimme den <Link to="/agb" className="text-fmv-orange hover:text-fmv-orange-light transition-colors">AGB</Link> und <Link to="/datenschutz" className="text-fmv-orange hover:text-fmv-orange-light transition-colors">Datenschutzbestimmungen</Link> zu
          </label>
        </div>
      </div>

      {/* Email Verification Alert */}
      {showVerificationAlert && (
        <div className="bg-green-900/20 border border-green-900/30 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-green-400 text-sm">
              Ihr Account wurde erfolgreich erstellt! Bitte überprüfen Sie Ihren Posteingang und bestätigen Sie Ihre E-Mail-Adresse, um sich anmelden zu können.
            </p>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting || !agreeTerms || !!passwordError || password !== confirmPassword}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-fmv-orange hover:bg-fmv-orange-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fmv-orange disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              <UserPlus size={20} className="mr-2" />
              Registrieren
            </>
          )}
        </button>
      </div>

      <div className="text-center text-sm">
        <span className="text-fmv-silk/60">
          Bereits ein Konto?{' '}
        </span>
        <Link to="/auth/login" className="text-fmv-orange hover:text-fmv-orange-light transition-colors font-medium">
          Anmelden
        </Link>
      </div>

      <div>
        <Link to="/bestellen" className="w-full flex justify-center items-center py-2 px-4 border border-fmv-carbon-light/40 rounded-md text-fmv-silk/90 bg-fmv-carbon-light/10 hover:bg-fmv-carbon-light/20 transition-colors">
          Als Gast fortfahren
        </Link>
      </div>
    </form>
  );
};

import { useNavigate } from 'react-router-dom';

export default RegisterForm;