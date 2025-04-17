import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Video, Award, Shield, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/AnimatedElement';
import PageHeader from '../components/PageHeader';
import SectionWrapper from '../components/SectionWrapper';
import SectionTitle from '../components/SectionTitle';
import Card from '../components/Card';
import CalendlyWidget from '../components/CalendlyWidget';

const AboutUsPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Über FixMyVideo.io"
        subtitle="Ein innovatives Schweizer Unternehmen, das die Kraft der Künstlichen Intelligenz nutzt, um beeindruckende Videos aus einfachen Bildern zu erstellen."
      />

      {/* Mission Section */}
      <SectionWrapper 
        className="bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker" 
        withDecoration
      >
        <div className="flex flex-col md:flex-row items-center">
          <AnimatedElement animation="slide-right" className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-fmv-orange to-purple-600 rounded-lg blur-xl opacity-30"></div>
              <div className="relative rounded-lg overflow-hidden border border-fmv-carbon-light/30">
                <img 
                  src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&auto=format&fit=crop" 
                  alt="KI Visualisierung" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </AnimatedElement>
          
          <AnimatedElement animation="slide-left" className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-light mb-6 text-fmv-silk">
              <span className="text-fmv-orange font-medium">Unsere Mission</span>
            </h2>
            <p className="text-fmv-silk/80 mb-6 font-light">
              Unsere Mission ist es, professionelles Videomarketing für jedes Unternehmen – unabhängig von Grösse oder Budget – zugänglich, einfach und schnell zu machen.
            </p>
            <p className="text-fmv-silk/80 mb-6 font-light">
              Mit Sitz in der Schweiz stehen wir für Qualität, Zuverlässigkeit und Datenschutz. Wir glauben, dass jedes Unternehmen von der Kraft des Videomarketings profitieren sollte, ohne dafür teure Agenturen oder komplexe Software zu benötigen.
            </p>
            <p className="text-fmv-silk/80 font-light">
              Durch den Einsatz fortschrittlicher KI-Technologie verwandeln wir einfache Fotos in beeindruckende Videos, die Kunden begeistern und Conversions steigern.
            </p>
          </AnimatedElement>
        </div>
      </SectionWrapper>

      {/* Values Section */}
      <SectionWrapper className="bg-gradient-to-b from-fmv-carbon-darker to-fmv-carbon" withPattern>
        <SectionTitle title="Unsere Werte" subtitle="Was uns antreibt und definiert" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatedElement animation="slide-up" delay={0.1}>
            <Card centered>
              <div className="bg-fmv-orange/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="h-8 w-8 text-fmv-orange" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-fmv-silk">Qualität</h3>
              <p className="text-gray-400">
                Wir liefern Videos, die nicht nur gut aussehen, sondern auch wirkungsvoll sind und deine Marke optimal repräsentieren.
              </p>
            </Card>
          </AnimatedElement>
          
          <AnimatedElement animation="slide-up" delay={0.2}>
            <Card centered>
              <div className="bg-fmv-orange/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-fmv-orange" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-fmv-silk">Effizienz</h3>
              <p className="text-gray-400">
                Zeit ist wertvoll. Deshalb bieten wir einen schnellen, unkomplizierten Prozess und liefern innerhalb von 48 Stunden.
              </p>
            </Card>
          </AnimatedElement>
          
          <AnimatedElement animation="slide-up" delay={0.3}>
            <Card centered>
              <div className="bg-fmv-orange/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-fmv-orange" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-fmv-silk">Vertrauen</h3>
              <p className="text-gray-400">
                Als Schweizer Unternehmen legen wir höchsten Wert auf Datenschutz, Zuverlässigkeit und Transparenz in allen Prozessen.
              </p>
            </Card>
          </AnimatedElement>
          
          <AnimatedElement animation="slide-up" delay={0.4}>
            <Card centered>
              <div className="bg-fmv-orange/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-fmv-orange" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-fmv-silk">Kundenfokus</h3>
              <p className="text-gray-400">
                Dein Erfolg ist unser Erfolg. Wir arbeiten eng mit dir zusammen, um sicherzustellen, dass deine Vision umgesetzt wird.
              </p>
            </Card>
          </AnimatedElement>
        </div>
      </SectionWrapper>

      {/* Technology Section - replacing the Team Section */}
      <SectionWrapper className="bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker" withDecoration>
        <SectionTitle title="Unsere Technologie" subtitle="Wie wir KI einsetzen, um beeindruckende Videos zu erstellen" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <AnimatedElement animation="slide-up" delay={0.1}>
            <div className="bg-gradient-to-b from-gray-800/20 to-fmv-carbon-light/5 backdrop-blur-sm rounded-lg overflow-hidden group border border-fmv-carbon-light/30">
              <div className="relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop" 
                  alt="KI-Bildverarbeitung" 
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fmv-carbon-darker via-transparent to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium mb-2 text-fmv-silk">Fortschrittliche KI-Bildverarbeitung</h3>
                <p className="text-gray-400 text-sm">
                  Unsere proprietäre KI-Technologie analysiert Ihre Bilder im Detail und erkennt wichtige Elemente, um bewegende Szenen mit natürlichen Übergängen zu erzeugen. Die Algorithmen wurden speziell entwickelt, um professionelle Videoproduktionsstandards einzuhalten.
                </p>
              </div>
            </div>
          </AnimatedElement>
          
          <AnimatedElement animation="slide-up" delay={0.2}>
            <div className="bg-gradient-to-b from-gray-800/20 to-fmv-carbon-light/5 backdrop-blur-sm rounded-lg overflow-hidden group border border-fmv-carbon-light/30">
              <div className="relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format&fit=crop" 
                  alt="Sichere Datenverarbeitung" 
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fmv-carbon-darker via-transparent to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium mb-2 text-fmv-silk">Sichere Schweizer Infrastruktur</h3>
                <p className="text-gray-400 text-sm">
                  Alle Daten werden auf sicheren Servern in der Schweiz verarbeitet und gespeichert, entsprechend den strengen lokalen Datenschutzbestimmungen. Nach Abschluss Ihres Projekts werden Ihre Originalbilder automatisch gelöscht, sofern nicht anders vereinbart.
                </p>
              </div>
            </div>
          </AnimatedElement>
        </div>
        
        <AnimatedElement animation="slide-up" delay={0.3}>
          <div className="bg-gradient-to-b from-gray-800/20 to-fmv-carbon-light/5 backdrop-blur-sm rounded-lg overflow-hidden border border-fmv-carbon-light/30 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <h3 className="text-xl font-medium mb-4 text-fmv-silk">Der Unterschied zu anderen Lösungen</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="rounded-full bg-fmv-orange/20 p-1 mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-fmv-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-gray-400">
                      <span className="text-fmv-silk">Spezialisierung auf Schweizer Markt:</span> Optimiert für lokale Geschäftsanforderungen und ästhetische Präferenzen.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-fmv-orange/20 p-1 mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-fmv-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-gray-400">
                      <span className="text-fmv-silk">Hybrides Modell:</span> Unsere KI wird durch menschliches Qualitätsmanagement ergänzt für überragende Ergebnisse.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-fmv-orange/20 p-1 mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-fmv-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-gray-400">
                      <span className="text-fmv-silk">Fortlaufende Innovation:</span> Kontinuierliche Weiterentwicklung unserer Algorithmen mit den neuesten Forschungsergebnissen.
                    </p>
                  </li>
                </ul>
              </div>
              
              <div className="md:w-1/2 md:border-l border-fmv-carbon-light/30 md:pl-6">
                <h3 className="text-xl font-medium mb-4 text-fmv-silk">Zukunftsvisionen</h3>
                <p className="text-gray-400 mb-4">
                  Wir arbeiten kontinuierlich an der Verbesserung unserer Technologie, um noch beeindruckendere Videoeffekte, nahtlosere Übergänge und fortschrittlichere Anpassungsoptionen anzubieten.
                </p>
                <p className="text-gray-400">
                  Unser Ziel ist es, die Grenze zwischen statischen Bildern und dynamischen Videos vollständig zu verwischen und jedem die Möglichkeit zu geben, professionelle Videoinhalte zu erstellen – unabhängig von technischen Vorkenntnissen oder Budget.
                </p>
              </div>
            </div>
          </div>
        </AnimatedElement>
      </SectionWrapper>

      {/* Swiss Quality Section */}
      <SectionWrapper className="bg-gradient-to-b from-fmv-carbon-darker to-fmv-carbon" withPattern>
        <AnimatedElement animation="fade">
          <div className="bg-gradient-to-br from-gray-800/30 to-fmv-carbon-light/5 rounded-lg overflow-hidden border border-fmv-carbon-light/20 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-fmv-carbon-light/20">
                <div className="flex justify-center mb-4">
                  <img src="https://i.imgur.com/woSig5t.png" alt="FixMyVideo Logo" className="h-24" />
                </div>
                <h3 className="text-2xl font-medium mb-4 text-fmv-orange text-center">Schweizer Qualität</h3>
                <div className="flex justify-center">
                  <Award className="h-12 w-12 text-fmv-orange" />
                </div>
              </div>
              
              <div className="md:w-2/3 p-8">
                <p className="text-fmv-silk/80 mb-6 font-light">
                  Als Schweizer Unternehmen sind wir stolz auf unsere Werte: Präzision, Zuverlässigkeit und höchste Qualitätsstandards. Diese Prinzipien fliessen in jeden Aspekt unserer Arbeit ein.
                </p>
                <p className="text-fmv-silk/80 mb-6 font-light">
                  Unsere Kunden schätzen nicht nur die hervorragende Qualität unserer Videos, sondern auch unsere Datenschutzstandards gemäss Schweizer Gesetzgebung, die zu den strengsten weltweit gehört.
                </p>
                <p className="text-fmv-silk/80 font-light">
                  Wir behandeln deine Daten und Bilder mit höchster Sorgfalt und Vertraulichkeit. Deine Inhalte werden ausschliesslich für die Erstellung deiner Videos verwendet und niemals für andere Zwecke weitergegeben oder genutzt.
                </p>
              </div>
            </div>
          </div>
        </AnimatedElement>
      </SectionWrapper>

      {/* Calendly Integration */}
      <SectionWrapper className="bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker py-12">
        <div className="max-w-3xl mx-auto">
          <AnimatedElement animation="fade">
            <CalendlyWidget 
              url="https://calendly.com/fixmyvideo/beratung"
              text="Möchten Sie mehr über unsere Unternehmensangebote erfahren? Buchen Sie einen kostenlosen Beratungstermin."
              buttonText="Beratungsgespräch vereinbaren"
            />
          </AnimatedElement>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper className="py-20 bg-gradient-to-br from-fmv-carbon to-fmv-carbon-darker">
        {/* Decorative animated glow */}
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,88,0,0.5)_0%,transparent_50%)]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedElement animation="fade">
            <h2 className="section-title">
              <span className="font-light">Bereit, mit uns </span>
              <span className="text-fmv-orange font-medium">zusammenzuarbeiten</span>
              <span className="font-light">?</span>
            </h2>
            <div className="section-divider"></div>
            <p className="text-xl mb-8 text-fmv-silk/80 font-light">
              Lass uns gemeinsam beeindruckende Videos für dein Unternehmen erstellen, die deine Kunden begeistern werden.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/bestellen"
                className="fmv-primary-btn px-8 py-4 text-lg inline-flex items-center"
              >
                Video bestellen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/kontakt"
                className="fmv-secondary-btn px-8 py-4 text-lg"
              >
                Kontakt aufnehmen
              </Link>
            </div>
          </AnimatedElement>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default AboutUsPage;