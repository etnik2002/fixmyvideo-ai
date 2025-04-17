import React from 'react';
import { motion } from 'framer-motion';

interface GradientBorderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  as?: 'button' | 'div' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

const GradientBorderButton: React.FC<GradientBorderButtonProps> = ({
  children,
  onClick,
  className = '',
  as = 'button',
  href,
  target,
  rel
}) => {
  const buttonVariants = {
    rest: { 
      borderImageSource: 'linear-gradient(90deg, rgba(255,88,0,0.7), rgba(255,122,51,0.4), rgba(255,88,0,0.7))'
    },
    hover: { 
      borderImageSource: 'linear-gradient(90deg, rgba(255,122,51,0.5), rgba(255,88,0,0.8), rgba(255,122,51,0.5))'
    }
  };

  const Component = motion[as as keyof typeof motion];

  return (
    <Component
      onClick={onClick}
      href={href}
      target={target}
      rel={rel}
      className={`relative rounded-md overflow-hidden group ${className}`}
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <motion.span
        className="absolute inset-0 bg-gray-800/40 rounded-md z-0"
        variants={{
          rest: { 
            backgroundColor: 'rgba(255, 88, 0, 0.15)', 
          },
          hover: { 
            backgroundColor: 'rgba(255, 88, 0, 0.1)',
          }
        }}
        transition={{ duration: 0.3 }}
      />

      <motion.span
        className="absolute inset-0 rounded-md"
        style={{
          borderWidth: '1px',
          borderStyle: 'solid',
          borderImageSlice: 1,
        }}
        variants={buttonVariants}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="absolute -inset-px bg-gradient-to-r from-transparent via-fmv-orange/10 to-transparent opacity-0 group-hover:opacity-100 z-10"
        animate={{
          x: ['100%', '-100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="relative z-20 px-6 py-3">
        {children}
      </div>
    </Component>
  );
};

export default GradientBorderButton;