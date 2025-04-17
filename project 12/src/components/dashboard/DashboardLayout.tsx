import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeft } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();

  // Close mobile nav when route changes
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location]);

  // Get page title based on current pathname
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop() || 'dashboard';
    
    switch(path) {
      case 'dashboard':
        return 'Dashboard';
      case 'orders':
        return 'Meine Bestellungen';
      case 'videos':
        return 'Meine Videos';
      case 'settings':
        return 'Einstellungen';
      case 'partner':
        return 'Partner Program';
      default:
        return 'Dashboard';
    }
  };

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <div className="min-h-screen bg-fmv-carbon text-fmv-silk flex flex-col">
      {/* Subtle background patterns */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
      
      {/* Mobile navigation overlay */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileNavOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Dashboard header */}
      <DashboardHeader 
        toggleMobileNav={toggleMobileNav} 
        pageTitle={getPageTitle()} 
      />
      
      <div className="flex flex-1" style={{ paddingTop: '4rem' }}>
        {/* Sidebar for mobile (slide in from left) */}
        <AnimatePresence>
          {isMobileNavOpen && (
            <motion.div 
              className="fixed inset-y-0 left-0 z-40 w-64 md:hidden"
              style={{ paddingTop: '4rem' }}
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <DashboardSidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar for desktop (always visible) */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky h-[calc(100vh-4rem)]" style={{ top: '4rem' }}>
            <DashboardSidebar />
          </div>
        </div>
        
        {/* Mobile menu toggle button - only visible on small screens when menu is closed */}
        <AnimatePresence>
          {!isMobileNavOpen && (
            <motion.button
              className="fixed left-4 bottom-4 md:hidden z-30 rounded-full bg-fmv-orange p-3 shadow-lg"
              onClick={toggleMobileNav}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileTap={{ scale: 0.9 }}
            >
              <PanelLeft size={24} className="text-white" />
            </motion.button>
          )}
        </AnimatePresence>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;