import React from 'react';
import { Check, Plus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UpsellOption {
  id: string;
  title: string;
  price: number;
  description: string;
}

interface UpsellOptionsProps {
  selectedOptions: string[];
  onToggleOption: (id: string) => void;
}

const UpsellOptions: React.FC<UpsellOptionsProps> = ({ 
  selectedOptions, 
  onToggleOption 
}) => {
  // Available upsell options
  const options: UpsellOption[] = [
    {
      id: '4k-resolution',
      title: '4K Auflösung',
      price: 50,
      description: 'Upgrade auf 4K Ultra-HD Qualität für maximale Schärfe und Details'
    },
    {
      id: 'additional-format',
      title: 'Zusätzliches Format',
      price: 30,
      description: 'Erhalte dein Video in einem weiteren Format (z.B. 9:16 für Instagram Stories)'
    },
    {
      id: 'express-delivery',
      title: 'Express-Lieferung',
      price: 100,
      description: 'Erhalte dein Video innerhalb von 12 Stunden statt 24-48 Stunden'
    },
    {
      id: 'color-correction',
      title: 'Farbkorrektur',
      price: 60,
      description: 'Professionelle Farbkorrektur für optimale Bildqualität und Stimmung'
    },
    {
      id: 'custom-effects',
      title: 'Spezialeffekte',
      price: 60,
      description: 'Individuelle Animationen und visuelle Effekte für mehr Dynamik'
    },
    {
      id: 'source-files',
      title: 'Quelldateien',
      price: 120,
      description: 'Erhalte die Quelldateien für weitere Bearbeitung'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Plus className="h-5 w-5 text-fmv-orange mr-2" />
          <h3 className="text-lg font-medium">Zusätzliche Optionen</h3>
        </div>
        <div className="flex items-center text-fmv-silk/60 text-sm">
          <Info className="h-4 w-4 mr-1" />
          Optional
        </div>
      </div>
      
      <div className="space-y-4">
        {options.map((option) => (
          <div 
            key={option.id} 
            className={`border rounded-lg p-3 cursor-pointer transition-all ${
              selectedOptions.includes(option.id)
                ? 'border-fmv-orange bg-fmv-orange/10 shadow-md shadow-fmv-orange/5'
                : 'border-fmv-carbon-light/30 hover:border-fmv-orange/30 hover:bg-fmv-carbon-light/5'
            }`}
            onClick={() => onToggleOption(option.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h4 className="font-medium text-sm">{option.title}</h4>
                  <span className="ml-auto text-fmv-orange font-medium text-sm">CHF {option.price}</span>
                </div>
                <p className="text-xs text-fmv-silk/60">{option.description}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <AnimatePresence mode="wait">
                  {selectedOptions.includes(option.id) ? (
                    <motion.div 
                      key="checked"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="bg-fmv-orange rounded-full p-1"
                    >
                      <Check className="h-4 w-4 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unchecked"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="w-6 h-6 rounded-full border-2 border-fmv-carbon-light/50"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpsellOptions;