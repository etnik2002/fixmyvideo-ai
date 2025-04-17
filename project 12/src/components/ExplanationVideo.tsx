import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface ExplanationVideoProps {
  videoUrl: string;
  thumbnailUrl: string;
  title?: string;
  description?: string;
  className?: string;
}

const ExplanationVideo: React.FC<ExplanationVideoProps> = ({
  videoUrl,
  thumbnailUrl,
  title = "Sehen Sie, wie FixMyVideo funktioniert",
  description = "Ein kurzes Video, das zeigt, wie einfach es ist, mit FixMyVideo beeindruckende Videos zu erstellen.",
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={`bg-gradient-to-br from-fmv-carbon-light/10 to-fmv-carbon-darker/80 rounded-lg border border-fmv-carbon-light/20 overflow-hidden shadow-lg ${className}`}>
      <div className="p-6 md:p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-medium text-fmv-silk mb-2">{title}</h3>
          <p className="text-fmv-silk/70">{description}</p>
        </div>
        
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
          {isPlaying ? (
            <iframe
              src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
              title="Explanation Video"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <>
              <img 
                src={thumbnailUrl} 
                alt="Video Thumbnail" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
                <motion.button 
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-fmv-orange rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110 hover:bg-fmv-orange-light active:scale-95 animate-radial-pulse"
                  onClick={() => setIsPlaying(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={30} className="text-white ml-1" fill="white" />
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplanationVideo;