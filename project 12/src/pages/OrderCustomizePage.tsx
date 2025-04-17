import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Video, Music, Type, Layout, Clock, Check } from 'lucide-react';
import AnimatedElement from '../components/AnimatedElement';
import toast from 'react-hot-toast';

const OrderCustomizePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get selected package from URL params
  const searchParams = new URLSearchParams(location.search);
  const selectedPackage = searchParams.get('package') || 'flash';
  
  // State for customization options
  const [selectedFormat, setSelectedFormat] = useState<string>('16:9');
  const [selectedStyle, setSelectedStyle] = useState<string>('dynamic');
  const [selectedMusic, setSelectedMusic] = useState<string>('upbeat'); 
  const [selectedSpeed, setSelectedSpeed] = useState<string>('medium'); 
  const [textOverlays, setTextOverlays] = useState<string[]>([]);
  const [textInput, setTextInput] = useState<string>('');
  
  // Load uploaded images from sessionStorage
  const [uploadedImages, setUploadedImages] = useState<string[]>(() => {
    const imagesStr = sessionStorage.getItem('uploadedImages');
    return imagesStr ? imagesStr.split(',').filter(Boolean) : [];
  });
  
  // Format options
  const formatOptions = [
    { id: '16:9', label: 'Landscape (16:9)', description: 'Ideal für YouTube, Websites' },
    { id: '9:16', label: 'Portrait (9:16)', description: 'Perfekt für Instagram, TikTok' },
    { id: '1:1', label: 'Square (1:1)', description: 'Optimal für Instagram, Facebook' },
  ];
  
  // Style options
  const styleOptions = [
    { id: 'dynamic', label: 'Dynamisch', description: 'Lebendige Übergänge mit Bewegung' },
    { id: 'smooth', label: 'Sanft', description: 'Weiche, fließende Übergänge' },
    { id: 'minimal', label: 'Minimalistisch', description: 'Klare, einfache Übergänge' },
    { id: 'creative', label: 'Kreativ', description: 'Künstlerische, ungewöhnliche Effekte' },
  ];
  
  // Music options
  const musicOptions = [
    { id: 'upbeat', label: 'Energetisch', description: 'Lebhaft und motivierend' },
    { id: 'relaxed', label: 'Entspannt', description: 'Ruhig und beruhigend' },
    { id: 'corporate', label: 'Business', description: 'Professionell und seriös' },
    { id: 'emotional', label: 'Emotional', description: 'Gefühlvoll und bewegend' },
    { id: 'custom', label: 'Eigene Musik', description: 'Ihre hochgeladene Audiodatei' },
  ];
  
  // Speed options
  const speedOptions = [
    { id: 'slow', label: 'Langsam', description: 'Ruhiges Tempo' },
    { id: 'medium', label: 'Mittel', description: 'Ausgewogenes Tempo' },
    { id: 'fast', label: 'Schnell', description: 'Dynamisches Tempo' },
  ];

  // Save customization data to sessionStorage before navigating
  const saveAndContinue = () => {
    try {
      // Save customization data with actual values
      const customizationData = {
        selectedFormat,
        selectedStyle,
        selectedMusic,
        selectedSpeed,
        textOverlays: textOverlays.length || 1
      };
      
      sessionStorage.setItem('orderCustomization', JSON.stringify(customizationData));
      
      // Navigate to next step
      navigate(`/bestellen/upsell?package=${selectedPackage}`);
    } catch (error) {
      console.error('Error saving customization data:', error);
      toast.error('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    }
  };
  
  // Parse text input into array of text overlays
  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    
    // Split by newlines and filter out empty lines
    const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
    setTextOverlays(lines);
  };

  return (
    <div className="min-h-screen bg-fmv-carbon text-fmv-silk pt-20 sm:pt-24">
      {/* Progress Steps */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto mb-12 relative">
          {/* Progress bar background */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-fmv-carbon-light/20 -translate-y-1/2 z-0"></div>
          
          {/* Progress steps with improved spacing */}
          <div className="relative z-10 flex justify-between items-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center w-16 sm:w-24">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-fmv-orange/20 to-fmv-orange/30 text-fmv-orange flex items-center justify-center font-medium mb-3 border-2 border-fmv-orange/30">
                <Check size={22} />
              </div>
              <span className="text-fmv-silk/60 text-center text-xs sm:text-sm">Paket wählen</span>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center w-16 sm:w-24">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-fmv-orange/20 to-fmv-orange/30 text-fmv-orange flex items-center justify-center font-medium mb-3 border-2 border-fmv-orange/30">
                <Check size={22} />
              </div>
              <span className="text-fmv-silk/60 text-center text-xs sm:text-sm">Inhalte hochladen</span>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center w-16 sm:w-24">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-fmv-orange to-fmv-orange-light text-white flex items-center justify-center font-medium mb-3 shadow-lg shadow-fmv-orange/20 border-2 border-fmv-orange-light/30">
                <span className="text-lg">3</span>
              </div>
              <span className="text-fmv-orange font-medium text-center text-xs sm:text-sm">Video anpassen</span>
            </div>
            
            {/* Step 4 */}
            <div className="flex flex-col items-center w-16 sm:w-24">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-fmv-carbon-light/20 text-fmv-silk/50 flex items-center justify-center font-medium mb-3 border-2 border-fmv-carbon-light/10">
                <span className="text-lg">4</span>
              </div>
              <span className="text-fmv-silk/50 text-center text-xs sm:text-sm">Überprüfen & Bestellen</span>
            </div>
          </div>
          
          {/* Active progress bar */}
          <div className="absolute top-1/2 left-0 w-[62.5%] h-2 bg-gradient-to-r from-fmv-orange to-fmv-orange-light -translate-y-1/2 z-0 rounded-full shadow-sm shadow-fmv-orange/20"></div>
        </div>

        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <AnimatedElement animation="fade">
            <h1 className="text-3xl sm:text-4xl font-light mb-4">
              Passe dein <span className="text-fmv-orange font-medium">Video</span> an
            </h1>
            <p className="text-fmv-silk/80">
              Wähle die Einstellungen, die am besten zu deinem Projekt passen. 
              Du kannst Format, Stil, Musik und mehr anpassen.
            </p>
          </AnimatedElement>
        </div>

        {/* Customization Options */}
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Format Selection */}
          <AnimatedElement animation="slide-up" delay={0.1}>
            <div>
              <div className="flex items-center mb-4">
                <Layout className="h-6 w-6 text-fmv-orange mr-2" />
                <h2 className="text-xl font-medium">Videoformat</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formatOptions.map((format) => (
                  <div
                    key={format.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedFormat === format.id
                        ? 'border-fmv-orange bg-fmv-orange/10'
                        : 'border-fmv-carbon-light/30 hover:border-fmv-orange/50 hover:bg-fmv-carbon-light/5'
                    }`}
                    onClick={() => setSelectedFormat(format.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium mb-1">{format.label}</h3>
                        <p className="text-sm text-fmv-silk/60">{format.description}</p>
                      </div>
                      {selectedFormat === format.id && (
                        <div className="bg-fmv-orange rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedElement>

          {/* Style Selection */}
          <AnimatedElement animation="slide-up" delay={0.2}>
            <div>
              <div className="flex items-center mb-4">
                <Settings className="h-6 w-6 text-fmv-orange mr-2" />
                <h2 className="text-xl font-medium">Stil & Übergänge</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {styleOptions.map((style) => (
                  <div
                    key={style.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedStyle === style.id
                        ? 'border-fmv-orange bg-fmv-orange/10'
                        : 'border-fmv-carbon-light/30 hover:border-fmv-orange/50 hover:bg-fmv-carbon-light/5'
                    }`}
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium mb-1">{style.label}</h3>
                        <p className="text-sm text-fmv-silk/60">{style.description}</p>
                      </div>
                      {selectedStyle === style.id && (
                        <div className="bg-fmv-orange rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedElement>

          {/* Music Selection */}
          <AnimatedElement animation="slide-up" delay={0.3}>
            <div>
              <div className="flex items-center mb-4">
                <Music className="h-6 w-6 text-fmv-orange mr-2" />
                <h2 className="text-xl font-medium">Musikstil</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {musicOptions.map((music) => (
                  <div
                    key={music.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedMusic === music.id
                        ? 'border-fmv-orange bg-fmv-orange/10'
                        : 'border-fmv-carbon-light/30 hover:border-fmv-orange/50 hover:bg-fmv-carbon-light/5'
                    }`}
                    onClick={() => setSelectedMusic(music.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium mb-1">{music.label}</h3>
                        <p className="text-sm text-fmv-silk/60">{music.description}</p>
                      </div>
                      {selectedMusic === music.id && (
                        <div className="bg-fmv-orange rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedElement>

          {/* Speed Selection */}
          <AnimatedElement animation="slide-up" delay={0.4}>
            <div>
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-fmv-orange mr-2" />
                <h2 className="text-xl font-medium">Geschwindigkeit</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {speedOptions.map((speed) => (
                  <div
                    key={speed.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedSpeed === speed.id
                        ? 'border-fmv-orange bg-fmv-orange/10'
                        : 'border-fmv-carbon-light/30 hover:border-fmv-orange/50 hover:bg-fmv-carbon-light/5'
                    }`}
                    onClick={() => setSelectedSpeed(speed.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium mb-1">{speed.label}</h3>
                        <p className="text-sm text-fmv-silk/60">{speed.description}</p>
                      </div>
                      {selectedSpeed === speed.id && (
                        <div className="bg-fmv-orange rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedElement>

          {/* Text Overlays */}
          <AnimatedElement animation="slide-up" delay={0.5}>
            <div>
              <div className="flex items-center mb-4">
                <Type className="h-6 w-6 text-fmv-orange mr-2" />
                <h2 className="text-xl font-medium">Texteinblendungen (optional)</h2>
              </div>
              
              <div className="bg-fmv-carbon-darker rounded-lg p-6 border border-fmv-carbon-light/30">
                <p className="text-fmv-silk/80 mb-4">
                  Geben Sie hier Text ein, den Sie im Video einblenden möchten (z.B. Titel, Beschreibungen, Kontaktdaten).
                  Trennen Sie verschiedene Texteinblendungen durch Zeilenumbrüche.
                  {selectedPackage === 'spark' && (
                    <span className="block mt-2 text-fmv-orange">Maximal 3 Texteinblendungen im Spark-Paket.</span>
                  )}
                  {selectedPackage === 'flash' && (
                    <span className="block mt-2 text-fmv-orange">Maximal 6 Texteinblendungen im Flash-Paket.</span>
                  )}
                  {selectedPackage === 'ultra' && (
                    <span className="block mt-2 text-fmv-orange">Maximal 10 Texteinblendungen im Ultra-Paket.</span>
                  )}
                  <span className="block mt-2 text-fmv-silk/60">
                    Hochgeladene Bilder: {uploadedImages.length || 0}
                  </span>
                </p>
                <textarea
                  value={textInput}
                  onChange={handleTextInputChange}
                  className="w-full bg-fmv-carbon-light/10 border border-fmv-carbon-light/30 rounded-md px-4 py-3 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50"
                  placeholder="Beispiel:
Willkommen bei [Ihr Unternehmen]
Entdecken Sie unsere Produkte
Kontaktieren Sie uns unter info@example.com"
                  rows={6}
                />
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-fmv-silk/60">
                    Eingegebene Texteinblendungen: {textOverlays.length}
                  </span>
                  {(() => {
                    let maxOverlays = 3; // Default for Spark
                    if (selectedPackage === 'flash') maxOverlays = 6;
                    if (selectedPackage === 'ultra') maxOverlays = 10;
                    
                    if (textOverlays.length > maxOverlays) {
                      return (
                        <span className="text-sm text-red-400">
                          Maximale Anzahl überschritten! ({maxOverlays})
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>
          </AnimatedElement>

          {/* Navigation Buttons */}
          <div className="flex justify-between max-w-4xl mx-auto pt-6">
            <button 
              onClick={() => navigate(`/bestellen/upload?package=${selectedPackage}`)}
              className="px-6 py-2 border border-fmv-carbon-light/30 rounded-md text-fmv-silk hover:bg-fmv-carbon-light/10 transition-colors"
            >
              Zurück
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-2 bg-fmv-orange text-white rounded-md hover:bg-fmv-orange-light transition-colors"
              onClick={saveAndContinue}
            >
              Weiter
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCustomizePage;