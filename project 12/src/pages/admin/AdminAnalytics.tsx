import React, { useState, useEffect } from 'react';
// Removed Firebase imports
// import { collection, query, getDocs, orderBy, where, Timestamp } from 'firebase/firestore';
// import { db } from '../../firebase';
import { BarChart3, TrendingUp, DollarSign, Calendar, AlertTriangle, ShoppingBag, Users, Film, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../../lib/apiClient'; // Import apiClient

// Define interfaces for the expected API response structure
interface OrderStats {
  total: number;
  completed: number;
  pending: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface MonthlyDataPoint {
  label: string;
  orders: number;
  revenue: number;
}

interface PackageDistribution {
  spark: number;
  flash: number;
  ultra: number;
}

interface UserStats {
  total: number;
  new: number;
  returning: number;
}

interface AnalyticsData {
  orderStats: OrderStats;
  monthlyData: MonthlyDataPoint[];
  packageDistribution: PackageDistribution;
  userStats: UserStats;
}

const AdminAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  // Combined state for analytics data
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      setAnalyticsData(null); // Clear previous data
      
      try {
        // Fetch aggregated analytics data from API
        const response = await apiClient.get(`/admin/analytics?timeRange=${timeRange}`); 
        setAnalyticsData(response.data);

      } catch (err: any) {
        console.error('Error fetching analytics data:', err);
        const message = err.response?.data?.message || err.message || 'Fehler beim Laden der Analysedaten.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [timeRange]); // Re-fetch when timeRange changes

  // Format currency (keep as is)
  const formatCurrency = (amount: number) => {
    return `CHF ${amount.toFixed(2)}`;
  };

  // Destructure data for easier use in JSX, provide defaults
  const { 
    orderStats = { total: 0, completed: 0, pending: 0, totalRevenue: 0, averageOrderValue: 0 }, 
    monthlyData = [], 
    packageDistribution = { spark: 0, flash: 0, ultra: 0 }, 
    userStats = { total: 0, new: 0, returning: 0 } 
  } = analyticsData || {};

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
      ) : analyticsData ? ( // Check if data is loaded
        <>
          {/* Key Metrics - Use destructured data */}
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
          
          {/* Charts Section - Use destructured data */}
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
                    {/* Find max revenue for scaling */}
                    {(() => {
                      const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 0);
                      return monthlyData?.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="relative w-full flex justify-center group">
                            <div 
                              className="w-full bg-fmv-orange/20 rounded-t-sm hover:bg-fmv-orange/30 transition-all duration-300"
                              style={{ 
                                // Ensure height is non-negative and has a minimum value
                                height: `${Math.max(5, maxRevenue > 0 ? (data?.revenue / maxRevenue) * 200 : 0)}px` 
                              }}
                            ></div>
                            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-fmv-carbon-darker/90 text-fmv-silk text-xs px-2 py-1 rounded pointer-events-none">
                              {formatCurrency(data?.revenue)}
                            </div>
                          </div>
                          <div className="text-xs text-fmv-silk/70 mt-2">{data?.label}</div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-fmv-silk/60">Keine Daten verfügbar</p>
                </div>
              )}
            </div>
            
            {/* Package Distribution - Use destructured data */}
            <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30 p-6">
              <h2 className="text-xl font-medium text-fmv-silk mb-6 flex items-center">
                <ShoppingBag className="h-5 w-5 text-fmv-orange mr-2" />
                Paketverteilung
              </h2>
              
              <div className="space-y-6">
                {Object.entries(packageDistribution).map(([packageType, count]) => {
                  const percentage = orderStats?.total > 0 
                    ? Math.round((count / orderStats?.total) * 100) 
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
          
          {/* Additional Stats - Use destructured data */}
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
            
            {/* Customer Stats - Use destructured data */}
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
      ) : null} 
    </div>
  );
};

export default AdminAnalytics;