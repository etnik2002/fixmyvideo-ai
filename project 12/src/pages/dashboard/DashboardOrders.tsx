import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Download, Eye, Filter, Search, AlertCircle } from 'lucide-react';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { db, getOrderFiles } from '../../firebase';
import toast from 'react-hot-toast';

// Import ShoppingBag for the empty state
import { ShoppingBag } from 'lucide-react';

const DashboardOrders: React.FC = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderFiles, setOrderFiles] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      try {
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        try {
          const querySnapshot = await getDocs(q);
          const ordersData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Format orders for display
          const formattedOrders = ordersData.map((order) => ({
            id: order.id,
            orderId: order.orderId || `ORD-${order.id.substring(0, 5).toUpperCase()}`,
            type: order.packageType || 'Flash',
            status: order.status || 'In Bearbeitung',
            date: order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString('de-DE') : new Date().toLocaleDateString('de-DE'),
            price: `CHF ${order.total?.toFixed(2) || '0.00'}`,
            description: `${order.packageType || 'Flash'} Video-Paket`,
            hasInvoice: true,
            videos: order.videoIds || [],
            imageUrls: order.imageUrls || []
          }));
          
          setOrders(formattedOrders);
        } catch (fetchError) {
          console.error('Error fetching orders:', fetchError);
          setError('Fehler beim Laden der Bestellungen. Bitte versuchen Sie es später erneut.');
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Fehler beim Laden der Bestellungen. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser]);
  
  // Fetch files for an order when expanded
  const fetchOrderFiles = async (orderId: string, orderDocId: string) => {
    try {
      // Check if we already have files for this order
      if (orderFiles[orderDocId] && orderFiles[orderDocId].length > 0) {
        return;
      }
      
      if (!currentUser) return;
      
      // Get the order document to find the user ID and order ID
      const orderDoc = await getDoc(doc(db, 'orders', orderDocId));
      if (!orderDoc.exists()) {
        console.error('Order document not found');
        return;
      }
      
      const orderData = orderDoc.data();
      const userId = orderData.userId || currentUser.uid;
      const actualOrderId = orderData.orderId || orderId;
      
      // Get files using the helper function
      const { images } = await getOrderFiles(userId, actualOrderId);
      
      // Update state with the file URLs
      setOrderFiles(prev => ({
        ...prev,
        [orderDocId]: images
      }));
      
      // Fallback to imageUrls in the order document if no files found
      if (images.length === 0 && orderData.imageUrls && orderData.imageUrls.length > 0) {
        setOrderFiles(prev => ({
          ...prev,
          [orderDocId]: orderData.imageUrls
        }));
      }
    } catch (error) {
      console.error('Error fetching order files:', error);
    }
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.orderId && order.orderId.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = 
      statusFilter === 'all' || 
      order.status.toLowerCase() === statusFilter.toLowerCase();
      
    return matchesSearch && matchesStatus;
  });

  // Toggle order details
  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
      // Fetch files for this order
      const order = filteredOrders.find(o => o.id === orderId);
      if (order) {
        fetchOrderFiles(order.orderId, order.id);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-fmv-carbon-light/20 to-fmv-carbon-light/5 p-6 rounded-lg border border-fmv-carbon-light/30">
        <h1 className="text-2xl font-medium text-fmv-silk mb-2">Meine Bestellungen</h1>
        <p className="text-fmv-silk/70">Verwalten Sie Ihre Bestellungen und laden Sie Ihre Videos herunter.</p>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4 text-red-400">
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
              placeholder="Bestellung suchen..."
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
              <option value="abgeschlossen">Abgeschlossen</option>
              <option value="in bearbeitung">In Bearbeitung</option>
              <option value="storniert">Storniert</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Orders List */}
      <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-fmv-orange border-t-transparent"></div>
              <p className="mt-4 text-fmv-silk/70">Bestellungen werden geladen...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-fmv-carbon-light/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fmv-silk/70 uppercase tracking-wider">
                    Bestellnummer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fmv-silk/70 uppercase tracking-wider">
                    Paket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fmv-silk/70 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fmv-silk/70 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fmv-silk/70 uppercase tracking-wider">
                    Preis
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-fmv-silk/70 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fmv-carbon-light/10">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className={`hover:bg-fmv-carbon-light/5 ${expandedOrder === order.id ? 'bg-fmv-carbon-light/5' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-fmv-orange">
                        <button 
                          onClick={() => toggleOrderDetails(order.id)}
                          className="text-left flex items-center"
                        >
                          {order.orderId || order.id.substring(0, 8)}
                          <ArrowRight className={`ml-1 h-4 w-4 transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk">
                        {order.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'Abgeschlossen' 
                            ? 'bg-green-900/20 text-green-400' 
                            : order.status === 'In Bearbeitung'
                              ? 'bg-yellow-900/20 text-yellow-400'
                              : 'bg-red-900/20 text-red-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk/70">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk">
                        {order.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {order.hasInvoice && (
                            <button 
                              className="p-1.5 bg-fmv-carbon-light/20 hover:bg-fmv-carbon-light/30 rounded-full text-fmv-silk/80 hover:text-fmv-silk transition-colors"
                              title="Rechnung herunterladen"
                            >
                              <FileText size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => toggleOrderDetails(order.id)}
                            className={`p-1.5 ${
                              expandedOrder === order.id 
                                ? 'bg-fmv-orange/20 text-fmv-orange' 
                                : 'bg-fmv-carbon-light/20 hover:bg-fmv-carbon-light/30 text-fmv-silk/80 hover:text-fmv-silk'
                              } rounded-full transition-colors`}
                            title="Details anzeigen"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Order Details */}
                    {expandedOrder === order.id && (
                      <tr className="bg-fmv-carbon-light/5">
                        <td colSpan={6} className="px-6 py-4">
                          <div>
                            <h3 className="font-medium text-fmv-silk mb-2">Bestelldetails</h3>
                            <p className="text-fmv-silk/70 mb-4">{order.description}</p>
                            
                            {order.videos && order.videos.length > 0 ? (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-fmv-silk/90 mb-2">Videos:</h4>
                                <div className="space-y-2">
                                  {order.videos.map((video: any) => (
                                    <div key={video} className="flex items-center justify-between bg-fmv-carbon/40 rounded p-3">
                                      <span className="text-fmv-silk">Video {video}</span>
                                      <button 
                                        className="p-1.5 bg-fmv-orange/20 hover:bg-fmv-orange/30 rounded-full text-fmv-orange transition-colors"
                                        title="Video herunterladen"
                                      >
                                        <Download size={16} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : orderFiles[order.id] && orderFiles[order.id].length > 0 ? (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-fmv-silk/90 mb-2">Hochgeladene Bilder:</h4>
                                <div className="grid grid-cols-4 gap-2">
                                  {orderFiles[order.id].slice(0, 4).map((url: string, idx: number) => (
                                    <div key={idx} className="aspect-square rounded overflow-hidden">
                                      <img 
                                        src={url} 
                                        alt={`Bild ${idx+1}`} 
                                        className="w-full h-full object-cover" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              order.status === 'In Bearbeitung' ? (
                                <div className="bg-yellow-900/20 border border-yellow-900/30 rounded-md p-3 text-yellow-400 text-sm">
                                  Diese Bestellung wird gerade bearbeitet. Ihre Videos werden in Kürze verfügbar sein.
                                </div>
                              ) : order.status === 'Storniert' ? (
                                <div className="bg-red-900/20 border border-red-900/30 rounded-md p-3 text-red-400 text-sm">
                                  Diese Bestellung wurde storniert. Es sind keine Videos verfügbar.
                                </div>
                              ) : (
                                <div className="bg-green-900/20 border border-green-900/30 rounded-md p-3 text-green-400 text-sm">
                                  Ihre Videos werden in Kürze verfügbar sein.
                                </div>
                              )
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <div className="bg-fmv-carbon-light/5 inline-flex rounded-full p-4 mb-4">
                <ShoppingBag size={24} className="text-fmv-silk/40" />
              </div>
              <h3 className="text-lg font-medium text-fmv-silk mb-2">Keine Bestellungen gefunden</h3>
              <p className="text-fmv-silk/70 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Keine Bestellungen entsprechen Ihren Filterkriterien.' 
                  : 'Sie haben noch keine Bestellungen aufgegeben.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link
                  to="/bestellen"
                  className="fmv-primary-btn px-4 py-2 inline-flex items-center text-sm"
                >
                  Erste Bestellung aufgeben
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOrders;