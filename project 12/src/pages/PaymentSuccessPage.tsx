import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext'; 
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

type VerificationStatus = 'verifying' | 'verified' | 'failed';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [error, setError] = useState<string | null>(null);
  const [verifiedOrderId, setVerifiedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const orderIdFromUrl = searchParams.get('orderId');

    if (!sessionId) {
      setError('Ungültige Sitzungs-ID für die Zahlungsüberprüfung.');
      setStatus('failed');
      toast.error('Fehlende Zahlungs-Sitzungs-ID.');
      return;
    }

    if (!orderIdFromUrl) {
      setError('Bestell-ID fehlt in der URL.');
      setStatus('failed');
      toast.error('Fehlende Bestell-ID in der URL.');
      return;
    }

    const verifyPayment = async () => {
      setStatus('verifying');
      setError(null);
      try {
        const verificationResult = await apiClient.get(`/payments/verify-payment/${sessionId}?orderId=${sessionStorage.getItem('currentOrderId')}`);
        
        // Check if backend confirmed payment and orderId matches
        if (verificationResult.status === 'paid' && verificationResult.orderId === orderIdFromUrl) {
          setStatus('verified');
          setVerifiedOrderId(verificationResult.orderId);
          toast.success('Zahlung erfolgreich bestätigt!');
          
          // Optional: Trigger backend to update order status explicitly if not done via webhook/verification endpoint
          // try {
          //   await apiClient.put(`/orders/${verificationResult.orderId}/status`, { status: 'processing' });
          // } catch (updateError) {
          //   console.warn("Failed to explicitly update order status after verification:", updateError);
          // }

        } else {
          throw new Error(verificationResult.message || 'Zahlung nicht erfolgreich oder Bestell-ID stimmt nicht überein.');
        }

      } catch (err: any) {
        console.error('Error verifying payment:', err);
        setError(err.message || 'Fehler bei der Zahlungsüberprüfung.');
        setStatus('failed');
        toast.error('Fehler bei der Zahlungsüberprüfung.');
      } finally {
          // Clear potentially sensitive session storage items regardless of success/failure
          // Keep only non-sensitive ones if needed (e.g., package type for display)
          sessionStorage.removeItem('currentOrder'); // Example - remove sensitive/unneeded items
          sessionStorage.removeItem('uploadedImages');
          sessionStorage.removeItem('uploadedImageUrls');
          sessionStorage.removeItem('currentOrderId'); 
          sessionStorage.removeItem('uploadedMusic');
          sessionStorage.removeItem('uploadedMusicUrl');
          sessionStorage.removeItem('uploadDescription');
          sessionStorage.removeItem('orderCustomization');
          sessionStorage.removeItem('orderUpsells');
      }
    };

    verifyPayment();

    // Setup redirect timer only after verification is successful
    // We control the redirect manually below based on status

  }, [searchParams]); // Depend on searchParams

  // Handle redirect after status is determined
  useEffect(() => {
      if (status === 'verified' && currentUser) {
          const timer = setTimeout(() => {
              navigate('/dashboard/bestellungen'); // Redirect to orders page
          }, 5000); 
          return () => clearTimeout(timer);
      }
      // No automatic redirect if verification failed or user not logged in
  }, [status, currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700 shadow-xl"
        >
          {status === 'verifying' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader className="h-12 w-12 text-indigo-400 animate-spin mb-4" />
              <p className="text-gray-300">Zahlung wird überprüft...</p>
            </div>
          )}

          {status === 'verified' && (
            <>
              <div className="mb-6">
                <div className="bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto border-2 border-green-500/50">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-white mb-3">
                Zahlung erfolgreich!
              </h1>
              <p className="text-gray-400 mb-6">
                Vielen Dank! Ihre Bestellung <span className="font-medium text-indigo-300">{verifiedOrderId}</span> wurde bestätigt.
                Wir beginnen nun mit der Bearbeitung Ihres Videos.
              </p>
               <div className="space-y-4">
                 {currentUser ? (
                   <>
                     <Link
                       to="/dashboard/bestellungen" // Link directly to orders
                       className="inline-flex items-center justify-center w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
                     >
                       Meine Bestellungen anzeigen
                       <ArrowRight className="ml-2 h-5 w-5" />
                     </Link>
                      <p className="text-sm text-gray-500">
                        Sie werden in 5 Sekunden weitergeleitet...
                      </p>
                   </>
                 ) : (
                   <Link
                     to="/"
                     className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
                   >
                     Zurück zur Startseite
                   </Link>
                 )}
               </div>
            </>
          )}
          
          {status === 'failed' && (
              <>
                 <div className="mb-6">
                    <div className="bg-red-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto border-2 border-red-500/50">
                      <AlertTriangle className="h-12 w-12 text-red-400" />
                    </div>
                </div>
                 <h1 className="text-2xl font-semibold text-white mb-3">
                   Zahlungsüberprüfung fehlgeschlagen
                 </h1>
                 <p className="text-red-400 mb-6">
                    {error || "Ihre Zahlung konnte nicht bestätigt werden. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support."} 
                 </p>
                 <Link
                   to="/bestellen" // Link back to the order start page or contact
                   className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
                 >
                   Zurück zum Bestellvorgang
                 </Link>
              </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;