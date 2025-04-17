import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const location = useLocation();
  
  // Determine page title based on the route
  let pageTitle = "Anmelden";
  if (location.pathname.includes("register")) {
    pageTitle = "Registrieren";
  } else if (location.pathname.includes("forgot-password")) {
    pageTitle = "Passwort zurücksetzen";
  }

  return (
    <div className="min-h-screen bg-fmv-carbon flex flex-col">
      {/* Subtle background elements */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
      
      {/* Back to home button */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-fmv-silk/70 hover:text-fmv-orange transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Zurück zur Startseite
        </Link>
      </div>
      
      {/* Main content with decorative elements */}
      <div className="flex-grow flex items-center justify-center py-8 relative overflow-hidden">
        {/* Decorative elements */}
        <motion.div 
          className="absolute top-[20%] left-[10%] w-32 h-32 fmv-large-circle"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-[20%] right-[10%] w-24 h-24 fmv-large-circle"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        
        <motion.div 
          className="absolute top-[40%] right-[30%] fmv-line w-48"
          animate={{ 
            width: ["0%", "100%", "0%"],
            left: ["0%", "0%", "100%"],
            opacity: [0, 0.5, 0],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10 max-w-md">
          {/* Auth card with animation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="gradient-border-animated rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="bg-fmv-carbon-darker/90 backdrop-blur-lg p-8 rounded-xl">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <img 
                  src="https://i.imgur.com/woSig5t.png" 
                  alt="FixMyVideo Logo" 
                  className="h-16" 
                />
              </div>
              
              {/* Page title */}
              <h1 className="text-2xl font-medium text-fmv-silk text-center mb-8">
                {pageTitle}
              </h1>
              
              {/* Auth form content */}
              <Outlet />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-fmv-silk/60 text-sm">
          &copy; 2025 fixmyvideo GmbH. Alle Rechte vorbehalten.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;