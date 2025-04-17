import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, BadgeCheck, Shield, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, userData, logout, isAdmin } = useAuth();
  console.log({ isAdmin })

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // When menu is toggled, ensure header is visible
    if (!isHeaderVisible) {
      setIsHeaderVisible(true);
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Handle scroll direction for header visibility but only when menu is closed
  useEffect(() => {
    const handleScroll = () => {
      // Don't hide header when menu is open
      if (isMenuOpen) {
        return;
      }

      const currentScrollY = window.scrollY;

      // Always show header at the top of the page
      if (currentScrollY < 10) {
        setIsScrolled(false);
        setIsHeaderVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Determine if we're scrolling up or down
      if (currentScrollY > 80) {
        setIsScrolled(true);

        // Scrolling down and past header height
        if (currentScrollY > lastScrollY.current + 10) {
          setIsHeaderVisible(false);
        }
        // Scrolling up
        else if (currentScrollY < lastScrollY.current - 10) {
          setIsHeaderVisible(true);
        }
      } else {
        setIsScrolled(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen]);

  // Close profile menu when clicking outside
  useEffect(() => {
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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      // Ensure header is visible when menu is open
      setIsHeaderVisible(true);
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = 'auto';
    };
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header
      ref={headerRef}
      className={`bg-fmv-carbon-darker/90 backdrop-blur-sm text-fmv-silk fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'border-b border-fmv-carbon-light/30 py-3' : 'py-6'
        } ${isHeaderVisible || isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="group z-20 relative">
            <img
              src="https://i.imgur.com/woSig5t.png"
              alt="FixMyVideo Logo"
              className={`transition-all duration-300 ${isScrolled ? 'h-12 sm:h-16' : 'h-14 sm:h-20'}`}
            />
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-fmv-silk p-2 z-20 relative"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <NavLink
              to="/prozess"
              className={({ isActive }) =>
                isActive
                  ? "text-fmv-orange font-light"
                  : "text-fmv-silk text-opacity-80 font-light transition-colors hover:text-fmv-orange"
              }
            >
              So funktioniert's
            </NavLink>
            <NavLink
              to="/preise"
              className={({ isActive }) =>
                isActive
                  ? "text-fmv-orange font-light"
                  : "text-fmv-silk text-opacity-80 font-light transition-colors hover:text-fmv-orange"
              }
            >
              Preise
            </NavLink>
            <NavLink
              to="/beispiele"
              className={({ isActive }) =>
                isActive
                  ? "text-fmv-orange font-light"
                  : "text-fmv-silk text-opacity-80 font-light transition-colors hover:text-fmv-orange"
              }
            >
              Beispiele
            </NavLink>
            <NavLink
              to="/ueber-uns"
              className={({ isActive }) =>
                isActive
                  ? "text-fmv-orange font-light"
                  : "text-fmv-silk text-opacity-80 font-light transition-colors hover:text-fmv-orange"
              }
            >
              Über Uns
            </NavLink>
            <NavLink
              to="/kontakt"
              className={({ isActive }) =>
                isActive
                  ? "text-fmv-orange font-light"
                  : "text-fmv-silk text-opacity-80 font-light transition-colors hover:text-fmv-orange"
              }
            >
              Kontakt
            </NavLink>

            <button
              onClick={() => {
                if (window.Calendly) {
                  window.Calendly.initPopupWidget({
                    url: 'https://calendly.com/fixmyvideo/beratung'
                  });
                }
              }}
              className="text-fmv-silk text-opacity-80 font-light transition-colors hover:text-fmv-orange flex items-center"
              aria-label="Termin buchen"
            >
              <Calendar className="h-5 w-5" />
            </button>

            {currentUser ? (
              <div className="relative">
                {/* User Profile Button */}
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 text-fmv-silk hover:text-fmv-orange transition-colors profile-trigger"
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-fmv-orange/20 rounded-full flex items-center justify-center">
                      <User size={14} className="text-fmv-orange" />
                    </div>
                  </div>
                  <span className="font-light flex items-center">
                    <span>{userData?.displayName || 'Mein Konto'}</span>
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
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-fmv-carbon-darker border border-fmv-carbon-light/30 z-30"
                    >
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-fmv-silk hover:bg-fmv-carbon-light/10"
                        >
                          Dashboard
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-fmv-silk hover:bg-fmv-carbon-light/10"
                          >
                            <span className="flex items-center">
                              <Shield className="h-4 w-4 mr-2 text-red-500" />
                              Admin-Bereich
                            </span>
                          </Link>
                        )}
                        <Link
                          to="/dashboard/videos"
                          className="block px-4 py-2 text-sm text-fmv-silk hover:bg-fmv-carbon-light/10"
                        >
                          Meine Videos
                        </Link>
                        <Link
                          to="/dashboard/settings"
                          className="block px-4 py-2 text-sm text-fmv-silk hover:bg-fmv-carbon-light/10"
                        >
                          Einstellungen
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-fmv-carbon-light/10 border-t border-fmv-carbon-light/20"
                        >
                          Abmelden
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="fmv-primary-btn px-5 py-2 font-light"
              >
                Anmelden
              </Link>
            )}

            <Link
              to="/bestellen"
              className="fmv-primary-btn px-5 py-2 font-light"
            >
              Video Bestellen
            </Link>
          </nav>
        </div>
      </div>

      {/* Orange highlight line below header */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-fmv-orange/30 to-transparent"></div>

      {/* Mobile menu - Only render when menu is open and header is visible */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-fmv-carbon-darker/95 backdrop-blur-lg text-fmv-silk z-40 flex flex-col overflow-y-auto"
            style={{
              top: headerRef.current ? headerRef.current.offsetHeight : 'auto',
              height: `calc(100vh - ${headerRef.current?.offsetHeight || 0}px)`
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-8 flex flex-col h-full">
              <nav className="flex flex-col space-y-6">
                <NavLink
                  to="/prozess"
                  className={({ isActive }) =>
                    `text-2xl font-light ${isActive ? "text-fmv-orange" : "text-fmv-silk"} flex items-center`
                  }
                >
                  <motion.span
                    whileTap={{ scale: 0.95 }}
                  >
                    So funktioniert's
                  </motion.span>
                </NavLink>
                <NavLink
                  to="/preise"
                  className={({ isActive }) =>
                    `text-2xl font-light ${isActive ? "text-fmv-orange" : "text-fmv-silk"} flex items-center`
                  }
                >
                  <motion.span
                    whileTap={{ scale: 0.95 }}
                  >
                    Preise
                  </motion.span>
                </NavLink>
                <NavLink
                  to="/beispiele"
                  className={({ isActive }) =>
                    `text-2xl font-light ${isActive ? "text-fmv-orange" : "text-fmv-silk"} flex items-center`
                  }
                >
                  <motion.span
                    whileTap={{ scale: 0.95 }}
                  >
                    Beispiele
                  </motion.span>
                </NavLink>
                <NavLink
                  to="/ueber-uns"
                  className={({ isActive }) =>
                    `text-2xl font-light ${isActive ? "text-fmv-orange" : "text-fmv-silk"} flex items-center`
                  }
                >
                  <motion.span
                    whileTap={{ scale: 0.95 }}
                  >
                    Über Uns
                  </motion.span>
                </NavLink>
                <NavLink
                  to="/kontakt"
                  className={({ isActive }) =>
                    `text-2xl font-light ${isActive ? "text-fmv-orange" : "text-fmv-silk"} flex items-center`
                  }
                >
                  <motion.span
                    whileTap={{ scale: 0.95 }}
                  >
                    Kontakt
                  </motion.span>
                </NavLink>

                <button
                  onClick={() => {
                    if (window.Calendly) {
                      window.Calendly.initPopupWidget({
                        url: 'https://calendly.com/fixmyvideo/beratung'
                      });
                    }
                    setIsMenuOpen(false);
                  }}
                  className="text-2xl font-light text-fmv-silk flex items-center"
                >
                  <motion.span
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Termin buchen
                  </motion.span>
                </button>

                {currentUser ? (
                  <>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        `text-2xl font-light ${isActive ? "text-fmv-orange" : "text-fmv-silk"} flex items-center`
                      }
                    >
                      <motion.span
                        whileTap={{ scale: 0.95 }}
                      >
                        Dashboard
                      </motion.span>
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="text-2xl font-light text-red-400 flex items-center"
                    >
                      <motion.span
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center"
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        Abmelden
                      </motion.span>
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/auth/login"
                    className={({ isActive }) =>
                      `text-2xl font-light ${isActive ? "text-fmv-orange" : "text-fmv-silk"} flex items-center`
                    }
                  >
                    <motion.span
                      whileTap={{ scale: 0.95 }}
                    >
                      <User className="mr-2 h-5 w-5 inline" />
                      Anmelden
                    </motion.span>
                  </NavLink>
                )}
              </nav>

              <div className="mt-auto pt-8 pb-6 border-t border-fmv-carbon-light/20">
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/bestellen"
                    className="fmv-primary-btn px-6 py-3 inline-block text-xl font-light w-full text-center"
                  >
                    Video Bestellen
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;