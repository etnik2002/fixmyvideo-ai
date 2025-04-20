import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Mail, Phone, Calendar, User, AlertTriangle, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../../lib/apiClient';

// Define a more specific Customer interface based on expected API response
interface Customer {
  id: string; // Use id or _id based on API response
  uid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string; // Expect string date from API
  timestamp: string; // Expect string date from API
  orderCount: number;
  totalSpent: number;
}

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]); // Use Customer interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch customers from API endpoint
        const response = await apiClient.get('/dashboard/users'); // Use API call

        const customersData = response.data.map((user: any) => ({ // Map API response
          id: user._id || user.id, // Adjust based on API response field name
          uid: user.uid || user._id || user.id, // Use uid or fallback
          name: user.displayName || user.name || 'Unbekannt',
          email: user.email || 'Keine E-Mail',
          phone: user.phone || 'Nicht angegeben',
          // Combine address fields if they come separately from the API
          address: user.address
            ? `${user.address}, ${user.zipCode || ''} ${user.city || ''}, ${user.country || ''}`
            : 'Nicht angegeben',
          createdAt: user.createdAt
            ? new Date(user.createdAt).toLocaleDateString('de-DE') // Format date string
            : 'Unbekannt',
          timestamp: user.createdAt || new Date().toISOString(), // Store date string
          orderCount: user.orderCount || 0, // Assume API provides this
          totalSpent: user.totalSpent || 0    // Assume API provides this
        }));

        setCustomers(customersData);

      } catch (err: any) {
        console.error('Error fetching customers:', err);
        const message = err.response?.data?.message || err.message || 'Fehler beim Laden der Kunden.';
        setError(message);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search term and status
  const filteredCustomers = customers.filter(customer => { // Use customers directly
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && customer.orderCount > 0) ||
      (statusFilter === 'inactive' && customer.orderCount === 0);

    return matchesSearch && matchesStatus;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return `CHF ${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-900/20 to-red-900/10 p-6 rounded-lg border border-red-900/30">
        <h1 className="text-2xl font-medium text-fmv-silk mb-2">Kundenverwaltung</h1>
        <p className="text-fmv-silk/70">Übersicht aller Kunden und deren Bestellungen.</p>
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
            <div className="bg-indigo-500/20 p-3 rounded-full mr-4">
              <User className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">Gesamtkunden</p>
              <p className="text-2xl font-medium text-fmv-silk">{customers.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-fmv-carbon-darker p-6 rounded-lg shadow-md border border-fmv-carbon-light/20"
        >
          <div className="flex items-center">
            <div className="bg-green-500/20 p-3 rounded-full mr-4">
              <ShoppingBag className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-sm">Aktive Kunden</p>
              <p className="text-2xl font-medium text-fmv-silk">
                {customers.filter(c => c.orderCount > 0).length}
              </p>
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
              <p className="text-fmv-silk/60 text-sm">Neue Kunden (30 Tage)</p>
              <p className="text-2xl font-medium text-fmv-silk">
                {customers.filter(c => {
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return new Date(c.timestamp) >= thirtyDaysAgo; // Compare parsed date
                }).length}
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
              placeholder="Kunde suchen (Name, E-Mail, Telefon)..."
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
              <option value="all">Alle Kunden</option>
              <option value="active">Aktive Kunden</option>
              <option value="inactive">Inaktive Kunden</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-fmv-orange border-t-transparent"></div>
            <p className="mt-4 text-fmv-silk/70">Kunden werden geladen...</p>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-fmv-carbon-light/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fmv-silk/70 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fmv-silk/70 uppercase tracking-wider">
                    E-Mail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fmv-silk/70 uppercase tracking-wider">
                    Telefon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fmv-silk/70 uppercase tracking-wider">
                    Registriert am
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fmv-silk/70 uppercase tracking-wider">
                    Bestellungen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fmv-silk/70 uppercase tracking-wider">
                    Umsatz
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-fmv-silk/70 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fmv-carbon-light/10">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-fmv-carbon-light/5">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-fmv-orange">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-fmv-orange/20 rounded-full flex items-center justify-center mr-3">
                          <User size={14} className="text-fmv-orange" />
                        </div>
                        {customer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk">
                      <div className="flex items-center">
                        <Mail size={14} className="text-fmv-silk/50 mr-2" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk">
                      <div className="flex items-center">
                        <Phone size={14} className="text-fmv-silk/50 mr-2" />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk/70">
                      <div className="flex items-center">
                        <Calendar size={14} className="text-fmv-silk/50 mr-2" />
                        {customer.createdAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk">
                      <div className="flex items-center">
                        <ShoppingBag size={14} className="text-fmv-silk/50 mr-2" />
                        {customer.orderCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/orders?customer=${customer.uid}`}
                        className="text-fmv-orange hover:text-fmv-orange-light transition-colors inline-flex items-center"
                      >
                        Bestellungen
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="bg-fmv-carbon-light/5 inline-flex rounded-full p-4 mb-4">
              <User size={24} className="text-fmv-silk/40" />
            </div>
            <h3 className="text-lg font-medium text-fmv-silk mb-2">Keine Kunden gefunden</h3>
            <p className="text-fmv-silk/70 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Keine Kunden entsprechen Ihren Filterkriterien.'
                : 'Es sind noch keine Kunden vorhanden.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;