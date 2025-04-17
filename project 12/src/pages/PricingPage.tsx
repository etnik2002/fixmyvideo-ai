import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, CreditCard, Clock, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/AnimatedElement';
import PageHeader from '../components/PageHeader';
import SectionWrapper from '../components/SectionWrapper';
import SectionTitle from '../components/SectionTitle';
import Card from '../components/Card';
import GradientBorderButton from '../components/GradientBorderButton';
import CalendlyWidget from '../components/CalendlyWidget';

const PricingPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Unsere Pakete und Preise"
        subtitle="Transparente Preise für professionelle Videos. Wähle das Paket, das am besten zu deinem Bedarf passt."
      />

      {/* Pricing Section */}
      <SectionWrapper 
        className="bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker" 
        withPattern
        withDecoration
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Spark Package */}
          <AnimatedElement animation="slide-up" delay={0.1}>
            <Card className="flex flex-col h-full">
              <div>
                <h3 className="text-xl md:text-2xl font-medium mb-2 text-fmv-silk">Spark</h3>
                <p className="text-fmv-orange text-4xl font-bold mb-6">CHF 150</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">30 Sekunden Video</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Bis zu 5 Fotos</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Bis zu 3 Formatvarianten (16:9, 9:16, 1:1)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Musik aus unserer Bibliothek</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Bis zu 3 Texteinblendungen</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Lieferung in 24-48h</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">1 Korrekturschleife</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">HD-Qualität 1080p</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto">
                <Link
                  to="/bestellen?package=spark"
                  className="block w-full fmv-primary-btn text-center px-6 py-3"
                >
                  Jetzt bestellen
                </Link>
              </div>
            </Card>
          </AnimatedElement>
          
          {/* Flash Package */}
          <AnimatedElement animation="slide-up" delay={0.3}>
            <div className="gradient-border-animated bg-fmv-carbon-darker/60 rounded-lg overflow-hidden transform scale-105 shadow-xl h-full">
              <div className="p-8 h-full flex flex-col">
                <div>
                  <div className="bg-fmv-orange text-white text-sm font-semibold uppercase py-1 px-4 rounded-full inline-block mb-4">Beliebt</div>
                  <h3 className="text-2xl font-medium mb-2 text-fmv-silk">Flash</h3>
                  <p className="text-fmv-orange text-4xl font-bold mb-6">CHF 250</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                      <span className="text-gray-400">60 Sekunden Video</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                      <span className="text-gray-400">Bis zu 10 Fotos</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                      <span className="text-gray-400">Alle Formatvarianten (16:9, 9:16, 1:1)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                      <span className="text-gray-400">Musik aus unserer Bibliothek oder eigene Musik</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                      <span className="text-gray-400">Bis zu 6 Texteinblendungen</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                      <span className="text-gray-400">Lieferung in 24-48h</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                      <span className="text-gray-400">2 Korrekturschleifen</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                      <span className="text-gray-400">HD-Qualität 1080p</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-auto">
                  <Link
                    to="/bestellen?package=flash"
                    className="block w-full fmv-primary-btn text-center px-6 py-3"
                  >
                    Jetzt bestellen
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedElement>
          
          {/* Ultra Package */}
          <AnimatedElement animation="slide-up" delay={0.5}>
            <Card className="flex flex-col h-full">
              <div>
                <h3 className="text-2xl font-medium mb-2 text-fmv-silk">Ultra</h3>
                <p className="text-fmv-orange text-4xl font-bold mb-6">CHF 350</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">90 Sekunden Video</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Bis zu 20 Fotos</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Alle Formatvarianten (16:9, 9:16, 1:1)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Musik aus unserer Bibliothek oder eigene Musik</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Bis zu 10 Texteinblendungen</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Lieferung in 24-48h</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">3 Korrekturschleifen</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">HD-Qualität 1080p</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-fmv-orange mr-2 flex-shrink-0" />
                    <span className="text-gray-400">Premium-Support</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto">
                <Link
                  to="/bestellen?package=ultra"
                  className="block w-full fmv-primary-btn text-center px-6 py-3"
                >
                  Jetzt bestellen
                </Link>
              </div>
            </Card>
          </AnimatedElement>
        </div>
      </SectionWrapper>
      
      {/* Additional Services Section */}
      <SectionWrapper className="bg-gradient-to-b from-fmv-carbon-darker to-fmv-carbon">
        <SectionTitle 
          title="Zusätzliche Leistungen" 
          subtitle="Maßgeschneiderte Optionen für deine speziellen Anforderungen"
        />
        
        <div className="max-w-3xl mx-auto">
          <Card border={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatedElement animation="slide-up" delay={0.1}>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center border-b border-fmv-carbon-light/20 pb-3 mb-3">
                    <span className="text-fmv-silk font-medium">Zusätzliche Korrekturschleife</span>
                    <span className="text-fmv-orange font-medium">CHF 50</span>
                  </div>
                  <p className="text-gray-400 text-sm">Weitere Änderungen nach den inkludierten Korrekturschleifen.</p>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-up" delay={0.2}>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center border-b border-fmv-carbon-light/20 pb-3 mb-3">
                    <span className="text-fmv-silk font-medium">Express-Lieferung (12h)</span>
                    <span className="text-fmv-orange font-medium">CHF 100</span>
                  </div>
                  <p className="text-gray-400 text-sm">Prioritäts-Bearbeitung und beschleunigte Lieferung innerhalb von 12 Stunden.</p>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-up" delay={0.3}>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center border-b border-fmv-carbon-light/20 pb-3 mb-3">
                    <span className="text-fmv-silk font-medium">Zusätzliches Format</span>
                    <span className="text-fmv-orange font-medium">CHF 30</span>
                  </div>
                  <p className="text-gray-400 text-sm">Weitere Formatvariante bei Spark-Paket (bei anderen Paketen inklusive).</p>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-up" delay={0.4}>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center border-b border-fmv-carbon-light/20 pb-3 mb-3">
                    <span className="text-fmv-silk font-medium">4K-Ausgabe</span>
                    <span className="text-fmv-orange font-medium">CHF 50</span>
                  </div>
                  <p className="text-gray-400 text-sm">Optimierung und Lieferung des Videos in 4K-Qualität.</p>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-up" delay={0.5}>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center border-b border-fmv-carbon-light/20 pb-3 mb-3">
                    <span className="text-fmv-silk font-medium">Individuelle Farbkorrektur</span>
                    <span className="text-fmv-orange font-medium">CHF 60</span>
                  </div>
                  <p className="text-gray-400 text-sm">Professionelle Farbkorrektur für optimale Bildqualität.</p>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-up" delay={0.6}>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center border-b border-fmv-carbon-light/20 pb-3 mb-3">
                    <span className="text-fmv-silk font-medium">Individuelle Animationen/Effekte</span>
                    <span className="text-fmv-orange font-medium">CHF 60</span>
                  </div>
                  <p className="text-gray-400 text-sm">Maßgeschneiderte Animationen und visuelle Effekte.</p>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-up" delay={0.7}>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center border-b border-fmv-carbon-light/20 pb-3 mb-3">
                    <span className="text-fmv-silk font-medium">Upgrade Videoqualität</span>
                    <span className="text-fmv-orange font-medium">CHF 50</span>
                  </div>
                  <p className="text-gray-400 text-sm">Verbesserung der Videoqualität für professionellere Ergebnisse.</p>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-up" delay={0.8}>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center border-b border-fmv-carbon-light/20 pb-3 mb-3">
                    <span className="text-fmv-silk font-medium">Expresslieferung</span>
                    <span className="text-fmv-orange font-medium">CHF 100</span>
                  </div>
                  <p className="text-gray-400 text-sm">Beschleunigte Bearbeitung und Lieferung.</p>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-up" delay={0.9}>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center border-b border-fmv-carbon-light/20 pb-3 mb-3">
                    <span className="text-fmv-silk font-medium">Quelldateien erhalten</span>
                    <span className="text-fmv-orange font-medium">CHF 120</span>
                  </div>
                  <p className="text-gray-400 text-sm">Erhalten Sie die Quelldateien für weitere Bearbeitung.</p>
                </div>
              </AnimatedElement>
            </div>
          </Card>
        </div>
      </SectionWrapper>

      {/* Calendly Integration */}
      <SectionWrapper className="bg-gradient-to-b from-fmv-carbon-darker to-fmv-carbon py-12">
        <div className="max-w-3xl mx-auto">
          <AnimatedElement animation="fade">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-light mb-4">
                <span className="text-fmv-orange font-medium">Großprojekte</span> & Unternehmensangebote
              </h2>
              <p className="text-fmv-silk/80 max-w-2xl mx-auto">
                Benötigen Sie mehr als 10 Videos pro Monat oder haben spezielle Anforderungen?
                Wir bieten maßgeschneiderte Lösungen für Unternehmen mit individuellen Preismodellen.
              </p>
            </div>
            <CalendlyWidget 
              url="https://calendly.com/fixmyvideo/beratung"
              text="Vereinbaren Sie ein kostenloses Beratungsgespräch für Ihre individuellen Anforderungen"
              buttonText="Beratungstermin buchen"
            />
          </AnimatedElement>
        </div>
      </SectionWrapper>

      {/* Payment Information */}
      <SectionWrapper className="bg-gradient-to-br from-fmv-carbon to-fmv-carbon-darker">
        <SectionTitle 
          title="Zahlungsinformationen" 
          subtitle="Einfache und sichere Bezahlung für deine Video-Bestellung"
        />
        
        <div className="max-w-3xl mx-auto">
          <Card>
            <h3 className="text-xl font-medium mb-6 text-fmv-silk text-center">Akzeptierte Zahlungsmethoden</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <AnimatedElement animation="slide-up" delay={0.1}>
                <div className="bg-gradient-to-b from-gray-800/30 to-gray-800/10 p-6 rounded-lg text-center">
                  <CreditCard className="h-8 w-8 text-fmv-orange mx-auto mb-3" />
                  <p className="text-fmv-silk font-medium mb-1">Kreditkarte</p>
                  <p className="text-gray-400 text-sm">Visa, Mastercard, American Express</p>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-up" delay={0.2}>
                <div className="bg-gradient-to-b from-gray-800/30 to-gray-800/10 p-6 rounded-lg text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-fmv-orange mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                    <path d="M9.34 9.34a3 3 0 1 0 0 5.32"></path>
                    <path d="M14.66 14.66a3 3 0 1 0 0-5.32"></path>
                  </svg>
                  <p className="text-fmv-silk font-medium mb-1">PayPal</p>
                  <p className="text-gray-400 text-sm">Schnell und sicher bezahlen</p>
                </div>
              </AnimatedElement>
              
              <AnimatedElement animation="slide-up" delay={0.3}>
                <div className="bg-gradient-to-b from-gray-800/30 to-gray-800/10 p-6 rounded-lg text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-fmv-orange mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  <p className="text-fmv-silk font-medium mb-1">Überweisung</p>
                  <p className="text-gray-400 text-sm">Für Firmenkunden (EUR/CHF)</p>
                </div>
              </AnimatedElement>
            </div>
            <p className="text-gray-400 text-center">Alle Preise verstehen sich netto zzgl. der gesetzlichen MwSt. Bei Überweisungen beginnt die Produktion nach Zahlungseingang.</p>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <AnimatedElement animation="fade" delay={0.4}>
            <Link
              to="/bestellen"
              className="fmv-primary-btn px-8 py-4 inline-flex items-center text-lg"
            >
              Jetzt Video bestellen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </AnimatedElement>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default PricingPage;