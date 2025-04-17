import React from 'react';
import { Clock, CreditCard, Upload } from 'lucide-react';
import AnimatedElement from './AnimatedElement';

const AdvantagesSection: React.FC = () => {
  const advantages = [
    {
      icon: <Clock className="h-8 w-8 text-fmv-orange" />,
      title: "Zeitersparnis",
      description: "Keine wochenlange Wartezeit auf Videoproduktionen. Erhalten Sie Ihr Video innerhalb von 24-48 Stunden."
    },
    {
      icon: <CreditCard className="h-8 w-8 text-fmv-orange" />,
      title: "Kostenersparnis",
      description: "Sparen Sie tausende Franken im Vergleich zu traditionellen Videoproduktionen oder Kamerateams."
    },
    {
      icon: <Upload className="h-8 w-8 text-fmv-orange" />,
      title: "Flexibilität",
      description: "Nutzen Sie vorhandene Bilder und erhalten Sie Videos in allen gängigen Formaten für verschiedene Plattformen."
    }
  ];

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedElement animation="fade" className="text-center mb-10 md:mb-12">
          <h2 className="section-title">
            <span className="font-light">Ihre </span>
            <span className="text-fmv-orange font-medium">Vorteile</span>
            <span className="font-light"> mit uns</span>
          </h2>
          <div className="section-divider"></div>
          <p className="text-lg text-fmv-silk/80 max-w-3xl mx-auto font-light">
            Warum Sie sich für FixMyVideo entscheiden sollten
          </p>
        </AnimatedElement>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <AnimatedElement key={index} animation="slide-up" delay={index * 0.2}>
              <div className="bg-gradient-to-br from-fmv-carbon-light/10 to-fmv-carbon-darker/80 rounded-lg border border-fmv-carbon-light/20 p-6 h-full">
                <div className="bg-fmv-orange/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-medium text-fmv-silk mb-3">{advantage.title}</h3>
                <p className="text-fmv-silk/70">{advantage.description}</p>
              </div>
            </AnimatedElement>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvantagesSection;