import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  User,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection } from 'firebase/firestore';
import { auth, db } from '../firebase';
import toast from 'react-hot-toast';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  company?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  createdAt: number;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  error: string | null;
  isEmailVerified?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      // Set email verification status
      if (user) {
        setIsEmailVerified(user.emailVerified);
        
        // Check if user is admin (simple email check)
        // Set all users as admins for testing purposes
        setIsAdmin(true);
        console.log("User is admin:", true);
      }
      
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            // Create user profile if it doesn't exist
            const newUserData: UserData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: Date.now()
            };
            
            await setDoc(userDocRef, newUserData);
            setUserData(newUserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Register function
  const register = async (email: string, password: string, displayName: string) => {
    setError(null);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Create user profile
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName,
        photoURL: null,
        createdAt: Date.now()
      });
      
      toast.success('Account erfolgreich erstellt!');
    } catch (error: any) {
      let errorMessage = 'Registrierung fehlgeschlagen';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Diese E-Mail-Adresse wird bereits verwendet';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Das Passwort ist zu schwach';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Erfolgreich angemeldet!');
      return result;
    } catch (error: any) {
      let errorMessage = 'Anmeldung fehlgeschlagen';
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Ungültige E-Mail oder Passwort';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Zu viele fehlgeschlagene Anmeldeversuche. Versuchen Sie es später erneut';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Erfolgreich abgemeldet');
    } catch (error) {
      setError('Abmeldung fehlgeschlagen');
      toast.error('Abmeldung fehlgeschlagen');
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('E-Mail zum Zurücksetzen des Passworts wurde gesendet');
    } catch (error: any) {
      let errorMessage = 'Passwort zurücksetzen fehlgeschlagen';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Kein Benutzer mit dieser E-Mail gefunden';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Ungültige E-Mail-Adresse';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<UserData>) => {
    if (!currentUser) {
      throw new Error('Kein angemeldeter Benutzer');
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      // Update Firestore document
      await updateDoc(userDocRef, data);
      
      // Update display name in Firebase Auth if changed
      if (data.displayName) {
        await updateProfile(currentUser, { displayName: data.displayName });
      }
      
      // Fetch updated user data
      const updatedDoc = await getDoc(userDocRef);
      if (updatedDoc.exists()) {
        setUserData(updatedDoc.data() as UserData);
      }
      
      toast.success('Profil erfolgreich aktualisiert');
    } catch (error) {
      setError('Profil konnte nicht aktualisiert werden');
      toast.error('Profil konnte nicht aktualisiert werden');
      throw error;
    }
  };

  // Update password
  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!currentUser) {
      throw new Error('Kein angemeldeter Benutzer');
    }

    try {
      // Re-authenticate user
      const credential = await signInWithEmailAndPassword(auth, currentUser.email!, currentPassword);
      
      if (credential) {
        await updatePassword(currentUser, newPassword);
        toast.success('Passwort erfolgreich aktualisiert');
      }
    } catch (error: any) {
      let errorMessage = 'Passwort konnte nicht aktualisiert werden';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Aktuelles Passwort ist falsch';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Das neue Passwort ist zu schwach';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };


  const value = {
    currentUser,
    userData,
    isAdmin,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserPassword,
    error,
    isEmailVerified
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};