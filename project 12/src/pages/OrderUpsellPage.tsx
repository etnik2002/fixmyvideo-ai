import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Check, ArrowRight, Info, Video, Monitor, Smartphone, Square, Clock, Palette, Wand2, FileVideo, Image, Upload, Zap, Shield, Layout } from 'lucide-react';
import AnimatedElement from '../components/AnimatedElement';
import Card from '../components/Card'; 
import toast from 'react-hot-toast';

interface UpsellOption {
  id: string;
  title: string;
  price: number;
  description: string;
  icon: React.ReactNode;
  details?: string[];
}

const OrderUpsellPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get selected package from URL params
  const searchParams = new URLSearchParams(location.search);
  const selectedPackage = searchParams.get('package') || 'flash';
  const uploadedImagesCount = parseInt(searchParams.get('images') || '5');
  
  // Get customization data from sessionStorage
  const getCustomizationData = () => {
    try {
      const data = sessionStorage.getItem('orderCustomization');
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error parsing customization data:', error);
    }
    
    // Default values if no data is found
    return {
      selectedFormat: '16:9',
      selectedStyle: 'Dynamisch',
      selectedMusic: 'Energetisch',
      selectedSpeed: 'Mittel',
      textOverlays: 3
    };
  };
  
  const customizationData = getCustomizationData();
  
  // State for selected upsell options
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  // State for selected format options
  const [selectedFormats, setSelectedFormats] = useState<string[]>([customizationData.selectedFormat || '16:9']);
  
  // State for reference inputs
  const [colorReference, setColorReference] = useState<string>('');
  const [effectsReference, setEffectsReference] = useState<string>('');
  
  // Available upsell options
  const upsellOptions: UpsellOption[] = [
    {
      id: 'express-delivery',
      title: 'Express-Lieferung',
      price: 100,
      description: 'Erhalte dein Video innerhalb von 12 Stunden statt 24-48 Stunden',
      icon: <Zap className="h-6 w-6 text-fmv-orange" />,
      details: [
        'Prioritätsbearbeitung durch unser Team',
        'Garantierte Lieferung innerhalb von 12 Stunden',
        'Ideal für zeitkritische Projekte',
        'Inklusive Express-Support'
      ]
    },
    {
      id: '4k-resolution',
      title: '4K Auflösung',
      price: 50,
      description: 'Upgrade auf 4K Ultra-HD Qualität für maximale Schärfe und Details',
      icon: <Video className="h-6 w-6 text-fmv-orange" />,
      details: [
        'Viermal höhere Auflösung als Standard-HD',
        'Ideal für große Bildschirme und Projektionen',
        'Zukunftssicher für moderne Displays',
        'Mehr Details und Klarheit'
      ]
    },
    {
      id: 'color-correction',
      title: 'Farbkorrektur',
      price: 60,
      description: 'Professionelle Farbkorrektur für optimale Bildqualität und Stimmung',
      icon: <Palette className="h-6 w-6 text-fmv-orange" />,
      details: [
        'Professionelle Farbabstimmung aller Bilder',
        'Konsistente Farbpalette im gesamten Video',
        'Optimierte Kontraste und Sättigung',
        'Stimmungsvolle Farbatmosphäre'
      ]
    },
    {
      id: 'custom-effects',
      title: 'Spezialeffekte',
      price: 60,
      description: 'Individuelle Animationen und visuelle Effekte für mehr Dynamik',
      icon: <Wand2 className="h-6 w-6 text-fmv-orange" />,
      details: [
        'Maßgeschneiderte Übergangseffekte',
        'Dynamische Text-Animationen',
        'Visuelle Akzente und Highlights',
        'Professionelle Motion-Graphics'
      ]
    },
    {
      id: 'quality-enhancement',
      title: 'Qualitätsverbesserung',
      price: 40,
      description: 'KI-gestützte Verbesserung der Bildqualität für optimale Ergebnisse',
      icon: <Shield className="h-6 w-6 text-fmv-orange" />,
      details: [
        'KI-basierte Bildoptimierung für maximale Klarheit',
        'Rauschunterdrückung und Schärfung',
        'Verbesserte Details und Texturen'
      ]
    },
    {
      id: 'source-files',
      title: 'Quelldateien',
      price: 120,
      description: 'Erhalte die Quelldateien für weitere Bearbeitung',
      icon: <FileVideo className="h-6 w-6 text-fmv-orange" />,
      details: [
        'Vollständige Projektdateien für Eigenbearbeitung',
        'Alle verwendeten Assets und Ressourcen',
        'Unbegrenzte Anpassungsmöglichkeiten',
        'Ideal für Agenturen und Profis'
      ]
    }
  ];
  
  // Format options
  const formatOptions = [
    { id: '16:9', label: 'Landscape (16:9)', description: 'Ideal für YouTube, Websites, TV', icon: <Monitor className="h-6 w-6 text-fmv-orange" /> },
    { id: '9:16', label: 'Portrait (9:16)', description: 'Perfekt für Instagram/TikTok Stories', icon: <Smartphone className="h-6 w-6 text-fmv-orange" /> },
    { id: '1:1', label: 'Square (1:1)', description: 'Optimal für Instagram/Facebook Feed', icon: <Square className="h-6 w-6 text-fmv-orange" /> },
    { id: '4:5', label: 'Instagram (4:5)', description: 'Maximale Größe für Instagram Feed', icon: <Image className="h-6 w-6 text-fmv-orange" /> },
    { id: '2.35:1', label: 'Cinematic (2.35:1)', description: 'Filmisches Breitbildformat', icon: <Video className="h-6 w-6 text-fmv-orange" /> },
  ];
  
  // Toggle upsell option
  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };
  
  // Toggle format option
  const toggleFormat = (formatId: string) => {
    // If it's the only selected format, don't allow deselection
    if (selectedFormats.includes(formatId) && selectedFormats.length === 1) {
      return;
    }
    
    setSelectedFormats(prev => {
      if (prev.includes(formatId)) {
        return prev.filter(id => id !== formatId);
      } else {
        return [...prev, formatId];
      }
    });
  };
  
  // Calculate additional formats cost
  const getAdditionalFormatsCost = () => {
    // First format is free, additional formats cost 30 each
    const additionalFormats = Math.max(0, selectedFormats.length - 1);
    return additionalFormats * 30;
  };
  
  // Calculate total cost
  const calculateTotal = () => {
    // Base package price
    let total = 0;
    switch (selectedPackage) {
      case 'spark':
        total = 150;
        break;
      case 'flash':
        total = 250;
        break;
      case 'ultra':
        total = 350;
        break;
      default:
        total = 250; // Default to Flash
    }
    
    // Add upsell options
    selectedOptions.forEach(optionId => {
      const option = upsellOptions.find(opt => opt.id === optionId);
      if (option) {
        total += option.price;
      }
    });
    
    // Add additional formats cost
    total += getAdditionalFormatsCost();
    
    return total;
  };
  
  // Save upsell data to sessionStorage before navigating
  const saveAndContinue = () => {
    try {
      // Save upsell data
      const upsellData = {
        selectedOptions,
        selectedFormats,
        colorReference,
        effectsReference
      };
      
      sessionStorage.setItem('orderUpsells', JSON.stringify(upsellData));
      
      // Navigate to next step
      navigate(`/bestellen/review?package=${selectedPackage}`);
    } catch (error) {
      console.error('Error saving upsell data:', error);
      toast.error('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    }
  };
  
  // Get subtotal (without VAT)
  const subtotal = calculateTotal();
  
  // Calculate VAT (8.1%)
  const vat = subtotal * 0.081;
  
  // Calculate final total
  const total = subtotal + vat;

  return (
    <div className="min-h-screen bg-fmv-carbon text-fmv-silk pt-20 sm:pt-24">
      {/* Progress Steps */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto mb-12 relative">
          {/* Progress bar background */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-fmv-carbon-light/20 -translate-y-1/2 z-0"></div>

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
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-fmv-orange/20 to-fmv-orange/30 text-fmv-orange flex items-center justify-center font-medium mb-3 border-2 border-fmv-orange/30">
                <Check size={22} />
              </div>
              <span className="text-fmv-silk/60 text-center text-xs sm:text-sm">Video anpassen</span>
            </div>
            
            {/* Step 3.5 - New step for upsells */}
            <div className="flex flex-col items-center w-16 sm:w-24">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-fmv-orange to-fmv-orange-light text-white flex items-center justify-center font-medium mb-3 shadow-lg shadow-fmv-orange/20 border-2 border-fmv-orange-light/30">
                <span className="text-lg">4</span>
              </div>
              <span className="text-fmv-orange font-medium text-center text-xs sm:text-sm">Extras wählen</span>
            </div>
            
            {/* Step 4 */}
            <div className="flex flex-col items-center w-16 sm:w-24">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-fmv-carbon-light/20 text-fmv-silk/50 flex items-center justify-center font-medium mb-3 border-2 border-fmv-carbon-light/10">
                <span className="text-lg">5</span>
              </div>
              <span className="text-fmv-silk/50 text-center text-xs sm:text-sm">Bestellen</span>
            </div>
          </div>
          
          {/* Active progress bar */}
          <div className="absolute top-1/2 left-0 w-[75%] h-2 bg-gradient-to-r from-fmv-orange to-fmv-orange-light -translate-y-1/2 z-0 rounded-full shadow-sm shadow-fmv-orange/20"></div>
        </div>

        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <AnimatedElement animation="fade">
            <h1 className="text-3xl sm:text-4xl font-light mb-4">
              Optimiere dein <span className="text-fmv-orange font-medium">Video</span>
            </h1>
            <p className="text-fmv-silk/80">
              Wähle zusätzliche Optionen, um dein Video zu verbessern und für verschiedene Plattformen zu optimieren.
            </p>
          </AnimatedElement>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Order Summary Banner */}
          <AnimatedElement animation="slide-up" delay={0.1}>
            <div className="bg-gradient-to-r from-fmv-carbon-light/20 to-fmv-carbon-light/5 rounded-lg p-6 border border-fmv-carbon-light/30 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-medium text-fmv-silk mb-1">Deine Bestellung</h2>
                  <p className="text-fmv-silk/70">
                    <span className="capitalize">{selectedPackage}</span> Paket • {uploadedImagesCount} {uploadedImagesCount === 1 ? 'Bild' : 'Bilder'} • Format {selectedFormats[0]}
                  </p>
                </div>
                <div className="text-fmv-orange text-xl font-medium">
                  Grundpreis: CHF {
                    selectedPackage === 'spark' ? '150' : 
                    selectedPackage === 'ultra' ? '350' : '250'
                  }
                </div>
              </div>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Options */}
            <div className="lg:col-span-8 space-y-8">
              {/* Video Formats Section */}
              <AnimatedElement animation="slide-up" delay={0.2}>
                <Card border={true} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-fmv-orange/10 to-transparent -mx-6 -mt-6 px-6 pt-6 pb-4 mb-4 border-b border-fmv-carbon-light/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Layout className="h-6 w-6 text-fmv-orange mr-2" />
                        <h2 className="text-xl font-medium">Videoformate</h2>
                      </div>
                      <div className="text-fmv-orange font-medium">
                        {getAdditionalFormatsCost() > 0 && `+CHF ${getAdditionalFormatsCost()}`}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-fmv-silk/70 mb-6">
                    Wähle die Formate, in denen du dein Video erhalten möchtest. Das erste Format ist im Preis inbegriffen, jedes zusätzliche Format kostet <span className="text-fmv-orange font-medium">CHF 30</span>.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formatOptions.map((format) => (
                      <div
                        key={format.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedFormats.includes(format.id)
                            ? 'border-fmv-orange bg-fmv-orange/10'
                            : 'border-fmv-carbon-light/30 hover:border-fmv-orange/50 hover:bg-fmv-carbon-light/5'
                        }`}
                        onClick={() => toggleFormat(format.id)}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="mb-3">
                            {format.icon}
                          </div>
                          <h3 className="font-medium mb-1">{format.label}</h3>
                          <p className="text-sm text-fmv-silk/60">{format.description}</p>
                          
                          <div className="mt-4">
                            {selectedFormats.includes(format.id) ? (
                              <div className="bg-fmv-orange rounded-full p-1 inline-block">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-fmv-carbon-light/50 inline-block"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedFormats.length > 1 && (
                    <div className="mt-4 bg-fmv-orange/10 border border-fmv-orange/30 rounded-md p-3">
                      <p className="text-fmv-orange text-sm">
                        <span className="font-medium">+{selectedFormats.length - 1} zusätzliche Formate</span> - 
                        Dein Video wird in allen ausgewählten Formaten geliefert, perfekt optimiert für verschiedene Plattformen.
                      </p>
                    </div>
                  )}
                </Card>
              </AnimatedElement>
              
              {/* Color Correction Reference - Only visible when color correction is selected */}
              {selectedOptions.includes('color-correction') && (
                <AnimatedElement animation="slide-up" delay={0.3}>
                  <div className="bg-gradient-to-b from-fmv-carbon-light/10 to-fmv-carbon-darker rounded-lg p-6 border border-fmv-orange/30">
                    <div className="flex items-center mb-6">
                      <Palette className="h-6 w-6 text-fmv-orange mr-2" />
                      <h2 className="text-xl font-medium">Farbkorrektur-Referenz</h2>
                    </div>
                    
                    <p className="text-fmv-silk/70 mb-6">
                      Gib uns Hinweise zur gewünschten Farbstimmung. Beschreibe den Look oder verlinke Referenzbilder/-videos.
                    </p>
                    
                    <textarea
                      value={colorReference}
                      onChange={(e) => setColorReference(e.target.value)}
                      className="w-full bg-fmv-carbon-light/10 border border-fmv-carbon-light/30 rounded-md px-4 py-3 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50"
                      placeholder="Beispiel: Warme, leicht gesättigte Farben mit hohem Kontrast. Referenz: https://example.com/reference-image.jpg"
                      rows={4}
                    />
                    
                    <div className="mt-4 bg-fmv-orange/10 border border-fmv-orange/30 rounded-md p-3">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-fmv-orange mt-0.5 mr-3 flex-shrink-0" />
                        <p className="text-fmv-orange/90 text-sm">
                          Je detaillierter deine Beschreibung, desto besser können wir deine Vorstellung umsetzen. Du kannst auch URLs zu Referenzbildern oder -videos angeben.
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedElement>
              )}
              
              {/* Special Effects Reference - Only visible when special effects is selected */}
              {selectedOptions.includes('custom-effects') && (
                <AnimatedElement animation="slide-up" delay={0.3}>
                  <div className="bg-gradient-to-b from-fmv-carbon-light/10 to-fmv-carbon-darker rounded-lg p-6 border border-fmv-orange/30">
                    <div className="flex items-center mb-6">
                      <Wand2 className="h-6 w-6 text-fmv-orange mr-2" />
                      <h2 className="text-xl font-medium">Spezialeffekte-Referenz</h2>
                    </div>
                    
                    <p className="text-fmv-silk/70 mb-6">
                      Beschreibe, welche Art von Effekten du dir für dein Video wünschst. Gib gerne Beispiele oder Referenzen an.
                    </p>
                    
                    <textarea
                      value={effectsReference}
                      onChange={(e) => setEffectsReference(e.target.value)}
                      className="w-full bg-fmv-carbon-light/10 border border-fmv-carbon-light/30 rounded-md px-4 py-3 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50"
                      placeholder="Beispiel: Sanfte Überblendungen zwischen den Bildern, leichte Zoom-Effekte und moderne Text-Animationen. Referenz: https://example.com/reference-video.mp4"
                      rows={4}
                    />
                    
                    <div className="mt-4 bg-fmv-orange/10 border border-fmv-orange/30 rounded-md p-3">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-fmv-orange mt-0.5 mr-3 flex-shrink-0" />
                        <p className="text-fmv-orange/90 text-sm">
                          Spezifische Beschreibungen helfen uns, genau die Effekte zu erstellen, die du dir vorstellst. Du kannst auch Links zu Beispielvideos teilen, die den gewünschten Stil zeigen.
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedElement>
              )}
              
              {/* Upsell Options */}
              <AnimatedElement animation="slide-up" delay={0.2}>
                <Card border={true} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-fmv-orange/10 to-transparent -mx-6 -mt-6 px-6 pt-6 pb-4 mb-4 border-b border-fmv-carbon-light/20">
                    <div className="flex items-center">
                      <Zap className="h-6 w-6 text-fmv-orange mr-2" />
                      <h2 className="text-xl font-medium">Premium-Optionen</h2>
                    </div>
                  </div>
                  
                  <p className="text-fmv-silk/70 mb-6">
                    Wähle aus diesen Premium-Optionen, um dein Video auf die nächste Stufe zu heben und ein noch professionelleres Ergebnis zu erzielen.
                  </p>
                  
                  <div className="space-y-4">
                    {upsellOptions.map((option) => (
                      <div key={option.id} className="bg-fmv-carbon-darker rounded-lg overflow-hidden shadow-sm">
                        <div 
                          className={`border-2 rounded-lg cursor-pointer transition-all ${
                            selectedOptions.includes(option.id)
                              ? 'border-fmv-orange bg-fmv-orange/5 shadow-md shadow-fmv-orange/10'
                              : 'border-fmv-carbon-light/20 hover:border-fmv-orange/30'
                          }`}
                        >
                          <div 
                            className="p-4 flex items-start justify-between"
                            onClick={() => toggleOption(option.id)}
                          >
                            <div className="flex items-start">
                              <div className="bg-fmv-carbon-light/10 p-2 rounded-md mr-3 flex-shrink-0">
                                {option.icon}
                              </div>
                              <div>
                                <h3 className="font-medium text-fmv-silk">{option.title}</h3>
                                <p className="text-sm text-fmv-silk/60 mt-1">{option.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-fmv-orange font-medium mr-3">CHF {option.price}</span>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                selectedOptions.includes(option.id)
                                  ? 'bg-fmv-orange'
                                  : 'border-2 border-fmv-carbon-light/50'
                              }`}>
                                {selectedOptions.includes(option.id) && (
                                  <Check className="h-4 w-4 text-white" />
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Details section - only visible when selected */}
                          {selectedOptions.includes(option.id) && option.details && (
                            <div className="bg-fmv-carbon-light/5 p-4 border-t border-fmv-carbon-light/10 animate-fade-in">
                              <h4 className="text-sm font-medium text-fmv-silk/80 mb-2">Details:</h4>
                              <ul className="space-y-1">
                                {option.details.map((detail, index) => (
                                  <li key={index} className="flex items-start text-sm">
                                    <Check className="h-4 w-4 text-fmv-orange mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-fmv-silk/70">{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </AnimatedElement>
            </div>
            
            {/* Right Column - Summary */}
            <div className="lg:col-span-4">
              <AnimatedElement animation="slide-up" delay={0.3}>
                <div className="bg-gradient-to-b from-fmv-carbon-darker to-fmv-carbon-dark rounded-lg p-6 border border-fmv-carbon-light/30 sticky top-24 shadow-lg">
                  <div className="bg-gradient-to-r from-fmv-orange/10 to-transparent -mx-6 -mt-6 px-6 pt-6 pb-4 mb-4 border-b border-fmv-carbon-light/20">
                    <h2 className="text-xl font-medium">Bestellübersicht</h2>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                      <span className="text-fmv-silk/80">Paket</span>
                      <span className="text-fmv-silk font-medium capitalize">{selectedPackage}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                      <span className="text-fmv-silk/80">Formate</span>
                      <span className="text-fmv-silk">{selectedFormats.join(', ')}</span>
                      {selectedFormats.length > 1 && (
                        <span className="text-fmv-orange text-sm ml-2">+{(selectedFormats.length - 1) * 30} CHF</span>
                      )}
                    </div>
                    
                    {selectedOptions.length > 0 && (
                      <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                        <span className="text-fmv-silk/80">Zusatzoptionen</span>
                        <span className="text-fmv-silk">{selectedOptions.length}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                      <span className="text-fmv-silk/80">Zwischensumme</span>
                      <span className="text-fmv-silk">CHF {subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                      <span className="text-fmv-silk/80">MwSt. (8.1%)</span>
                      <span className="text-fmv-silk">CHF {vat.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-fmv-silk">Gesamtbetrag inkl. MwSt</span>
                      <span className="text-fmv-orange text-xl">CHF {total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-4 bg-fmv-orange text-white rounded-md hover:bg-fmv-orange-light transition-colors flex items-center justify-center font-medium"
                      onClick={saveAndContinue}
                    >
                      Weiter zur Bestellung
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.button>
                    
                    <button 
                      onClick={() => navigate(`/bestellen/customize?package=${selectedPackage}`)}
                      className="w-full py-2 px-4 border border-fmv-carbon-light/30 rounded-md text-fmv-silk hover:bg-fmv-carbon-light/10 transition-colors"
                    >
                      Zurück zu den Anpassungen
                    </button>
                  </div>
                  
                  {/* Info Box */}
                  <div className="mt-6 bg-fmv-carbon-light/5 border border-fmv-carbon-light/20 rounded-lg p-4">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-fmv-orange mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-fmv-silk/70 text-sm mb-2">
                          Alle Zusatzoptionen sind optional und verbessern die Qualität deines Videos.
                        </p>
                        <p className="text-fmv-silk/70 text-sm">
                          Für Farbkorrektur und Spezialeffekte kannst du detaillierte Referenzen angeben, um genau das gewünschte Ergebnis zu erhalten.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Selected Options Summary */}
                  {selectedOptions.length > 0 && (
                    <div className="mt-6 bg-fmv-orange/5 border border-fmv-orange/20 rounded-lg p-4">
                      <h3 className="font-medium text-fmv-orange mb-2 text-sm">Ausgewählte Premium-Optionen:</h3>
                      <ul className="space-y-1">
                        {selectedOptions.map(option => {
                          const opt = upsellOptions.find(o => o.id === option);
                          return (
                            <li key={option} className="flex justify-between text-xs">
                              <span className="text-fmv-silk/80">{opt?.title}</span>
                              <span className="text-fmv-orange">CHF {opt?.price}</span>
                            </li>
                          );
                        })}
                        {selectedFormats.length > 1 && (
                          <li className="flex justify-between text-xs">
                            <span className="text-fmv-silk/80">Zusätzliche Formate ({selectedFormats.length - 1})</span>
                            <span className="text-fmv-orange">CHF {getAdditionalFormatsCost()}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </AnimatedElement>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderUpsellPage;