import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext'; 
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { ref } from 'firebase/storage';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [orderId, setOrderId] = useState<string>('');

  // Get payment intent ID from URL if available
  const paymentIntentId = searchParams.get('payment_intent');
  
  // Get order details from sessionStorage
  useEffect(() => {
    const saveOrderToDatabase = async () => {
      try {
        const orderData = sessionStorage.getItem('currentOrder');
        const storedOrderId = sessionStorage.getItem('currentOrderId') || '';
        setOrderId(storedOrderId);
        
        if (orderData) {
          const parsedOrderData = JSON.parse(orderData);
          setOrderDetails(parsedOrderData);
          
          // Save order to Firestore if user is logged in
          if (currentUser) {
            // Create a new order document
            const orderCollection = collection(db, 'orders');
            const newOrderRef = await addDoc(orderCollection, {
              orderId: storedOrderId,
              userId: currentUser.uid,
              packageType: parsedOrderData.package,
              imageUrls: parsedOrderData.imageUrls || [],
              musicUrl: parsedOrderData.musicUrl || null,
              customization: parsedOrderData.customization || {},
              upsells: parsedOrderData.upsells?.selectedOptions || [],
              additionalFormats: parsedOrderData.upsells?.selectedFormats?.length > 1 
                ? parsedOrderData.upsells.selectedFormats.filter((f: string) => f !== parsedOrderData.customization.selectedFormat) 
                : [],
              total: parsedOrderData.total,
              status: 'In Bearbeitung',
              createdAt: serverTimestamp(),
              paymentIntentId: paymentIntentId || null
            });
            
            // Update the order with its document ID for easier reference
            await updateDoc(newOrderRef, {
              docId: newOrderRef.id
            });
            
            // If we have files in storage but no orderId, try to list and organize them
            if (!storedOrderId) {
              try {
                // Look for recently uploaded files by this user
                const userUploadsRef = ref(storage, `uploads/${currentUser.uid}`);
                
                // Note: Moving files in Firebase Storage requires a Cloud Function
                // We would need to implement a Cloud Function to move files from temporary uploads to order folders
                console.log('Order created with ID:', newOrderRef.id);
                console.log('Files path:', `orders/${currentUser.uid}/${storedOrderId}`);
              } catch (storageError) {
                console.error('Error organizing storage files:', storageError);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error parsing order data:', error);
      } finally {
        setIsLoading(false);
        
        // Clear order data from sessionStorage
        sessionStorage.removeItem('currentOrder');
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

    saveOrderToDatabase();
    
    // Redirect to dashboard after 5 seconds if user is logged in
    if (currentUser) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [navigate, currentUser]);

  return (
    <div className="min-h-screen bg-fmv-carbon flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-fmv-carbon-darker rounded-lg p-8 text-center border border-fmv-carbon-light/30 shadow-xl"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader className="h-12 w-12 text-fmv-orange animate-spin mb-4" />
              <p className="text-fmv-silk">Bestellung wird verarbeitet...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="bg-green-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
              </div>

              <h1 className="text-2xl font-medium text-fmv-silk mb-4">
                Zahlung erfolgreich!
              </h1>

              <p className="text-fmv-silk/70 mb-8">
                Vielen Dank für Ihre Bestellung. Wir haben mit der Bearbeitung Ihres Videos begonnen
                und werden Sie über den Fortschritt auf dem Laufenden halten.
              </p>

              {orderDetails && (
                <div className="bg-fmv-carbon-light/10 rounded-lg p-4 mb-6 text-left">
                  <h3 className="text-fmv-orange font-medium mb-2">Bestellübersicht</h3>
                  <p className="text-fmv-silk/80 text-sm">Paket: <span className="text-fmv-silk">{orderDetails.package.charAt(0).toUpperCase() + orderDetails.package.slice(1)}</span></p>
                  {orderId && (
                    <p className="text-fmv-silk/80 text-sm">Bestellnummer: <span className="text-fmv-silk">{orderId}</span></p>
                  )}
                  {orderDetails.upsells?.selectedOptions?.length > 0 && (
                    <p className="text-fmv-silk/80 text-sm">Zusatzoptionen: <span className="text-fmv-silk">{orderDetails.upsells.selectedOptions.length}</span></p>
                  )}
                  <p className="text-fmv-silk/80 text-sm mt-2">Gesamtbetrag: <span className="text-fmv-orange font-medium">CHF {orderDetails.total.toFixed(2)}</span></p>
                </div>
              )}

              <div className="space-y-4">
                {currentUser ? (
                  <Link
                    to="/dashboard"
                    className="fmv-primary-btn px-6 py-3 inline-flex items-center justify-center w-full"
                  >
                    Zum Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/auth/register"
                      className="fmv-primary-btn px-6 py-3 inline-flex items-center justify-center w-full"
                    >
                      Jetzt registrieren
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      to="/"
                      className="fmv-secondary-btn px-6 py-3 inline-flex items-center justify-center w-full"
                    >
                      Zurück zur Startseite
                    </Link>
                  </div>
                )}

                {currentUser && (
                  <p className="text-sm text-fmv-silk/60">
                    Sie werden in wenigen Sekunden automatisch weitergeleitet...
                  </p>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;