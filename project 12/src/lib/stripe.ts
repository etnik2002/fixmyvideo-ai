import { videoPackages, upsellOptions, upsellOptionMap } from '../stripe-config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

// Create a checkout session for a package
export const createCheckoutSession = async (
  packageType: string,
  selectedOptions: string[] = [],
  additionalFormats: number = 0
) => {
  try {
    // Get the package price ID
    const packagePriceId = videoPackages[packageType]?.priceId;
    
    if (!packagePriceId) {
      throw new Error('Invalid package type');
    }

    // Create a checkout session in Stripe via Firebase
    const checkoutSessionRef = collection(db, 'stripeCheckout');
    const docRef = await addDoc(checkoutSessionRef, {
      priceId: packagePriceId,
      successUrl: `${window.location.origin}/payment/success`,
      cancelUrl: `${window.location.origin}/bestellen/review?package=${packageType}`,
      userId: auth.currentUser?.uid || 'guest',
      mode: 'payment',
      timestamp: new Date(),
      upsellOptions: selectedOptions,
      additionalFormats: additionalFormats
    });

    // Wait for the Cloud Function to process the request and update the document
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      attempts++;
      
      // Wait a bit before checking
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the updated document
      const docSnap = await getDocs(query(
        collection(db, 'stripeCheckout'),
        where('__name__', '==', docRef.id)
      ));
      
      if (!docSnap.empty) {
        const data = docSnap.docs[0].data();
        
        // Check if the session URL is available
        if (data.sessionUrl) {
          return { 
            sessionId: data.sessionId,
            url: data.sessionUrl
          };
        }
        
        // Check if there was an error
        if (data.error) {
          throw new Error(data.error);
        }
      }
      
      // If we've reached the maximum number of attempts, throw an error
      if (attempts >= maxAttempts) {
        throw new Error('Timeout waiting for checkout session');
      }
    }
    
    throw new Error('Failed to create checkout session');
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Get user subscription status
export const getUserSubscription = async () => {
  try {
    if (!auth.currentUser) {
      return null;
    }
    
    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(subscriptionsRef, where('userId', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs[0]?.data() || null;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    throw error;
  }
};

// Get user orders
export const getUserOrders = async () => {
  try {
    if (!auth.currentUser) {
      return [];
    }
    
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Helper function to get package price
export const getPackagePrice = (packageType: 'Spark' | 'Flash' | 'Ultra'): string => {
  const packageKey = packageType.toLowerCase();
  return videoPackages[packageKey]?.priceId || '';
};

// Helper function to get package amount
export const getPackageAmount = (packageType: 'Spark' | 'Flash' | 'Ultra'): number => {
  const packageKey = packageType.toLowerCase();
  return videoPackages[packageKey]?.price || 0;
};

// Helper function to get upsell option price
export const getUpsellPrice = (optionId: string): string => {
  const mappedId = upsellOptionMap[optionId];
  return upsellOptions[mappedId]?.priceId || '';
};

// Helper function to get upsell option amount
export const getUpsellAmount = (optionId: string): number => {
  const mappedId = upsellOptionMap[optionId];
  return upsellOptions[mappedId]?.price || 0;
};