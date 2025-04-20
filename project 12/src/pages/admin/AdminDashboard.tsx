import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  AlertTriangle,
  Users,
  DollarSign,
  BarChart3,
  TrendingUp,
  Eye
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

interface AdminDashboardData {
  orderStats: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
  };
  revenueStats: {
    totalRevenue: number;
    monthlyRevenue: number;
    averageOrderValue: number;
  };
  userStats: {
    totalUsers: number;
    newUsers: number;
  };
  recentOrders: {
    _id: string;
    orderId: string;
    user: { name: string; email: string };
    status: string;
    createdAt: string;
    totalAmount?: number;
  }[];
}

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

const formatCurrency = (amount: number | undefined): string => {
    if (amount === undefined || amount === null) return 'N/A';
    return `CHF ${amount.toFixed(2)}`;
}

const getStatusClass = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'completed': return 'bg-green-900/30 text-green-400';
    case 'processing': return 'bg-yellow-900/30 text-yellow-400';
    case 'pending': return 'bg-blue-900/30 text-blue-400';
    case 'cancelled': return 'bg-red-900/30 text-red-400';
    default: return 'bg-gray-700/50 text-gray-400';
  }
};

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const responseData = await apiClient.get('/dashboard/admin');
        setData(responseData);
      } catch (err: any) {
        console.error('Error fetching admin dashboard data:', err);
        setError(err.message || 'Fehler beim Laden der Dashboard-Daten');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-400 border-t-transparent"></div>
        </div>
      );
  }

  if (error) {
      return (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6 text-red-300 text-center">
           <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-400" />
           <h2 className="text-xl font-semibold mb-2">Fehler beim Laden</h2>
           <p>{error}</p>
         </div>
      );
  }

  if (!data) {
      return (
           <div className="p-10 text-center text-gray-500">
               <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-600" />
               <h3 className="text-xl font-semibold text-gray-400 mb-2">Keine Daten verfügbar</h3>
               <p>Es konnten keine Dashboard-Daten abgerufen werden.</p>
           </div>
      );
  }

  const { orderStats, revenueStats, userStats, recentOrders } = data;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 shadow-md border border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">
              Übersicht über Bestellungen, Umsatz und Benutzer.
            </p>
          </div>
          <Link
            to="/admin/bestellungen"
            className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center text-sm"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Alle Bestellungen
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-700 flex items-center"
        >
          <div className="bg-green-500/20 p-3 rounded-full mr-4">
            <DollarSign className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Gesamtumsatz</p>
            <p className="text-xl font-semibold text-white">{formatCurrency(revenueStats.totalRevenue)}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-700 flex items-center"
        >
          <div className="bg-blue-500/20 p-3 rounded-full mr-4">
             <TrendingUp className="h-6 w-6 text-blue-400" />
          </div>
          <div>
             <p className="text-gray-400 text-sm">Umsatz (Monat)</p>
             <p className="text-xl font-semibold text-white">{formatCurrency(revenueStats.monthlyRevenue)}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-700 flex items-center"
        >
           <div className="bg-indigo-500/20 p-3 rounded-full mr-4">
             <ShoppingBag className="h-6 w-6 text-indigo-400" />
           </div>
           <div>
             <p className="text-gray-400 text-sm">Bestellungen</p>
             <p className="text-xl font-semibold text-white">{orderStats.total}</p>
           </div>
        </motion.div>

         <motion.div
           whileHover={{ y: -4 }}
           className="bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-700 flex items-center"
         >
            <div className="bg-purple-500/20 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Benutzer</p>
              <p className="text-xl font-semibold text-white">{userStats.totalUsers}</p>
            </div>
         </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
           <h2 className="text-lg font-semibold text-white mb-2">Schnellzugriff</h2>
           <Link to="/admin/bestellungen?status=pending" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-yellow-600 hover:bg-gray-700/50 transition-all">
              <div className="flex justify-between items-center">
                  <div className="flex items-center">
                     <Clock className="h-5 w-5 text-yellow-400 mr-3" />
                     <span className="text-gray-200">Ausstehende Bestellungen</span>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-700/50">{orderStats.pending}</span>
              </div>
           </Link>
            <Link to="/admin/bestellungen?status=processing" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-600 hover:bg-gray-700/50 transition-all">
               <div className="flex justify-between items-center">
                  <div className="flex items-center">
                     <Clock className="h-5 w-5 text-blue-400 mr-3" />
                     <span className="text-gray-200">Bestellungen in Bearb.</span>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-900/30 text-blue-400 border border-blue-700/50">{orderStats.processing}</span>
               </div>
            </Link>
           <Link to="/admin/kunden" className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-600 hover:bg-gray-700/50 transition-all">
              <div className="flex justify-between items-center">
                  <div className="flex items-center">
                     <Users className="h-5 w-5 text-purple-400 mr-3" />
                     <span className="text-gray-200">Kunden verwalten</span>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-900/30 text-purple-400 border border-purple-700/50">{userStats.totalUsers}</span>
              </div>
           </Link>
        </div>

        <div className="lg:col-span-2 bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Letzte Bestellungen</h2>
            <Link to="/admin/bestellungen" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center">
              Alle anzeigen <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentOrders?.length > 0 ? (
               <table className="w-full min-w-[400px]">
                 <thead>
                   <tr className="border-b border-gray-700">
                     <th className="pb-2 pt-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                     <th className="pb-2 pt-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Kunde</th>
                     <th className="pb-2 pt-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Datum</th>
                     <th className="pb-2 pt-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                     <th className="pb-2 pt-1 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Aktion</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-700/50">
                   {recentOrders?.map((order) => (
                     <tr key={order._id} className="hover:bg-gray-700/30">
                       <td className="py-2.5 pr-2 whitespace-nowrap text-sm font-medium text-indigo-400">{order.orderId}</td>
                       <td className="py-2.5 pr-2 whitespace-nowrap text-sm text-gray-300" title={order?.user?.email}>{order?.user?.name}</td>
                       <td className="py-2.5 pr-2 whitespace-nowrap text-sm text-gray-400">{formatDate(order?.createdAt)}</td>
                       <td className="py-2.5 pr-2 whitespace-nowrap">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusClass(order?.status)}`}>
                             {order?.status?.charAt(0)?.toUpperCase() + order?.status?.slice(1)}
                           </span>
                       </td>
                       <td className="py-2.5 whitespace-nowrap text-right text-sm font-medium">
                         <Link to={`/admin/bestellungen/${order.orderId}`} className="text-indigo-400 hover:text-indigo-300 p-1 rounded hover:bg-indigo-500/10" title="Details anzeigen">
                            <Eye size={16} />
                         </Link>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            ) : (
              <p className="text-center text-gray-500 py-6">Keine kürzlichen Bestellungen.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;