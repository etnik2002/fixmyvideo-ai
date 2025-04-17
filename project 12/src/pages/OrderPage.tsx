import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import AnimatedElement from '../components/AnimatedElement';

const OrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(searchParams.get('package') || 'flash');

  const packages = {
    spark: {
      title: '30 Sekunden',
      price: 'CHF 150',
      features: [
        'Bis zu 5 Fotos',
        'Ein Videoformat inklusive',
        'Musik aus unserer Bibliothek',
        'Bis zu 3 Texteinblendungen',
        'Lieferung in 24-48h',
        '1 Korrekturschleife',
        'HD-Qualität 1080p'
      ]
    },
    flash: {
      title: '60 Sekunden',
      price: 'CHF 250',
      features: [
        'Bis zu 10 Fotos',
        'Ein Videoformat inklusive',
        'Musik aus unserer Bibliothek oder eigene Musik',
        'Bis zu 6 Texteinblendungen',
        'Lieferung in 24-48h',
        '2 Korrekturschleifen',
        'HD-Qualität 1080p'
      ]
    },
    ultra: {
      title: '90 Sekunden',
      price: 'CHF 350',
      features: [
        'Bis zu 20 Fotos',
        'Ein Videoformat inklusive',
        'Musik aus unserer Bibliothek oder eigene Musik',
        'Bis zu 10 Texteinblendungen',
        'Lieferung in 24-48h',
        '3 Korrekturschleifen',
        'HD-Qualität 1080p',
        'Premium-Support'
      ]
    }
  };

  return (
    <div className="min-h-screen bg-fmv-carbon text-fmv-silk pt-20 sm:pt-24">
      {/* Progress Steps */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto mb-12 relative">
          {/* Progress bar background */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-fmv-carbon-light/20 -translate-y-1/2 z-0"></div>
          
          {/* Progress steps with improved spacing */}
          <div className="relative z-10 flex justify-between items-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center w-16 sm:w-24">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-fmv-orange to-fmv-orange-light text-white flex items-center justify-center font-medium mb-3 shadow-lg shadow-fmv-orange/20 border-2 border-fmv-orange-light/30">
                <span className="text-lg">1</span>
              </div>
              <span className="text-fmv-orange font-medium text-center text-xs sm:text-sm">Paket wählen</span>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center w-16 sm:w-24">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-fmv-carbon-light/20 text-fmv-silk/50 flex items-center justify-center font-medium mb-3 border-2 border-fmv-carbon-light/10">
                <span className="text-lg">2</span>
              </div>
              <span className="text-fmv-silk/50 text-center text-xs sm:text-sm">Inhalte hochladen</span>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center w-16 sm:w-24">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-fmv-carbon-light/20 text-fmv-silk/50 flex items-center justify-center font-medium mb-3 border-2 border-fmv-carbon-light/10">
                <span className="text-lg">3</span>
              </div>
              <span className="text-fmv-silk/50 text-center text-xs sm:text-sm">Video anpassen</span>
            </div>
            
            {/* Step 4 */}
            <div className="flex flex-col items-center w-16 sm:w-24">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-fmv-carbon-light/20 text-fmv-silk/50 flex items-center justify-center font-medium mb-3 border-2 border-fmv-carbon-light/10">
                <span className="text-lg">4</span>
              </div>
              <span className="text-fmv-silk/50 text-center text-xs sm:text-sm">Überprüfen & Bestellen</span>
            </div>
          </div>
          
          {/* Active progress bar */}
          <div className="absolute top-1/2 left-0 w-[12.5%] h-2 bg-gradient-to-r from-fmv-orange to-fmv-orange-light -translate-y-1/2 z-0 rounded-full shadow-sm shadow-fmv-orange/20"></div>
        </div>

        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <AnimatedElement animation="fade">
            <h1 className="text-3xl sm:text-4xl font-light mb-4">
              Wähle dein <span className="text-fmv-orange font-medium">Video-Paket</span>
            </h1>
            <p className="text-fmv-silk/80">
              Wähle das Paket, das am besten zu deinen Anforderungen passt. Die Dauer
              und Anzahl der Bilder bestimmen die Komplexität deines Videos.
            </p>
          </AnimatedElement>
        </div>

        {/* Package Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {/* Spark Package */}
          <AnimatedElement animation="slide-up" delay={0.1}>
            <div
              className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 h-full flex flex-col ${
                selectedPackage === 'spark' 
                  ? 'border-2 border-fmv-orange shadow-lg shadow-fmv-orange/10' 
                  : 'border border-fmv-carbon-light/30'
              }`}
              onClick={() => setSelectedPackage('spark')}
            >
              <div className="bg-fmv-carbon-darker p-6 flex-grow flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-2xl font-medium mb-2">{packages.spark.title}</h3>
                  <p className="text-fmv-orange text-3xl font-bold mb-6">{packages.spark.price}</p>
                  <ul className="space-y-3">
                    {packages.spark.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                        <span className="text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <button 
                    className={`w-full py-3 rounded-md transition-colors ${
                      selectedPackage === 'spark'
                        ? 'bg-fmv-orange text-white'
                        : 'bg-fmv-carbon-light/10 text-fmv-silk hover:bg-fmv-carbon-light/20'
                    }`}
                  >
                    {selectedPackage === 'spark' ? 'Ausgewählt' : 'Auswählen'}
                  </button>
                </div>
              </div>
            </div>
          </AnimatedElement>

          {/* Flash Package */}
          <AnimatedElement animation="slide-up" delay={0.2}>
            <div 
              className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform h-full flex flex-col ${
                selectedPackage === 'flash' 
                  ? 'border-2 border-fmv-orange shadow-lg shadow-fmv-orange/10 scale-105' 
                  : 'border border-fmv-carbon-light/30'
              }`}
              onClick={() => setSelectedPackage('flash')}
            >
              <div className="absolute top-0 left-0 right-0 bg-fmv-orange text-white text-center py-1 text-sm font-medium">
                BELIEBT
              </div>
              <div className="bg-fmv-carbon-darker p-6 pt-10 flex-grow flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-2xl font-medium mb-2">{packages.flash.title}</h3>
                  <p className="text-fmv-orange text-3xl font-bold mb-6">{packages.flash.price}</p>
                  <ul className="space-y-3">
                    {packages.flash.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                        <span className="text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <button 
                    className={`w-full py-3 rounded-md transition-colors ${
                      selectedPackage === 'flash'
                        ? 'bg-fmv-orange text-white'
                        : 'bg-fmv-carbon-light/10 text-fmv-silk hover:bg-fmv-carbon-light/20'
                    }`}
                  >
                    {selectedPackage === 'flash' ? 'Ausgewählt' : 'Auswählen'}
                  </button>
                </div>
              </div>
            </div>
          </AnimatedElement>

          {/* Ultra Package */}
          <AnimatedElement animation="slide-up" delay={0.3}>
            <div 
              className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 h-full flex flex-col ${
                selectedPackage === 'ultra' 
                  ? 'border-2 border-fmv-orange shadow-lg shadow-fmv-orange/10' 
                  : 'border border-fmv-carbon-light/30'
              }`}
              onClick={() => setSelectedPackage('ultra')}
            >
              <div className="bg-fmv-carbon-darker p-6 flex-grow flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-2xl font-medium mb-2">{packages.ultra.title}</h3>
                  <p className="text-fmv-orange text-3xl font-bold mb-6">{packages.ultra.price}</p>
                  <ul className="space-y-3">
                    {packages.ultra.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                        <span className="text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <button 
                    className={`w-full py-3 rounded-md transition-colors ${
                      selectedPackage === 'ultra'
                        ? 'bg-fmv-orange text-white'
                        : 'bg-fmv-carbon-light/10 text-fmv-silk hover:bg-fmv-carbon-light/20'
                    }`}
                  >
                    {selectedPackage === 'ultra' ? 'Ausgewählt' : 'Auswählen'}
                  </button>
                </div>
              </div>
            </div>
          </AnimatedElement>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between max-w-6xl mx-auto mt-12">
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-fmv-carbon-light/30 rounded-md text-fmv-silk hover:bg-fmv-carbon-light/10 transition-colors"
          >
            Zurück
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-2 bg-fmv-orange text-white rounded-md hover:bg-fmv-orange-light transition-colors" 
            onClick={() => {
              navigate(`/bestellen/upload?package=${selectedPackage}`);
            }}
          >
            Weiter
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;