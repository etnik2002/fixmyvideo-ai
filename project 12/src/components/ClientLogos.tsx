import React from 'react';
import { motion } from 'framer-motion';

interface ClientLogosProps {
  className?: string;
}

const ClientLogos: React.FC<ClientLogosProps> = ({ className = '' }) => {
  // Array of client logos with their names and image URLs
  const clients = [
    {
      name: 'Google',
      logo: 'https://i.imgur.com/sLXvQTC.png', // Google logo
      url: 'https://google.com'
    },
    {
      name: 'Microsoft',
      logo: 'https://i.imgur.com/Wd0Qfxl.png', // Microsoft logo
      url: 'https://microsoft.com'
    },
    {
      name: 'Amazon',
      logo: 'https://i.imgur.com/LHFPWK9.png', // Amazon logo
      url: 'https://amazon.com'
    },
    {
      name: 'Apple',
      logo: 'https://i.imgur.com/Hkbsf6Q.png', // Apple logo
      url: 'https://apple.com'
    },
    {
      name: 'Netflix',
      logo: 'https://i.imgur.com/V0xc8Ey.png', // Netflix logo
      url: 'https://netflix.com'
    },
    {
      name: 'Spotify',
      logo: 'https://i.imgur.com/ktJBxeF.png', // Spotify logo
      url: 'https://spotify.com'
    }
  ];

  return (
    <div className={`py-12 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-light text-fmv-silk/80">
            <span>Vertraut von führenden </span>
            <span className="text-fmv-orange font-medium">Unternehmen</span>
          </h3>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0.6 }}
              whileHover={{ 
                opacity: 1,
                scale: 1.05,
                filter: 'brightness(1.2)'
              }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              <img 
                src={client.logo} 
                alt={`${client.name} logo`} 
                className="h-8 sm:h-10 md:h-12 w-auto object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-fmv-carbon-darker/90 text-fmv-silk text-xs px-2 py-1 rounded whitespace-nowrap backdrop-blur-sm border border-fmv-carbon-light/20"
              >
                {client.name}
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10 text-sm text-fmv-silk/40">
          <p>* Beispielhafte Darstellung. Logos dienen nur zu Demonstrationszwecken.</p>
        </div>
      </div>
    </div>
  );
};

export default ClientLogos;