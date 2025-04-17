import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Filter, Search, Eye, Clock, CheckCircle, ShoppingBag, AlertTriangle, Mail, User, Calendar, DollarSign } from 'lucide-react';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import toast from 'react-hot-toast';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const [userDetails, setUserDetails] = useState<Record<string, any>>({});

  useEffect(() => {
    // Check if there's a status filter in the URL
    const urlStatus = searchParams.get('status');
    if (urlStatus) {
      if (urlStatus === 'pending') {
        setStatusFilter('in bearbeitung');
      } else if (urlStatus === 'completed') {
        setStatusFilter('abgeschlossen');
      }
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        // Create base query
        const ordersRef = collection(db, 'orders');
        console.log({ ordersRef })
        let q = query(ordersRef, orderBy('createdAt', 'desc'));

        // Apply status filter if needed
        if (urlStatus === 'pending') {
          q = query(ordersRef, where('status', '==', 'In Bearbeitung'), orderBy('createdAt', 'desc'));
        } else if (urlStatus === 'completed') {
          q = query(
            ordersRef,
            where('status', 'in', ['Abgeschlossen', 'Fertig']),
            orderBy('createdAt', 'desc')
          );
        }

        try {
          const querySnapshot = await getDocs(q);
          const ordersData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log({ ordersData })
          setOrders(ordersData);
          // Fetch user details for each order
          const userIds = [...new Set(ordersData.map(order => order.userId))];
          const usersRef = collection(db, 'users');

          const userDetailsObj: Record<string, any> = {};

          for (const userId of userIds) {
            if (userId === 'guest') {
              userDetailsObj[userId] = { displayName: 'Gast', email: 'guest@example.com' };
              continue;
            }

            try {
              const userQuery = query(usersRef, where('uid', '==', userId));
              const userSnapshot = await getDocs(userQuery);

              if (!userSnapshot.empty) {
                const userData = userSnapshot.docs[0].data();
                userDetailsObj[userId] = {
                  displayName: userData.displayName || 'Unbekannt',
                  email: userData.email || 'Keine E-Mail'
                };
              } else {
                userDetailsObj[userId] = { displayName: 'Unbekannt', email: 'Nicht gefunden' };
              }
            } catch (userError) {
              console.error(`Error fetching user ${userId}:`, userError);
              userDetailsObj[userId] = { displayName: 'Fehler', email: 'Fehler beim Laden' };
            }
          }

          setUserDetails(userDetailsObj);
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
  }, [searchParams]);

  // Format orders for display
  const formatOrders = (orders: any[]) => {
    return orders.map(order => ({
      id: order.id,
      orderId: order.orderId || `ORD-${order.id.substring(0, 5).toUpperCase()}`,
      userId: order.userId,
      userEmail: userDetails[order.userId]?.email || 'Unbekannt',
      userName: userDetails[order.userId]?.displayName || 'Unbekannt',
      type: order.packageType || 'Flash',
      status: order.status || 'In Bearbeitung',
      date: order.createdAt instanceof Timestamp
        ? new Date(order.createdAt.toDate()).toLocaleDateString('de-DE')
        : new Date().toLocaleDateString('de-DE'),
      timestamp: order.createdAt instanceof Timestamp
        ? order.createdAt.toDate()
        : new Date(),
      price: `CHF ${order.total?.toFixed(2) || '0.00'}`,
      imageCount: order.imageUrls?.length || 0
    }));
  };

  // Filter orders based on search term and status
  const filteredOrders = formatOrders(orders).filter(order => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      order.status.toLowerCase().includes(statusFilter.toLowerCase());

    const matchesPackage =
      packageFilter === 'all' ||
      order.type.toLowerCase() === packageFilter.toLowerCase();

    // Date filtering
    let matchesDate = true;
    const now = new Date();

    if (dateFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      matchesDate = order.timestamp >= today;
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = order.timestamp >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = order.timestamp >= monthAgo;
    }

    return matchesSearch && matchesStatus && matchesPackage && matchesDate;
  });

  // Handle status filter change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setStatusFilter(status);

    // Update URL params
    if (status === 'all') {
      searchParams.delete('status');
    } else if (status === 'in bearbeitung') {
      searchParams.set('status', 'pending');
    } else if (status === 'abgeschlossen' || status === 'fertig') {
      searchParams.set('status', 'completed');
    }

    setSearchParams(searchParams);
  };

  // Calculate total revenue from filtered orders
  const totalRevenue = filteredOrders.reduce((sum, order) => {
    const price = parseFloat(order.price.replace('CHF ', ''));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-900/20 to-red-900/10 p-6 rounded-lg border border-red-900/30">
        <h1 className="text-2xl font-medium text-fmv-silk mb-2">Bestellungen verwalten</h1>
        <p className="text-fmv-silk/70">Alle Bestellungen im Überblick - Bearbeiten, Hochladen und Status aktualisieren.</p>
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
      <div className="bg-fmv-carbon-darker p-4 rounded-lg shadow-md border border-fmv-carbon-light/20 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="bg-fmv-orange/20 p-2 rounded-full mr-3">
              <ShoppingBag className="h-5 w-5 text-fmv-orange" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-xs">Gefilterte Bestellungen</p>
              <p className="text-lg font-medium text-fmv-silk">{filteredOrders.length}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-green-500/20 p-2 rounded-full mr-3">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-xs">Gesamtumsatz (gefiltert)</p>
              <p className="text-lg font-medium text-fmv-silk">CHF {totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-500/20 p-2 rounded-full mr-3">
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-fmv-silk/60 text-xs">Durchschnittswert</p>
              <p className="text-lg font-medium text-fmv-silk">
                CHF {filteredOrders.length > 0 ? (totalRevenue / filteredOrders.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-fmv-carbon-darker p-4 rounded-lg shadow-md border border-fmv-carbon-light/20">
        <div className="flex flex-col gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Bestellung oder Kunde suchen..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md bg-fmv-carbon-light/10 border border-fmv-carbon-light/30 text-fmv-silk focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="pl-10 pr-4 py-2 w-full rounded-md bg-fmv-carbon-light/10 border border-fmv-carbon-light/30 text-fmv-silk focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
              >
                <option value="all">Alle Status</option>
                <option value="in bearbeitung">In Bearbeitung</option>
                <option value="abgeschlossen">Abgeschlossen</option>
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ShoppingBag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={packageFilter}
                onChange={e => setPackageFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-md bg-fmv-carbon-light/10 border border-fmv-carbon-light/30 text-fmv-silk focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
              >
                <option value="all">Alle Pakete</option>
                <option value="spark">Spark</option>
                <option value="flash">Flash</option>
                <option value="ultra">Ultra</option>
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-md bg-fmv-carbon-light/10 border border-fmv-carbon-light/30 text-fmv-silk focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
              >
                <option value="all">Alle Zeiträume</option>
                <option value="today">Heute</option>
                <option value="week">Letzte 7 Tage</option>
                <option value="month">Letzter Monat</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-fmv-orange border-t-transparent"></div>
            <p className="mt-4 text-fmv-silk/70">Bestellungen werden geladen...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
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
                    Bilder
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
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-fmv-carbon-light/5">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-fmv-orange">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk">
                      {order.userName || order.userId.substring(0, 8) + '...'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk/80">
                      {order.userEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk">
                      {order.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'Abgeschlossen' || order.status === 'Fertig'
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
                      {order.imageCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fmv-silk">
                      {order.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-fmv-orange hover:text-fmv-orange-light transition-colors inline-flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
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
              <ShoppingBag size={24} className="text-fmv-silk/40" />
            </div>
            <h3 className="text-lg font-medium text-fmv-silk mb-2">Keine Bestellungen gefunden</h3>
            <p className="text-fmv-silk/70 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Keine Bestellungen entsprechen Ihren Filterkriterien.'
                : 'Es sind noch keine Bestellungen vorhanden.'}
            </p>
          </div>
        )}
      </div>

      {/* Status Legend */}
      <div className="bg-fmv-carbon-darker p-4 rounded-lg border border-fmv-carbon-light/20">
        <h3 className="text-sm font-medium text-fmv-silk mb-3">Status-Legende:</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
            <span className="text-sm text-fmv-silk/80">In Bearbeitung: Video muss noch hochgeladen werden</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
            <span className="text-sm text-fmv-silk/80">Abgeschlossen: Video wurde hochgeladen</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;