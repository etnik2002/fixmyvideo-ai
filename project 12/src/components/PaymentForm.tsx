import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { CreditCard, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  amount: number; // Total amount including upsells
  packageType: 'Spark' | 'Flash' | 'Ultra';
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, packageType, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        toast.error(error.message || 'Ein Fehler ist aufgetreten');
      } else {
        toast.success('Zahlung erfolgreich!');
        onSuccess();
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Ein Fehler ist aufgetreten');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-fmv-carbon-darker p-6 rounded-lg border border-fmv-carbon-light/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 text-fmv-orange mr-2" />
            <h3 className="text-lg font-medium text-fmv-silk">Zahlungsinformationen</h3>
          </div>
          <div className="flex items-center text-fmv-silk/60 text-sm">
            <Lock className="h-4 w-4 mr-1" />
            Sichere Bezahlung
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-fmv-silk/80">Paket</span>
            <span className="text-fmv-silk font-medium">{packageType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-fmv-silk/80">Gesamtbetrag</span>
            <span className="text-fmv-orange text-xl font-medium">CHF {amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <PaymentElement />
        </div>
      </div>

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-fmv-orange hover:bg-fmv-orange-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fmv-orange disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Jetzt bezahlen
          </>
        )}
      </button>

      <p className="text-center text-sm text-fmv-silk/60">
        Mit der Zahlung akzeptieren Sie unsere{' '}
        <a href="/agb" className="text-fmv-orange hover:text-fmv-orange-light">
          AGB
        </a>{' '}
        und{' '}
        <a href="/datenschutz" className="text-fmv-orange hover:text-fmv-orange-light">
          Datenschutzbestimmungen
        </a>
      </p>
    </form>
  );
};

export default PaymentForm;