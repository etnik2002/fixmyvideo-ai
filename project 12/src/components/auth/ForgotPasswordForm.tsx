import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      // Error handling is done in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="bg-fmv-orange/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="h-8 w-8 text-fmv-orange" />
        </div>
        <h3 className="text-xl font-medium mb-2 text-fmv-silk">E-Mail gesendet</h3>
        <p className="text-fmv-silk/70 mb-6">
          Falls ein Konto mit dieser E-Mail existiert, haben wir einen Link zum Zurücksetzen deines Passworts gesendet.
        </p>
        <Link to="/auth/login" className="text-fmv-orange hover:text-fmv-orange-light transition-colors inline-flex items-center">
          <ArrowLeft size={16} className="mr-1" />
          Zurück zur Anmeldung
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-fmv-silk/70 mb-6">
        Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen deines Passworts.
      </p>
      
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
            'Zurücksetzen-Link senden'
          )}
        </button>
      </div>

      <div className="text-center text-sm">
        <Link to="/auth/login" className="text-fmv-orange hover:text-fmv-orange-light transition-colors inline-flex items-center">
          <ArrowLeft size={16} className="mr-1" />
          Zurück zur Anmeldung
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;