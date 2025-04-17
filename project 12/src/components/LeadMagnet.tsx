import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface LeadMagnetProps {
  title?: string;
  description?: string;
  buttonText?: string;
  offerText?: string;
  className?: string;
}

const LeadMagnet: React.FC<LeadMagnetProps> = ({
  title = "Kostenloser Video-Guide",
  description = "Erhalten Sie unseren kostenlosen Guide: \"10 Tipps für beeindruckende Marketing-Videos\" und steigern Sie Ihre Conversion-Rate.",
  buttonText = "Guide herunterladen",
  offerText = "Jetzt 15% Rabatt für Erstkunden sichern!",
  className = ""
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Vielen Dank! Der Guide wurde an Ihre E-Mail gesendet.');
    }, 1500);
  };

  return (
    <div className={`bg-gradient-to-br from-fmv-carbon-light/20 to-fmv-carbon-light/5 rounded-lg border border-fmv-carbon-light/30 backdrop-blur-sm shadow-lg ${className}`}>
      <div className="p-6 md:p-8">
        {!isSubmitted ? (
          <>
            <div className="mb-6">
              <div className="bg-fmv-orange/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-fmv-orange" />
              </div>
              <h3 className="text-xl md:text-2xl font-medium text-fmv-silk text-center mb-2">{title}</h3>
              <p className="text-fmv-silk/70 text-center">{description}</p>
              
              {offerText && (
                <div className="mt-4 bg-fmv-orange/10 border border-fmv-orange/30 rounded-md p-3 text-center">
                  <p className="text-fmv-orange font-medium">{offerText}</p>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="lead-email" className="block text-sm font-medium text-fmv-silk/80 mb-2">
                  E-Mail Adresse
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <input
                    type="email"
                    id="lead-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-fmv-carbon-darker border border-fmv-carbon-light/30 text-fmv-silk rounded-md pl-10 pr-4 py-3 focus:border-fmv-orange/50 focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
                    placeholder="ihre@email.com"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-fmv-orange hover:bg-fmv-orange-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fmv-orange disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    {buttonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
              
              <div className="text-center text-xs text-fmv-silk/50">
                Wir respektieren Ihre Privatsphäre. Abmeldung jederzeit möglich.
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-green-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-10 w-10 text-green-400" />
            </motion.div>
            <h3 className="text-xl md:text-2xl font-medium text-fmv-silk mb-4">Vielen Dank!</h3>
            <p className="text-fmv-silk/70 mb-6">
              Ihr Guide wurde an Ihre E-Mail-Adresse gesendet. Überprüfen Sie auch Ihren Spam-Ordner, falls Sie die E-Mail nicht finden können.
            </p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsSubmitted(false);
                setEmail('');
              }}
              className="text-fmv-orange hover:text-fmv-orange-light transition-colors"
            >
              Zurück zum Formular
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadMagnet;