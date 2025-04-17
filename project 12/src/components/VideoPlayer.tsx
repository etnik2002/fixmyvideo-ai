import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  thumbnail?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  title?: string;
  description?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  thumbnail,
  autoplay = false,
  muted = true,
  loop = true,
  title,
  description
}) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [hasStarted, setHasStarted] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const playerRef = useRef<ReactPlayer>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!hasStarted) setHasStarted(true);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };
  
  // Parse the URL to check if it's a Vimeo or YouTube URL and add parameters to hide branding
  const getPlayerUrl = (url: string): string => {
    if (url.includes('vimeo.com')) {
      // Check if the URL already has parameters
      const hasParams = url.includes('?');
      const paramConnector = hasParams ? '&' : '?';
      
      // Add parameters to hide branding and disable fullscreen
      return `${url}${paramConnector}title=0&byline=0&portrait=0&pip=0&transparent=0&controls=1&fullscreen=0`;
    }
    
    // For YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Check if the URL already has parameters
      const hasParams = url.includes('?');
      const paramConnector = hasParams ? '&' : '?';
      
      // Add parameters to hide branding for YouTube and disable fullscreen
      return `${url}${paramConnector}showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0`;
    }
    
    return url;
  };

  return (
    <div className="video-container group" ref={wrapperRef}>
      {(!hasStarted || !isPlaying) && thumbnail && (
        <div 
          className="video-overlay"
          onClick={handlePlayPause}
        >
          <div className="video-overlay-button animate-radial-pulse">
            <Play className="w-8 h-8" fill="white" />
          </div>
          {title && !isPlaying && (
            <div className="absolute bottom-6 left-6 right-6 text-left">
              <h3 className="text-xl font-medium mb-2 text-white">{title}</h3>
              {description && (
                <p className="text-sm text-gray-200 line-clamp-2">{description}</p>
              )}
            </div>
          )}
        </div>
      )}
      
      <ReactPlayer
        ref={playerRef}
        url={getPlayerUrl(url)}
        width="100%"
        height="100%"
        playing={isPlaying}
        muted={isMuted}
        loop={loop}
        playsinline
        onEnded={() => setIsPlaying(false)}
        style={{ position: 'absolute', top: 0, left: 0 }}
        config={{
          youtube: {
            playerVars: {
              controls: 1,
              showinfo: 0,
              rel: 0,
              modestbranding: 1,
              iv_load_policy: 3,
              disablekb: 0,
              fs: 0 // Disable fullscreen button
            }
          },
          vimeo: {
            playerOptions: {
              title: false,
              byline: false,
              portrait: false,
              controls: true,
              pip: false,
              dnt: true,
              fullscreen: false // Disable fullscreen button
            }
          },
          file: {
            attributes: {
              controlsList: 'nodownload nofullscreen',
              disablePictureInPicture: true,
              playsInline: true
            }
          }
        }}
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center justify-between">
          <button 
            onClick={handlePlayPause}
            className="text-white hover:text-fmv-orange transition-colors mr-3"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button 
            onClick={handleMuteToggle}
            className="text-white hover:text-fmv-orange transition-colors mr-3"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <div className="flex-grow"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;