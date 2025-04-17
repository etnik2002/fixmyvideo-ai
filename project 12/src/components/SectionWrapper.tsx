import React from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  withPattern?: boolean;
  withDecoration?: boolean;
  topPadding?: 'normal' | 'large' | 'none';
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  className = '',
  withPattern = false,
  withDecoration = false,
  topPadding = 'normal'
}) => {
  // Determine top padding class based on prop
  const getPaddingClass = () => {
    switch (topPadding) {
      case 'large':
        return 'pt-32 md:pt-36';
      case 'none':
        return 'pt-4 md:pt-6';
      default:
        return 'pt-16 md:pt-24';
    }
  };

  return (
    <section className={`${getPaddingClass()} pb-16 md:pb-24 relative overflow-hidden ${className}`}>
      {withPattern && <div className="fmv-bg-pattern"></div>}
      
      {withDecoration && (
        <>
          <motion.div
            className="absolute top-[10%] right-[10%] w-24 md:w-32 h-24 md:h-32 fmv-circle"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute bottom-[20%] left-[5%] fmv-dot"
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute top-[40%] left-[20%] fmv-line w-32 md:w-64"
            animate={{ 
              width: ["0%", "100%", "0%"],
              right: ["0%", "0%", "100%"],
              opacity: [0, 0.5, 0],
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </>
      )}
      
      <div className="container mx-auto px-6 sm:px-8 relative z-10">
        {children}
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-fmv-carbon-dark to-transparent"></div>
    </section>
  );
};

export default SectionWrapper;