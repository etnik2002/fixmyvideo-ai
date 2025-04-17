import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload, Settings, Video, Clock, CreditCard, Layout as LayoutIcon, CheckCircle, Mail, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/AnimatedElement';
import VideoPlayer from '../components/VideoPlayer';
import GradientBorderButton from '../components/GradientBorderButton';
import BackgroundVideo from '../components/BackgroundVideo';
import VideoShowcase from '../components/VideoShowcase';
import CalendlyWidget from '../components/CalendlyWidget';
import ClientLogos from '../components/ClientLogos';

const HomePage: React.FC = () => {
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would make an API call to subscribe
    setIsNewsletterSubmitted(true);
    // Reset after 5 seconds for demo purposes
    setTimeout(() => {
      setIsNewsletterSubmitted(false);
      setEmail('');
    }, 5000);
  };

  // Example videos data with expanded details and YouTube URLs
  const exampleVideos = [
    {
      id: 1,
      title: "Restaurant Promotion",
      description: "Elegante Präsentation mit lebendigen Aufnahmen und fließenden Übergängen, perfekt für Gastronomiebetriebe jeder Größe.",
      thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop",
      category: "Gastronomie",
      videoUrl: "https://www.youtube.com/watch?v=b7mHJEVsABg&showinfo=0&rel=0&modestbranding=1"
    },
    {
      id: 2,
      title: "Immobilien Showcase",
      description: "Professionelle Darstellung von Immobilien mit beeindruckenden Perspektiven und atmosphärischer Beleuchtung.",
      thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop",
      category: "Immobilien",
      videoUrl: "https://www.youtube.com/watch?v=JLqy5zieGrw&showinfo=0&rel=0&modestbranding=1"
    },
    {
      id: 3,
      title: "Mode Kollektion",
      description: "Dynamische Präsentation von Kleidung und Accessoires mit künstlerischen Übergängen und stilvoller Ästhetik.",
      thumbnail: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
      category: "Fashion",
      videoUrl: "https://www.youtube.com/watch?v=69ngmjpaI2c&showinfo=0&rel=0&modestbranding=1"
    },
    {
      id: 4,
      title: "Produktdemonstration",
      description: "Detaillierte Produktdarstellung mit Fokus auf Funktionalität und Nutzen, ideal für E-Commerce und Online-Shops.",
      thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
      category: "E-Commerce",
      videoUrl: "https://www.youtube.com/watch?v=Ps8iBHVZKXM&showinfo=0&rel=0&modestbranding=1"
    },
    {
      id: 5,
      title: "Autohandel Präsentation",
      description: "Dynamische und professionelle Darstellung von Fahrzeugen mit beeindruckenden Perspektiven und Details.",
      thumbnail: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600&auto=format&fit=crop", 
      category: "Automotive",
      videoUrl: "https://www.youtube.com/watch?v=u2hfvoFUQ_g&showinfo=0&rel=0&modestbranding=1"
    },
    {
      id: 6,
      title: "Boutique Hotel",
      description: "Elegante Präsentation von Hotelräumlichkeiten mit warmer Atmosphäre und einladenden Details.",
      thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
      category: "Hotellerie",
      videoUrl: "https://www.youtube.com/watch?v=A0futZIsfX0&showinfo=0&rel=0&modestbranding=1"
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section with Background Video - REDUCED BOTTOM PADDING */}
      <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden pb-4 pt-24 sm:pt-28">
        {/* Background video with overlay */}
        <BackgroundVideo
          src="https://www.youtube.com/embed/s83lS4Mc4mI?si=aGxa0Q9sgSwvrCpJ"
          fallbackImage="https://images.unsplash.com/photo-1626176214008-25c1de248660?q=80&w=1920&auto=format&fit=crop"
          overlay={true}
          overlayOpacity={70}
          isYouTube={true}
        />
        
        {/* Decorative elements on top of the video overlay */}
        <motion.div 
          className="absolute top-[20%] left-[10%] w-40 h-40 fmv-large-circle z-10"
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
          className="absolute bottom-[30%] right-[5%] w-24 h-24 fmv-large-circle z-10"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        
        <motion.div 
          className="absolute top-[35%] right-[25%] fmv-line w-64 z-10"
          animate={{ 
            width: ["0%", "100%", "0%"],
            left: ["0%", "0%", "100%"],
            opacity: [0, 0.8, 0],
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-[15%] left-[20%] fmv-dot z-10"
          animate={{ 
            y: [0, -15, 0],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Content on top of background video */}
        <div className="container mx-auto px-4 sm:px-8 relative z-20 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            <AnimatedElement animation="slide-right" delay={0.3} duration={0.8}>
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight mb-4 sm:mb-6 leading-tight">
                  <span className="text-fmv-orange">KI-gestützte</span> Videos aus deinen <span className="text-fmv-orange">Bildern</span> für dein Unternehmen
                </h1>
                <p className="text-lg sm:text-xl text-fmv-silk/80 mb-6 sm:mb-6 font-light">
                  Spare Zeit, Geld und Aufwand. Ideal für Unternehmen, Influencer, Hochzeiten und private Erinnerungen. Schweizer Qualität.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link
                    to="/bestellen"
                    className="fmv-primary-btn px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                  >
                    Video erstellen
                    <ArrowRight className="ml-2 h-5 w-5 inline" />
                  </Link>
                  <GradientBorderButton
                    as="a"
                    href="/prozess"
                    className="text-fmv-silk"
                  >
                    So funktioniert's
                  </GradientBorderButton>
                </div>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="fade" delay={0.6} duration={1}>
              <div className="aspect-video lg:aspect-auto">
                <VideoPlayer
                  url="https://cdn.coverr.co/videos/coverr-editing-of-a-video-9410/1080p/coverr-editing-of-a-video-9410-1080p.mp4"
                  thumbnail="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1920&auto=format&fit=crop"
                  title="Verwandle Bilder in professionelle Videos"
                  description="Sieh dir an, wie FixMyVideo aus statischen Bildern dynamische, ansprechende Videos macht."
                />
              </div>
            </AnimatedElement>
          </div>
        </div>
        
        {/* Reduced height of decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-fmv-carbon to-transparent z-[1]"></div>
      </section>

      {/* Client Logos Section */}
      <section className="py-8 bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 mix-blend-overlay pointer-events-none"></div>
        <ClientLogos />
      </section>

      {/* Examples Section - REDUCED TOP PADDING */}
      <section className="py-4 sm:py-6 md:py-10 bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker relative overflow-hidden">
        <AnimatedElement animation="fade" delay={0.1}>
          <VideoShowcase 
            title="Inspirierende Beispielvideos"
            subtitle="Entdecke, was unsere KI aus einfachen Fotos zaubern kann"
            videos={exampleVideos}
          />
        </AnimatedElement>
        
        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-fmv-carbon-dark to-transparent"></div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker relative overflow-hidden">
        <div className="fmv-bg-pattern"></div>
        
        {/* Decorative elements */}
        <motion.div
          className="absolute top-[10%] right-[10%] w-24 md:w-32 h-24 md:h-32 fmv-circle"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-[20%] left-[5%] fmv-dot"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          <AnimatedElement animation="fade" className="text-center mb-10 md:mb-16">
            <h2 className="section-title">
              <span className="font-light">So funktioniert </span>
              <span className="text-fmv-orange font-medium">FixMyVideo</span>
            </h2>
            <div className="section-divider"></div>
            <p className="text-lg md:text-xl text-fmv-silk/80 max-w-3xl mx-auto font-light">
              In nur 3 einfachen Schritten zu deinem professionellen KI-Video
            </p>
          </AnimatedElement>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            <AnimatedElement animation="slide-up" delay={0.2}>
              <div className="fmv-card fmv-card-hover text-center h-full relative">
                <div className="bg-gradient-to-br from-fmv-orange/5 to-fmv-orange/20 w-16 sm:w-20 h-16 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-fmv-orange" />
                </div>
                <div className="absolute -top-2 -left-2 w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center bg-fmv-orange text-white rounded-full">
                  1
                </div>
                <h3 className="text-xl md:text-2xl font-medium mb-4 text-fmv-silk">Bilder hochladen</h3>
                <p className="text-gray-400">
                  Lade deine Bilder hoch. Je hochwertiger die Fotos, desto beeindruckender das Video.
                </p>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.4}>
              <div className="fmv-card fmv-card-hover text-center h-full relative">
                <div className="bg-gradient-to-br from-fmv-orange/5 to-fmv-orange/20 w-16 sm:w-20 h-16 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings className="h-8 w-8 sm:h-10 sm:w-10 text-fmv-orange" />
                </div>
                <div className="absolute -top-2 -left-2 w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center bg-fmv-orange text-white rounded-full">
                  2
                </div>
                <h3 className="text-xl md:text-2xl font-medium mb-4 text-fmv-silk">Stil wählen</h3>
                <p className="text-gray-400">
                  Passe Dynamik, Formatierungen und Musik an, um den perfekten Look für dein Publikum zu erzielen.
                </p>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.6}>
              <div className="fmv-card fmv-card-hover text-center h-full relative">
                <div className="bg-gradient-to-br from-fmv-orange/5 to-fmv-orange/20 w-16 sm:w-20 h-16 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="h-8 w-8 sm:h-10 sm:w-10 text-fmv-orange" />
                </div>
                <div className="absolute -top-2 -left-2 w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center bg-fmv-orange text-white rounded-full">
                  3
                </div>
                <h3 className="text-xl md:text-2xl font-medium mb-4 text-fmv-silk">Video erhalten</h3>
                <p className="text-gray-400">
                  Innerhalb von 24-48 Stunden erhältst du dein professionelles Video, bereit für Marketing-Erfolg.
                </p>
              </div>
            </AnimatedElement>
          </div>
          
          <div className="text-center mt-10 md:mt-16">
            <Link 
              to="/prozess" 
              className="inline-flex items-center text-fmv-orange hover:text-fmv-orange-light font-medium transition-colors group"
            >
              <span>Mehr zum Prozess erfahren</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
        
        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-fmv-carbon-dark to-transparent"></div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-fmv-carbon-darker to-fmv-carbon relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          <AnimatedElement animation="fade" className="text-center mb-10 md:mb-16">
            <h2 className="section-title">
              <span className="font-light">Deine </span>
              <span className="text-fmv-orange font-medium">Vorteile</span>
              <span className="font-light"> mit uns</span>
            </h2>
            <div className="section-divider"></div>
            <p className="text-lg md:text-xl text-fmv-silk/80 max-w-3xl mx-auto font-light">
              Warum immer mehr Unternehmen auf unsere KI-Videos setzen
            </p>
          </AnimatedElement>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-8 md:gap-y-12">
            <AnimatedElement animation="slide-up" delay={0.1}>
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="icon-container">
                    <Clock className="h-6 w-6 md:h-8 md:w-8 text-fmv-orange" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-medium mb-2 text-fmv-silk">Zeitersparnis</h3>
                  <p className="text-gray-400 text-sm md:text-base">
                    Fokussiere dich auf dein Kerngeschäft, während wir deine Videos erstellen. Fertig in 24-48 Stunden.
                  </p>
                </div>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.2}>
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="icon-container">
                    <CreditCard className="h-6 w-6 md:h-8 md:w-8 text-fmv-orange" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-medium mb-2 text-fmv-silk">Kostenersparnis</h3>
                  <p className="text-gray-400 text-sm md:text-base">
                    Professionelle Videos ohne teure Agenturpreise oder komplizierte Software-Lizenzen.
                  </p>
                </div>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.3}>
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="icon-container">
                    <Upload className="h-6 w-6 md:h-8 md:w-8 text-fmv-orange" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-medium mb-2 text-fmv-silk">Einfachheit</h3>
                  <p className="text-gray-400 text-sm md:text-base">
                    Keine Vorkenntnisse oder Design-Skills erforderlich. Einfach Bilder hochladen, wir erledigen den Rest.
                  </p>
                </div>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.4}>
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="icon-container">
                    <Video className="h-6 w-6 md:h-8 md:w-8 text-fmv-orange" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-medium mb-2 text-fmv-silk">Qualität</h3>
                  <p className="text-gray-400 text-sm md:text-base">
                    Professionelle, KI-optimierte Videos, die deine Marke perfekt repräsentieren und Kunden begeistern.
                  </p>
                </div>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.5}>
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="icon-container">
                    <LayoutIcon className="h-6 w-6 md:h-8 md:w-8 text-fmv-orange" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-medium mb-2 text-fmv-silk">Flexibilität</h3>
                  <p className="text-gray-400 text-sm md:text-base">
                    Videos in verschiedenen Formaten (16:9, 9:16, 1:1) für alle Plattformen und Netzwerke.
                  </p>
                </div>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.6}>
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="icon-container">
                    <Award className="h-6 w-6 md:h-8 md:w-8 text-fmv-orange" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-medium mb-2 text-fmv-silk">Schweizer Qualität</h3>
                  <p className="text-gray-400 text-sm md:text-base">
                    Ein Schweizer Unternehmen, das für Zuverlässigkeit, Datenschutz und herausragende Qualität steht.
                  </p>
                </div>
              </div>
            </AnimatedElement>
          </div>
        </div>
        
        {/* Decorative elements */}
        <motion.div
          className="absolute bottom-[20%] right-[10%] fmv-line w-40 md:w-72 z-0"
          animate={{ 
            width: ["0%", "100%", "0%"],
            opacity: [0, 0.6, 0],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.div
          className="absolute top-[30%] left-[5%] w-16 md:w-24 h-16 md:h-24 fmv-circle z-0"
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
        
        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-fmv-carbon-darker to-transparent"></div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-fmv-carbon-darker to-fmv-carbon relative overflow-hidden">
        <div className="fmv-bg-pattern"></div>
        
        {/* Decorative elements */}
        <motion.div
          className="absolute top-[15%] left-[10%] fmv-line w-32 md:w-64 z-0"
          animate={{ 
            width: ["0%", "100%", "0%"],
            right: ["0%", "0%", "100%"],
            opacity: [0, 0.5, 0],
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <motion.div
          className="absolute bottom-[25%] right-[10%] fmv-dot z-0"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          <AnimatedElement animation="fade" className="text-center mb-10 md:mb-16">
            <h2 className="section-title">
              <span className="font-light">Unsere </span>
              <span className="text-fmv-orange font-medium">Pakete</span>
            </h2>
            <div className="section-divider"></div>
            <p className="text-lg md:text-xl text-fmv-silk/80 max-w-3xl mx-auto font-light">
              Transparente Preise für jedes Budget
            </p>
          </AnimatedElement>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <AnimatedElement animation="slide-up" delay={0.1}>
              <div className="fmv-card h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl font-medium mb-2 text-fmv-silk">Spark</h3>
                  <p className="text-fmv-orange text-3xl md:text-4xl font-bold mb-6">CHF 150</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <span className="text-fmv-orange mr-2">✓</span>
                      <span className="text-gray-400">30 Sekunden Video</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-fmv-orange mr-2">✓</span>
                      <span className="text-gray-400">Beliebige Formate (16:9, 9:16, 1:1)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-fmv-orange mr-2">✓</span>
                      <span className="text-gray-400">Musik inklusive</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-fmv-orange mr-2">✓</span>
                      <span className="text-gray-400">Texteinblendungen</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-fmv-orange mr-2">✓</span>
                      <span className="text-gray-400">Lieferung in 24-48h</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/bestellen?package=spark"
                  className="block w-full fmv-primary-btn text-center px-6 py-3"
                >
                  Jetzt bestellen
                </Link>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.3}>
              <div className="gradient-border-animated bg-fmv-carbon-darker/60 rounded-lg overflow-hidden transform scale-105 shadow-xl h-full">
                <div className="p-6 sm:p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="bg-fmv-orange text-white text-xs sm:text-sm font-semibold uppercase py-1 px-3 sm:px-4 rounded-full inline-block mb-4">Beliebt</div>
                    <h3 className="text-xl md:text-2xl font-medium mb-2 text-fmv-silk">Flash</h3>
                    <p className="text-fmv-orange text-4xl font-bold mb-6">CHF 250</p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start">
                        <span className="text-fmv-orange mr-2">✓</span>
                        <span className="text-gray-400">60 Sekunden Video</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-fmv-orange mr-2">✓</span>
                        <span className="text-gray-400">Beliebige Formate (16:9, 9:16, 1:1)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-fmv-orange mr-2">✓</span>
                        <span className="text-gray-400">Musik inklusive</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-fmv-orange mr-2">✓</span>
                        <span className="text-gray-400">Texteinblendungen</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-fmv-orange mr-2">✓</span>
                        <span className="text-gray-400">Lieferung in 24-48h</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-fmv-orange mr-2">✓</span>
                        <span className="text-gray-400">Mehr Details und Szenen</span>
                      </li>
                    </ul>
                  </div>
                  <Link
                    to="/bestellen?package=flash"
                    className="block w-full fmv-primary-btn text-center px-6 py-3"
                  >
                    Jetzt bestellen
                  </Link>
                </div>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.5}>
              <div className="fmv-card h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl font-medium mb-2 text-fmv-silk">Ultra</h3>
                  <p className="text-fmv-orange text-3xl md:text-4xl font-bold mb-6">CHF 350</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <span className="text-fmv-orange mr-2">✓</span>
                      <span className="text-gray-400">90 Sekunden Video</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-fmv-orange mr-2">✓</span>
                      <span className="text-gray-400">Beliebige Formate (16:9, 9:16, 1:1)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-fmv-orange mr-2">✓</span>
                      <span className="text-gray-400">Musik inklusive</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-fmv-orange mr-2">✓</span>
                      <span className="text-gray-400">Texteinblendungen</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-fmv-orange mr-2">✓</span>
                      <span className="text-gray-400">Lieferung in 24-48h</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-fmv-orange mr-2">✓</span>
                      <span className="text-gray-400">Maximum an Details und Szenen</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/bestellen?package=ultra"
                  className="block w-full fmv-primary-btn text-center px-6 py-3"
                >
                  Jetzt bestellen
                </Link>
              </div>
            </AnimatedElement>
          </div>
          
          <div className="text-center mt-10 md:mt-12">
            <Link 
              to="/preise" 
              className="inline-flex items-center text-fmv-orange hover:text-fmv-orange-light font-medium transition-colors group"
            >
              <span>Alle Details zu unseren Paketen</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
        
        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-fmv-carbon to-transparent"></div>
      </section>
      
      {/* CTA Section - NEW POSITION */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-fmv-carbon to-fmv-carbon-darker relative overflow-hidden">
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
        
        {/* Decorative elements */}
        <motion.div
          className="absolute top-[20%] left-[50%] fmv-dot z-0"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <motion.div 
          className="absolute bottom-[20%] left-[30%] fmv-line w-32 md:w-48 z-0"
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
        
        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          <AnimatedElement animation="fade" className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">
              <span className="font-light">Bereit für dein </span>
              <span className="text-fmv-orange font-medium">beeindruckendes Video</span>
              <span className="font-light">?</span>
            </h2>
            <div className="section-divider"></div>
            <p className="text-lg md:text-xl mb-8 text-fmv-silk/80 font-light">
              Starte jetzt und lass deine Fotos zum Leben erwecken. Keine Vorkenntnisse erforderlich!
            </p>
            <Link
              to="/bestellen"
              className="fmv-primary-btn px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg inline-flex items-center"
            >
              Video erstellen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </AnimatedElement>
        </div>
        
        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-fmv-carbon-darker to-transparent"></div>
      </section>
      
      {/* Calendly Integration */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          <AnimatedElement animation="fade">
            <CalendlyWidget 
              url="https://calendly.com/fixmyvideo/beratung"
              text="Sind Sie an einer größeren Zusammenarbeit interessiert? Buchen Sie einen kostenlosen Beratungstermin für Projekte mit 10+ Videos pro Monat."
              buttonText="Kostenlose Beratung buchen"
              className="shadow-lg"
            />
          </AnimatedElement>
        </div>
      </section>
      
      {/* NEW: Newsletter Section - MOVED TO FINAL POSITION */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-fmv-carbon-darker to-fmv-carbon relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          <div className="max-w-3xl mx-auto">
            <AnimatedElement animation="fade" className="text-center mb-8 md:mb-10">
              <h2 className="section-title">
                <span className="font-light">Bleibe auf dem </span>
                <span className="text-fmv-orange font-medium">Laufenden</span>
              </h2>
              <div className="section-divider"></div>
              <p className="text-lg md:text-xl text-fmv-silk/80 max-w-3xl mx-auto font-light">
                Erhalte exklusive Tipps, aktuelle Trends und Sonderangebote in deinem Postfach
              </p>
            </AnimatedElement>
            
            <div className="bg-gradient-to-br from-fmv-carbon-light/20 to-fmv-carbon-light/5 rounded-lg p-6 md:p-8 border border-fmv-carbon-light/30 backdrop-blur-sm shadow-lg">
              {!isNewsletterSubmitted ? (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col">
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <label htmlFor="email" className="block text-fmv-silk/80 mb-2 font-light">
                        E-Mail Adresse
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-fmv-carbon-darker border border-fmv-carbon-light/30 text-fmv-silk rounded-md pl-10 pr-4 py-3 focus:border-fmv-orange/50 focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
                          placeholder="deine@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="sm:self-end">
                      <button 
                        type="submit"
                        className="w-full sm:w-auto fmv-primary-btn px-6 py-3"
                      >
                        Abonnieren
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      id="privacy-consent" 
                      className="mt-1 mr-3" 
                      required 
                    />
                    <label htmlFor="privacy-consent" className="text-sm text-gray-400">
                      Ich bin damit einverstanden, den Newsletter zu erhalten und akzeptiere die <Link to="/datenschutz" className="text-fmv-orange hover:underline">Datenschutzbestimmungen</Link>. Die Abmeldung ist jederzeit möglich.
                    </label>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6 md:py-8">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-fmv-orange/20 p-3">
                      <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-fmv-orange" />
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-medium mb-2 text-fmv-silk">Erfolgreich abonniert!</h3>
                  <p className="text-gray-400">
                    Vielen Dank für dein Interesse. Wir haben deine Anmeldung erhalten und werden dich über Neuigkeiten auf dem Laufenden halten.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <motion.div
          className="absolute top-[30%] right-[10%] fmv-dot z-0"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-[20%] left-[5%] w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 fmv-circle z-0"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </section>
    </div>
  );
};

export default HomePage;