import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  const location = useLocation();
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerObserver = useRef<ResizeObserver | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  
  // Observe header height changes
  useEffect(() => {
    const headerElement = document.querySelector('header');
    
    if (headerElement && window.ResizeObserver) {
      headerObserver.current = new ResizeObserver(entries => {
        for (let entry of entries) {
          const newHeight = entry.contentRect.height;
          setHeaderHeight(newHeight);
          
          // Update main element padding when header height changes
          if (mainRef.current) {
            mainRef.current.style.paddingTop = `${newHeight}px`;
          }
        }
      });
      
      headerObserver.current.observe(headerElement);
    }
    
    return () => {
      if (headerObserver.current) {
        headerObserver.current.disconnect();
      }
    };
  }, []);
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen font-manrope bg-fmv-carbon text-fmv-silk relative">
      {/* Global background elements */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
      
      <Header />
      <main 
        ref={mainRef}
        className="flex-grow relative z-10"
        style={{ 
          paddingTop: `${headerHeight}px`,
          minHeight: `calc(100vh - ${headerHeight}px)` 
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;