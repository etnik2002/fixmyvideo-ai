import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player/lazy';

interface BackgroundVideoProps {
  src: string;
  fallbackImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  overlayColor?: string;
  isYouTube?: boolean;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  src,
  fallbackImage = 'https://images.unsplash.com/photo-1626176214008-25c1de248660?q=80&w=1920&auto=format&fit=crop',
  overlay = true,
  overlayOpacity = 60,
  overlayColor = 'rgb(10, 10, 10)',
  isYouTube = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<ReactPlayer>(null);
  
  // Determine if it's a YouTube/Vimeo URL without relying on the isYouTube prop
  const isStreamingVideo = React.useMemo(() => {
    if (!src) return false;
    return src.includes('youtube.com') || src.includes('youtu.be') || 
           src.includes('vimeo.com');
  }, [src]);

  // For YouTube videos, properly format the URL
  const getYouTubeUrl = (url: string) => {
    // If it's already in embed format, return as is
    if (url.includes('/embed/')) return url;
    
    // If it's a standard YouTube URL or youtu.be format, convert to embed URL
    let videoId = '';
    
    if (url.includes('youtube.com/watch')) {
      // Extract video ID from youtube.com/watch?v=ID format
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v') || '';
    } else if (url.includes('youtu.be/')) {
      // Extract video ID from youtu.be/ID format
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playsinline=1&fs=0&modestbranding=1`;
    }
    
    return url;
  };

  useEffect(() => {
    // For regular mp4 videos
    if (!isStreamingVideo) {
      const video = videoRef.current;
      if (!video) return;

      const handleCanPlay = () => {
        console.log('Video can play');
        setIsLoaded(true);
      };

      const handlePlaying = () => {
        console.log('Video is playing');
        setIsVideoPlaying(true);
      };

      const handleError = (e: any) => {
        console.error('Error loading video:', e);
        setIsError(true);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('error', handleError);

      // Force load attempt - helps in some browsers
      video.load();

      // Clean up
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('error', handleError);
      };
    } else {
      // For YouTube/streaming videos, set as loaded immediately for UI
      setIsLoaded(true);
    }
  }, [isStreamingVideo, src]);

  // Calculate overlay opacity as decimal
  const overlayOpacityDecimal = overlayOpacity / 100;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 right-0 bg-black/70 text-white text-xs p-1 z-50">
          {isStreamingVideo ? 'YouTube' : 'MP4'} {isLoaded ? '✓' : '⟳'} {isError ? '✕' : ''}
        </div>
      )}
      
      {/* Fallback image shown before video loads or on error */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: isVideoPlaying ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-cover bg-center z-10"
        style={{ 
          backgroundImage: `url(${fallbackImage})`,
          display: (!isLoaded || isError) ? 'block' : 'block' // Always show until video is playing
        }}
      />
      
      {/* Regular MP4 video */}
      {!isError && !isStreamingVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 min-w-full min-h-full object-cover w-full h-full z-20"
          onPlay={() => setIsVideoPlaying(true)}
          style={{ objectPosition: 'center center' }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      
      {/* YouTube/Vimeo video */}
      {!isError && isStreamingVideo && (
        <div className="absolute inset-0 w-full h-full z-20">
          <ReactPlayer
            ref={playerRef}
            url={isYouTube || src.includes('youtube.com') || src.includes('youtu.be') 
              ? getYouTubeUrl(src)
              : src}
            playing={true}
            loop={true}
            muted={true}
            width="100%"
            height="100%"
            onReady={() => setIsVideoPlaying(true)}
            onPlay={() => setIsVideoPlaying(true)}
            onError={(e) => {
              console.error('ReactPlayer error:', e);
              setIsError(true);
            }}
            config={{
              youtube: {
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  showinfo: 0,
                  rel: 0,
                  iv_load_policy: 3,
                  modestbranding: 1,
                  disablekb: 1,
                  playsinline: 1,
                  fs: 0, // Disable fullscreen button
                  loop: 1,
                  playlist: src.includes('youtube.com/watch') 
                    ? new URLSearchParams(src.split('?')[1]).get('v')
                    : src.includes('youtu.be/') 
                      ? src.split('youtu.be/')[1].split('?')[0]
                      : '',
                  origin: window.location.origin
                }
              },
              vimeo: {
                playerOptions: {
                  autopause: 0,
                  background: 1,
                  controls: 0,
                  loop: 1,
                  muted: 1,
                  transparent: 1
                }
              }
            }}
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '100%',
              minHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'cover'
            }}
          />
        </div>
      )}
      
      {/* Overlay - on top of all video elements */}
      {overlay && (
        <div 
          className="absolute inset-0 bg-gradient-to-b from-fmv-carbon-darker via-fmv-carbon-dark/90 to-fmv-carbon-darker z-30"
          style={{ 
            opacity: overlayOpacityDecimal,
            backgroundColor: overlayColor
          }}
        />
      )}
    </div>
  );
};

export default BackgroundVideo;