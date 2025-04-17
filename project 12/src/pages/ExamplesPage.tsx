import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/AnimatedElement';
import PageHeader from '../components/PageHeader';
import SectionWrapper from '../components/SectionWrapper';
import Card from '../components/Card';
import VideoPlayer from '../components/VideoPlayer';

// Comprehensive video examples with better thumbnails for all categories
const videoExamples = [
  // Business categories
  {
    id: 1,
    title: "Restaurant Promo",
    description: "Elegante Präsentation mit lebendigen Aufnahmen und fließenden Übergängen, perfekt für Gastronomiebetriebe jeder Größe.",
    thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop",
    category: "restaurant",
    duration: "30sec",
    videoUrl: "https://www.youtube.com/watch?v=b7mHJEVsABg&showinfo=0&rel=0&modestbranding=1&fs=0",
    industry: "Gastronomie"
  },
  {
    id: 2,
    title: "Immobilien Showcase",
    description: "Professionelle Darstellung von Immobilien mit beeindruckenden Perspektiven und atmosphärischer Beleuchtung.",
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop",
    category: "immobilien",
    duration: "60sec",
    videoUrl: "https://www.youtube.com/watch?v=JLqy5zieGrw&showinfo=0&rel=0&modestbranding=1&fs=0",
    industry: "Immobilien"
  },
  {
    id: 3,
    title: "Autohandel Präsentation",
    description: "Dynamische und professionelle Darstellung von Fahrzeugen mit beeindruckenden Perspektiven und Details.",
    thumbnail: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600&auto=format&fit=crop",
    category: "auto",
    duration: "90sec",
    videoUrl: "https://www.youtube.com/watch?v=u2hfvoFUQ_g&showinfo=0&rel=0&modestbranding=1&fs=0",
    industry: "Automotive"
  },
  {
    id: 4,
    title: "E-Commerce Produktvideo",
    description: "Detaillierte Produktdarstellung mit Fokus auf Funktionalität und Nutzen, ideal für E-Commerce und Online-Shops.",
    thumbnail: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=600&auto=format&fit=crop",
    category: "ecommerce",
    duration: "30sec",
    videoUrl: "https://www.youtube.com/watch?v=Ps8iBHVZKXM&showinfo=0&rel=0&modestbranding=1&fs=0",
    industry: "E-Commerce"
  },
  {
    id: 5,
    title: "Mode Kollektion",
    description: "Dynamische Präsentation von Kleidung und Accessoires mit künstlerischen Übergängen und stilvoller Ästhetik.",
    thumbnail: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
    category: "fashion",
    duration: "60sec",
    videoUrl: "https://www.youtube.com/watch?v=69ngmjpaI2c&showinfo=0&rel=0&modestbranding=1&fs=0",
    industry: "Fashion"
  },
  {
    id: 6,
    title: "Boutique Hotel",
    description: "Elegante Präsentation von Hotelräumlichkeiten mit warmer Atmosphäre und einladenden Details.",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
    category: "hotel",
    duration: "90sec",
    videoUrl: "https://www.youtube.com/watch?v=A0futZIsfX0&showinfo=0&rel=0&modestbranding=1&fs=0",
    industry: "Hotellerie"
  },
  
  // Personal/Private categories
  {
    id: 7,
    title: "Urlaubserinnerungen",
    description: "Verwandeln Sie Ihre Reisefotos in ein cineastisches Erlebnis mit stimmungsvoller Musik und fließenden Übergängen.",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
    category: "reisen",
    duration: "60sec",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&showinfo=0&rel=0&modestbranding=1&fs=0",
    industry: "Reisen"
  },
  {
    id: 8,
    title: "Familienchronik",
    description: "Feiern Sie besondere Momente und Meilensteine mit einem emotionalen Video-Rückblick auf Ihre wertvollsten Erinnerungen.",
    thumbnail: "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=600&auto=format&fit=crop",
    category: "familie",
    duration: "90sec",
    videoUrl: "https://www.youtube.com/watch?v=kfVsfOSbJY0&showinfo=0&rel=0&modestbranding=1&fs=0",
    industry: "Familie"
  },
  {
    id: 9,
    title: "Hochzeitsimpressionen",
    description: "Verewigen Sie den schönsten Tag im Leben mit einem kunstvoll gestalteten Video aus Ihren Hochzeitsfotos.",
    thumbnail: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop",
    category: "hochzeit",
    duration: "90sec",
    videoUrl: "https://www.youtube.com/watch?v=ZbZSe6N_BXs&showinfo=0&rel=0&modestbranding=1&fs=0",
    industry: "Hochzeit"
  },
  {
    id: 10,
    title: "Social Media Story",
    description: "Erstellen Sie dynamische Content-Pakete für Ihre Social-Media-Kanäle, die perfekt für TikTok, Instagram und YouTube optimiert sind.",
    thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=600&auto=format&fit=crop",
    category: "social",
    duration: "30sec",
    videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0&showinfo=0&rel=0&modestbranding=1&fs=0",
    industry: "Social Media"
  },
  {
    id: 11,
    title: "Baby's erstes Jahr",
    description: "Dokumentieren Sie die wundervollen Momente des ersten Lebensjahres in einem bewegenden Zeitraffer-Video.",
    thumbnail: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop",
    category: "familie",
    duration: "60sec",
    videoUrl: "https://www.youtube.com/watch?v=Z-ytrj8VdpY&showinfo=0&rel=0&modestbranding=1&fs=0",
    industry: "Familie"
  },
  {
    id: 12,
    title: "Geschenk-Video",
    description: "Überraschen Sie Ihre Liebsten mit einem persönlichen Video-Geschenk zu besonderen Anlässen wie Geburtstagen oder Jubiläen.",
    thumbnail: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=600&auto=format&fit=crop",
    category: "geschenk",
    duration: "30sec",
    videoUrl: "https://www.youtube.com/watch?v=pRpeEdMmmQ0&showinfo=0&rel=0&modestbranding=1&fs=0",
    industry: "Persönlich"
  }
];

// Available filter categories - Enhanced to include all use cases
const categories = [
  { value: "all", label: "Alle Kategorien" },
  // Business categories
  { value: "restaurant", label: "Restaurant & Café" },
  { value: "immobilien", label: "Immobilien" },
  { value: "auto", label: "Autohandel" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "fashion", label: "Mode" },
  { value: "hotel", label: "Hotel" },
  // Personal categories
  { value: "reisen", label: "Reisen & Urlaub" },
  { value: "familie", label: "Familie & Baby" },
  { value: "hochzeit", label: "Hochzeit & Events" },
  { value: "social", label: "Social Media" },
  { value: "geschenk", label: "Geschenke & Jubiläen" },
];

// Video durations
const durations = [
  { value: "all", label: "Alle Längen" },
  { value: "30sec", label: "30 Sekunden" },
  { value: "60sec", label: "60 Sekunden" },
  { value: "90sec", label: "90 Sekunden" },
];

const ExamplesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [thumbnailErrors, setThumbnailErrors] = useState<Record<number, boolean>>({});

  // Filter videos based on selected filters
  const filteredVideos = videoExamples.filter((video) => {
    const categoryMatch = selectedCategory === "all" || video.category === selectedCategory;
    const durationMatch = selectedDuration === "all" || video.duration === selectedDuration;
    return categoryMatch && durationMatch;
  });

  // Get current video object when one is active
  const currentVideo = activeVideo ? videoExamples.find(v => v.id === activeVideo) : null;

  // Handle thumbnail errors
  const handleThumbnailError = (videoId: number) => {
    setThumbnailErrors(prev => ({
      ...prev,
      [videoId]: true
    }));
  };

  // Get fallback thumbnail based on industry
  const getFallbackThumbnail = (industry: string) => {
    const fallbacks: Record<string, string> = {
      "Gastronomie": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop",
      "Immobilien": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop",
      "Automotive": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600&auto=format&fit=crop",
      "E-Commerce": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=600&auto=format&fit=crop",
      "Fashion": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
      "Hotellerie": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
      "Reisen": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
      "Familie": "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=600&auto=format&fit=crop",
      "Hochzeit": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop",
      "Social Media": "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=600&auto=format&fit=crop",
      "Persönlich": "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=600&auto=format&fit=crop",
    };
    return fallbacks[industry] || "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop";
  };

  // Get effective thumbnail with fallback
  const getEffectiveThumbnail = (video: any) => {
    if (thumbnailErrors[video.id]) {
      return getFallbackThumbnail(video.industry);
    }
    return video.thumbnail;
  };

  // Function to get optimized video URL with parameters to hide branding
  const getPlayerUrl = (url: string): string => {
    if (url?.includes('youtube.com') || url?.includes('youtu.be')) {
      // Check if the URL already has parameters
      const hasParams = url.includes('?');
      const paramConnector = hasParams ? '&' : '?';
      
      // Add parameters to hide branding for YouTube
      return `${url}${paramConnector}showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0`;
    }
    
    return url || '';
  };

  return (
    <div>
      <PageHeader 
        title="Beispielvideos für jeden Anlass"
        subtitle="Entdecke, was unsere KI aus einfachen Fotos zaubern kann - für Business, Social Media und persönliche Erinnerungen."
      />

      {/* Filters Section */}
      <SectionWrapper className="py-8 bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker">
        <div className="bg-gradient-to-br from-fmv-carbon-light/10 to-fmv-carbon-light/5 rounded-lg p-6 border border-fmv-carbon-light/20 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h3 className="text-xl font-medium text-fmv-silk mb-4 md:mb-0">Filter</h3>
            
            <button 
              className="flex items-center space-x-2 text-fmv-orange md:hidden"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <Filter size={20} />
              <span>{isFiltersOpen ? 'Filter verbergen' : 'Filter anzeigen'}</span>
            </button>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isFiltersOpen || window.innerWidth >= 768 ? 'block' : 'hidden md:block'}`}>
            <div>
              <label htmlFor="category-filter" className="block text-fmv-silk/80 mb-2 font-light">Kategorie:</label>
              <select 
                id="category-filter"
                className="w-full bg-fmv-carbon-darker border border-fmv-carbon-light/30 rounded-md px-4 py-3 text-fmv-silk focus:border-fmv-orange/50 focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="duration-filter" className="block text-fmv-silk/80 mb-2 font-light">Länge:</label>
              <select 
                id="duration-filter"
                className="w-full bg-fmv-carbon-darker border border-fmv-carbon-light/30 rounded-md px-4 py-3 text-fmv-silk focus:border-fmv-orange/50 focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
              >
                {durations.map((duration) => (
                  <option key={duration.value} value={duration.value}>{duration.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Videos Grid Section */}
      <SectionWrapper 
        className="bg-gradient-to-b from-fmv-carbon-darker to-fmv-carbon" 
        withPattern
        withDecoration
      >
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredVideos.map((video, index) => (
              <AnimatedElement key={video.id} animation="slide-up" delay={index * 0.1}>
                <div className="bg-gradient-to-b from-gray-800/20 to-fmv-carbon-light/5 backdrop-blur-sm rounded-lg overflow-hidden group shadow-md hover:shadow-lg border border-fmv-carbon-light/20 hover:border-fmv-carbon-light/40 transition-all duration-300">
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={getEffectiveThumbnail(video)} 
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={() => handleThumbnailError(video.id)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    
                    <button 
                      className="absolute inset-0 flex items-center justify-center"
                      onClick={() => setActiveVideo(video.id)}
                    >
                      <div className="bg-fmv-orange rounded-full p-4 transform transition-transform duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95">
                        <Play className="h-8 w-8 text-white" fill="white" />
                      </div>
                    </button>
                    
                    <div className="absolute top-3 left-3">
                      <span className="bg-fmv-orange/90 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {video.industry}
                      </span>
                    </div>
                    
                    <div className="absolute bottom-3 right-3">
                      <span className="bg-fmv-carbon-darker/90 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
                        {video.duration}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-5">
                    <h3 className="text-xl font-medium mb-2 text-fmv-silk group-hover:text-fmv-orange transition-colors duration-300">{video.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{video.description}</p>
                  </div>
                </div>
              </AnimatedElement>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">Keine Videos mit den ausgewählten Filtern gefunden.</p>
            <button 
              className="mt-4 text-fmv-orange hover:text-fmv-orange-light font-medium"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedDuration("all");
              }}
            >
              Filter zurücksetzen
            </button>
          </div>
        )}
      </SectionWrapper>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setActiveVideo(null)}>
          <motion.div 
            className="relative bg-fmv-carbon-darker rounded-lg w-full max-w-4xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 z-10 bg-fmv-carbon-light/50 rounded-full p-2 text-white hover:text-fmv-orange transition-colors"
              onClick={() => setActiveVideo(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <div className="rounded-t-lg overflow-hidden aspect-video">
              {currentVideo && (
                <VideoPlayer url={getPlayerUrl(currentVideo.videoUrl || '')} autoplay={true} />
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-medium text-fmv-silk mb-2">
                {currentVideo?.title}
              </h3>
              <p className="text-gray-400 mb-4">
                {currentVideo?.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-fmv-orange/20 text-fmv-orange text-sm px-3 py-1 rounded-full">
                  {currentVideo?.industry}
                </span>
                <span className="bg-gray-700/50 text-gray-300 text-sm px-3 py-1 rounded-full">
                  {currentVideo?.duration}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* CTA Section */}
      <SectionWrapper className="py-20 bg-gradient-to-br from-fmv-carbon to-fmv-carbon-darker">
        {/* Decorative animated glow */}
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,88,0,0.5)_0%,transparent_50%)]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedElement animation="fade">
            <h2 className="section-title">
              <span className="font-light">Bereit, dein eigenes </span>
              <span className="text-fmv-orange font-medium">Video</span>
              <span className="font-light"> zu erstellen?</span>
            </h2>
            <div className="section-divider"></div>
            <p className="text-xl mb-8 text-fmv-silk/80 font-light">
              Lass deine Bilder zum Leben erwecken und schaffe beeindruckende Videos für dein Business oder deine persönlichen Momente.
            </p>
            <Link
              to="/bestellen"
              className="fmv-primary-btn px-8 py-4 text-lg inline-flex items-center"
            >
              Jetzt Video erstellen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </AnimatedElement>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ExamplesPage;