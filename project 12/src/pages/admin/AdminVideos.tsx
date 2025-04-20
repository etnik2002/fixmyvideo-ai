import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Play, Download, MoreHorizontal, Edit, Trash2, AlertTriangle, Film, Eye, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../lib/apiClient';

interface Video {
  id: string;
  orderId: string;
  userId: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  date: string;
  createdAt: string;
  status: string;
  format: string;
  userEmail?: string;
  userName?: string;
}

const AdminVideos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch videos from API endpoint
        const response = await apiClient.get('/admin/videos');
        const videosData = response.data.map((video: any) => ({
          id: video._id || video.id,
          orderId: video.orderId || 'Unbekannt',
          userId: video.userId || 'Unbekannt',
          title: video.title || 'Unbenanntes Video',
          description: video.description || 'Keine Beschreibung',
          url: video.url || '',
          thumbnail: video.thumbnail || 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop',
          date: video.createdAt 
            ? new Date(video.createdAt).toLocaleDateString('de-DE')
            : new Date().toLocaleDateString('de-DE'),
          createdAt: video.createdAt || new Date().toISOString(),
          status: video.status || 'Fertig',
          format: video.format || '16:9',
          userName: video.user?.displayName || video.userName || 'Unbekannt',
          userEmail: video.user?.email || video.userEmail || 'Keine E-Mail'
        }));
          
        setVideos(videosData);
      } catch (err: any) {
        console.error('Error fetching videos:', err);
        const message = err.response?.data?.message || err.message || 'Fehler beim Laden der Videos.';
        setError(message);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, []);

  // Filter videos based on search term and filters
  const filteredVideos = videos.filter(video => {
    const matchesSearch = 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.userName && video.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (video.userEmail && video.userEmail.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = 
      statusFilter === 'all' || 
      video.status.toLowerCase() === statusFilter.toLowerCase();
      
    const matchesFormat =
      formatFilter === 'all' ||
      video.format === formatFilter;
      
    return matchesSearch && matchesStatus && matchesFormat;
  });

  // Toggle menu
  const toggleMenu = (videoId: string) => {
    if (activeMenu === videoId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(videoId);
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
      <div className="bg-gradient-to-r from-red-900/20 to-red-900/10 p-6 rounded-lg border border-red-900/30">
        <h1 className="text-2xl font-medium text-fmv-silk mb-2">Videos verwalten</h1>
        <p className="text-fmv-silk/70">Übersicht aller erstellten Videos und Verwaltung der Videodateien.</p>
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
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
        >
          <div className="flex items-center">
            <div className="bg-fmv-orange/20 p-3 rounded-full mr-4">
              <Film className="h-6 w-6 text-fmv-orange" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">Gesamt Videos</p>
              <p className="text-2xl font-medium text-fmv-silk">{videos.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
        >
          <div className="flex items-center">
            <div className="bg-blue-500/20 p-3 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">Diesen Monat</p>
              <p className="text-2xl font-medium text-fmv-silk">
                {videos.filter(video => {
                  const now = new Date();
                  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                  return new Date(video.createdAt) >= firstDayOfMonth;
                }).length}
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
        >
          <div className="flex items-center">
            <div className="bg-green-500/20 p-3 rounded-full mr-4">
              <User className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">Kunden mit Videos</p>
              <p className="text-2xl font-medium text-fmv-silk">
                {new Set(videos.map(video => video.userId)).size}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-fmv-carbon-darker p-4 rounded-lg shadow-md border border-fmv-carbon-light/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Video oder Kunde suchen..."
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
              value={formatFilter}
              onChange={e => setFormatFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md bg-fmv-carbon-light/10 border border-fmv-carbon-light/30 text-fmv-silk focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
            >
              <option value="all">Alle Formate</option>
              <option value="16:9">Landscape (16:9)</option>
              <option value="9:16">Portrait (9:16)</option>
              <option value="1:1">Square (1:1)</option>
              <option value="4:5">Instagram (4:5)</option>
              <option value="2.35:1">Cinematic (2.35:1)</option>
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
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <motion.div 
                key={video.id}
                whileHover={{ y: -5 }}
                className="bg-fmv-carbon rounded-lg overflow-hidden border border-fmv-carbon-light/20 hover:border-fmv-carbon-light/40 shadow-md group"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 bg-fmv-carbon-light/20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a 
                      href={video.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-fmv-orange/90 rounded-full p-3 transform transition-transform duration-300 hover:scale-110 active:scale-95 shadow-lg"
                    >
                      <Play className="h-6 w-6 text-white" fill="white" />
                    </a>
                  </div>
                  
                  {/* Format badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-fmv-orange/90 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                      {video.format}
                    </span>
                  </div>
                  
                  {/* Action menu */}
                  <div className="absolute top-2 right-2">
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
                          className="absolute top-full right-0 mt-2 w-56 rounded-md shadow-lg bg-fmv-carbon-darker border border-fmv-carbon-light/30 z-10 video-menu"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="py-1">
                            <a 
                              href={video.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex w-full items-center px-4 py-2 text-sm text-fmv-silk hover:bg-fmv-carbon-light/10"
                            >
                              <Eye size={16} className="mr-2 text-fmv-orange" />
                              Video ansehen
                            </a>
                            <a 
                              href={video.url} 
                              download
                              className="flex w-full items-center px-4 py-2 text-sm text-fmv-silk hover:bg-fmv-carbon-light/10"
                            >
                              <Download size={16} className="mr-2 text-fmv-orange" />
                              Herunterladen
                            </a>
                            <Link
                              to={`/admin/orders?search=${video.orderId}`}
                              className="flex w-full items-center px-4 py-2 text-sm text-fmv-silk hover:bg-fmv-carbon-light/10"
                            >
                              <Eye size={16} className="mr-2 text-fmv-orange" />
                              Bestellung ansehen
                            </Link>
                            <button 
                              className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-fmv-carbon-light/10 border-t border-fmv-carbon-light/20"
                              onClick={() => toast.error('Löschen-Funktion noch nicht verfügbar')}
                            >
                              <Trash2 size={16} className="mr-2" />
                              Löschen
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Title and info on overlay */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex justify-between items-end">
                      <div className="max-w-[70%]">
                        <h3 className="text-white font-medium text-sm line-clamp-2">
                          {video.title}
                        </h3> 
                        <p className="text-white/70 text-xs">{video.date}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-fmv-silk/60 text-xs flex items-center">
                      <User size={12} className="mr-1" />
                      {video.userName}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 bg-fmv-carbon-light/20 rounded text-fmv-silk/70">
                      {video.orderId}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-fmv-carbon-light/5 inline-flex rounded-full p-4 mb-4">
              <Film size={24} className="text-fmv-silk/40" />
            </div>
            <h3 className="text-lg font-medium text-fmv-silk mb-4">Keine Videos gefunden</h3>
            <p className="text-fmv-silk/70 mb-4">
              {searchTerm || formatFilter !== 'all'
                ? 'Keine Videos entsprechen Ihren Filterkriterien.' 
                : 'Es wurden noch keine Videos erstellt.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVideos;