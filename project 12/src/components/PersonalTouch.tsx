import React from 'react';
import { motion } from 'framer-motion';
import { User, Quote } from 'lucide-react';

interface PersonalTouchProps {
  name?: string;
  role?: string;
  quote?: string;
  imageSrc?: string;
  className?: string;
}

const PersonalTouch: React.FC<PersonalTouchProps> = ({
  name = "Max Mustermann",
  role = "Gründer & CEO",
  quote = "Wir haben FixMyVideo gegründet, weil wir glauben, dass jedes Unternehmen von der Kraft des Videomarketings profitieren sollte - ohne komplizierte Software oder teure Agenturen.",
  imageSrc = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop",
  className = ""
}) => {
  return (
    <div className={`bg-gradient-to-br from-fmv-carbon-light/10 to-fmv-carbon-darker/80 rounded-lg border border-fmv-carbon-light/20 overflow-hidden shadow-lg ${className}`}>
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-fmv-orange/30">
                {imageSrc ? (
                  <img 
                    src={imageSrc} 
                    alt={name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-fmv-orange/20 flex items-center justify-center">
                    <User className="h-12 w-12 text-fmv-orange" />
                  </div>
                )}
              </div>
              <motion.div 
                className="absolute -bottom-2 -right-2 bg-fmv-orange rounded-full p-2"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Quote className="h-5 w-5 text-white" />
              </motion.div>
            </div>
          </div>
          
          <div>
            <blockquote className="text-fmv-silk/90 text-lg md:text-xl font-light italic mb-4 relative">
              <span className="text-fmv-orange text-4xl absolute -top-2 -left-2 opacity-20">"</span>
              {quote}
              <span className="text-fmv-orange text-4xl absolute -bottom-6 -right-2 opacity-20">"</span>
            </blockquote>
            
            <div className="mt-4 flex items-center">
              <div className="h-px w-8 bg-fmv-orange/50 mr-3"></div>
              <div>
                <p className="text-fmv-orange font-medium">{name}</p>
                <p className="text-fmv-silk/60 text-sm">{role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalTouch;