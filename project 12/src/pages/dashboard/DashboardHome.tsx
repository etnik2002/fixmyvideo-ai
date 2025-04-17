import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, ShoppingBag, Clock, Star, ArrowRight, ArrowUpRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, orderBy, limit, Timestamp, DocumentData } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const DashboardHome: React.FC = () => {
  const { userData, currentUser } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [userVideos, setUserVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Fetch orders from Firestore
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        
        try {
          const querySnapshot = await getDocs(q);
          const ordersData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setOrders(ordersData);
          
          // Extract videos from orders
          const extractedVideos: DocumentData[] = [];
          ordersData.forEach(order => {
            if (order.status === 'Abgeschlossen' || order.status === 'Fertig') {
              // For completed orders, create a video entry
              extractedVideos.push({
                id: order.id,
                title: `${order.packageType || 'Video'} ${order.orderId ? `(${order.orderId})` : ''}`,
                thumbnail: order.imageUrls && order.imageUrls.length > 0 
                  ? order.imageUrls[0] 
                  : 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop',
                date: order.createdAt instanceof Timestamp 
                  ? new Date(order.createdAt.toDate()).toLocaleDateString('de-DE')
                  : new Date().toLocaleDateString('de-DE'),
                status: 'Fertig'
              });
            }
          });
          
          setUserVideos(extractedVideos.slice(0, 3)); // Show up to 3 videos
        } catch (ordersError) {
          console.error('Error fetching orders:', ordersError);
          setError('Fehler beim Laden der Bestellungen');
          setOrders([]);
        }
        
        // Fetch subscription status if needed
        try {
          const subscriptionsRef = collection(db, 'subscriptions');
          const subQuery = query(
            subscriptionsRef,
            where('userId', '==', currentUser.uid),
            limit(1)
          );
          
          const subSnapshot = await getDocs(subQuery);
          if (!subSnapshot.empty) {
            setSubscription(subSnapshot.docs[0].data());
          }
        } catch (subError) {
          console.error('Error fetching subscription:', subError);
          // Non-critical error, don't set the main error state
        }
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        
        // More specific error messages based on error code
        if (error.code === 'permission-denied') {
          setError('Keine Berechtigung zum Laden der Daten. Bitte melden Sie sich erneut an.');
        } else if (error.code === 'not-found') {
          setError('Daten nicht gefunden. Bitte versuchen Sie es später erneut.');
        } else {
          setError('Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser]);

  // Format order data for display
  const formatOrders = (orders: any[]) => {
    return orders.map(order => ({
      id: order.orderId || order.id,
      type: order.packageType || 'Flash',
      status: order.status || 'In Bearbeitung',
      date: order.createdAt && order.createdAt instanceof Timestamp 
        ? new Date(order.createdAt.toDate()).toLocaleDateString('de-DE') 
        : new Date().toLocaleDateString('de-DE'),
      price: `CHF ${order.total?.toFixed(2) || '0.00'}`,
      videos: order.videoIds || []
    }));
  };
  
  // Helper to determine package type based on amount
  const getPackageType = (amount: number) => {
    const total = amount / 100;
    if (total >= 350) return 'Ultra';
    if (total >= 250) return 'Flash';
    return 'Spark';
  };
  
  // Format orders for display
  const formattedOrders = formatOrders(orders).slice(0, 2);
  
  // Calculate statistics
  const totalOrders = orders.length;
  const inProgressOrders = orders.filter(order => order.order_status !== 'completed').length;
  const totalVideos = userVideos.length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-fmv-carbon-light/20 to-fmv-carbon-light/5 rounded-lg p-6 shadow-md border border-fmv-carbon-light/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-medium text-fmv-silk mb-2">
              Willkommen, {userData?.displayName || 'im Dashboard'}!
            </h1>
            <p className="text-fmv-silk/70">
              Hier finden Sie eine Übersicht Ihrer Aktivitäten und Videos.
            </p>
          </div>
          <Link
            to="/bestellen"
            className="fmv-primary-btn px-4 py-2 mt-4 sm:mt-0 inline-flex items-center text-sm"
          >
            <Film className="mr-2 h-4 w-4" />
            Neues Video erstellen
          </Link>
        </div>
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
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
        >
          <div className="flex items-center">
            <div className="bg-fmv-orange/20 p-3 rounded-full mr-4">
              <Film className="h-6 w-6 text-fmv-orange" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">Videos</p>
              <p className="text-2xl font-medium text-fmv-silk">{totalVideos}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
        >
          <div className="flex items-center">
            <div className="bg-fmv-orange/20 p-3 rounded-full mr-4">
              <ShoppingBag className="h-6 w-6 text-fmv-orange" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">Bestellungen</p>
              <p className="text-2xl font-medium text-fmv-silk">{totalOrders}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
        >
          <div className="flex items-center">
            <div className="bg-fmv-orange/20 p-3 rounded-full mr-4">
              <Clock className="h-6 w-6 text-fmv-orange" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">In Bearbeitung</p>
              <p className="text-2xl font-medium text-fmv-silk">{inProgressOrders}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className={`p-6 rounded-lg shadow-md border ${
            'bg-fmv-carbon-darker border-fmv-carbon-light/20'
          }`}
        >
          <div className="flex items-center">
            <div className="bg-fmv-orange/20 p-3 rounded-full mr-4">
              <Star className="h-6 w-6 text-fmv-orange" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">Status</p>
              <p className="text-2xl font-medium text-fmv-silk">
                Standard
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30">
        <div className="p-6 border-b border-fmv-carbon-light/10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-fmv-silk">Letzte Bestellungen</h2>
            <Link 
              to="/dashboard/orders"
              className="text-fmv-orange hover:text-fmv-orange-light transition-colors text-sm flex items-center"
            >
              <span>Alle anzeigen</span>
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-fmv-orange border-t-transparent"></div>
            <p className="mt-4 text-fmv-silk/70">Daten werden geladen...</p>
          </div>
        ) : formattedOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-fmv-carbon-light/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fmv-silk/70 uppercase tracking-wider">
                    Bestell-ID
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
                </tr>
              </thead>
              <tbody className="divide-y divide-fmv-carbon-light/10">
                {formattedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-fmv-carbon-light/5">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-fmv-orange">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk">
                      {order.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'Abgeschlossen' 
                          ? 'bg-green-900/20 text-green-400' 
                          : 'bg-yellow-900/20 text-yellow-400'
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-fmv-silk/60">
            <p className="mb-2">Keine Bestellungen vorhanden</p>
            <Link 
              to="/bestellen" 
              className="text-fmv-orange hover:text-fmv-orange-light transition-colors inline-flex items-center"
            >
              <span>Erste Bestellung aufgeben</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
      
      {/* Recent Videos */}
      <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30">
        <div className="p-6 border-b border-fmv-carbon-light/10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-fmv-silk">Neueste Videos</h2>
            <Link 
              to="/dashboard/videos"
              className="text-fmv-orange hover:text-fmv-orange-light transition-colors text-sm flex items-center"
            >
              <span>Alle anzeigen</span>
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-fmv-orange border-t-transparent"></div>
            <p className="mt-4 text-fmv-silk/70">Videos werden geladen...</p>
          </div>
        ) : userVideos.length > 0 ? (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userVideos.map((video) => (
              <motion.div 
                key={video.id}
                whileHover={{ y: -5 }}
                className="bg-fmv-carbon rounded-lg overflow-hidden shadow-sm border border-fmv-carbon-light/20 hover:border-fmv-carbon-light/30 transition-colors"
              >
                <div className="aspect-video relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-3">
                    <p className="text-white font-medium text-sm">{video.title}</p>
                    <p className="text-white/70 text-xs">{video.date}</p>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-fmv-orange/90 text-white text-xs px-2 py-0.5 rounded-full">
                      HD
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-fmv-silk/60">
            <p className="mb-2">Keine Videos vorhanden</p>
            <Link 
              to="/bestellen" 
              className="text-fmv-orange hover:text-fmv-orange-light transition-colors inline-flex items-center"
            >
              <span>Erstes Video erstellen</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
      
      {/* Help & Support */}
      <div className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="mb-4 sm:mb-0 flex items-start">
            <div className="bg-fmv-orange/20 p-2 rounded-full mr-3 mt-1">
              <AlertCircle size={18} className="text-fmv-orange" />
            </div>
            <div>
              <h3 className="text-fmv-silk font-medium mb-1">Brauchen Sie Hilfe?</h3>
              <p className="text-fmv-silk/60 text-sm">
                Unser Support-Team steht Ihnen bei Fragen jederzeit zur Verfügung.
              </p>
            </div>
          </div>
          <Link
            to="/kontakt"
            className="fmv-outline-btn px-4 py-2 inline-flex items-center text-sm whitespace-nowrap"
          >
            Kontakt aufnehmen
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;