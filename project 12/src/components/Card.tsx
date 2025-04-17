import React from 'react';
import { motion } from 'framer-motion';
import AnimatedElement from './AnimatedElement';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  animation?: boolean;
  delay?: number;
  highlight?: boolean;
  border?: boolean;
  centered?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  animation = true,
  delay = 0,
  highlight = false,
  border = true,
  centered = false
}) => {
  const cardContent = (
    <div 
      className={`
        ${border ? 'fmv-card' : 'bg-fmv-carbon-light/10 backdrop-blur-sm rounded-lg p-6 sm:p-8'} 
        ${hover ? 'fmv-card-hover' : ''} 
        ${highlight ? 'bg-gradient-to-b from-fmv-orange/5 to-transparent' : ''}
        ${centered ? 'text-center' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );

  if (highlight) {
    return (
      <div className="gradient-border-animated bg-fmv-carbon-darker/60 rounded-lg overflow-hidden transform scale-105 shadow-xl h-full">
        {animation ? (
          <AnimatedElement animation="slide-up" delay={delay} className="h-full">
            {cardContent}
          </AnimatedElement>
        ) : (
          cardContent
        )}
      </div>
    );
  }

  return animation ? (
    <AnimatedElement animation="slide-up" delay={delay} className="h-full">
      {cardContent}
    </AnimatedElement>
  ) : (
    cardContent
  );
};

export default Card;