import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle, ArrowRight, ArrowUpRight, AlertTriangle, Users, DollarSign, BarChart3, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, orderBy, limit, Timestamp, getCountFromServer, getDocs as getDocsOnce } from 'firebase/firestore';
import { db } from '../../firebase';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0
  });
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageOrderValue: 0
  });
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    newUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all orders
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        
        let querySnapshot;
        try {
          querySnapshot = await getDocs(q);
          const ordersData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setOrders(ordersData);
        } catch (fetchError) {
          console.error('Error fetching orders:', fetchError);
          setError('Fehler beim Laden der Bestellungen');
          setOrders([]);
        }
        
        // Calculate stats
        try {
          // Use getCountFromServer for more efficient counting
          const allOrdersSnapshot = await getCountFromServer(collection(db, 'orders'));
          const totalOrders = allOrdersSnapshot.data().count;
          
          const pendingOrdersQuery = query(
            ordersRef,
            where('status', '==', 'In Bearbeitung')
          );
          const pendingOrdersSnapshot = await getCountFromServer(pendingOrdersQuery);
          const pendingOrders = pendingOrdersSnapshot.data().count;
          
          const completedOrdersQuery = query(
            ordersRef,
            where('status', 'in', ['Abgeschlossen', 'Fertig'])
          );
          const completedOrdersSnapshot = await getCountFromServer(completedOrdersQuery);
          const completedOrders = completedOrdersSnapshot.data().count;
          
          setStats({
            total: totalOrders,
            pending: pendingOrders,
            completed: completedOrders
          });

          // Calculate revenue statistics
          const allOrdersDataQuery = query(ordersRef);
          const allOrdersData = await getDocsOnce(allOrdersDataQuery);
          
          let totalRevenue = 0;
          let monthlyRevenue = 0;
          const currentDate = new Date();
          const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          
          allOrdersData.forEach(doc => {
            const orderData = doc.data();
            const orderAmount = orderData.total || 0;
            
            // Add to total revenue
            totalRevenue += orderAmount;
            
            // Check if order is from current month
            if (orderData.createdAt && orderData.createdAt.toDate() >= firstDayOfMonth) {
              monthlyRevenue += orderAmount;
            }
          });
          
          // Calculate average order value
          const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
          
          setRevenueStats({
            totalRevenue,
            monthlyRevenue,
            averageOrderValue
          });
          
          // Fetch user statistics
          const usersRef = collection(db, 'users');
          const usersSnapshot = await getCountFromServer(usersRef);
          const totalUsers = usersSnapshot.data().count;
          
          // Get new users (registered in the last 30 days)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const newUsersQuery = query(
            usersRef,
            where('createdAt', '>=', thirtyDaysAgo.getTime())
          );
          
          const newUsersSnapshot = await getCountFromServer(newUsersQuery);
          const newUsers = newUsersSnapshot.data().count;
          
          setUserStats({
            totalUsers,
            newUsers
          });
        } catch (statsError) {
          console.error('Error fetching stats:', statsError);
          setError('Fehler beim Laden der Statistiken');
          setStats({
            total: 0,
            pending: 0,
            completed: 0
          });
          setRevenueStats({
            totalRevenue: 0,
            monthlyRevenue: 0,
            averageOrderValue: 0
          });
          setUserStats({
            totalUsers: 0,
            newUsers: 0
          });
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Fehler beim Laden der Daten');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Format orders for display
  const formatOrders = (orders: any[]) => {
    return orders.map(order => ({
      id: order.id,
      orderId: order.orderId || `ORD-${order.id.substring(0, 5).toUpperCase()}`,
      userId: order.userId,
      userEmail: order.userEmail || 'Unbekannt',
      type: order.packageType || 'Flash',
      status: order.status || 'In Bearbeitung',
      date: order.createdAt instanceof Timestamp 
        ? new Date(order.createdAt.toDate()).toLocaleDateString('de-DE') 
        : new Date().toLocaleDateString('de-DE'),
      price: `CHF ${order.total?.toFixed(2) || '0.00'}`,
      priceNumeric: order.total || 0,
      imageCount: order.imageUrls?.length || 0
    }));
  };
  
  const formattedOrders = formatOrders(orders);

  // Format currency
  const formatCurrency = (amount: number) => {
    return `CHF ${amount.toFixed(2)}`;
  };
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-900/20 to-red-900/10 rounded-lg p-6 shadow-md border border-red-900/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-medium text-fmv-silk mb-2">
              Admin Dashboard
            </h1>
            <p className="text-fmv-silk/70">
              Verwalten Sie Bestellungen und laden Sie fertige Videos hoch.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors inline-flex items-center"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Alle Bestellungen
          </Link>
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
      
      {/* Order Stats Overview */}
      <h2 className="text-xl font-medium text-fmv-silk mb-4">Bestellungen</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
        >
          <div className="flex items-center">
            <div className="bg-fmv-orange/20 p-3 rounded-full mr-4">
              <ShoppingBag className="h-6 w-6 text-fmv-orange" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">Bestellungen gesamt</p>
              <p className="text-2xl font-medium text-fmv-silk">{stats.total}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
        >
          <div className="flex items-center">
            <div className="bg-yellow-500/20 p-3 rounded-full mr-4">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">In Bearbeitung</p>
              <p className="text-2xl font-medium text-fmv-silk">{stats.pending}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
        >
          <div className="flex items-center">
            <div className="bg-green-500/20 p-3 rounded-full mr-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">Abgeschlossen</p>
              <p className="text-2xl font-medium text-fmv-silk">{stats.completed}</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Revenue Stats */}
      <h2 className="text-xl font-medium text-fmv-silk mb-4">Umsatz</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
        >
          <div className="flex items-center">
            <div className="bg-green-500/20 p-3 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">Gesamtumsatz</p>
              <p className="text-2xl font-medium text-fmv-silk">{formatCurrency(revenueStats.totalRevenue)}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
        >
          <div className="flex items-center">
            <div className="bg-blue-500/20 p-3 rounded-full mr-4">
              <BarChart3 className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">Monatlicher Umsatz</p>
              <p className="text-2xl font-medium text-fmv-silk">{formatCurrency(revenueStats.monthlyRevenue)}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
        >
          <div className="flex items-center">
            <div className="bg-purple-500/20 p-3 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">Durchschnittl. Bestellung</p>
              <p className="text-2xl font-medium text-fmv-silk">{formatCurrency(revenueStats.averageOrderValue)}</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* User Stats */}
      <h2 className="text-xl font-medium text-fmv-silk mb-4">Kunden</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
        >
          <div className="flex items-center">
            <div className="bg-indigo-500/20 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">Gesamtkunden</p>
              <p className="text-2xl font-medium text-fmv-silk">{userStats.totalUsers}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
        >
          <div className="flex items-center">
            <div className="bg-teal-500/20 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-teal-500" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">Neue Kunden (30 Tage)</p>
              <p className="text-2xl font-medium text-fmv-silk">{userStats.newUsers}</p>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Recent Orders */}
      <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30">
        <div className="p-6 border-b border-fmv-carbon-light/10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-fmv-silk">Neueste Bestellungen</h2>
            <Link 
              to="/admin/orders"
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
                    Kunde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fmv-silk/70 uppercase tracking-wider">
                    E-Mail
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
                    Aktion
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fmv-carbon-light/10">
                {formattedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-fmv-carbon-light/5">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-fmv-orange">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk">
                      {order.userId.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk">
                      {order.userEmail || 'Nicht verfügbar'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk">
                      {order.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'Abgeschlossen' || order.status === 'Fertig'
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-fmv-orange hover:text-fmv-orange-light transition-colors"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-fmv-silk/60">
            <p className="mb-2">Keine Bestellungen vorhanden</p>
          </div>
        )}
      </div>
      
      {/* Top Customers */}
      <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30">
        <div className="p-6 border-b border-fmv-carbon-light/10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-fmv-silk">Top Kunden</h2>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-fmv-orange border-t-transparent"></div>
            <p className="mt-4 text-fmv-silk/70">Daten werden geladen...</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formattedOrders
                .reduce((acc: any[], order) => {
                  // Find if customer already exists in accumulator
                  const existingCustomer = acc.find(c => c.userId === order.userId);
                  
                  if (existingCustomer) {
                    // Update existing customer
                    existingCustomer.totalSpent += order.priceNumeric;
                    existingCustomer.orderCount += 1;
                  } else {
                    // Add new customer
                    acc.push({
                      userId: order.userId,
                      userEmail: order.userEmail || 'Unbekannt',
                      totalSpent: order.priceNumeric,
                      orderCount: 1
                    });
                  }
                  
                  return acc;
                }, [])
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 4)
                .map((customer, index) => (
                  <div key={customer.userId} className="bg-fmv-carbon-light/5 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-fmv-orange">{customer.userEmail}</h3>
                        <p className="text-sm text-fmv-silk/70">ID: {customer.userId.substring(0, 8)}...</p>
                      </div>
                      <div className="text-right">
                        <p className="text-fmv-silk font-medium">{formatCurrency(customer.totalSpent)}</p>
                        <p className="text-xs text-fmv-silk/60">{customer.orderCount} Bestellungen</p>
                      </div>
                    </div>
                  </div>
                ))
              }
              
              {formattedOrders.length === 0 && (
                <div className="col-span-2 text-center py-4 text-fmv-silk/60">
                  <p>Keine Kundendaten verfügbar</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Quick Links */}
      <div className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/30">
        <h2 className="text-xl font-medium text-fmv-silk mb-4">Schnellzugriff</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            to="/admin/orders?status=pending" 
            className="bg-fmv-carbon-light/10 hover:bg-fmv-carbon-light/20 p-4 rounded-lg flex items-center transition-colors"
          >
            <Clock className="h-5 w-5 text-yellow-500 mr-3" />
            <span>Offene Bestellungen</span>
            <ArrowRight className="ml-auto h-4 w-4 text-fmv-orange" />
          </Link>
          
          <Link 
            to="/admin/orders?status=completed" 
            className="bg-fmv-carbon-light/10 hover:bg-fmv-carbon-light/20 p-4 rounded-lg flex items-center transition-colors"
          >
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <span>Abgeschlossene Bestellungen</span>
            <ArrowRight className="ml-auto h-4 w-4 text-fmv-orange" />
          </Link>
          
          <Link 
            to="/dashboard" 
            className="bg-fmv-carbon-light/10 hover:bg-fmv-carbon-light/20 p-4 rounded-lg flex items-center transition-colors"
          >
            <ShoppingBag className="h-5 w-5 text-fmv-orange mr-3" />
            <span>Zum Kundendashboard</span>
            <ArrowRight className="ml-auto h-4 w-4 text-fmv-orange" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;