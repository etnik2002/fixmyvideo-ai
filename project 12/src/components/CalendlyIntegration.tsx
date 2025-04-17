import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

interface CalendlyIntegrationProps {
  calendlyUrl?: string;
  title?: string;
  description?: string;
  className?: string;
}

const CalendlyIntegration: React.FC<CalendlyIntegrationProps> = ({
  calendlyUrl = "https://calendly.com/fixmyvideo/beratung",
  title = "Größere Projekte besprechen?",
  description = "Buchen Sie einen Termin mit unserem Team, um über größere Kooperationen oder spezielle Anforderungen zu sprechen.",
  className = ""
}) => {
  const openCalendly = () => {
    // In a real implementation, this would open the Calendly widget
    window.open(calendlyUrl, '_blank');
  };

  return (
    <div className={`bg-gradient-to-br from-fmv-carbon-light/10 to-fmv-carbon-darker/80 rounded-lg border border-fmv-carbon-light/20 overflow-hidden shadow-lg ${className}`}>
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0">
            <div className="bg-fmv-orange/20 w-16 h-16 rounded-full flex items-center justify-center">
              <Calendar className="h-8 w-8 text-fmv-orange" />
            </div>
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-xl font-medium text-fmv-silk mb-2">{title}</h3>
            <p className="text-fmv-silk/70 mb-4">{description}</p>
            
            <button
              onClick={openCalendly}
              className="inline-flex items-center px-4 py-2 bg-fmv-orange text-white rounded-md hover:bg-fmv-orange-light transition-colors"
            >
              Termin vereinbaren
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendlyIntegration;