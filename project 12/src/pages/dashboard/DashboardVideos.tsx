import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Filter, Play, Download, MoreHorizontal, Edit, Trash2, AlertCircle } from 'lucide-react';
import { collection, query, where, getDocs, orderBy, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db, getOrderFiles } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  duration: string;
  resolution: string;
  status: string;
  formats: string[];
}

const DashboardVideos: React.FC = () => {
  const { currentUser } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [videoFiles, setVideoFiles] = useState<Record<string, string[]>>({});
  const [noVideosFound, setNoVideosFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle thumbnail errors
  const handleThumbnailError = (videoId: number) => {
    console.log(`Thumbnail error for video ${videoId}`);
    // You could set a state to track failed thumbnails and use fallbacks
  };
  
  useEffect(() => {
    const fetchVideos = async () => {
      if (!currentUser) return;
      setLoading(true);
      setError(null);
      
      try {
        // Fetch orders to show pending videos
        const ordersRef = collection(db, 'orders');
        const ordersQuery = query(
          ordersRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        try {
          const ordersSnapshot = await getDocs(ordersQuery);
          
          if (ordersSnapshot.empty) {
            setNoVideosFound(true);
            setVideos([]);
            setLoading(false);
            return;
          }
          
          // Map orders to video objects
          const orderVideos = ordersSnapshot.docs.map(doc => {
            const data = doc.data();
            const createdAt = data.createdAt instanceof Timestamp 
              ? data.createdAt.toDate() 
              : new Date();
              
            return {
              id: doc.id,
              orderId: data.orderId || `ORD-${doc.id.substring(0, 5).toUpperCase()}`, 
              title: `${data.packageType || 'Video'} ${data.status === 'In Bearbeitung' ? '(in Bearbeitung)' : ''}`,
              thumbnail: data.imageUrls && data.imageUrls.length > 0 
                ? data.imageUrls[0] 
                : 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop',
              date: createdAt.toLocaleDateString('de-DE'),
              duration: data.packageType === 'Spark' ? '30s' : data.packageType === 'Flash' ? '60s' : '90s',
              resolution: data.resolution || 'HD',
              status: data.status || 'In Bearbeitung',
              formats: []
            };
          });
          
          setVideos(orderVideos);
        } catch (ordersError) {
          console.error('Error fetching orders:', ordersError);
          setError('Fehler beim Laden der Videos. Bitte versuchen Sie es später erneut.');
          setNoVideosFound(true);
          setVideos([]);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Fehler beim Laden der Videos. Bitte versuchen Sie es später erneut.');
        setNoVideosFound(true);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [currentUser]);

  // Fetch files for a video when menu is opened
  const fetchVideoFiles = async (videoId: string, orderId?: string) => {
    try {
      if (!currentUser || !orderId) return;
      
      // Get video files using the helper function
      const { videos } = await getOrderFiles(currentUser.uid, orderId);
      
      // If we have videos, update the formats array for this video
      if (videos.length > 0) {
        // Update the video in state with the available formats
        setVideos(prevVideos => 
          prevVideos.map(video => {
            if (video.id === videoId) {
              // Extract format info from filenames or just use generic formats
              const formats = videos.map((_, index) => 
                index === 0 ? 'MP4 (HD)' : `Format ${index + 1}`
              );
              
              return {
                ...video,
                formats
              };
            }
            return video;
          })
        );
      }
    } catch (error) {
      console.error('Error fetching video files:', error);
    }
  };

  // Filter videos based on search term and status
  const filteredVideos = videos.filter(video => {
    const matchesSearch = 
      (video.title && video.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (video.id && video.id.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = 
      statusFilter === 'all' || 
      (video.status && video.status.toLowerCase() === statusFilter.toLowerCase());
      
    return matchesSearch && matchesStatus;
  });

  const toggleMenu = (videoId: string) => {
    if (activeMenu === videoId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(videoId);
      
      // Fetch files for this video
      fetchVideoFiles(videoId, video.orderId);
    }
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        !(event.target as Element).closest('.video-menu') &&
        !(event.target as Element).closest('.menu-trigger')
      ) {
        setActiveMenu(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-fmv-carbon-light/20 to-fmv-carbon-light/5 p-6 rounded-lg border border-fmv-carbon-light/30">
        <h1 className="text-2xl font-medium text-fmv-silk mb-2">Meine Videos</h1>
        <p className="text-fmv-silk/70">Alle Ihre Videos an einem Ort - Durchsuchen, Herunterladen und Verwalten.</p>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4 text-red-400 mt-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Filters and Search */}
      <div className="bg-fmv-carbon-darker p-4 rounded-lg shadow-md border border-fmv-carbon-light/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Video suchen..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md bg-fmv-carbon-light/10 border border-fmv-carbon-light/30 text-fmv-silk focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
            />
          </div>
          
          <div className="relative sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md bg-fmv-carbon-light/10 border border-fmv-carbon-light/30 text-fmv-silk focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
            >
              <option value="all">Alle Status</option>
              <option value="fertig">Fertig</option>
              <option value="in bearbeitung">In Bearbeitung</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Videos Grid */}
      <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30 p-6">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-fmv-orange border-t-transparent mb-4"></div>
            <p className="mt-4 text-fmv-silk/70">Videos werden geladen...</p>
          </div>
        ) : filteredVideos && filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <motion.div 
                key={video.id}
                whileHover={{ y: -5 }}
                onHoverStart={() => setHoveredVideo(video.id)}
                onHoverEnd={() => setHoveredVideo(null)}
                className="bg-fmv-carbon rounded-lg overflow-hidden border border-fmv-carbon-light/20 hover:border-fmv-carbon-light/40 shadow-md group"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 bg-fmv-carbon-light/20 ${
                      video.status === 'In Bearbeitung' ? 'opacity-70' : ''
                    }`}
                    onError={() => handleThumbnailError(parseInt(video.id))}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  
                  {/* Play icon on hover */}
                  <AnimatePresence>
                    {hoveredVideo === video.id && video.status !== 'In Bearbeitung' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <div className="bg-fmv-orange/90 rounded-full p-3 shadow-lg">
                          <Play size={24} className="text-white" fill="white" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Status badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      video.status === 'Abgeschlossen' || video.status === 'Fertig'
                        ? 'bg-green-900/20 text-green-400'
                        : 'bg-yellow-900/20 text-yellow-400'
                    }`}>
                      {video.status}
                    </span>
                  </div>

                  {/* Resolution badge */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-fmv-carbon-darker/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {video.resolution}
                    </span>
                  </div>
                  
                  {/* Title and duration on overlay */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex justify-between items-end">
                      <div className="max-w-[70%]">
                        <h3 className="text-white font-medium text-sm line-clamp-2">
                          {video.title}
                        </h3> 
                        <p className="text-white/70 text-xs">{video.duration}</p>
                      </div>
                      
                      {/* Action buttons */}
                      {(video.status === 'Abgeschlossen' || video.status === 'Fertig') && <div className="relative">
                        <button 
                          className="p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors menu-trigger backdrop-blur-sm active:scale-95"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(video.id);
                          }}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        
                        {/* Dropdown menu */}
                        <AnimatePresence>
                          {activeMenu === video.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="absolute bottom-full right-0 mb-2 w-56 rounded-md shadow-lg bg-fmv-carbon-darker border border-fmv-carbon-light/30 z-10 video-menu"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="py-1">
                                {video.formats.length > 0 ? (
                                  <>
                                    <div className="px-4 py-2 text-xs uppercase text-fmv-silk/50">
                                      Download Format
                                    </div>
                                    {video.formats.map((format, index) => (
                                      <button 
                                        key={index}
                                        className="flex w-full items-center px-4 py-2 text-sm text-fmv-silk hover:bg-fmv-carbon-light/10"
                                        onClick={() => toast.error('Download-Funktion noch nicht verfügbar')}
                                      >
                                        <Download size={16} className="mr-2 text-fmv-orange" />
                                        {format} Format
                                      </button>
                                    ))}
                                    <div className="border-t border-fmv-carbon-light/20 my-1"></div>
                                  </>
                                ) : (
                                  <div className="px-4 py-2 text-sm text-fmv-silk/50 italic">
                                    Video wird bearbeitet...
                                  </div>
                                )}
                                
                                <button 
                                  className="flex w-full items-center px-4 py-2 text-sm text-fmv-silk hover:bg-fmv-carbon-light/10"
                                  disabled={video.status !== 'Fertig'}
                                  onClick={() => toast.error('Bearbeiten-Funktion noch nicht verfügbar')}
                                >
                                  <Edit size={16} className="mr-2 text-fmv-orange" />
                                  Details bearbeiten
                                </button>
                                <button 
                                  className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-fmv-carbon-light/10"
                                  onClick={() => toast.error('Löschen-Funktion noch nicht verfügbar')}
                                >
                                  <Trash2 size={16} className="mr-2" />
                                  Löschen
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>}
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-fmv-silk/60 text-xs">{video.date}</span>
                    <div className="flex space-x-1">
                      {video.formats.slice(0, 3).map((format, index) => (
                        <span key={index} className="text-xs px-1.5 py-0.5 bg-fmv-carbon-light/20 rounded text-fmv-silk/70">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-fmv-carbon-light/5 inline-flex rounded-full p-4 mb-4">
              <Play size={24} className="text-fmv-silk/40" />
            </div>
            <h3 className="text-lg font-medium text-fmv-silk mb-4">Keine Videos gefunden</h3>
            <p className="text-fmv-silk/70 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Keine Videos entsprechen Ihren Filterkriterien.' 
                : 'Sie haben noch keine Videos erstellt.'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link
                to="/bestellen"
                className="fmv-primary-btn px-6 py-3 inline-flex items-center"
              >
                Erstes Video erstellen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardVideos;