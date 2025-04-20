import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Download, Eye, Filter, Search, AlertCircle, ShoppingBag, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

// Re-define apiClient if not imported (use the same logic as in AuthContext)
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
// End apiClient re-definition

// Interface for the basic order list item
interface OrderListItem {
  _id: string; // MongoDB ID
  orderId: string; // User-friendly order ID
  status: string; // e.g., 'pending', 'processing', 'completed', 'cancelled'
  createdAt: string; // ISO Date string from backend
  // Add other fields returned by /api/orders/myorders if needed
  // Example: packageType, totalAmount
  packageType?: string; 
  totalAmount?: number;
}

// Interface for the detailed order data (including files)
interface OrderDetail extends OrderListItem {
  user: { name: string; email: string }; // Assuming populated user
  uploadedImages: { filename: string; contentType: string; data: string }[];
  processedVideo?: { filename: string; contentType: string; data: string };
  // Add any other detailed fields from GET /api/orders/:orderId
}

const DashboardOrders: React.FC = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<OrderListItem[]>([]); // Use specific type
  const [detailedOrders, setDetailedOrders] = useState<Record<string, OrderDetail>>({}); // Store detailed view data
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({}); // Loading state per order detail
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null); // Stores the orderId (user-friendly one)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch initial list of orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
          setLoading(false);
          // Maybe set an error or show a message prompting login
          setError("Bitte melden Sie sich an, um Ihre Bestellungen anzuzeigen.");
          return;
      }

      setLoading(true);
      setError(null);

      try {
        // Call the backend API to get user's orders
        const ordersData: OrderListItem[] = await apiClient.get('/orders/myorders');
        console.log({ordersData})
        setOrders(ordersData.data);

      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Fehler beim Laden der Bestellungen. Bitte versuchen Sie es später erneut.');
        setOrders([]); // Clear orders on error
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]); // Depend only on currentUser

  // Fetch full order details when expanded
  const fetchOrderDetails = useCallback(async (orderId: string) => {
      if (!currentUser || !orderId || detailedOrders[orderId]) {
          return; // Don't fetch if not logged in, no ID, or already fetched
      }

      setLoadingDetails(prev => ({ ...prev, [orderId]: true }));
      try {
          const details: OrderDetail = await apiClient.get(`/orders/${orderId}`);
          setDetailedOrders(prev => ({ ...prev, [orderId]: details }));
      } catch (err: any) {
          console.error(`Error fetching details for order ${orderId}:`, err);
          toast.error(`Details für Bestellung ${orderId} konnten nicht geladen werden.`);
          // Optionally remove the order from expanded view or show error within the row
          setExpandedOrder(null); // Close expansion on error
      } finally {
          setLoadingDetails(prev => ({ ...prev, [orderId]: false }));
      }
  }, [currentUser, detailedOrders]); // Dependencies for the fetch callback

  // Filter orders based on search term and status
  const filteredOrders = orders?.filter(order => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTermLower) ||
      (order.packageType && order.packageType.toLowerCase().includes(searchTermLower)) ||
      order.status.toLowerCase().includes(searchTermLower) ||
      order._id.toLowerCase().includes(searchTermLower);
      // Add other fields to search if needed

    const matchesStatus =
      statusFilter === 'all' ||
      order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Toggle order details expansion
  const toggleOrderDetails = useCallback((orderId: string) => {
    setExpandedOrder(prevExpanded => {
      const newExpanded = prevExpanded === orderId ? null : orderId;
      // If expanding, fetch details (if not already fetched)
      if (newExpanded && !detailedOrders[newExpanded]) {
        fetchOrderDetails(newExpanded);
      }
      return newExpanded;
    });
  }, [detailedOrders, fetchOrderDetails]); // Dependencies for toggle callback

  // Helper to format date
  const formatDate = (dateString: string | undefined): string => {
      if (!dateString) return 'N/A';
      try {
          return new Date(dateString).toLocaleDateString('de-DE', {
              day: '2-digit', month: '2-digit', year: 'numeric'
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

  // Helper to get status class
  const getStatusClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-900/20 text-green-400';
      case 'processing': return 'bg-yellow-900/20 text-yellow-400';
      case 'pending': return 'bg-blue-900/20 text-blue-400';
      case 'cancelled': return 'bg-red-900/20 text-red-400';
      default: return 'bg-gray-700 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
       {/* Header */} 
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 shadow-md">
        <h1 className="text-2xl font-semibold text-white mb-1">Meine Bestellungen</h1>
        <p className="text-gray-400">Verwalten Sie Ihre Bestellungen und laden Sie Ihre Videos herunter.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 text-red-300">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Bestellung suchen (ID, Paket, Status...)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md bg-gray-700/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div className="relative sm:w-48 flex-shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md appearance-none bg-gray-700/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            >
              <option value="all">Alle Status</option>
              <option value="completed">Abgeschlossen</option>
              <option value="processing">In Bearbeitung</option>
              <option value="pending">Ausstehend</option>
              <option value="cancelled">Storniert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-indigo-400 border-t-transparent mb-3"></div>
              <p>Bestellungen werden geladen...</p>
            </div>
          ) : orders.length === 0 && !error ? (
             <div className="p-10 text-center text-gray-500">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Keine Bestellungen gefunden</h3>
                <p className="mb-4">Sie haben noch keine Bestellungen aufgegeben.</p>
                <Link to="/bestellen" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  Jetzt erste Bestellung aufgeben
                </Link>
              </div>
          ) : filteredOrders.length === 0 && orders.length > 0 ? (
             <div className="p-10 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Keine Bestellungen entsprechen Ihren Filtern</h3>
                <p>Versuchen Sie, Ihre Suche oder Filter anzupassen.</p>
              </div>
          ) : (
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bestell-ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Paket</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Datum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Preis</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}> {/* Use MongoDB _id as key */}
                    <tr className={`hover:bg-gray-700/30 transition-colors ${expandedOrder === order.orderId ? 'bg-gray-700/30' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-400">
                        <button
                          onClick={() => toggleOrderDetails(order.orderId)}
                          className="text-left flex items-center hover:underline"
                          title="Details anzeigen/ausblenden"
                        >
                          {order.orderId}
                          <ArrowRight className={`ml-2 h-4 w-4 transition-transform transform ${expandedOrder === order.orderId ? 'rotate-90' : ''}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.packageType || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatPrice(order.totalAmount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* Add actions like view details page, reorder, etc. */}
                        <Link to={`/dashboard/bestellungen/${order.orderId}`} className="text-indigo-400 hover:text-indigo-300 mr-3" title="Details anzeigen">
                           <Eye size={18} />
                        </Link>
                        {/* Example: Download Invoice (if available) */}
                        {/* <button className="text-gray-400 hover:text-white" title="Rechnung herunterladen">
                           <FileText size={18} />
                        </button> */} 
                      </td>
                    </tr>
                    {/* Expanded Row for Details */}
                    {expandedOrder === order.orderId && (
                      <tr className="bg-gray-700/20">
                        <td colSpan={6} className="px-6 py-4">
                          {loadingDetails[order.orderId] ? (
                             <div className="text-center text-gray-400 py-4">
                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-indigo-400 border-t-transparent mb-2"></div>
                                <p>Details werden geladen...</p>
                             </div>
                          ) : detailedOrders[order.orderId] ? (
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-gray-300">Hochgeladene Dateien:</h4>
                              {detailedOrders[order.orderId].uploadedImages.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {detailedOrders[order.orderId].uploadedImages.map((img, idx) => (
                                    <img
                                      key={idx}
                                      // Display Base64 image using data URL
                                      src={`data:${img.contentType};base64,${img.data}`}
                                      alt={img.filename}
                                      title={img.filename}
                                      className="h-16 w-16 object-cover rounded border border-gray-600"
                                    />
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">Keine Bilder hochgeladen.</p>
                              )}
                              
                              {detailedOrders[order.orderId].processedVideo && (
                                  <div>
                                       <h4 className="text-sm font-semibold text-gray-300 mt-3">Fertiges Video:</h4>
                                       {/* Provide a download link for the Base64 video */}
                                       <a 
                                          href={`data:${detailedOrders[order.orderId].processedVideo?.contentType};base64,${detailedOrders[order.orderId].processedVideo?.data}`} 
                                          download={detailedOrders[order.orderId].processedVideo?.filename || 'video.mp4'}
                                          className="inline-flex items-center px-3 py-1 mt-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded transition-colors"
                                       >
                                          <Download size={14} className="mr-1" />
                                          Herunterladen ({detailedOrders[order.orderId].processedVideo?.filename})
                                       </a>
                                  </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-red-400">Details konnten nicht geladen werden.</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOrders;