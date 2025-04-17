import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const { login, isEmailVerified } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect URL from location state, or default to dashboard
  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      // Navigate to the redirect URL after successful login
      navigate(from);
    } catch (error) {
      if (error.message === 'email-not-verified') {
        setShowVerificationAlert(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-fmv-carbon-light/30 rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-fmv-silk/80">
            Passwort
          </label>
          <Link to="/auth/forgot-password" className="text-xs text-fmv-orange hover:text-fmv-orange-light transition-colors">
            Passwort vergessen?
          </Link>
        </div>
        <div className="mt-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-fmv-carbon-light" />
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-fmv-carbon-light/30 rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50"
            placeholder="••••••••"
          />
        </div>
      </div>

      {/* Email Verification Alert */}
      {showVerificationAlert && (
        <div className="bg-yellow-900/20 border border-yellow-900/30 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-yellow-400 text-sm">
              Bitte bestätigen Sie Ihre E-Mail-Adresse. Überprüfen Sie Ihren Posteingang und klicken Sie auf den Bestätigungslink.
            </p>
            <button
              onClick={() => {
                // Handle resend verification email
                setShowVerificationAlert(false);
              }}
              className="text-yellow-400 hover:text-yellow-300 text-sm font-medium mt-2"
            >
              Bestätigungs-E-Mail erneut senden
            </button>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
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
              <LogIn size={20} className="mr-2" />
              Anmelden
            </>
          )}
        </button>
      </div>

      <div className="text-center text-sm">
        <span className="text-fmv-silk/60">
          Noch kein Konto?{' '}
        </span>
        <Link to="/auth/register" className="text-fmv-orange hover:text-fmv-orange-light transition-colors font-medium">
          Jetzt registrieren
        </Link>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-fmv-carbon-light/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-fmv-carbon-darker text-fmv-silk/60">oder</span>
        </div>
      </div>

      <div>
        <Link to="/bestellen" className="w-full flex justify-center items-center py-2 px-4 border border-fmv-carbon-light/40 rounded-md text-fmv-silk/90 bg-fmv-carbon-light/10 hover:bg-fmv-carbon-light/20 transition-colors">
          Als Gast fortfahren
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;