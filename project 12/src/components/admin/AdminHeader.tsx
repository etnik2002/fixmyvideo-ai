import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Menu, User, LogOut, Settings, Shield, Home, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminHeaderProps {
  toggleMobileNav: () => void;
  pageTitle: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleMobileNav, pageTitle }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const profileMenuRef = React.useRef<HTMLDivElement>(null);

  // Close profile menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current && 
        !profileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.profile-trigger')
      ) {
        setIsProfileMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-red-900/90 backdrop-blur-sm text-fmv-silk fixed top-0 left-0 right-0 h-14 sm:h-16 border-b border-red-800/50 z-30 shadow-sm">
      <div className="container mx-auto h-full px-4">
        <div className="flex justify-between items-center h-full">
          {/* Left section - Logo and menu toggle */}
          <div className="flex items-center">
            <button
              className="md:hidden p-2 mr-2 text-fmv-silk hover:text-fmv-orange transition-colors"
              onClick={toggleMobileNav}
              aria-label="Toggle navigation"
            >
              <Menu size={24} />
            </button>
            
            <Link to="/admin" className="hidden md:flex items-center">
              <Shield className="h-6 w-6 text-white mr-2" />
              <span className="text-white font-medium">Admin Panel</span>
            </Link>

            <div className="md:hidden font-medium text-lg ml-2 flex items-center">
              <Shield className="h-5 w-5 text-white mr-2" />
              {pageTitle}
            </div>
          </div>
          
          {/* Right section - User and actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              onClick={() => {
                if (window.Calendly) {
                  window.Calendly.initPopupWidget({
                    url: 'https://calendly.com/fixmyvideo/beratung'
                  });
                }
              }}
              className="p-2 text-fmv-silk hover:text-fmv-orange transition-colors"
              aria-label="Termin buchen"
            >
              <Calendar size={22} />
            </button>
            
            <button className="p-2 text-fmv-silk hover:text-fmv-orange transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-fmv-orange rounded-full"></span>
            </button>
            
            {/* User Profile */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 text-fmv-silk hover:text-fmv-orange transition-colors profile-trigger"
              >
                <div className="w-8 h-8 bg-fmv-orange/20 rounded-full flex items-center justify-center">
                  <User size={14} className="text-fmv-orange" />
                </div>
                <span className="font-light hidden md:inline-block">
                  {userData?.displayName || currentUser?.email || 'Admin'}
                </span>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    ref={profileMenuRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-fmv-carbon-darker border border-fmv-carbon-light/30 z-50"
                  >
                    <div className="py-1">
                      <Link 
                        to="/dashboard" 
                        className="flex px-4 py-2 text-sm text-fmv-silk hover:bg-fmv-carbon-light/10"
                      >
                        <Settings size={16} className="mr-2" />
                        Zum Dashboard
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-fmv-carbon-light/10 border-t border-fmv-carbon-light/20"
                      >
                        <LogOut size={16} className="mr-2" />
                        Abmelden
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {/* Orange highlight line below header */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-fmv-orange/30 to-transparent"></div>
    </header>
  );
};

export default AdminHeader;