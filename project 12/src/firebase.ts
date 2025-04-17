import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, StorageReference } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure auth persistence and custom domain
auth.useDeviceLanguage();
auth.settings.appVerificationDisabledForTesting = true;

// Set persistence
setPersistence(auth, browserLocalPersistence);

export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Helper function to upload a file to Firebase Storage
export const uploadFile = async (file: File, fullPath: string, metadata?: any): Promise<string> => {
  // Add timestamp to ensure unique filenames
  const timestamp = Date.now();
  const fileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_'); // Sanitize filename
  const filePath = `${fullPath}/${timestamp}_${fileName}`;
  
  // Add metadata with file information
  const fileMetadata = {
    contentType: file.type,
    customMetadata: {
      ...metadata,
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      fileSize: file.size.toString()
    }
  };
  
  const storageRef = ref(storage, filePath);
  const snapshot = await uploadBytes(storageRef, file, fileMetadata);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

// Helper function to upload multiple files to Firebase Storage
export const uploadFiles = async (files: File[], basePath: string, metadata?: any): Promise<string[]> => {
  const uploadPromises = files.map((file, index) => {
    // Include index in metadata for ordering
    const fileMetadata = metadata ? {
      ...metadata,
      index: index.toString()
    } : {
      index: index.toString(),
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      fileSize: file.size.toString()
    };
    
    // Use the basePath directly and let uploadFile handle the full path construction
    return uploadFile(file, basePath, fileMetadata);
  });
  
  return Promise.all(uploadPromises);
};

// Helper function to get files associated with an order
export const getOrderFiles = async (userId: string, orderId: string) => {
  try {
    // Define the paths for different file types
    const imagesPath = `orders/${userId}/${orderId}/images`;
    const videosPath = `orders/${userId}/${orderId}/videos`;
    
    // Create references to the storage locations
    const imagesRef = ref(storage, imagesPath);
    const videosRef = ref(storage, videosPath);
    
    // List all files in both directories
    const [imagesResult, videosResult] = await Promise.all([
      listAll(imagesRef).catch(() => ({ items: [] })), // Handle case where directory doesn't exist
      listAll(videosRef).catch(() => ({ items: [] }))  // Handle case where directory doesn't exist
    ]);
    
    // Get download URLs for all files
    const imageUrls = await Promise.all(
      imagesResult.items.map(async (imageRef) => {
        try {
          return await getDownloadURL(imageRef);
        } catch (error) {
          console.error('Error getting image URL:', error);
          return null;
        }
      })
    );
    
    const videoUrls = await Promise.all(
      videosResult.items.map(async (videoRef) => {
        try {
          return await getDownloadURL(videoRef);
        } catch (error) {
          console.error('Error getting video URL:', error);
          return null;
        }
      })
    );
    
    // Filter out any null values from failed downloads
    return {
      images: imageUrls.filter((url): url is string => url !== null),
      videos: videoUrls.filter((url): url is string => url !== null)
    };
  } catch (error) {
    console.error('Error getting order files:', error);
    return {
      images: [],
      videos: []
    };
  }
};

// Helper function to generate a unique order ID
export const generateOrderId = async (): Promise<string> => {
  // Get the counter document from Firestore
  const counterRef = doc(db, 'counters', 'orders');
  const counterSnap = await getDoc(counterRef);
  
  let counter = 1;
  if (counterSnap.exists()) {
    counter = counterSnap.data().count + 1;
  }
  
  // Format the order ID with leading zeros (e.g., ORD-00001)
  const orderId = `ORD-${counter.toString().padStart(5, '0')}`;
  
  // Update the counter in Firestore
  await addDoc(collection(db, 'counters'), {
    id: 'orders',
    count: counter,
    updatedAt: new Date()
  });
  
  return orderId;
};