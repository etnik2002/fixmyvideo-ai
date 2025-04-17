import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, ArrowUpRight, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player/lazy';

// Fallback thumbnails for categories
const FALLBACK_THUMBNAILS = {
  "Gastronomie": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop",
  "Immobilien": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop",
  "Fashion": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
  "E-Commerce": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=600&auto=format&fit=crop",
  "Automotive": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600&auto=format&fit=crop",
  "Hotellerie": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
  "Reisen": "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=600&auto=format&fit=crop",
  "Familie": "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=600&auto=format&fit=crop",
  "Erinnerungen": "https://images.unsplash.com/photo-1611162618758-4a29a658b5d2?q=80&w=600&auto=format&fit=crop",
  "Social Media": "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=600&auto=format&fit=crop",
  "default": "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop"
};

interface VideoItem {
  id: number;
  title: string;
  description?: string;
  thumbnail: string;
  category: string;
  videoUrl?: string;
}

interface VideoShowcaseProps {
  title: string;
  subtitle: string;
  videos: VideoItem[];
}

const VideoShowcase: React.FC<VideoShowcaseProps> = ({ title, subtitle, videos }) => {
  const [activeVideo, setActiveVideo] = useState<number>(videos[0]?.id || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [thumbnailErrors, setThumbnailErrors] = useState<Record<number, boolean>>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);
  
  const currentVideo = videos.find(v => v.id === activeVideo) || videos[0];

  // Handle thumbnail errors
  const handleThumbnailError = (videoId: number) => {
    setThumbnailErrors(prev => ({
      ...prev,
      [videoId]: true
    }));
    console.log(`Thumbnail error for video ${videoId}`);
  };

  // Get fallback thumbnail based on category
  const getFallbackThumbnail = (category: string) => {
    return FALLBACK_THUMBNAILS[category as keyof typeof FALLBACK_THUMBNAILS] || FALLBACK_THUMBNAILS.default;
  };

  // Auto-rotate videos when not playing
  useEffect(() => {
    if (!isPlaying && videos.length > 1 && viewMode === 'carousel') {
      const interval = setInterval(() => {
        const currentIndex = videos.findIndex(v => v.id === activeVideo);
        const nextIndex = (currentIndex + 1) % videos.length;
        setActiveVideo(videos[nextIndex].id);
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [activeVideo, isPlaying, videos, viewMode]);
  
  // Update view mode on window resize
  useEffect(() => {
    const handleResize = () => {
      // Don't change the view mode on window resize - maintain the user's choice
      // This removes the automatic switching, which can be confusing
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleNext = () => {
    const currentIndex = videos.findIndex(v => v.id === activeVideo);
    const nextIndex = (currentIndex + 1) % videos.length;
    setActiveVideo(videos[nextIndex].id);
    setIsPlaying(false);
    setPlayerError(null);
  };
  
  const handlePrev = () => {
    const currentIndex = videos.findIndex(v => v.id === activeVideo);
    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
    setActiveVideo(videos[prevIndex].id);
    setIsPlaying(false);
    setPlayerError(null);
  };
  
  const scrollToThumbnail = (id: number) => {
    const thumbnailElement = document.getElementById(`thumbnail-${id}`);
    if (thumbnailElement && carouselRef.current) {
      carouselRef.current.scrollTo({
        left: thumbnailElement.offsetLeft - carouselRef.current.offsetWidth / 2 + thumbnailElement.offsetWidth / 2,
        behavior: 'smooth'
      });
    }
  };
  
  // When active video changes, scroll to it in the carousel
  useEffect(() => {
    if (viewMode === 'carousel') {
      scrollToThumbnail(activeVideo);
    }
  }, [activeVideo, viewMode]);

  // Function to get optimized video URL with parameters to hide branding
  const getPlayerUrl = (url: string): string => {
    if (!url) return '';
    
    try {
      // Validate URL
      new URL(url);
      
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
    } catch (err) {
      console.error('Invalid video URL:', url);
      return '';
    }
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    setPlayerError(null);
  };

  const handlePlayerError = (error: any) => {
    console.error('Video Player Error:', error);
    setPlayerError('Fehler beim Laden des Videos. Bitte versuchen Sie es später erneut.');
    setIsPlaying(false);
  };

  // Get effective thumbnail with fallback
  const getEffectiveThumbnail = (video: VideoItem) => {
    if (thumbnailErrors[video.id]) {
      return getFallbackThumbnail(video.category);
    }
    return video.thumbnail;
  };

  return (
    <div className="relative">
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-fmv-carbon-darker/10 via-transparent to-fmv-carbon-darker/10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-dot-pattern opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-[10%] right-[10%] w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 fmv-circle"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-[20%] left-[5%] fmv-line w-24 sm:w-32 md:w-48"
        animate={{ 
          width: ["0%", "100%", "0%"],
          left: ["0%", "0%", "100%"],
          opacity: [0, 0.5, 0],
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Section header with seamless view mode toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10">
          <div>
            <h2 className="section-title text-left mb-2">
              <span className="font-light">Videos für </span>
              <span className="text-fmv-orange font-medium">jeden Moment</span>
            </h2>
            <p className="text-fmv-silk/80 max-w-xl font-light text-sm sm:text-base">
              Vom Business-Marketing bis zur persönlichen Erinnerung – entdecke die vielfältigen Möglichkeiten
            </p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 self-start">
            <div className="gradient-border-animated rounded-full overflow-hidden">
              <div className="bg-fmv-carbon-darker/50 backdrop-blur-sm p-1 flex">
                <button 
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${viewMode === 'carousel' ? 'bg-fmv-orange text-white' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setViewMode('carousel')}
                >
                  Showcase
                </button>
                <button 
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-fmv-orange text-white' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setViewMode('grid')}
                >
                  Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {viewMode === 'carousel' ? (
          <div className="relative">
            {/* Video showcase with enhanced styling */}
            <div className="gradient-border-animated rounded-xl mb-6 overflow-hidden shadow-lg">
              <div className="bg-gradient-to-b from-fmv-carbon-light/5 to-fmv-carbon-darker/30 backdrop-blur-sm p-0.5 rounded-xl">
                <div className="relative aspect-video md:aspect-[16/9] rounded-xl overflow-hidden">
                  {/* Background blur effect based on current thumbnail */}
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={`bg-${activeVideo}`}
                      className="absolute inset-0 bg-center bg-cover filter blur-sm opacity-30 scale-105"
                      style={{ 
                        backgroundImage: `url(${getEffectiveThumbnail(currentVideo)})` 
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                    />
                  </AnimatePresence>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-fmv-carbon-darker via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-fmv-carbon-darker/40 via-transparent to-fmv-carbon-darker/40"></div>
                  
                  <div className="flex flex-col md:flex-row h-full relative z-10">
                    {/* Video player area */}
                    <div className="md:w-2/3 p-4 md:p-6 flex items-center justify-center">
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl bg-fmv-carbon-darker/40 backdrop-blur-sm group transition-all duration-300 hover:shadow-fmv-orange/10">
                        {isPlaying ? (
                          <>
                            <ReactPlayer
                              ref={playerRef}
                              url={getPlayerUrl(currentVideo.videoUrl || '')}
                              width="100%"
                              height="100%"
                              playing={isPlaying}
                              controls
                              onError={handlePlayerError}
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
                                    pip: false,
                                    transparent: false,
                                    controls: true,
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
                            {playerError && (
                              <div className="absolute inset-0 bg-fmv-carbon-darker/90 flex flex-col items-center justify-center">
                                <div className="bg-fmv-carbon-darker/60 p-4 rounded-lg text-center max-w-sm">
                                  <div className="text-fmv-orange mb-2"><Image size={32} /></div>
                                  <p className="text-fmv-silk mb-3">{playerError}</p>
                                  <button 
                                    className="px-4 py-2 bg-fmv-orange text-white rounded-md"
                                    onClick={() => setPlayerError(null)}
                                  >
                                    Schließen
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <AnimatePresence mode="wait">
                            <motion.div 
                              key={`thumb-${activeVideo}`}
                              className="absolute inset-0 bg-center bg-cover z-0"
                              style={{ 
                                backgroundImage: `url(${getEffectiveThumbnail(currentVideo)})` 
                              }}
                              initial={{ scale: 1.05, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.95, opacity: 0 }}
                              transition={{ duration: 0.4 }}
                            />
                          </AnimatePresence>
                        )}
                        
                        {!isPlaying && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-center justify-center">
                            <button 
                              className="w-12 h-12 sm:w-16 sm:h-16 bg-fmv-orange rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110 hover:bg-fmv-orange-light active:scale-95 animate-radial-pulse"
                              onClick={handlePlayClick}
                            >
                              <Play size={24} className="text-white ml-1" fill="white" />
                            </button>
                          </div>
                        )}
                        
                        <div className="absolute top-3 left-3">
                          <span className="bg-fmv-orange/90 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                            {currentVideo.category}
                          </span>
                        </div>
                        
                        {/* Navigation arrows with improved mobile touch targets */}
                        <button 
                          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 sm:p-2 z-20 backdrop-blur-sm transition-all duration-300 opacity-60 hover:opacity-100 active:scale-95"
                          onClick={handlePrev}
                          aria-label="Previous video"
                        >
                          <ChevronLeft size={18} className="sm:hidden" />
                          <ChevronLeft size={20} className="hidden sm:block" />
                        </button>
                        
                        <button 
                          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 sm:p-2 z-20 backdrop-blur-sm transition-all duration-300 opacity-60 hover:opacity-100 active:scale-95"
                          onClick={handleNext}
                          aria-label="Next video"
                        >
                          <ChevronRight size={18} className="sm:hidden" />
                          <ChevronRight size={20} className="hidden sm:block" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Video info */}
                    <div className="md:w-1/3 p-4 md:p-6 flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`info-${activeVideo}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="mb-4 md:mb-6"
                        >
                          <h3 className="text-lg sm:text-xl font-medium mb-2 text-fmv-silk">{currentVideo.title}</h3>
                          <p className="text-gray-400 text-sm sm:text-base mb-4 md:mb-6">{currentVideo.description || "Entdecke, wie unsere KI-generierten Videos für verschiedene Anwendungsbereiche eingesetzt werden können."}</p>
                          
                          <Link 
                            to="/beispiele" 
                            className="inline-flex items-center text-fmv-orange font-medium hover:text-fmv-orange-light transition-colors group"
                          >
                            <span>Mehr Details</span>
                            <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                          </Link>
                        </motion.div>
                      </AnimatePresence>
                      
                      {/* Video indicator pills - improved for mobile */}
                      <div className="hidden md:flex space-x-2 mb-6">
                        {videos.map((video) => (
                          <button
                            key={video.id}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              video.id === activeVideo ? 'bg-fmv-orange w-10' : 'bg-gray-600 w-5 hover:bg-gray-500'
                            }`}
                            onClick={() => {
                              setActiveVideo(video.id);
                              setIsPlaying(false);
                              setPlayerError(null);
                            }}
                            aria-label={`View ${video.title}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile-optimized thumbnail carousel */}
            <div className="relative overflow-hidden mb-4">
              {/* Overlay gradients for scroll indication */}
              <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-fmv-carbon to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-fmv-carbon to-transparent z-10 pointer-events-none"></div>
              
              <div 
                ref={carouselRef}
                className="flex gap-3 overflow-x-auto py-2 px-2 scrollbar-hide snap-x snap-mandatory no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {videos.map((video) => (
                  <div 
                    key={video.id}
                    id={`thumbnail-${video.id}`}
                    className={`relative flex-shrink-0 w-28 sm:w-36 md:w-40 snap-center ${
                      activeVideo === video.id ? 'ring-2 ring-fmv-orange transform scale-[1.03]' : ''
                    } rounded-lg overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg bg-fmv-carbon-light/10 backdrop-blur-sm`}
                    onClick={() => {
                      setActiveVideo(video.id);
                      setIsPlaying(false);
                      setPlayerError(null);
                    }}
                  >
                    <div className="aspect-video w-full relative overflow-hidden">
                      <img 
                        src={getEffectiveThumbnail(video)}
                        alt={video.title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          activeVideo === video.id ? 'scale-110 brightness-110' : 'hover:scale-105 hover:brightness-110'
                        }`}
                        onError={() => handleThumbnailError(video.id)}
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-2">
                        <p className={`text-xs font-medium line-clamp-1 ${
                          activeVideo === video.id ? 'text-fmv-orange' : 'text-white'
                        }`}>
                          {video.title}
                        </p>
                        <p className="text-[10px] text-gray-300 line-clamp-1 opacity-80">
                          {video.category}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Grid view for gallery mode - enhanced for mobile
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                className="bg-gradient-to-b from-fmv-carbon-light/10 to-fmv-carbon-darker/30 backdrop-blur-sm rounded-lg overflow-hidden group shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setHoveredVideo(video.id)}
                onMouseLeave={() => setHoveredVideo(null)}
                onClick={() => {
                  setActiveVideo(video.id);
                  setPlayerError(null);
                  
                  if (window.innerWidth >= 768) {
                    setViewMode('carousel');
                    setIsPlaying(false);
                  } else {
                    // On mobile, switch to carousel and play the video
                    setViewMode('carousel');
                    setTimeout(() => setIsPlaying(true), 100);
                  }
                }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={getEffectiveThumbnail(video)} 
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={() => handleThumbnailError(video.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:opacity-80 transition-opacity duration-300"></div>
                  
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    initial={false}
                    animate={hoveredVideo === video.id ? { scale: 1 } : { scale: 0.9 }}
                  >
                    <div className="bg-fmv-orange rounded-full p-3 sm:p-4 transform transition-transform duration-300 hover:scale-110 active:scale-95 shadow-lg">
                      <Play className="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="white" />
                    </div>
                  </motion.div>
                  
                  <div className="absolute top-3 left-3">
                    <span className="bg-fmv-orange text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
                      {video.category}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-fmv-carbon-darker/80 text-gray-200 text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {video.duration || '60sec'}
                    </span>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 text-fmv-silk group-hover:text-fmv-orange transition-colors duration-300">{video.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">{video.description || "Entdecke, wie unsere KI-generierten Videos für diese Anwendung eingesetzt werden können."}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="flex justify-center mt-8 sm:mt-10">
          <Link
            to="/beispiele"
            className="fmv-outline-btn px-4 sm:px-6 py-2 sm:py-3 inline-flex items-center text-sm sm:text-base rounded-lg shadow-sm"
          >
            <span>Alle Beispielvideos ansehen</span>
            <ArrowUpRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoShowcase;