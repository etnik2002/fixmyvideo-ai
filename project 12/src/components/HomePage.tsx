@@ .. @@
                   <Link
                     to="/bestellen"
                     className="fmv-primary-btn px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                   >
                     Video erstellen
                     <ArrowRight className="ml-2 h-5 w-5 inline" />
                   </Link>
                  <Link
                    to="/prozess"
                    className="fmv-outline-btn px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                  >
                    So funktioniert's
                  </Link>
                </div>
              </div>
            </AnimatedElement>
      </section>
      
      {/* NEW: Newsletter Section - MOVED TO FINAL POSITION */}
      
      {/* Customer Logos Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          <AnimatedElement animation="fade" className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-light text-fmv-silk/80">
              <span className="font-light">Vertrauen von führenden </span>
              <span className="text-fmv-orange font-medium">Unternehmen</span>
            </h2>
          </AnimatedElement>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {/* Logo placeholders - replace with actual client logos when available */}
            <AnimatedElement animation="fade" delay={0.1}>
              <div className="w-24 md:w-32 h-12 md:h-16 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Client Logo" className="max-w-full max-h-full" />
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="fade" delay={0.2}>
              <div className="w-24 md:w-32 h-12 md:h-16 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Client Logo" className="max-w-full max-h-full" />
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="fade" delay={0.3}>
              <div className="w-24 md:w-32 h-12 md:h-16 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Client Logo" className="max-w-full max-h-full" />
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="fade" delay={0.4}>
              <div className="w-24 md:w-32 h-12 md:h-16 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Client Logo" className="max-w-full max-h-full" />
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="fade" delay={0.5}>
              <div className="w-24 md:w-32 h-12 md:h-16 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Client Logo" className="max-w-full max-h-full" />
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="fade" delay={0.6}>
              <div className="w-24 md:w-32 h-12 md:h-16 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Spotify_logo_with_text.svg" alt="Client Logo" className="max-w-full max-h-full" />
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-gradient-to-b from-fmv-carbon-darker to-fmv-carbon relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          <AnimatedElement animation="fade" className="text-center mb-8 md:mb-10">