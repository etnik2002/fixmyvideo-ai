import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Lock, Shield, AlertTriangle, CreditCard } from 'lucide-react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion } from 'framer-motion';
  
const DashboardSettings: React.FC = () => {
  const { userData, updateUserProfile, currentUser, updateUserPassword } = useAuth();
  
  // Profile state
  const [profileFormData, setProfileFormData] = useState({
    displayName: userData?.displayName || '',
    email: userData?.email || '',
    company: userData?.company || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
    city: userData?.city || '',
    zipCode: userData?.zipCode || '',
    country: userData?.country || '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // Subscription state
  const [subscription, setSubscription] = useState<any>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  
  // Fetch subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        if (!currentUser) return;
        
        // Fetch subscription from Firestore
        const subscriptionsRef = collection(db, 'subscriptions');
        const q = query(
          subscriptionsRef,
          where('userId', '==', currentUser.uid),
          limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setSubscription(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoadingSubscription(false);
      }
    };

    fetchSubscription();
  }, [currentUser]);
  
  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileFormData({
      ...profileFormData,
      [name]: value
    });
  };
  
  // Submit profile updates
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileSuccess(false);
    
    try {
      // Update only the fields that have changed
      const updatedFields: any = {};
      
      if (profileFormData.displayName !== userData?.displayName) {
        updatedFields.displayName = profileFormData.displayName;
      }
      
      if (profileFormData.company !== userData?.company) {
        updatedFields.company = profileFormData.company;
      }
      
      if (profileFormData.phone !== userData?.phone) {
        updatedFields.phone = profileFormData.phone;
      }
      
      if (profileFormData.address !== userData?.address) {
        updatedFields.address = profileFormData.address;
      }
      
      if (profileFormData.city !== userData?.city) {
        updatedFields.city = profileFormData.city;
      }
      
      if (profileFormData.zipCode !== userData?.zipCode) {
        updatedFields.zipCode = profileFormData.zipCode;
      }
      
      if (profileFormData.country !== userData?.country) {
        updatedFields.country = profileFormData.country;
      }
      
      if (Object.keys(updatedFields).length > 0) {
        await updateUserProfile(updatedFields);
        setProfileSuccess(true);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    
    if (name === 'newPassword') {
      if (value.length < 8) {
        setPasswordError('Das Passwort muss mindestens 8 Zeichen lang sein');
      } else {
        setPasswordError('');
      }
    }
    
    if (name === 'confirmPassword') {
      if (value !== passwordData.newPassword) {
        setPasswordError('Die Passwörter stimmen nicht überein');
      } else {
        setPasswordError('');
      }
    }
  };
  
  // Submit password update
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordError) {
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Die Passwörter stimmen nicht überein');
      return;
    }
    
    setIsUpdatingPassword(true);
    setPasswordSuccess(false);
    
    try {
      await updateUserPassword(passwordData.currentPassword, passwordData.newPassword);
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setPasswordSuccess(true);
    } catch (error) {
      console.error('Failed to update password:', error);
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  
  // Delete account
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Format subscription status for display
  const formatSubscriptionStatus = (status: string) => {
    switch (status) {
      case 'active': return 'Aktiv';
      case 'trialing': return 'Testphase';
      case 'past_due': return 'Zahlung überfällig';
      case 'canceled': return 'Gekündigt';
      case 'incomplete': return 'Unvollständig';
      case 'incomplete_expired': return 'Abgelaufen';
      case 'unpaid': return 'Unbezahlt';
      case 'paused': return 'Pausiert';
      default: return 'Keine Daten';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-fmv-carbon-light/20 to-fmv-carbon-light/5 p-6 rounded-lg border border-fmv-carbon-light/30">
        <h1 className="text-2xl font-medium text-fmv-silk mb-2">Kontoeinstellungen</h1>
        <p className="text-fmv-silk/70">Verwalten Sie Ihr Profil und Sicherheitseinstellungen.</p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-fmv-carbon-darker border border-fmv-carbon-light/20 p-1 rounded-lg">
          <TabsTrigger value="profile" className="data-[state=active]:bg-fmv-orange data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-fmv-orange data-[state=active]:text-white">
            <Lock className="h-4 w-4 mr-2" />
            Sicherheit
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-fmv-orange data-[state=active]:text-white">
            <CreditCard className="h-4 w-4 mr-2" />
            Abonnement
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30 p-6">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Profile Success Message */}
              {profileSuccess && (
                <div className="bg-green-900/20 border border-green-900/30 rounded-md p-4 flex items-start">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-400">Profil aktualisiert</h3>
                    <p className="mt-1 text-xs text-green-400/80">
                      Ihre Profilinformationen wurden erfolgreich aktualisiert.
                    </p>
                  </div>
                </div>
              )}
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-fmv-silk/80 mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-fmv-carbon-light" />
                    </div>
                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      value={profileFormData.displayName}
                      onChange={handleProfileChange}
                      className="block w-full pl-10 pr-3 py-2 border border-fmv-carbon-light/30 rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50"
                      placeholder="Ihr Name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-fmv-silk/80 mb-2">
                    E-Mail (nicht änderbar)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-fmv-carbon-light" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={profileFormData.email}
                      disabled
                      className="block w-full pl-10 pr-3 py-2 border border-fmv-carbon-light/30 rounded-md bg-fmv-carbon-light/5 text-fmv-silk/70 focus:outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-fmv-silk/80 mb-2">
                  Firma (optional)
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={profileFormData.company}
                  onChange={handleProfileChange}
                  className="block w-full px-3 py-2 border border-fmv-carbon-light/30 rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50"
                  placeholder="Firma (optional)"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-fmv-silk/80 mb-2">
                  Telefon (optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={profileFormData.phone}
                  onChange={handleProfileChange}
                  className="block w-full px-3 py-2 border border-fmv-carbon-light/30 rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50"
                  placeholder="+41 XX XXX XX XX"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-fmv-silk/80 mb-2">
                    Adresse (optional)
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={profileFormData.address}
                    onChange={handleProfileChange}
                    className="block w-full px-3 py-2 border border-fmv-carbon-light/30 rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50"
                    placeholder="Straße, Hausnummer"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-fmv-silk/80 mb-2">
                    Stadt (optional)
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={profileFormData.city}
                    onChange={handleProfileChange}
                    className="block w-full px-3 py-2 border border-fmv-carbon-light/30 rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50"
                    placeholder="Stadt"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-fmv-silk/80 mb-2">
                    PLZ (optional)
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={profileFormData.zipCode}
                    onChange={handleProfileChange}
                    className="block w-full px-3 py-2 border border-fmv-carbon-light/30 rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50"
                    placeholder="PLZ"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-fmv-silk/80 mb-2">
                    Land (optional)
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={profileFormData.country}
                    onChange={handleProfileChange}
                    className="block w-full px-3 py-2 border border-fmv-carbon-light/30 rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50"
                    placeholder="Land"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-6 py-2 bg-fmv-orange text-white rounded-md hover:bg-fmv-orange-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fmv-orange disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isUpdatingProfile ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : null}
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-8">
          {/* Password Change Section */}
          <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30 p-6">
            <h2 className="text-xl font-medium text-fmv-silk mb-4">Passwort ändern</h2>
            
            {/* Password Success Message */}
            {passwordSuccess && (
              <div className="bg-green-900/20 border border-green-900/30 rounded-md p-4 flex items-start mb-6">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-400">Passwort aktualisiert</h3>
                  <p className="mt-1 text-xs text-green-400/80">
                    Ihr Passwort wurde erfolgreich aktualisiert.
                  </p>
                </div>
              </div>
            )}
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-fmv-silk/80 mb-2">
                  Aktuelles Passwort
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-fmv-carbon-light" />
                  </div>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="block w-full pl-10 pr-3 py-2 border border-fmv-carbon-light/30 rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-fmv-silk/80 mb-2">
                  Neues Passwort
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-fmv-carbon-light" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      passwordError && passwordData.newPassword 
                        ? 'border-red-500/50' 
                        : 'border-fmv-carbon-light/30'
                    } rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50`}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-fmv-silk/80 mb-2">
                  Passwort bestätigen
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-fmv-carbon-light" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      passwordError && passwordData.confirmPassword 
                        ? 'border-red-500/50' 
                        : 'border-fmv-carbon-light/30'
                    } rounded-md bg-fmv-carbon-light/10 text-fmv-silk placeholder-gray-500 focus:outline-none focus:ring-fmv-orange/50 focus:border-fmv-orange/50`}
                    placeholder="••••••••"
                  />
                </div>
                
                {passwordError && (
                  <p className="mt-2 text-xs text-red-400">{passwordError}</p>
                )}
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingPassword || !!passwordError || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="px-6 py-2 bg-fmv-orange text-white rounded-md hover:bg-fmv-orange-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fmv-orange disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isUpdatingPassword ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : null}
                  Passwort ändern
                </button>
              </div>
            </form>
          </div>
          
          {/* Account Deletion Section */}
          <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-red-900/20 p-6">
            <h2 className="text-xl font-medium text-fmv-silk mb-4">Konto löschen</h2>
            <p className="text-fmv-silk/70 mb-6">
              Wenn Sie Ihr Konto löschen, werden alle Ihre persönlichen Daten und Einstellungen unwiderruflich entfernt.
              Bereits erstellte Videos bleiben jedoch für 30 Tage verfügbar.
            </p>
            
            {showDeleteConfirmation ? (
              <div className="bg-red-900/20 border border-red-900/30 rounded-md p-4 flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3 flex-grow">
                  <h3 className="text-sm font-medium text-red-400">Sind Sie sicher?</h3>
                  <p className="mt-2 text-xs text-red-400/90">
                    Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten werden permanent gelöscht.
                  </p>
                  <div className="mt-4 flex space-x-3">
                    <button 
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-sm"
                      onClick={() => setShowDeleteConfirmation(false)}
                    >
                      Konto löschen
                    </button>
                    <button 
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 text-sm"
                      onClick={() => setShowDeleteConfirmation(false)}
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                className="px-6 py-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 border border-red-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Konto löschen
              </button>
            )}
          </div>
        </TabsContent>
        
        {/* Billing Tab */}
        <TabsContent value="billing" className="mt-6 space-y-8">
          <div className="bg-fmv-carbon-darker rounded-lg shadow-md border border-fmv-carbon-light/30 p-6">
            <h2 className="text-xl font-medium text-fmv-silk mb-6">Abonnement & Zahlungen</h2>
            
            {loadingSubscription ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-fmv-orange border-t-transparent"></div>
              </div>
            ) : subscription ? (
              <div className="space-y-6">
                <div className="bg-fmv-carbon-light/10 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-fmv-silk mb-4">Aktives Abonnement</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-fmv-silk/70">Status:</span>
                      <span className={`px-2 py-0.5 rounded-full text-sm ${
                        subscription.subscription_status === 'active' 
                          ? 'bg-green-900/20 text-green-400' 
                          : 'bg-yellow-900/20 text-yellow-400'
                      }`}>
                        {formatSubscriptionStatus(subscription.subscription_status)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-fmv-silk/70">Zahlungsmethode:</span>
                      <span className="text-fmv-silk">
                        {subscription.payment_method_brand 
                          ? `${subscription.payment_method_brand.toUpperCase()} •••• ${subscription.payment_method_last4}` 
                          : 'Keine Zahlungsmethode'}
                      </span>
                    </div>
                    
                    {subscription.current_period_end && (
                      <div className="flex justify-between">
                        <span className="text-fmv-silk/70">Nächste Abrechnung:</span>
                        <span className="text-fmv-silk">
                          {new Date(subscription.current_period_end * 1000).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    )}
                    
                    {subscription.cancel_at_period_end && (
                      <div className="mt-4 bg-yellow-900/20 border border-yellow-900/30 rounded-md p-3">
                        <p className="text-yellow-400 text-sm">
                          Ihr Abonnement wurde gekündigt und endet am {new Date(subscription.current_period_end * 1000).toLocaleDateString('de-DE')}.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <button className="px-4 py-2 bg-fmv-orange text-white rounded-md hover:bg-fmv-orange-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fmv-orange">
                      Zahlungsmethode ändern
                    </button>
                    
                    {!subscription.cancel_at_period_end && subscription.subscription_status === 'active' && (
                      <button className="px-4 py-2 border border-red-500/30 text-red-400 rounded-md hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Abonnement kündigen
                      </button>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-fmv-silk mb-4">Zahlungshistorie</h3>
                  <p className="text-fmv-silk/70">
                    Ihre Rechnungen und Zahlungshistorie können Sie im Kundenportal einsehen.
                  </p>
                  <button className="mt-4 px-4 py-2 border border-fmv-carbon-light/30 text-fmv-silk rounded-md hover:bg-fmv-carbon-light/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fmv-orange">
                    Kundenportal öffnen
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-fmv-carbon-light/5 rounded-lg p-6 text-center">
                  <CreditCard className="h-12 w-12 text-fmv-silk/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-fmv-silk mb-2">Kein aktives Abonnement</h3>
                  <p className="text-fmv-silk/70 mb-6">
                    Sie haben derzeit kein aktives Abonnement. Entdecken Sie unsere Pakete und wählen Sie das passende für Ihre Bedürfnisse.
                  </p>
                  <a 
                    href="/preise" 
                    className="px-4 py-2 bg-fmv-orange text-white rounded-md hover:bg-fmv-orange-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fmv-orange inline-block"
                  >
                    Pakete anzeigen
                  </a>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardSettings;