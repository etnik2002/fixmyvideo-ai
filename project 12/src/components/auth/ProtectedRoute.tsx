import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-fmv-carbon text-fmv-silk">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fmv-orange/20 border-t-fmv-orange rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-fmv-silk/80">Laden...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login page and save the attempted URL
    return <Navigate to="/auth/login" state={location.pathname + location.search} replace />;
  }

  // Check if this is an admin-only route
  if (adminOnly) {
    const { isAdmin } = useAuth();
    
    if (!isAdmin) {
      console.log("Access denied: User is not admin");
      return <Navigate to="/dashboard" replace />;
    }
    console.log("Admin access granted");
  }

  return <>{children}</>;
};

export default ProtectedRoute;