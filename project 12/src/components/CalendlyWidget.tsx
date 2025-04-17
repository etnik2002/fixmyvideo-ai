import React, { useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface CalendlyWidgetProps {
  url: string;
  text?: string;
  buttonText?: string;
  className?: string;
}

const CalendlyWidget: React.FC<CalendlyWidgetProps> = ({
  url,
  text = "Buchen Sie einen Beratungstermin für größere Projekte (10+ Videos/Monat)",
  buttonText = "Termin vereinbaren",
  className = ""
}) => {
  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up
      document.body.removeChild(script);
    };
  }, []);

  const openCalendly = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: url
      });
      return false;
    }
  };

  return (
    <div className={`bg-gradient-to-br from-fmv-carbon-light/20 to-fmv-carbon-light/5 rounded-lg p-6 border border-fmv-carbon-light/30 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="bg-fmv-orange/20 p-3 rounded-full mr-4 flex-shrink-0">
            <Calendar className="h-6 w-6 text-fmv-orange" />
          </div>
          <p className="text-fmv-silk/90">{text}</p>
        </div>
        <button
          onClick={openCalendly}
          className="fmv-primary-btn px-4 py-2 whitespace-nowrap"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

// Add Calendly types
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export default CalendlyWidget;