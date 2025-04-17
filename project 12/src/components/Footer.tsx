import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Footer: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <footer className="bg-fmv-carbon-darker py-12 lg:py-16 text-fmv-silk border-t border-fmv-carbon-light/20">
      <div className="container mx-auto px-6 sm:px-8">
        {/* Main footer content */}
        <div className="flex flex-col gap-10">
          {/* Logo and company info */}
          <div className="max-w-md">
            <Link to="/" className="inline-block mb-6">
              <img 
                src="https://i.imgur.com/woSig5t.png" 
                alt="FixMyVideo Logo" 
                className="h-16"
              />
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              KI-gestützte Umwandlung von Kundenbildern in professionelle Marketing-Videos. Schweizer Qualität seit 2025.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-fmv-orange mr-3" />
                <span className="text-sm">
                  <span className="text-fmv-silk/80 font-medium">E-Mail: </span>
                  <a href="mailto:info@fixmyvideo.io" className="text-gray-400 hover:text-fmv-orange transition-colors">info@fixmyvideo.io</a>
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-fmv-orange mr-3" />
                <span className="text-sm">
                  <span className="text-fmv-silk/80 font-medium">Telefon: </span>
                  <a href="tel:+41434443366" className="text-gray-400 hover:text-fmv-orange transition-colors">+41 43 444 33 66</a>
                </span>
              </div>
            </div>
          </div>

          {/* Navigation columns for larger screens */}
          <div className="hidden sm:grid grid-cols-3 gap-8 sm:gap-16">
            {/* Pages column */}
            <div>
              <h3 className="text-fmv-orange text-sm font-medium uppercase mb-4">Seiten</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                    Homepage
                  </Link>
                </li>
                <li>
                  <Link to="/prozess" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                    So funktioniert's
                  </Link>
                </li>
                <li>
                  <Link to="/preise" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                    Preise
                  </Link>
                </li>
                <li>
                  <Link to="/beispiele" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                    Beispiele
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Service column */}
            <div>
              <h3 className="text-fmv-orange text-sm font-medium uppercase mb-4">Service</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/bestellen" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                    Video Bestellen
                  </Link>
                </li>
                <li>
                  <Link to="/ueber-uns" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                    Über Uns
                  </Link>
                </li>
                <li>
                  <Link to="/kontakt" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                    Kontakt
                  </Link>
                </li>
                {currentUser ? (
                  <li>
                    <Link to="/dashboard" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                      Mein Konto
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/auth/login" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                      Anmelden
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            
            {/* Legal column */}
            <div>
              <h3 className="text-fmv-orange text-sm font-medium uppercase mb-4">Rechtliches</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/impressum" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link to="/datenschutz" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <Link to="/agb" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                    AGB
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile accordion navigation */}
          <div className="sm:hidden space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-fmv-orange text-sm font-medium uppercase mb-3">Seiten</h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                      Homepage
                    </Link>
                  </li>
                  <li>
                    <Link to="/prozess" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                      So funktioniert's
                    </Link>
                  </li>
                  <li>
                    <Link to="/preise" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                      Preise
                    </Link>
                  </li>
                  <li>
                    <Link to="/beispiele" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                      Beispiele
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-fmv-orange text-sm font-medium uppercase mb-3">Service</h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/bestellen" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                      Video Bestellen
                    </Link>
                  </li>
                  <li>
                    <Link to="/ueber-uns" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                      Über Uns
                    </Link>
                  </li>
                  <li>
                    <Link to="/kontakt" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm">
                      Kontakt
                    </Link>
                  </li>
                  {currentUser ? (
                    <li>
                      <Link to="/dashboard" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm flex items-center">
                        <User className="h-3.5 w-3.5 mr-1" />
                        Mein Konto
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link to="/auth/login" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm flex items-center">
                        <User className="h-3.5 w-3.5 mr-1" />
                        Anmelden
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-fmv-orange text-sm font-medium uppercase mb-3">Rechtliches</h3>
              <div className="flex flex-wrap gap-3">
                <Link to="/impressum" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm bg-fmv-carbon-light/10 px-3 py-1 rounded-full">
                  Impressum
                </Link>
                <Link to="/datenschutz" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm bg-fmv-carbon-light/10 px-3 py-1 rounded-full">
                  Datenschutz
                </Link>
                <Link to="/agb" className="text-gray-400 hover:text-fmv-orange transition-colors text-sm bg-fmv-carbon-light/10 px-3 py-1 rounded-full">
                  AGB
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar with copyright and CTA */}
        <div className="mt-10 pt-6 border-t border-fmv-carbon-light/10 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2025 - Alle Rechte vorbehalten.</p>
          
          <Link 
            to="/bestellen" 
            className="mt-4 sm:mt-0 inline-flex items-center text-fmv-orange hover:text-fmv-orange-light transition-colors group"
          >
            <span>Jetzt Video erstellen</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;