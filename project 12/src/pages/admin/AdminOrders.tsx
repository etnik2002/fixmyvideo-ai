import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Filter, Search, Eye, Clock, CheckCircle, ShoppingBag, AlertTriangle, Mail, User, Calendar, DollarSign } from 'lucide-react';
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

// Interface matching the backend response for GET /api/orders (admin route)
interface AdminOrder {
  _id: string;
  orderId: string;
  user: { // Populated user details
    _id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  packageType?: string; // Optional fields based on your model/API response
  totalAmount?: number;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  imageCount?: number; // Example: Add if backend calculates this
  // Add other fields returned by the API as needed
}

// Helper to format date
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

// Helper to get status class
const getStatusClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed': return 'bg-green-900/30 text-green-400 border border-green-700/50';
    case 'processing': return 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50';
    case 'pending': return 'bg-blue-900/30 text-blue-400 border border-blue-700/50';
    case 'cancelled': return 'bg-red-900/30 text-red-400 border border-red-700/50';
    default: return 'bg-gray-700/50 text-gray-400 border border-gray-600';
  }
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Apply initial filter from URL if present
    const urlStatus = searchParams.get('status');
    if (urlStatus) {
        // Map URL param values to backend status values if needed
        const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
        if (validStatuses.includes(urlStatus)) {
             setStatusFilter(urlStatus);
        }
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all orders from the admin endpoint
        // Add filtering params here if/when backend supports them
        // e.g., apiClient.get(`/orders?status=${statusFilter}&search=${searchTerm}`)
        const ordersData: AdminOrder[] = await apiClient.get('/dashboard/admin');
        console.log({ordersData})
        setOrders(ordersData);

      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Fehler beim Laden der Bestellungen. Bitte versuchen Sie es später erneut.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // Re-fetch if URL filters change (though currently handled client-side)
  }, [searchParams]); 

  // Client-side filtering logic
  const filteredOrders = useMemo(() => {
      return orders?.recentOrders?.filter(order => {
          const searchTermLower = searchTerm.toLowerCase();
          const matchesSearch =
            order.orderId.toLowerCase().includes(searchTermLower) ||
            order.user.email.toLowerCase().includes(searchTermLower) ||
            order.user.name.toLowerCase().includes(searchTermLower) ||
            (order.packageType && order?.packageType.includes(searchTermLower));

          const matchesStatus =
            statusFilter === 'all' ||
            order.status.toLowerCase() === statusFilter.toLowerCase();

          const matchesPackage =
            packageFilter === 'all' ||
            (order.packageType && order?.packageType === packageFilter.toLowerCase());

          let matchesDate = true;
          if (dateFilter !== 'all' && order.createdAt) {
              const orderDate = new Date(order.createdAt);
              const now = new Date();
              let startDate = new Date();

              if (dateFilter === 'today') {
                  startDate.setHours(0, 0, 0, 0);
              } else if (dateFilter === 'week') {
                  startDate.setDate(now.getDate() - 7);
                  startDate.setHours(0, 0, 0, 0);
              } else if (dateFilter === 'month') {
                  startDate.setMonth(now.getMonth() - 1);
                  startDate.setHours(0, 0, 0, 0);
              }
              matchesDate = orderDate >= startDate;
          }

          return matchesSearch && matchesStatus && matchesPackage && matchesDate;
      });
  }, [orders, searchTerm, statusFilter, packageFilter, dateFilter]);

  // Handle status filter change and update URL
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setStatusFilter(status);
    // Update URL param
    if (status === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams, { replace: true }); // Use replace to avoid history clutter
  };

  // Calculate total revenue from filtered orders
  const totalRevenue = useMemo(() => {
      return filteredOrders?.reduce((sum, order) => {
          return sum + (order.totalAmount || 0);
      }, 0);
  }, [filteredOrders]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 shadow-md">
        <h1 className="text-2xl font-semibold text-white mb-1">Bestellungen verwalten</h1>
        <p className="text-gray-400">Alle Bestellungen im Überblick.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 text-red-300">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center p-3 bg-gray-700/30 rounded">
             <div className="bg-indigo-500/20 p-2 rounded-full mr-3">
               <ShoppingBag className="h-5 w-5 text-indigo-400" />
             </div>
             <div>
               <p className="text-gray-400 text-xs uppercase">Gefiltert</p>
               <p className="text-lg font-semibold text-white">{filteredOrders?.length}</p>
             </div>
           </div>
 
           <div className="flex items-center p-3 bg-gray-700/30 rounded">
             <div className="bg-green-500/20 p-2 rounded-full mr-3">
               <DollarSign className="h-5 w-5 text-green-400" />
             </div>
             <div>
               <p className="text-gray-400 text-xs uppercase">Umsatz (Gefiltert)</p>
               <p className="text-lg font-semibold text-white">{formatPrice(totalRevenue)}</p>
             </div>
           </div>
 
           <div className="flex items-center p-3 bg-gray-700/30 rounded">
             <div className="bg-blue-500/20 p-2 rounded-full mr-3">
               <DollarSign className="h-5 w-5 text-blue-400" />
             </div>
             <div>
               <p className="text-gray-400 text-xs uppercase">Durchschnitt</p>
               <p className="text-lg font-semibold text-white">
                 {formatPrice(filteredOrders?.length > 0 ? totalRevenue / filteredOrders?.length : 0)}
               </p>
             </div>
           </div>
         </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {/* Search Input */}
           <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Suche nach ID, Name, E-Mail..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md bg-gray-700/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          {/* Status Filter */}
          <div className="relative">
              <select
                value={statusFilter}
                onChange={handleStatusChange} // Use updated handler
                className="pl-4 pr-8 py-2 w-full appearance-none rounded-md bg-gray-700/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="all">Alle Status</option>
                <option value="pending">Ausstehend</option>
                <option value="processing">In Bearbeitung</option>
                <option value="completed">Abgeschlossen</option>
                <option value="cancelled">Storniert</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                 <Filter className="h-4 w-4 text-gray-400" />
              </div>
          </div>
          {/* Date Filter */}
           <div className="relative">
              <select
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="pl-4 pr-8 py-2 w-full appearance-none rounded-md bg-gray-700/50 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="all">Alle Daten</option>
                <option value="today">Heute</option>
                <option value="week">Letzte 7 Tage</option>
                <option value="month">Letzte 30 Tage</option>
              </select>
               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                 <Calendar className="h-4 w-4 text-gray-400" />
              </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-indigo-400 border-t-transparent mb-3"></div>
              <p>Bestellungen werden geladen...</p>
            </div>
          ) : orders.length === 0 && !error ? (
             <div className="p-10 text-center text-gray-500">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Keine Bestellungen</h3>
                <p>Es wurden noch keine Bestellungen aufgegeben.</p>
              </div>
          ) : filteredOrders.length === 0 && orders.length > 0 ? (
             <div className="p-10 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Keine Treffer</h3>
                <p>Keine Bestellungen entsprechen Ihren Filtern.</p>
              </div>
          ) : (
            <table className="w-full min-w-[800px]"> {/* Increased min-width */}
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bestell-ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Kunde</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Datum</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Betrag</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-700/30 transition-colors">
                     {/* Order ID */}
                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-400">
                         {order.orderId}
                     </td>
                     {/* Customer Info */}
                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                         <div className="font-medium">{order.user.name}</div>
                         <div className="text-xs text-gray-400">{order.user.email}</div>
                     </td>
                     {/* Status */}
                     <td className="px-4 py-3 whitespace-nowrap">
                       <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>
                         {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                       </span>
                     </td>
                     {/* Date */}
                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{formatDate(order.createdAt)}</td>
                     {/* Amount */}
                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{formatPrice(order.totalAmount)}</td>
                     {/* Actions */}
                     <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                       <Link to={`/admin/bestellungen/${order.orderId}`} className="text-indigo-400 hover:text-indigo-300 p-1 rounded hover:bg-indigo-500/10" title="Details anzeigen">
                         <Eye size={18} />
                       </Link>
                       {/* Add other actions like Edit Status, etc. */}
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;