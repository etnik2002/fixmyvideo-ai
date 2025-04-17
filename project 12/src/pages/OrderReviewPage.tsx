import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Image, Settings, CreditCard, Check, Info, ArrowLeft } from 'lucide-react';
import AnimatedElement from '../components/AnimatedElement';
import { createCheckoutSession } from '../lib/stripe';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const OrderReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get selected package from URL params
  const searchParams = new URLSearchParams(location.search);
  const selectedPackage = searchParams.get('package') || 'flash';
  const uploadedImagesCount = parseInt(searchParams.get('images') || '5');
  
  // Get customization options from URL or sessionStorage
  const getCustomizationData = () => {
    try {
      const data = sessionStorage.getItem('orderCustomization');
      const imageUrls = sessionStorage.getItem('uploadedImageUrls')?.split(',') || [];
      const uploadedImagesStr = sessionStorage.getItem('uploadedImages');
      const uploadedImages = uploadedImagesStr ? uploadedImagesStr.split(',').filter(Boolean) : [];
      const musicName = sessionStorage.getItem('uploadedMusic') || null;
      const musicUrl = sessionStorage.getItem('uploadedMusicUrl') || null;
      const description = sessionStorage.getItem('uploadDescription') || '';
      
      if (data) {
        const parsedData = JSON.parse(data);
        return {
          ...parsedData,
          uploadedImages,
          imageUrls,
          musicName,
          musicUrl,
          description,
          textOverlays: parsedData.textOverlays || 1,
          hasOwnMusic: !!musicName
        };
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
      textOverlays: 1,
      uploadedImages: [],
      imageUrls: [],
      musicName: null,
      musicUrl: null,
      description: '',
      hasOwnMusic: false
    };
  };
  
  // Get upsell options from URL or sessionStorage
  const getUpsellData = () => {
    try {
      const data = sessionStorage.getItem('orderUpsells');
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error parsing upsell data:', error);
    }
    
    // Default values if no data is found
    return {
      selectedOptions: [],
      selectedFormats: ['16:9'],
      colorReference: '',
      effectsReference: ''
    };
  };
  
  const customizationData = getCustomizationData();
  const upsellData = getUpsellData();
  
  // Package details
  const packageDetails = {
    spark: {
      title: 'Spark',
      duration: '30 Sekunden',
      price: 150,
      features: [
        'Bis zu 5 Fotos',
        'Ein Videoformat inklusive',
        'Musik aus unserer Bibliothek',
        'Bis zu 3 Texteinblendungen',
        'Lieferung in 24-48h',
        '1 Korrekturschleife',
        'HD-Qualität 1080p'
      ]
    },
    flash: {
      title: 'Flash',
      duration: '60 Sekunden',
      price: 250,
      features: [
        'Bis zu 10 Fotos',
        'Ein Videoformat inklusive',
        'Musik aus unserer Bibliothek oder eigene Musik',
        'Bis zu 6 Texteinblendungen',
        'Lieferung in 24-48h',
        '2 Korrekturschleifen',
        'HD-Qualität 1080p'
      ]
    },
    ultra: {
      title: 'Ultra',
      duration: '90 Sekunden',
      price: 350,
      features: [
        'Bis zu 20 Fotos',
        'Ein Videoformat inklusive',
        'Musik aus unserer Bibliothek oder eigene Musik',
        'Bis zu 10 Texteinblendungen',
        'Lieferung in 24-48h',
        '3 Korrekturschleifen',
        'HD-Qualität 1080p',
        'Premium-Support'
      ]
    }
  };
  
  // Get current package
  const currentPackage = packageDetails[selectedPackage as keyof typeof packageDetails];
  
  // Mock data for review
  const selectedFormat = customizationData.selectedFormat || '16:9';
  const additionalFormats = upsellData.selectedFormats.filter(f => f !== selectedFormat) || [];
  const selectedStyle = customizationData.selectedStyle || 'dynamic';
  const selectedMusic = customizationData.selectedMusic || 'upbeat';
  const selectedSpeed = customizationData.selectedSpeed || 'medium';
  const textOverlays = customizationData.textOverlays || 1;
  const uploadedImages = customizationData.uploadedImages || [];
  const imageUrls = customizationData.imageUrls || [];
  const musicName = customizationData.musicName;
  const description = customizationData.description;
  const selectedUpsellOptions = upsellData.selectedOptions || [];
  const colorReference = upsellData.colorReference || '';
  const effectsReference = upsellData.effectsReference || '';
  
  // Upsell options prices
  const upsellPrices: Record<string, number> = {
    '4k-resolution': 50,
    'additional-format': 30,
    'express-delivery': 100,
    'color-correction': 60,
    'custom-effects': 60,
    'source-files': 120
  };
  
  // Calculate upsell options total
  const upsellTotal = selectedUpsellOptions.reduce((total, option) => {
    return total + (upsellPrices[option] || 0);
  }, 0);
  
  // Calculate additional formats cost
  const formatsCost = additionalFormats.length * 30; // 30 CHF per additional format
  
  // Calculate total upsell cost
  const totalUpsellCost = upsellTotal + formatsCost;
  
  // Get upsell option name
  const getUpsellName = (optionId: string): string => {
    switch(optionId) {
      case '4k-resolution': return '4K Auflösung';
      case 'additional-format': return 'Zusätzliches Format';
      case 'express-delivery': return 'Express-Lieferung';
      case 'color-correction': return 'Farbkorrektur';
      case 'custom-effects': return 'Spezialeffekte';
      case 'source-files': return 'Quelldateien';
      default: return optionId;
    }
  };
  
  const subtotal = currentPackage.price;
  const vat = (subtotal + totalUpsellCost) * 0.081;
  const total = subtotal + totalUpsellCost + vat;
  
  // Initialize payment and redirect to Stripe Checkout
  const handleCheckout = async () => {
    if (!currentUser && !confirm('Möchten Sie als Gast fortfahren? Wir empfehlen, sich anzumelden oder zu registrieren, um Ihre Bestellungen zu verfolgen.')) {
      navigate('/auth/login', { state: location.pathname + location.search });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Save order details to sessionStorage for retrieval after payment
      sessionStorage.setItem('currentOrder', JSON.stringify({
        package: selectedPackage,
        imageUrls: imageUrls,
        musicUrl: customizationData.musicUrl,
        customization: customizationData,
        upsells: upsellData,
        total: total
      }));
      
      // Create checkout session
      const { url } = await createCheckoutSession(
        selectedPackage,
        selectedUpsellOptions,
        additionalFormats.length
      );
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error(`Fehler bei der Zahlungsinitialisierung: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
      setIsProcessing(false);
    }
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-fmv-orange/20 to-fmv-orange/30 text-fmv-orange flex items-center justify-center font-medium mb-3 border-2 border-fmv-orange/30">
                <Check size={22} />
              </div>
              <span className="text-fmv-silk/60 text-center text-xs sm:text-sm">Video anpassen</span>
            </div>
            
            {/* Step 4 */}
            <div className="flex flex-col items-center w-16 sm:w-24">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-fmv-orange to-fmv-orange-light text-white flex items-center justify-center font-medium mb-3 shadow-lg shadow-fmv-orange/20 border-2 border-fmv-orange-light/30">
                <span className="text-lg">4</span>
              </div>
              <span className="text-fmv-orange font-medium text-center text-xs sm:text-sm">Überprüfen & Bestellen</span>
            </div>
          </div>
          
          {/* Active progress bar */}
          <div className="absolute top-1/2 left-0 w-[87.5%] h-2 bg-gradient-to-r from-fmv-orange to-fmv-orange-light -translate-y-1/2 z-0 rounded-full shadow-sm shadow-fmv-orange/20"></div>
        </div>

        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <AnimatedElement animation="fade">
            <h1 className="text-3xl sm:text-4xl font-light mb-4">
              Überprüfe deine <span className="text-fmv-orange font-medium">Bestellung</span>
            </h1>
            <p className="text-fmv-silk/80">
              Bitte überprüfe deine Auswahl und fahre mit der Zahlung fort, um dein Video zu bestellen.
            </p>
          </AnimatedElement>
        </div>

        {/* Review and Payment Section */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Summary */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatedElement animation="slide-up" delay={0.1}>
                <div className="bg-gradient-to-b from-fmv-carbon-light/10 to-fmv-carbon-darker rounded-lg overflow-hidden border border-fmv-carbon-light/30 shadow-md">
                  <div className="bg-gradient-to-r from-fmv-orange/10 to-transparent px-6 pt-6 pb-4 border-b border-fmv-carbon-light/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image className="h-6 w-6 text-fmv-orange mr-2" />
                        <h2 className="text-xl font-medium">Hochgeladene Bilder ({uploadedImages.length})</h2>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {uploadedImages.length > 0 ? (
                      <div className="space-y-2">
                        {uploadedImages.map((imageName: string, index: number) => (
                          <div key={index} className="flex items-center justify-between bg-fmv-carbon-light/10 p-3 rounded-lg">
                            <span className="text-fmv-silk">{imageName}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-fmv-silk/60">
                        <p>Keine Bildnamen verfügbar</p>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-up" delay={0.2}>
                <div className="bg-gradient-to-b from-fmv-carbon-light/10 to-fmv-carbon-darker rounded-lg overflow-hidden border border-fmv-carbon-light/30 shadow-md">
                  <div className="bg-gradient-to-r from-fmv-orange/10 to-transparent px-6 pt-6 pb-4 border-b border-fmv-carbon-light/20">
                    <div className="flex items-center">
                      <Package className="h-6 w-6 text-fmv-orange mr-2" />
                      <h2 className="text-xl font-medium">Paket</h2>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-fmv-carbon-light/20">
                      <div>
                        <h3 className="font-medium text-lg">{currentPackage.title}</h3>
                        <p className="text-fmv-silk/60">{currentPackage.duration} Video</p>
                      </div>
                      <p className="text-fmv-orange font-medium text-xl">CHF {currentPackage.price}</p>
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {currentPackage.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                          <span className="text-fmv-silk/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-up" delay={0.2}>
                <div className="bg-gradient-to-b from-fmv-carbon-light/10 to-fmv-carbon-darker rounded-lg overflow-hidden border border-fmv-carbon-light/30 shadow-md">
                  <div className="bg-gradient-to-r from-fmv-orange/10 to-transparent px-6 pt-6 pb-4 border-b border-fmv-carbon-light/20">
                    <div className="flex items-center">
                      <Image className="h-6 w-6 text-fmv-orange mr-2" />
                      <h2 className="text-xl font-medium">Inhalte</h2>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                        <span className="text-fmv-silk/80">Hochgeladene Bilder</span>
                        <span className="text-fmv-silk">{uploadedImagesCount}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                        <span className="text-fmv-silk/80">Eigene Musik</span>
                        <span className="text-fmv-silk">{musicName ? musicName : 'Nein'}</span>
                      </div>
                      {description && (
                      <div className="flex justify-between items-start pb-2 border-b border-fmv-carbon-light/20">
                        <span className="text-fmv-silk/80">Beschreibung</span>
                        <span className="text-fmv-silk text-right max-w-[60%]">{description}</span>
                      </div>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-up" delay={0.3}>
                <div className="bg-gradient-to-b from-fmv-carbon-light/10 to-fmv-carbon-darker rounded-lg overflow-hidden border border-fmv-carbon-light/30 shadow-md">
                  <div className="bg-gradient-to-r from-fmv-orange/10 to-transparent px-6 pt-6 pb-4 border-b border-fmv-carbon-light/20">
                    <div className="flex items-center">
                      <Settings className="h-6 w-6 text-fmv-orange mr-2" />
                      <h2 className="text-xl font-medium">Anpassungen</h2>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                        <span className="text-fmv-silk/80">Format</span>
                        <span className="text-fmv-silk">{selectedFormat}</span>
                      </div>
                      {additionalFormats.length > 0 && (
                        <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                          <span className="text-fmv-silk/80">Zusätzliche Formate</span>
                          <span className="text-fmv-silk">{additionalFormats.join(', ')}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                        <span className="text-fmv-silk/80">Stil</span>
                        <span className="text-fmv-silk">
                          {selectedStyle === 'dynamic' ? 'Dynamisch' : 
                           selectedStyle === 'smooth' ? 'Sanft' : 
                           selectedStyle === 'minimal' ? 'Minimalistisch' : 
                           selectedStyle === 'creative' ? 'Kreativ' : selectedStyle}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                        <span className="text-fmv-silk/80">Geschwindigkeit</span>
                        <span className="text-fmv-silk">
                          {selectedSpeed === 'slow' ? 'Langsam' : 
                           selectedSpeed === 'medium' ? 'Mittel' : 
                           selectedSpeed === 'fast' ? 'Schnell' : selectedSpeed}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                        <span className="text-fmv-silk/80">Musik</span>
                        <span className="text-fmv-silk">
                          {selectedMusic === 'upbeat' ? 'Energetisch' : 
                           selectedMusic === 'relaxed' ? 'Entspannt' : 
                           selectedMusic === 'corporate' ? 'Business' : 
                           selectedMusic === 'emotional' ? 'Emotional' : 
                           selectedMusic === 'custom' ? 'Eigene Musik' : selectedMusic}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                        <span className="text-fmv-silk/80">Texteinblendungen</span> 
                        <span className="text-fmv-silk">{textOverlays}</span> 
                      </div>
                      
                      {/* Show color reference if color correction is selected */}
                      {selectedUpsellOptions.includes('color-correction') && colorReference.trim() && (
                        <div className="flex justify-between items-start pb-2 border-b border-fmv-carbon-light/20">
                          <span className="text-fmv-silk/80">Farbkorrektur-Referenz</span>
                          <span className="text-fmv-silk text-right max-w-[60%]">{colorReference}</span>
                        </div>
                      )}
                      
                      {/* Show effects reference if custom effects is selected */}
                      {selectedUpsellOptions.includes('custom-effects') && effectsReference.trim() && (
                        <div className="flex justify-between items-start pb-2 border-b border-fmv-carbon-light/20">
                          <span className="text-fmv-silk/80">Effekte-Referenz</span>
                          <span className="text-fmv-silk text-right max-w-[60%]">{effectsReference}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedElement>
            </div>
            
            {/* Right Column - Payment and Upsells */}
            <div className="lg:col-span-1 space-y-8">              
              {/* Payment Section */}
              <AnimatedElement animation="slide-up" delay={0.4}>
                <div className="bg-gradient-to-b from-fmv-carbon-light/10 to-fmv-carbon-darker rounded-lg overflow-hidden border border-fmv-carbon-light/30 shadow-lg sticky top-24">
                  <div className="bg-gradient-to-r from-fmv-orange/10 to-transparent px-6 pt-6 pb-4 border-b border-fmv-carbon-light/20">
                    <h2 className="text-xl font-medium">Zusammenfassung</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                        <span className="text-fmv-silk/80">{currentPackage.title} Paket</span>
                        <span className="text-fmv-silk">CHF {subtotal.toFixed(2)}</span>
                      </div>
                      
                      {additionalFormats.length > 0 && (
                        <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                          <span className="text-fmv-silk/80">Zusätzliche Formate ({additionalFormats.length})</span>
                          <span className="text-fmv-silk">CHF {formatsCost.toFixed(2)}</span>
                        </div>
                      )}
                      
                      {selectedUpsellOptions.length > 0 && upsellTotal > 0 && (
                        <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                          <span className="text-fmv-silk/80">Premium-Optionen</span>
                          <span className="text-fmv-silk">CHF {upsellTotal.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/20">
                        <span className="text-fmv-silk/80">MwSt. (8.1%)</span>
                        <span className="text-fmv-silk">CHF {vat.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center font-medium">
                        <span className="text-fmv-silk">Gesamtbetrag</span>
                        <span className="text-fmv-orange text-xl">CHF {total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-fmv-orange hover:bg-fmv-orange-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fmv-orange disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {isProcessing ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            Jetzt bezahlen
                          </>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => navigate(`/bestellen/upsell?package=${selectedPackage}`)}
                        className="w-full flex justify-center items-center py-2 px-4 border border-fmv-carbon-light/30 rounded-md text-fmv-silk hover:bg-fmv-carbon-light/10 transition-colors"
                        disabled={isProcessing}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Zurück zu den Optionen
                      </button>
                    </div>
                  </div>
                </div>
              </AnimatedElement>
              
              {/* Info Box */}
              <AnimatedElement animation="slide-up" delay={0.5}>
                <div className="bg-yellow-900/20 border border-yellow-900/30 rounded-lg p-4 shadow-md">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-yellow-400 text-sm">
                      Nach Abschluss der Bestellung beginnen wir sofort mit der Erstellung deines Videos.
                      Du erhältst eine Bestätigungs-E-Mail mit allen Details und kannst den Fortschritt
                      in deinem Dashboard verfolgen. Deine Referenzen für Farbkorrektur und Effekte werden berücksichtigt.
                    </p>
                  </div>
                </div>
              </AnimatedElement>
              
              {/* Selected Upsells Summary */}
              {selectedUpsellOptions.length > 0 && (
                <AnimatedElement animation="slide-up" delay={0.6} className="hidden lg:block">
                  <div className="bg-gradient-to-b from-fmv-carbon-light/10 to-fmv-carbon-darker rounded-lg overflow-hidden border border-fmv-carbon-light/30 shadow-md">
                    <div className="bg-gradient-to-r from-fmv-orange/10 to-transparent px-6 pt-6 pb-4 border-b border-fmv-carbon-light/20">
                      <h3 className="font-medium">Gewählte Premium-Optionen</h3>
                    </div>
                    <ul className="p-6 space-y-2">
                      {selectedUpsellOptions.map(option => (
                        <li key={option} className="flex justify-between items-center pb-2 border-b border-fmv-carbon-light/10">
                          <span className="text-fmv-silk/80">{getUpsellName(option)}</span>
                          <span className="text-fmv-orange">CHF {upsellPrices[option]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedElement>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReviewPage;