import React from 'react';
import { motion } from 'framer-motion';
import AnimatedElement from './AnimatedElement';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  withGradient?: boolean; // Whether to show orange gradient in title
  alignment?: 'left' | 'center';
  size?: 'normal' | 'large';
  topPadding?: 'normal' | 'large' | 'none';
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  withGradient = true,
  alignment = 'center',
  size = 'normal',
  topPadding = 'normal'
}) => {
  // Split title to apply gradient effect if needed
  const formatTitle = () => {
    if (!withGradient) return title;

    const words = title.split(' ');
    const middleIndex = Math.floor(words.length / 2);
    
    return (
      <>
        <span className="font-light">{words.slice(0, middleIndex).join(' ')} </span>
        <span className="text-fmv-orange font-medium">{words[middleIndex]} </span>
        {words.length > middleIndex + 1 && (
          <span className="font-light">{words.slice(middleIndex + 1).join(' ')}</span>
        )}
      </>
    );
  };

  // Determine top padding class based on prop
  const getPaddingClass = () => {
    switch (topPadding) {
      case 'large':
        return 'pt-32 md:pt-36';
      case 'none':
        return 'pt-4 md:pt-6';
      default:
        return 'pt-24 md:pt-28';
    }
  };

  return (
    <section className={`${getPaddingClass()} pb-16 md:pb-20 relative overflow-hidden`}>
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-[30%] left-[10%] w-24 md:w-32 h-24 md:h-32 fmv-large-circle"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-[20%] right-[10%] w-16 md:w-20 h-16 md:h-20 fmv-large-circle"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div 
        className="absolute top-[40%] right-[30%] fmv-line w-32 md:w-48"
        animate={{ 
          width: ["0%", "100%", "0%"],
          left: ["0%", "0%", "100%"],
          opacity: [0, 0.5, 0],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto px-6 sm:px-8 relative z-10">
        <AnimatedElement animation="fade" className={`text-${alignment} max-w-3xl mx-auto`}>
          <h1 className={`${size === 'large' ? 'text-4xl sm:text-5xl md:text-6xl' : 'text-3xl sm:text-4xl md:text-5xl'} font-light tracking-tight mb-6 leading-tight`}>
            {formatTitle()}
          </h1>
          
          {subtitle && (
            <>
              <div className="section-divider"></div>
              <p className="text-lg md:text-xl text-fmv-silk/80 font-light">
                {subtitle}
              </p>
            </>
          )}
        </AnimatedElement>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-fmv-carbon-dark to-transparent"></div>
    </section>
  );
};

export default PageHeader;