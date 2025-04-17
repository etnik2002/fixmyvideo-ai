import React from 'react';
import { Check, X } from 'lucide-react';
import AnimatedElement from './AnimatedElement';

const ComparisonSection: React.FC = () => {
  const comparisonData = [
    {
      feature: "Schnelle Lieferung",
      fixmyvideo: true,
      traditional: false,
      diy: true
    },
    {
      feature: "Professionelle Qualität",
      fixmyvideo: true,
      traditional: true,
      diy: false
    },
    {
      feature: "Kostengünstig",
      fixmyvideo: true,
      traditional: false,
      diy: true
    },
    {
      feature: "Kein Kameramann nötig",
      fixmyvideo: true,
      traditional: false,
      diy: true
    },
    {
      feature: "Keine Vorkenntnisse nötig",
      fixmyvideo: true,
      traditional: true,
      diy: false
    },
    {
      feature: "Verschiedene Formate",
      fixmyvideo: true,
      traditional: true,
      diy: false
    },
    {
      feature: "Nutzung vorhandener Bilder",
      fixmyvideo: true,
      traditional: false,
      diy: true
    }
  ];

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedElement animation="fade" className="text-center mb-10 md:mb-12">
          <h2 className="section-title">
            <span className="font-light">Warum </span>
            <span className="text-fmv-orange font-medium">FixMyVideo</span>
            <span className="font-light"> wählen?</span>
          </h2>
          <div className="section-divider"></div>
          <p className="text-lg text-fmv-silk/80 max-w-3xl mx-auto font-light">
            Vergleichen Sie unseren Service mit traditionellen Videoproduktionen und DIY-Lösungen
          </p>
        </AnimatedElement>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="py-4 px-6 text-left text-fmv-silk/80">Funktion</th>
                <th className="py-4 px-6 text-center bg-fmv-orange/10 text-fmv-orange font-medium rounded-t-lg">FixMyVideo</th>
                <th className="py-4 px-6 text-center text-fmv-silk/80">Traditionelle Videoproduktion</th>
                <th className="py-4 px-6 text-center text-fmv-silk/80">DIY-Software</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-fmv-carbon-light/5' : ''}>
                  <td className="py-4 px-6 text-fmv-silk">{item.feature}</td>
                  <td className="py-4 px-6 text-center bg-fmv-orange/5">
                    {item.fixmyvideo ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {item.traditional ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {item.diy ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonSection;