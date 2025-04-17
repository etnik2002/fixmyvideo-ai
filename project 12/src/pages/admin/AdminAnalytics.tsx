import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart3, TrendingUp, DollarSign, Calendar, AlertTriangle, ShoppingBag, Users, Film, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  // Analytics data
  const [orderStats, setOrderStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });
  
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [packageDistribution, setPackageDistribution] = useState<Record<string, number>>({
    spark: 0,
    flash: 0,
    ultra: 0
  });
  
  const [userStats, setUserStats] = useState({
    total: 0,
    new: 0,
    returning: 0
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch orders
        const ordersRef = collection(db, 'orders');
        const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'));
        const ordersSnapshot = await getDocs(ordersQuery);
        
        if (ordersSnapshot.empty) {
          setLoading(false);
          return;
        }
        
        const orders = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Calculate order stats
        const completed = orders.filter(order => 
          order.status === 'Abgeschlossen' || order.status === 'Fertig'
        ).length;
        
        const pending = orders.filter(order => 
          order.status === 'In Bearbeitung'
        ).length;
        
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
        
        setOrderStats({
          total: orders.length,
          completed,
          pending,
          totalRevenue,
          averageOrderValue
        });
        
        // Calculate package distribution
        const packageCounts = {
          spark: 0,
          flash: 0,
          ultra: 0
        };
        
        orders.forEach(order => {
          const packageType = order.packageType?.toLowerCase() || 'flash';
          if (packageType in packageCounts) {
            packageCounts[packageType as keyof typeof packageCounts]++;
          }
        });
        
        setPackageDistribution(packageCounts);
        
        // Calculate monthly data
        const monthlyStats: Record<string, { orders: number, revenue: number }> = {};
        
        // Get date range based on selected time range
        const now = new Date();
        let startDate: Date;
        
        if (timeRange === 'week') {
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
        } else if (timeRange === 'month') {
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
        } else { // year
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
        }
        
        // Filter orders by date range
        const filteredOrders = orders.filter(order => {
          if (!order.createdAt) return false;
          const orderDate = order.createdAt instanceof Timestamp 
            ? order.createdAt.toDate() 
            : new Date(order.createdAt);
          return orderDate >= startDate;
        });
        
        // Group by month or day depending on time range
        filteredOrders.forEach(order => {
          if (!order.createdAt) return;
          
          const orderDate = order.createdAt instanceof Timestamp 
            ? order.createdAt.toDate() 
            : new Date(order.createdAt);
          
          let key: string;
          
          if (timeRange === 'week') {
            // Format as day of week
            key = orderDate.toLocaleDateString('de-DE', { weekday: 'short' });
          } else if (timeRange === 'month') {
            // Format as day of month
            key = orderDate.getDate().toString();
          } else { // year
            // Format as month
            key = orderDate.toLocaleDateString('de-DE', { month: 'short' });
          }
          
          if (!monthlyStats[key]) {
            monthlyStats[key] = { orders: 0, revenue: 0 };
          }
          
          monthlyStats[key].orders++;
          monthlyStats[key].revenue += order.total || 0;
        });
        
        // Convert to array for display
        const monthlyDataArray = Object.entries(monthlyStats).map(([label, data]) => ({
          label,
          orders: data.orders,
          revenue: data.revenue
        }));
        
        setMonthlyData(monthlyDataArray);
        
        // Fetch users
        const usersRef = collection(db, 'users');
        const usersQuery = query(usersRef);
        const usersSnapshot = await getDocs(usersQuery);
        
        const users = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Calculate user stats
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const newUsers = users.filter(user => {
          if (!user.createdAt) return false;
          const createdAt = typeof user.createdAt === 'number' 
            ? new Date(user.createdAt) 
            : user.createdAt instanceof Timestamp 
              ? user.createdAt.toDate() 
              : new Date();
          return createdAt >= thirtyDaysAgo;
        }).length;
        
        // Get unique user IDs from orders to determine returning customers
        const uniqueCustomerIds = new Set(orders.map(order => order.userId));
        
        setUserStats({
          total: users.length,
          new: newUsers,
          returning: uniqueCustomerIds.size
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError('Fehler beim Laden der Analysedaten. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [timeRange]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return `CHF ${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-900/20 to-red-900/10 p-6 rounded-lg border border-red-900/30">
        <h1 className="text-2xl font-medium text-fmv-silk mb-2">Analysen & Statistiken</h1>
        <p className="text-fmv-silk/70">Übersicht über Bestellungen, Umsatz und Kundenaktivitäten.</p>
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
      
      {/* Time Range Selector */}
      <div className="bg-fmv-carbon-darker p-4 rounded-lg shadow-md border border-fmv-carbon-light/20">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-fmv-silk">Zeitraum</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-md text-sm ${
                timeRange === 'week'
                  ? 'bg-fmv-orange text-white'
                  : 'bg-fmv-carbon-light/10 text-fmv-silk hover:bg-fmv-carbon-light/20'
              }`}
            >
              Woche
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-md text-sm ${
                timeRange === 'month'
                  ? 'bg-fmv-orange text-white'
                  : 'bg-fmv-carbon-light/10 text-fmv-silk hover:bg-fmv-carbon-light/20'
              }`}
            >
              Monat
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 rounded-md text-sm ${
                timeRange === 'year'
                  ? 'bg-fmv-orange text-white'
                  : 'bg-fmv-carbon-light/10 text-fmv-silk hover:bg-fmv-carbon-light/20'
              }`}
            >
              Jahr
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-fmv-orange border-t-transparent"></div>
          <p className="mt-4 text-fmv-silk/70">Analysedaten werden geladen...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <p className="text-2xl font-medium text-fmv-silk">{orderStats.total}</p>
                </div>
              </div>
            </motion.div>
            
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
                  <p className="text-2xl font-medium text-fmv-silk">{formatCurrency(orderStats.totalRevenue)}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
            >
              <div className="flex items-center">
                <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-fmv-silk/60 text-sm">Kunden</p>
                  <p className="text-2xl font-medium text-fmv-silk">{userStats.total}</p>
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
                  <p className="text-fmv-silk/60 text-sm">Durchschn. Bestellung</p>
                  <p className="text-2xl font-medium text-fmv-silk">{formatCurrency(orderStats.averageOrderValue)}</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30 p-6">
              <h2 className="text-xl font-medium text-fmv-silk mb-6 flex items-center">
                <BarChart3 className="h-5 w-5 text-fmv-orange mr-2" />
                Umsatz nach {timeRange === 'week' ? 'Wochentag' : timeRange === 'month' ? 'Tag' : 'Monat'}
              </h2>
              
              {monthlyData.length > 0 ? (
                <div className="h-64">
                  <div className="flex h-full items-end space-x-2">
                    {monthlyData.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="relative w-full flex justify-center group">
                          <div 
                            className="w-full bg-fmv-orange/20 rounded-t-sm hover:bg-fmv-orange/30 transition-all duration-300"
                            style={{ 
                              height: `${Math.max(5, (data.revenue / Math.max(...monthlyData.map(d => d.revenue))) * 200)}px` 
                            }}
                          ></div>
                          <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-fmv-carbon-darker/90 text-fmv-silk text-xs px-2 py-1 rounded pointer-events-none">
                            {formatCurrency(data.revenue)}
                          </div>
                        </div>
                        <div className="text-xs text-fmv-silk/70 mt-2">{data.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-fmv-silk/60">Keine Daten verfügbar</p>
                </div>
              )}
            </div>
            
            {/* Package Distribution */}
            <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30 p-6">
              <h2 className="text-xl font-medium text-fmv-silk mb-6 flex items-center">
                <ShoppingBag className="h-5 w-5 text-fmv-orange mr-2" />
                Paketverteilung
              </h2>
              
              <div className="space-y-6">
                {Object.entries(packageDistribution).map(([packageType, count]) => {
                  const percentage = orderStats.total > 0 
                    ? Math.round((count / orderStats.total) * 100) 
                    : 0;
                  
                  return (
                    <div key={packageType} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-fmv-silk capitalize">{packageType}</span>
                        <span className="text-fmv-silk/70 text-sm">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-fmv-carbon-light/10 rounded-full h-2.5">
                        <div 
                          className="bg-fmv-orange h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Additional Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders by Status */}
            <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30 p-6">
              <h2 className="text-xl font-medium text-fmv-silk mb-6 flex items-center">
                <ShoppingBag className="h-5 w-5 text-fmv-orange mr-2" />
                Bestellungen nach Status
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-fmv-silk">Abgeschlossen</span>
                    <span className="text-fmv-silk/70 text-sm">
                      {orderStats.completed} ({orderStats.total > 0 ? Math.round((orderStats.completed / orderStats.total) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-fmv-carbon-light/10 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{ width: `${orderStats.total > 0 ? (orderStats.completed / orderStats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-fmv-silk">In Bearbeitung</span>
                    <span className="text-fmv-silk/70 text-sm">
                      {orderStats.pending} ({orderStats.total > 0 ? Math.round((orderStats.pending / orderStats.total) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-fmv-carbon-light/10 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-500 h-2.5 rounded-full"
                      style={{ width: `${orderStats.total > 0 ? (orderStats.pending / orderStats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Customer Stats */}
            <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30 p-6">
              <h2 className="text-xl font-medium text-fmv-silk mb-6 flex items-center">
                <Users className="h-5 w-5 text-fmv-orange mr-2" />
                Kundenstatistiken
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-fmv-carbon-light/5 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-fmv-silk font-medium">Neue Kunden</h3>
                  </div>
                  <p className="text-2xl font-medium text-fmv-silk">{userStats.new}</p>
                  <p className="text-xs text-fmv-silk/60">Letzte 30 Tage</p>
                </div>
                
                <div className="bg-fmv-carbon-light/5 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="text-fmv-silk font-medium">Wiederkehrend</h3>
                  </div>
                  <p className="text-2xl font-medium text-fmv-silk">{userStats.returning}</p>
                  <p className="text-xs text-fmv-silk/60">Kunden mit Bestellungen</p>
                </div>
                
                <div className="bg-fmv-carbon-light/5 p-4 rounded-lg col-span-2">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 text-fmv-orange mr-2" />
                    <h3 className="text-fmv-silk font-medium">Durchschnittlicher Kundenwert</h3>
                  </div>
                  <p className="text-2xl font-medium text-fmv-silk">
                    {formatCurrency(userStats.returning > 0 ? orderStats.totalRevenue / userStats.returning : 0)}
                  </p>
                  <p className="text-xs text-fmv-silk/60">Pro Kunde mit Bestellungen</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;