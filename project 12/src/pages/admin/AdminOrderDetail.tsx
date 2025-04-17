import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  Image, 
  Film, 
  CheckCircle, 
  Clock, 
  Info, 
  AlertTriangle,
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  Timestamp, 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll 
} from 'firebase/storage';
import { db, storage, getOrderFiles } from '../../firebase';
import toast from 'react-hot-toast';

const AdminOrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [customerImages, setCustomerImages] = useState<string[]>([]);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFormat, setVideoFormat] = useState('16:9');
  const [error, setError] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
        
        if (!orderSnap.exists()) {
          toast.error('Bestellung nicht gefunden');
          navigate('/admin/orders');
          return;
        }
        
        const orderData = orderSnap.data();
        setOrder({
          id: orderSnap.id,
          ...orderData
        });
        
        // Fetch customer images and completed videos
        if (orderData.userId && orderData.orderId) {
          try {
            const { images, videos } = await getOrderFiles(orderData.userId, orderData.orderId);
            setCustomerImages(images);
            setCompletedVideos(videos);
          } catch (filesError) {
            console.error('Error fetching order files:', filesError);
            setError('Fehler beim Laden der Dateien. Bitte versuchen Sie es später erneut.');
          }
        } else if (orderData.imageUrls) {
          // Fallback to imageUrls in the order document
          setCustomerImages(orderData.imageUrls);
        }
        // Fetch customer details
        if (orderData.userId && orderData.userId !== 'guest') {
          setLoadingCustomer(true);
          try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uid', '==', orderData.userId));
            const userSnapshot = await getDocs(q);
            
            if (!userSnapshot.empty) {
              setCustomerDetails(userSnapshot.docs[0].data());
            }
          } catch (customerError) {
            console.error('Error fetching customer details:', customerError);
          } finally {
            setLoadingCustomer(false);
          }
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Fehler beim Laden der Bestelldetails');
        setError('Fehler beim Laden der Bestelldetails. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, navigate]);

  // Handle video file selection
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  // Upload video file
  const uploadVideo = async () => {
    if (!videoFile || !order) return;
    
    setUploadingVideo(true);
    toast.loading('Video wird hochgeladen...');
    
    try {
      // Create reference to the video file in Firebase Storage
      const videoPath = `orders/${order.userId}/${order.orderId}/videos/${videoFormat}_${Date.now()}_${videoFile.name}`;
      const videoRef = ref(storage, videoPath);
      
      // Upload the video file
      await uploadBytes(videoRef, videoFile, {
        contentType: videoFile.type,
        customMetadata: {
          orderId: order.orderId,
          userId: order.userId,
          format: videoFormat,
          uploadedAt: new Date().toISOString()
        }
      });
      
      // Get download URL
      const downloadURL = await getDownloadURL(videoRef);
      
      // Update order status in Firestore
      await updateDoc(doc(db, 'orders', order.id), {
        status: 'Abgeschlossen',
        completedAt: serverTimestamp(),
        videoUrl: downloadURL,
        videoFormat: videoFormat
      });
      
      // Create a video document in Firestore
      await addDoc(collection(db, 'videos'), {
        orderId: order.orderId,
        userId: order.userId,
        title: `${order.packageType || 'Video'} (${order.orderId})`,
        description: `${order.packageType || 'Video'} erstellt am ${new Date().toLocaleDateString('de-DE')}`,
        url: downloadURL,
        format: videoFormat,
        createdAt: serverTimestamp(),
        status: 'Fertig'
      });
      
      // Refresh the order data
      const updatedOrderSnap = await getDoc(doc(db, 'orders', order.id));
      if (updatedOrderSnap.exists()) {
        setOrder({
          id: updatedOrderSnap.id,
          ...updatedOrderSnap.data()
        });
      }
      
      // Refresh the videos list
      const { videos } = await getOrderFiles(order.userId, order.orderId);
      setCompletedVideos(videos);
      
      // Reset the file input
      setVideoFile(null);
      
      toast.dismiss();
      toast.success('Video erfolgreich hochgeladen und Bestellung abgeschlossen');
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.dismiss();
      toast.error('Fehler beim Hochladen des Videos');
    } finally {
      setUploadingVideo(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (status: string) => {
    if (!order) return;
    
    setUpdatingStatus(true);
    
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status,
        updatedAt: serverTimestamp()
      });
      
      // Update local state
      setOrder({
        ...order,
        status
      });
      
      toast.success(`Status auf "${status}" aktualisiert`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Fehler beim Aktualisieren des Status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete a video
  const deleteVideo = async (videoUrl: string) => {
    if (!order || !window.confirm('Sind Sie sicher, dass Sie dieses Video löschen möchten?')) return;
    
    try {
      // Extract the path from the URL
      const videoPath = videoUrl.split('?')[0].split('/o/')[1];
      if (!videoPath) {
        toast.error('Ungültiger Video-Pfad');
        return;
      }
      
      // Decode the path
      const decodedPath = decodeURIComponent(videoPath);
      
      // Create a reference to the file
      const videoRef = ref(storage, decodedPath);
      
      // Delete the file
      await deleteObject(videoRef);
      
      // Update the videos list
      setCompletedVideos(prev => prev.filter(url => url !== videoUrl));
      
      // If this was the last video, update the order status
      if (completedVideos.length === 1) {
        await updateOrderStatus('In Bearbeitung');
      }
      
      toast.success('Video erfolgreich gelöscht');
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Fehler beim Löschen des Videos');
    }
  };

  // Format date
  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return 'Unbekannt';
    return new Date(timestamp.toDate()).toLocaleString('de-DE');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fmv-orange/20 border-t-fmv-orange rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-fmv-silk/80">Bestelldetails werden geladen...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-medium text-fmv-silk mb-2">Bestellung nicht gefunden</h2>
        <p className="text-fmv-silk/70 mb-6">Die angeforderte Bestellung existiert nicht oder wurde gelöscht.</p>
        <Link
          to="/admin/orders"
          className="px-4 py-2 bg-fmv-orange text-white rounded-md hover:bg-fmv-orange-light transition-colors inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/orders"
          className="text-fmv-silk/80 hover:text-fmv-orange transition-colors inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Übersicht
        </Link>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            order.status === 'Abgeschlossen' || order.status === 'Fertig'
              ? 'bg-green-900/20 text-green-400' 
              : 'bg-yellow-900/20 text-yellow-400'
          }`}>
            {order.status}
          </span>
          
          <span className="text-fmv-silk/60 text-sm">
            Bestellt am {formatDate(order.createdAt)}
          </span>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4 text-red-400">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Order Details */}
      <div className="bg-gradient-to-r from-red-900/20 to-red-900/10 rounded-lg p-6 shadow-md border border-red-900/30">
        <h1 className="text-2xl font-medium text-fmv-silk mb-4">
          Bestellung {order.orderId || order.id}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium text-fmv-silk mb-3">Bestelldetails</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-fmv-silk/70">Paket:</span>
                <span className="text-fmv-silk">{order.packageType || 'Standard'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fmv-silk/70">Kunde:</span>
                <span className="text-fmv-silk">{order.userId}</span>
              </div>
              {customerDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="text-fmv-silk/70">Name:</span>
                    <span className="text-fmv-silk">{customerDetails.displayName || 'Nicht angegeben'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fmv-silk/70">E-Mail:</span>
                    <span className="text-fmv-silk">{customerDetails.email || 'Nicht angegeben'}</span>
                  </div>
                  {customerDetails.phone && (
                    <div className="flex justify-between">
                      <span className="text-fmv-silk/70">Telefon:</span>
                      <span className="text-fmv-silk">{customerDetails.phone}</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between">
                <span className="text-fmv-silk/70">Preis:</span>
                <span className="text-fmv-orange font-medium">CHF {order.total?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fmv-silk/70">Status:</span>
                <span className={`${
                  order.status === 'Abgeschlossen' || order.status === 'Fertig'
                    ? 'text-green-400' 
                    : 'text-yellow-400'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-fmv-silk/70">Bestellt am:</span>
                <span className="text-fmv-silk">{formatDate(order.createdAt)}</span>
              </div>
              {order.completedAt && (
                <div className="flex justify-between">
                  <span className="text-fmv-silk/70">Abgeschlossen am:</span>
                  <span className="text-fmv-silk">{formatDate(order.completedAt)}</span>
                </div>
              )}
              {order.paymentIntentId && (
                <div className="flex justify-between">
                  <span className="text-fmv-silk/70">Zahlungs-ID:</span>
                  <span className="text-fmv-silk">{order.paymentIntentId}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-fmv-silk mb-3">Anpassungen</h2>
            <div className="space-y-2">
              {order.customization ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-fmv-silk/70">Format:</span>
                    <span className="text-fmv-silk">{order.customization.selectedFormat || '16:9'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fmv-silk/70">Stil:</span>
                    <span className="text-fmv-silk">{order.customization.selectedStyle || 'Dynamisch'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fmv-silk/70">Musik:</span>
                    <span className="text-fmv-silk">{order.customization.selectedMusic || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fmv-silk/70">Geschwindigkeit:</span>
                    <span className="text-fmv-silk">{order.customization.selectedSpeed || 'Mittel'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fmv-silk/70">Texteinblendungen:</span>
                    <span className="text-fmv-silk">{order.customization.textOverlays || 0}</span>
                  </div>
                </>
              ) : (
                <p className="text-fmv-silk/60 italic">Keine Anpassungsdaten verfügbar</p>
              )}
              
              {order.upsells && order.upsells.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-fmv-silk mb-2">Zusatzoptionen:</h3>
                  <ul className="list-disc list-inside text-fmv-silk/70 space-y-1">
                    {order.upsells.map((upsell: string, index: number) => (
                      <li key={index}>{upsell}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {order.description && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-fmv-silk mb-2">Kundenbeschreibung:</h3>
                  <div className="bg-fmv-carbon-light/5 p-3 rounded-md text-fmv-silk/80 text-sm">
                    {order.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Customer Images */}
      <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-fmv-silk">Kundenbilder</h2>
          <span className="text-fmv-silk/60">{customerImages.length} Bilder</span>
        </div>
        
        {customerImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {customerImages.map((imageUrl, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden border border-fmv-carbon-light/30">
                <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
                  <img 
                    src={imageUrl} 
                    alt={`Kundenbild ${index + 1}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-fmv-carbon-light/5 rounded-lg p-6 text-center">
            <Image className="h-12 w-12 text-fmv-silk/30 mx-auto mb-3" />
            <p className="text-fmv-silk/60">Keine Kundenbilder verfügbar</p>
          </div>
        )}
      </div>
      
      {/* Completed Videos */}
      <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-fmv-silk">Fertige Videos</h2>
          <span className="text-fmv-silk/60">{completedVideos.length} Videos</span>
        </div>
        
        {completedVideos.length > 0 ? (
          <div className="space-y-4">
            {completedVideos.map((videoUrl, index) => (
              <div key={index} className="flex items-center justify-between bg-fmv-carbon-light/10 p-4 rounded-lg">
                <div className="flex items-center">
                  <Film className="h-5 w-5 text-fmv-orange mr-3" />
                  <div>
                    <p className="text-fmv-silk font-medium">Video {index + 1}</p>
                    <p className="text-fmv-silk/60 text-sm truncate max-w-md">{videoUrl.split('/').pop()}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <a 
                    href={videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-fmv-orange/20 text-fmv-orange rounded-full hover:bg-fmv-orange/30 transition-colors"
                    title="Video ansehen"
                  >
                    <Eye size={18} />
                  </a>
                  <a 
                    href={videoUrl} 
                    download
                    className="p-2 bg-fmv-orange/20 text-fmv-orange rounded-full hover:bg-fmv-orange/30 transition-colors"
                    title="Video herunterladen"
                  >
                    <Download size={18} />
                  </a>
                  <button 
                    onClick={() => deleteVideo(videoUrl)}
                    className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500/30 transition-colors"
                    title="Video löschen"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-fmv-carbon-light/5 rounded-lg p-6 text-center">
            <Film className="h-12 w-12 text-fmv-silk/30 mx-auto mb-3" />
            <p className="text-fmv-silk/60">Noch keine Videos hochgeladen</p>
          </div>
        )}
      </div>
      
      {/* Upload Video Section */}
      <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30 p-6">
        <h2 className="text-xl font-medium text-fmv-silk mb-4">Video hochladen</h2>
        
        <div className="space-y-6">
          <div className="bg-fmv-carbon-light/5 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
              <div className="flex-grow">
                <label htmlFor="videoFile" className="block text-sm font-medium text-fmv-silk/80 mb-2">
                  Video-Datei auswählen
                </label>
                <input
                  type="file"
                  id="videoFile"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="block w-full text-sm text-fmv-silk file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-fmv-orange file:text-white hover:file:bg-fmv-orange-light file:cursor-pointer rounded-md focus:outline-none bg-fmv-carbon-light/10 border border-fmv-carbon-light/30"
                />
              </div>
              
              <div className="w-full md:w-48">
                <label htmlFor="videoFormat" className="block text-sm font-medium text-fmv-silk/80 mb-2">
                  Format
                </label>
                <select
                  id="videoFormat"
                  value={videoFormat}
                  onChange={(e) => setVideoFormat(e.target.value)}
                  className="block w-full rounded-md bg-fmv-carbon-light/10 border border-fmv-carbon-light/30 text-fmv-silk focus:outline-none focus:ring-1 focus:ring-fmv-orange/50 py-2 px-3"
                >
                  <option value="16:9">Landscape (16:9)</option>
                  <option value="9:16">Portrait (9:16)</option>
                  <option value="1:1">Square (1:1)</option>
                  <option value="4:5">Instagram (4:5)</option>
                  <option value="2.35:1">Cinematic (2.35:1)</option>
                </select>
              </div>
              
              <button
                onClick={uploadVideo}
                disabled={!videoFile || uploadingVideo}
                className="px-6 py-2 bg-fmv-orange text-white rounded-md hover:bg-fmv-orange-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fmv-orange disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-full md:w-auto"
              >
                {uploadingVideo ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <Upload className="mr-2 h-5 w-5" />
                )}
                Video hochladen
              </button>
            </div>
            
            {videoFile && (
              <div className="bg-fmv-orange/10 border border-fmv-orange/30 rounded-md p-3">
                <div className="flex items-center">
                  <Film className="h-5 w-5 text-fmv-orange mr-2" />
                  <div>
                    <p className="text-fmv-silk font-medium">{videoFile.name}</p>
                    <p className="text-fmv-silk/60 text-sm">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB • Format: {videoFormat}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Status Update Section */}
          <div className="bg-fmv-carbon-light/5 rounded-lg p-6">
            <h3 className="text-lg font-medium text-fmv-silk mb-3">Status aktualisieren</h3>
            <p className="text-fmv-silk/70 mb-4">
              Aktualisieren Sie den Status der Bestellung manuell. Der Status wird automatisch auf "Abgeschlossen" gesetzt, wenn ein Video hochgeladen wird.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => updateOrderStatus('In Bearbeitung')}
                disabled={order.status === 'In Bearbeitung' || updatingStatus}
                className={`px-4 py-2 rounded-md flex items-center ${
                  order.status === 'In Bearbeitung'
                    ? 'bg-yellow-500/20 text-yellow-500 cursor-not-allowed'
                    : 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
                }`}
              >
                <Clock className="mr-2 h-4 w-4" />
                In Bearbeitung
              </button>
              
              <button
                onClick={() => updateOrderStatus('Abgeschlossen')}
                disabled={order.status === 'Abgeschlossen' || updatingStatus}
                className={`px-4 py-2 rounded-md flex items-center ${
                  order.status === 'Abgeschlossen'
                    ? 'bg-green-500/20 text-green-500 cursor-not-allowed'
                    : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                }`}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Abgeschlossen
              </button>
            </div>
          </div>
          
          {/* Info Box */}
          <div className="bg-fmv-carbon-light/5 rounded-lg p-4 flex items-start">
            <Info className="h-5 w-5 text-fmv-orange mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-fmv-silk/70 text-sm">
                <span className="text-fmv-silk font-medium">Hinweis:</span> Wenn Sie ein Video hochladen, wird der Status der Bestellung automatisch auf "Abgeschlossen" gesetzt. Der Kunde wird benachrichtigt und kann das Video in seinem Dashboard ansehen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;