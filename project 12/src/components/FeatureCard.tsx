import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import AnimatedElement from './AnimatedElement';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
  variant?: 'default' | 'numbered';
  number?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  delay = 0,
  variant = 'default',
  number
}) => {
  return (
    <AnimatedElement animation="slide-up" delay={delay}>
      <div className="fmv-card fmv-card-hover text-center h-full relative">
        <div className="bg-gradient-to-br from-fmv-orange/5 to-fmv-orange/20 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-fmv-orange" />
        </div>
        
        {variant === 'numbered' && (
          <div className="absolute -top-2 -left-2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-fmv-orange text-white rounded-full text-sm sm:text-base font-medium">
            {number}
          </div>
        )}
        
        <h3 className="text-xl sm:text-2xl font-medium mb-4 text-fmv-silk">{title}</h3>
        <p className="text-gray-400">
          {description}
        </p>
      </div>
    </AnimatedElement>
  );
};

export default FeatureCard;