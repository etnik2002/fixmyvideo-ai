import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Settings, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedElement from './AnimatedElement';

const ProcessExplanation: React.FC = () => {
  const steps = [
    {
      icon: <Upload className="h-8 w-8 text-fmv-orange" />,
      title: "1. Bilder hochladen",
      description: "Laden Sie Ihre Bilder hoch. Je hochwertiger die Fotos, desto beeindruckender das Ergebnis."
    },
    {
      icon: <Settings className="h-8 w-8 text-fmv-orange" />,
      title: "2. Stil wählen",
      description: "Passen Sie Dynamik, Formatierungen und Musik an, um den perfekten Look für Ihr Publikum zu erzielen."
    },
    {
      icon: <Video className="h-8 w-8 text-fmv-orange" />,
      title: "3. Video erhalten",
      description: "Innerhalb von 24-48 Stunden erhalten Sie Ihr professionelles Video, bereit für Ihren Marketing-Erfolg."
    }
  ];

  return (
    <div className="bg-gradient-to-br from-fmv-carbon-light/10 to-fmv-carbon-darker/80 rounded-lg border border-fmv-carbon-light/20 overflow-hidden shadow-lg">
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-medium text-fmv-silk mb-2">So funktioniert's</h3>
          <p className="text-fmv-silk/70">In nur drei einfachen Schritten zu Ihrem professionellen Video</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
          {/* Connecting line between steps */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-fmv-orange/30 to-transparent"></div>
          
          {steps.map((step, index) => (
            <AnimatedElement 
              key={index} 
              animation="slide-up" 
              delay={index * 0.2}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-fmv-orange/10 to-fmv-orange/5 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-fmv-orange/20">
                  {step.icon}
                </div>
                <h4 className="text-lg font-medium text-fmv-silk mb-2">{step.title}</h4>
                <p className="text-fmv-silk/70 text-sm">{step.description}</p>
              </div>
            </AnimatedElement>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link
            to="/prozess"
            className="inline-flex items-center text-fmv-orange hover:text-fmv-orange-light font-medium transition-colors group"
          >
            <span>Mehr zum Prozess erfahren</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProcessExplanation;