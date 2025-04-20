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
  Eye,
  User,
  Mail,
  Package,
  Edit
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5001/api';
const apiClient = {
  async request(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any) {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `${response.status} ${response.statusText}`);
      }
      return data;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw error;
    }
  },
  get: (endpoint: string) => apiClient.request(endpoint, 'GET'),
  post: (endpoint: string, body: any) => apiClient.request(endpoint, 'POST', body),
  put: (endpoint: string, body: any) => apiClient.request(endpoint, 'PUT', body),
  delete: (endpoint: string) => apiClient.request(endpoint, 'DELETE'),
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to read file as Base64 string'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

interface AdminOrderDetailData {
  _id: string;
  orderId: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  packageType?: string;
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
  paymentIntentId?: string;
  uploadedImages: { _id?: string; filename: string; contentType: string; data: string }[];
  processedVideo?: { _id?: string; filename: string; contentType: string; data: string };
}

const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('de-DE', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    } catch (e) {
        return 'Invalid Date';
    }
}

// Helper to format currency
const formatPrice = (amount: number | undefined): string => {
    if (amount === undefined || amount === null) return 'N/A';
    return `CHF ${amount.toFixed(2)}`;
}

const getStatusClass = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'completed': return 'bg-green-900/30 text-green-400 border border-green-700/50';
    case 'processing': return 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50';
    case 'pending': return 'bg-blue-900/30 text-blue-400 border border-blue-700/50';
    case 'cancelled': return 'bg-red-900/30 text-red-400 border border-red-700/50';
    default: return 'bg-gray-700/50 text-gray-400 border border-gray-600';
  }
};

const AdminOrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [order, setOrder] = useState<AdminOrderDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;

    setLoading(true);
    setError(null);

    try {
      const orderData: AdminOrderDetailData = await apiClient.get(`/orders/${orderId}`);
      setOrder(orderData);
      setSelectedStatus(orderData.status);

    } catch (err: any) {
      console.error('Error fetching order details:', err);
      toast.error('Fehler beim Laden der Bestelldetails');
      setError(err.message || 'Bestellung konnte nicht geladen werden.');
      if (err.message?.includes('Not Found') || err.message?.includes('404')) {
          navigate('/admin/bestellungen');
      }
    } finally {
      setLoading(false);
    }
  }, [orderId, navigate]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (!e.target.files[0].type.startsWith('video/')) {
        toast.error('Bitte wählen Sie eine gültige Videodatei.');
        return;
      }
      setVideoFile(e.target.files[0]);
    }
  };

  const uploadVideo = async () => {
    if (!videoFile || !order) return;

    setUploadingVideo(true);
    toast.loading('Video wird hochgeladen...');

    try {
      const base64Data = await fileToBase64(videoFile);
      const payload = {
        filename: videoFile.name,
        contentType: videoFile.type,
        data: base64Data,
      };

      await apiClient.post(`/orders/${order.orderId}/processed`, payload);

      setVideoFile(null);
      const fileInput = document.getElementById('videoUploadInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      toast.dismiss();
      toast.success('Video erfolgreich hochgeladen und Bestellung aktualisiert');

      fetchOrderDetails();

    } catch (err: any) {
      console.error('Error uploading video:', err);
      toast.dismiss();
      toast.error(err.message || 'Fehler beim Hochladen des Videos');
    } finally {
      setUploadingVideo(false);
    }
  };

  const updateOrderStatus = async () => {
    if (!order || !selectedStatus || order.status === selectedStatus) return;

    setUpdatingStatus(true);

    try {
      await apiClient.put(`/orders/${order.orderId}/status`, { status: selectedStatus });

      setOrder(prevOrder => prevOrder ? { ...prevOrder, status: selectedStatus as AdminOrderDetailData['status'] } : null);

      toast.success(`Status auf "${selectedStatus}" aktualisiert`);
    } catch (err: any) {
      console.error('Error updating order status:', err);
      toast.error(err.message || 'Fehler beim Aktualisieren des Status');
      setSelectedStatus(order.status);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fmv-orange/20 border-t-fmv-orange rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-fmv-silk/80">Bestelldetails werden geladen...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6 text-red-300 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-400" />
        <h2 className="text-xl font-semibold mb-2">Fehler beim Laden</h2>
        <p>{error || 'Bestelldetails konnten nicht gefunden werden.'}</p>
        <Link to="/admin/bestellungen" className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link 
          to="/admin/bestellungen"
          className="inline-flex items-center text-gray-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Bestellübersicht
        </Link>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">
              Bestellung: <span className="text-indigo-400">{order.orderId}</span>
            </h1>
            <p className="text-sm text-gray-400">
              Bestellt am: {formatDate(order.createdAt)} | Status:
              <span className={`ml-1 px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={updatingStatus}
              className="pl-3 pr-8 py-1.5 appearance-none rounded-md bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
            >
              <option value="pending">Ausstehend</option>
              <option value="processing">In Bearbeitung</option>
              <option value="completed">Abgeschlossen</option>
              <option value="cancelled">Storniert</option>
            </select>
            <button 
              onClick={updateOrderStatus}
              disabled={updatingStatus || order.status === selectedStatus}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center ${updatingStatus || order.status === selectedStatus ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
            >
              {updatingStatus ? <div className="animate-spin h-4 w-4 mr-1.5"/> : <Edit size={14} className="mr-1.5"/>}
              Status ändern
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
              <User className="mr-2 h-5 w-5 text-indigo-400"/> Kundendetails
            </h2>
            <div className="text-sm space-y-1.5">
              <p className="text-gray-300"><span className="font-medium text-gray-400 w-20 inline-block">Name:</span> {order.user.name}</p>
              <p className="text-gray-300"><span className="font-medium text-gray-400 w-20 inline-block">E-Mail:</span> {order.user.email}</p>
            </div>
          </div>

          <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Package className="mr-2 h-5 w-5 text-indigo-400"/> Bestelldetails
            </h2>
            <div className="text-sm space-y-1.5">
              <p className="text-gray-300"><span className="font-medium text-gray-400 w-24 inline-block">Paket:</span> {order.packageType || 'N/A'}</p>
              <p className="text-gray-300"><span className="font-medium text-gray-400 w-24 inline-block">Betrag:</span> {formatPrice(order.totalAmount)}</p>
              <p className="text-gray-300"><span className="font-medium text-gray-400 w-24 inline-block">Payment Intent:</span> {order.paymentIntentId || 'N/A'}</p>
              <p className="text-gray-300"><span className="font-medium text-gray-400 w-24 inline-block">Aktualisiert:</span> {formatDate(order.updatedAt)}</p>
            </div>
          </div>

          <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-4">Fertiges Video hochladen</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-grow">
                <label htmlFor="videoUploadInput" className="sr-only">Video auswählen</label>
                <input
                  id="videoUploadInput"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600/10 file:text-indigo-300 hover:file:bg-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploadingVideo}
                />
                {videoFile && <p className="text-xs text-gray-400 mt-1 truncate">Ausgewählt: {videoFile.name}</p>}
              </div>
              <button
                onClick={uploadVideo}
                disabled={!videoFile || uploadingVideo}
                className={`px-4 py-2 text-sm rounded-md transition-colors flex items-center flex-shrink-0 ${!videoFile || uploadingVideo ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
              >
                {uploadingVideo ? <div className="animate-spin h-4 w-4 mr-1.5"/> : <Upload size={16} className="mr-1.5" />}
                {uploadingVideo ? 'Wird hochgeladen...' : 'Video hochladen'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Film className="mr-2 h-5 w-5 text-green-400"/> Fertiges Video
            </h2>
            {order.processedVideo ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-300 truncate" title={order.processedVideo.filename}>{order.processedVideo.filename}</p>
                <div className="flex items-center gap-2">
                  <a 
                    href={`data:${order.processedVideo.contentType};base64,${order.processedVideo.data}`} 
                    download={order.processedVideo.filename || 'video.mp4'}
                    className="inline-flex items-center px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded transition-colors"
                  >
                    <Download size={14} className="mr-1" /> Herunterladen
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Noch kein fertiges Video hochgeladen.</p>
            )}
          </div>

          <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Image className="mr-2 h-5 w-5 text-blue-400"/> Kundenbilder
            </h2>
            {order.uploadedImages && order.uploadedImages.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {order.uploadedImages.map((img, idx) => (
                  <a key={img._id || idx} href={`data:${img.contentType};base64,${img.data}`} download={img.filename} title={`Download ${img.filename}`} target="_blank" rel="noopener noreferrer" className="block relative group aspect-square rounded overflow-hidden border border-gray-600 hover:border-indigo-500 transition-colors">
                    <img
                      src={`data:${img.contentType};base64,${img.data}`}
                      alt={img.filename}
                      className="w-full h-full object-cover "
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Download className="h-6 w-6 text-white"/>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Keine Bilder vom Kunden hochgeladen.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;