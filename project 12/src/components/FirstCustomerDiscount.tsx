import React from 'react';
import { motion } from 'framer-motion';
import { Percent, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FirstCustomerDiscountProps {
  discountPercent?: number;
  className?: string;
}

const FirstCustomerDiscount: React.FC<FirstCustomerDiscountProps> = ({
  discountPercent = 15,
  className = ''
}) => {
  return (
    <motion.div 
      className={`bg-gradient-to-br from-fmv-orange/20 to-fmv-orange/5 rounded-lg border border-fmv-orange/30 shadow-lg overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative p-6 md:p-8">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-fmv-orange/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-fmv-orange/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
        
        <div className="flex items-start">
          <div className="bg-fmv-orange/20 w-14 h-14 rounded-full flex items-center justify-center mr-5 flex-shrink-0">
            <Percent className="h-7 w-7 text-fmv-orange" />
          </div>
          
          <div>
            <h3 className="text-xl md:text-2xl font-medium text-fmv-orange mb-2">
              {discountPercent}% Erstkundenrabatt
            </h3>
            <p className="text-fmv-silk/80 mb-4">
              Sichern Sie sich jetzt {discountPercent}% Rabatt auf Ihre erste Bestellung. Geben Sie einfach den Code <span className="font-medium text-fmv-orange">FIRSTORDER{discountPercent}</span> beim Checkout ein.
            </p>
            
            <Link
              to="/bestellen"
              className="inline-flex items-center text-fmv-orange hover:text-fmv-orange-light font-medium transition-colors group"
            >
              <span>Jetzt bestellen und sparen</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FirstCustomerDiscount;