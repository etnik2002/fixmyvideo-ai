import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Music, AlertCircle, Check } from 'lucide-react';
import AnimatedElement from '../components/AnimatedElement';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/apiClient';

interface FileWithPreview extends File {
  preview?: string;
}

const OrderUploadPage: React.FC = () => {
  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [music, setMusic] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Get selected package from URL params
  const searchParams = new URLSearchParams(location.search);
  const selectedPackage = searchParams.get('package') || 'flash';
  
  // Get max images based on package
  const getMaxImages = () => {
    switch (selectedPackage) {
      case 'spark':
        return 5;
      case 'flash':
        return 10;
      case 'ultra':
        return 20;
      default:
        return 10;
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const maxImages = getMaxImages();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (images.length + imageFiles.length > maxImages) {
        toast.error(`Sie können maximal ${maxImages} Bilder hochladen`);
        return;
      }
      
      const newImages = imageFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }));
            
      setImages(prev => [...prev, ...newImages]);
    }
  }, [images, getMaxImages]);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const maxImages = getMaxImages();
    
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      
      if (images.length + files.length > maxImages) {
        toast.error(`Sie können maximal ${maxImages} Bilder hochladen`);
        return;
      }
      
      const newImages = files.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }));
      
      setImages(prev => [...prev, ...newImages]);
    }
  }, [images, getMaxImages]);

  const handleMusicSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMusic(e.target.files[0]);
    }
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview!);
      newImages.splice(index, 1);
      return newImages;
    });
  }, []);

  const removeMusic = useCallback(() => {
    setMusic(null);
  }, []);

  // Helper function to convert a file to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const commaIndex = base64String.indexOf(',');
        if (commaIndex !== -1) {
          base64String = base64String.substring(commaIndex + 1);
        }
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Save upload data and navigate to next step
  const saveAndContinue = async () => {
    if (!currentUser) {
      toast.error('Bitte melden Sie sich an, um Dateien hochzuladen');
      navigate('/auth/login', { state: location.pathname + location.search });
      return;
    }

    if (images.length === 0) {
      toast.error('Bitte laden Sie mindestens ein Bild hoch');
      return;
    }
    
    setIsUploading(true);
    toast.loading('Dateien werden hochgeladen...');
    
    try {
      const orderData = {
        packageType: selectedPackage,
        totalAmount: getPackagePrice(selectedPackage),
        items: [],
        description: description || undefined
      };

      const orderResponse = await apiClient.post('/orders', orderData);
      console.log({orderResponse})
      const newOrderId = orderResponse.order.orderId;
      console.log({orderResponse})
      setOrderId(newOrderId);
      
      sessionStorage.setItem('currentOrderId', newOrderId);
      
      const fileObjects = await Promise.all(
        images.map(async (file, index) => {
          const base64Data = await fileToBase64(file);
          return {
            filename: file.name,
            contentType: file.type,
            data: base64Data,
          };
        })
      );
      
      await apiClient.post(`/orders/${newOrderId}/upload`, { files: fileObjects });
      
      const imageNames = images.map(img => img.name);
      sessionStorage.setItem('uploadedImages', imageNames.join(','));
      sessionStorage.setItem('orderId', newOrderId);
      
      if (music) {
        sessionStorage.setItem('uploadedMusic', music.name);
      }
      
      // Store description
      if (description) {
        sessionStorage.setItem('uploadDescription', description);
      }
      
      // Navigate to next step
      toast.dismiss();
      toast.success('Dateien erfolgreich hochgeladen!');
      navigate(`/bestellen/customize?package=${selectedPackage}&images=${images.length}`);
    } catch (error) {
      console.error('Error saving upload data:', error);
      toast.dismiss();
      
      // Handle specific error cases
      const errorMessage = error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten';
      console.error('Upload error details:', errorMessage);
      
      if (errorMessage.includes('401') || errorMessage.includes('auth')) {
        toast.error('Bitte melden Sie sich an, um Dateien hochzuladen');
        navigate('/auth/login', { state: location.pathname + location.search });
      } else {
        toast.error('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      }
      
      setIsUploading(false);
    }
  };

  // Helper function to get package price
  const getPackagePrice = (packageType: string): number => {
    switch (packageType.toLowerCase()) {
      case 'spark':
        return 49;
      case 'flash':
        return 79;
      case 'ultra':
        return 129;
      default:
        return 79;
    }
  };

  // Cleanup previews when component unmounts
  React.useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [images]);

  // Check authentication on mount
  React.useEffect(() => {
    if (!currentUser) {
      console.log('No current user detected');
      // We'll handle this in the form submission instead of redirecting immediately
      // This allows the page to load and be viewed even without authentication
    }
  }, [currentUser, navigate, location]);

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
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-fmv-orange to-fmv-orange-light text-white flex items-center justify-center font-medium mb-3 shadow-lg shadow-fmv-orange/20 border-2 border-fmv-orange-light/30">
                <span className="text-lg">2</span>
              </div>
              <span className="text-fmv-orange font-medium text-center text-xs sm:text-sm">Inhalte hochladen</span>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center w-16 sm:w-24">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-fmv-carbon-light/20 text-fmv-silk/50 flex items-center justify-center font-medium mb-3 border-2 border-fmv-carbon-light/10">
                <span className="text-lg">3</span>
              </div>
              <span className="text-fmv-silk/50 text-center text-xs sm:text-sm">Video anpassen</span>
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
          <div className="absolute top-1/2 left-0 w-[37.5%] h-2 bg-gradient-to-r from-fmv-orange to-fmv-orange-light -translate-y-1/2 z-0 rounded-full shadow-sm shadow-fmv-orange/20"></div>
        </div>

        {/* Page Title with increased top margin */}
        <div className="text-center max-w-2xl mx-auto mt-8 mb-12">
          <AnimatedElement animation="fade">
            <h1 className="text-3xl sm:text-4xl font-light mb-4">
              Lade deine <span className="text-fmv-orange font-medium">Inhalte</span> hoch
            </h1>
            <p className="text-fmv-silk/80 mb-4">
              Wähle die Bilder aus, die du in deinem Video verwenden möchtest. Je hochwertiger 
              die Bilder, desto beeindruckender das Ergebnis.
            </p>
            <p className="text-fmv-silk/70 max-w-xl mx-auto">
              Deine Bilder werden durch unsere KI-Technologie in ein dynamisches Video verwandelt, 
              das deine Produkte, Dienstleistungen oder Erinnerungen zum Leben erweckt. 
              Ideal für Marketing, Social Media oder persönliche Momente.
            </p>
          </AnimatedElement>
        </div>

        {/* Upload Section */}
        <div className="max-w-4xl mx-auto">
          <AnimatedElement animation="slide-up" delay={0.1}>
            {/* Image Upload */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium">Bilder</h2>
                <span className="text-fmv-silk/60">
                  {images.length} von {getMaxImages()} Bildern
                </span>
              </div>
              
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-fmv-orange bg-fmv-orange/5'
                    : 'border-fmv-carbon-light/30 hover:border-fmv-orange/50 hover:bg-fmv-carbon-light/5'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleImageDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-fmv-orange mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Bilder hierher ziehen oder klicken zum Auswählen
                  </p>
                  <p className="text-fmv-silk/60">
                    JPG, PNG oder TIFF, maximal {getMaxImages()} Bilder
                  </p>
                  <p className="text-fmv-silk/60 mt-2 text-sm">
                    Für beste Ergebnisse: Hochwertige Bilder mit ähnlichem Stil und Farbschema
                  </p>
                </div>
              </div>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                  {images.map((file, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={file.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AnimatedElement>

          <AnimatedElement animation="slide-up" delay={0.2}>
            {/* Music Upload */}
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-4">Musik (optional)</h2>
              <div className="bg-fmv-carbon-darker rounded-lg p-6 border border-fmv-carbon-light/30">
                {music ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Music className="h-8 w-8 text-fmv-orange mr-3" />
                      <div>
                        <p className="font-medium">{music.name}</p>
                        <p className="text-sm text-fmv-silk/60">
                          {(music.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeMusic}
                      className="text-fmv-silk/60 hover:text-fmv-orange transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleMusicSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center justify-center py-4">
                      <Music className="h-8 w-8 text-fmv-orange mr-3" />
                      <div className="text-center">
                        <p className="font-medium mb-1">Eigene Musik hochladen</p>
                        <p className="text-sm text-fmv-silk/60">
                          MP3 oder WAV, maximal 10MB
                        </p>
                        <p className="text-sm text-fmv-silk/60 mt-2">
                          Die richtige Musik verstärkt die emotionale Wirkung deines Videos
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AnimatedElement>

         <AnimatedElement animation="slide-up" delay={0.25}>
           {/* Description Text Input */}
           <div className="mb-8">
             <h2 className="text-xl font-medium mb-4">Beschreibung</h2>
             <div className="bg-fmv-carbon-darker rounded-lg p-6 border border-fmv-carbon-light/30">
               <p className="text-fmv-silk/80 mb-4">
                 Beschreiben Sie kurz, was Ihr Video zeigen soll und welche Stimmung es vermitteln soll.
                 Dies hilft uns, Ihr Video optimal an Ihre Wünsche anzupassen.
               </p>
               <textarea
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 className="w-full bg-fmv-carbon-light/10 border border-fmv-carbon-light/30 rounded-md px-4 py-3 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50"
                 placeholder="Beispiel: Ich möchte ein Video für mein Restaurant erstellen, das die gemütliche Atmosphäre und unsere Spezialitäten zeigt. Die Stimmung sollte einladend und warm sein."
                 rows={4}
               />
             </div>
           </div>
         </AnimatedElement>

          <AnimatedElement animation="slide-up" delay={0.3}>
            {/* Info Box */}
            <div className="bg-fmv-carbon-darker rounded-lg p-6 border border-fmv-carbon-light/30 mb-12">
              <div className="flex items-start">
                <div className="bg-fmv-orange/20 p-2 rounded-full mr-3 mt-1">
                  <AlertCircle size={18} className="text-fmv-orange" />
                </div>
                <div>
                  <h3 className="text-fmv-silk font-medium mb-2">Tipps für optimale Ergebnisse</h3>
                  <ul className="text-fmv-silk/70 space-y-2 text-sm">
                    <li>• Verwende Bilder mit hoher Auflösung für beste Qualität</li>
                    <li>• Wähle Bilder mit ähnlichem Stil und Farbschema</li>
                    <li>• Vermeide Bilder mit Text - füge Text später hinzu</li>
                    <li>• Achte auf eine logische Reihenfolge der Bilder für eine zusammenhängende Geschichte</li>
                    <li>• Bei eigener Musik: Stelle sicher, dass du die Rechte besitzt</li>
                    <li>• Bilder mit klarem Fokus auf das Hauptmotiv erzeugen bessere Ergebnisse</li>
                    <li>• Eine detaillierte Beschreibung hilft uns, deine Vision besser umzusetzen</li>
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedElement>

          {/* Navigation Buttons */}
          <div className="flex justify-between max-w-4xl mx-auto">
            <button 
              onClick={() => navigate(`/bestellen?package=${selectedPackage}`)}
              className="px-6 py-2 border border-fmv-carbon-light/30 rounded-md text-fmv-silk hover:bg-fmv-carbon-light/10 transition-colors"
            >
              Zurück
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-8 py-2 bg-fmv-orange text-white rounded-md hover:bg-fmv-orange-light transition-colors ${
                images.length === 0 || isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={images.length === 0 || isUploading}
              onClick={saveAndContinue}
            >
              {isUploading ? (
                <div className="flex items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  <span>Hochladen...</span>
                </div>
              ) : (
                'Weiter'
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderUploadPage;