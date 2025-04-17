import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Settings, Video, ArrowRight, Clock, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/AnimatedElement';
import PageHeader from '../components/PageHeader';
import SectionWrapper from '../components/SectionWrapper';
import SectionTitle from '../components/SectionTitle';
import FeatureCard from '../components/FeatureCard';
import Card from '../components/Card';

const ProcessPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="So funktioniert FixMyVideo"
        subtitle="Unser einfacher Prozess verwandelt deine Bilder in beeindruckende Videos - ohne Vorkenntnisse und in kürzester Zeit."
      />

      {/* Process Steps Section */}
      <SectionWrapper 
        className="bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker" 
        withPattern 
        withDecoration
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <FeatureCard 
            title="Bilder hochladen"
            description="Lade deine besten Bilder hoch. Je hochwertiger das Ausgangsmaterial, desto beeindruckender das Ergebnis."
            icon={Upload}
            variant="numbered"
            number={1}
            delay={0.2}
          />
          
          <FeatureCard 
            title="Einstellungen personalisieren"
            description="Passe dein Video genau nach deinen Wünschen an. Wähle Formate, Dynamik, Musik und Text-Overlays."
            icon={Settings}
            variant="numbered"
            number={2}
            delay={0.4}
          />
          
          <FeatureCard 
            title="Video erhalten & einsetzen"
            description="Innerhalb von 24-48 Stunden erhältst du dein fertig produziertes Video in höchster Qualität, bereit für deinen Marketing-Erfolg."
            icon={Video}
            variant="numbered"
            number={3}
            delay={0.6}
          />
        </div>
      </SectionWrapper>

      {/* Detailed Process Section */}
      <SectionWrapper className="bg-gradient-to-b from-fmv-carbon-darker to-fmv-carbon">
        <div className="space-y-24">
          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row items-center">
            <AnimatedElement animation="slide-right" className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-fmv-orange to-purple-600 rounded-lg blur-lg opacity-30"></div>
                <div className="relative rounded-lg overflow-hidden border border-fmv-carbon-light/30">
                  <img 
                    src="https://images.unsplash.com/photo-1607434472257-d9f8e57a643d?q=80&w=1200&auto=format&fit=crop" 
                    alt="Bilder hochladen" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-left" className="lg:w-1/2 lg:pl-12">
              <div className="bg-gradient-to-br from-fmv-orange/5 to-fmv-orange/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Upload className="h-8 w-8 text-fmv-orange" />
                <div className="absolute -top-2 -left-2 w-8 h-8 flex items-center justify-center bg-fmv-orange text-white rounded-full text-sm font-medium">
                  1
                </div>
              </div>
              <h2 className="text-3xl font-light mb-6 text-fmv-silk">
                <span className="text-fmv-orange font-medium">Bilder hochladen</span>
              </h2>
              <p className="text-fmv-silk/80 mb-6 font-light">
                Lade deine besten Bilder hoch. Je hochwertiger das Ausgangsmaterial, desto beeindruckender das Ergebnis. Unsere KI analysiert deine Bilder und erkennt automatisch die wichtigsten Elemente.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-fmv-orange/10 rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-fmv-orange" />
                  </div>
                  <span className="text-gray-400">
                    Einfacher Drag & Drop Upload
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-fmv-orange/10 rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-fmv-orange" />
                  </div>
                  <span className="text-gray-400">
                    Alle gängigen Bildformate unterstützt
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-fmv-orange/10 rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-fmv-orange" />
                  </div>
                  <span className="text-gray-400">
                    5-20 Bilder je nach Videopaket
                  </span>
                </li>
              </ul>
            </AnimatedElement>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center">
            <AnimatedElement animation="slide-left" className="lg:w-1/2 mb-8 lg:mb-0 lg:pl-12">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-fmv-orange rounded-lg blur-lg opacity-30"></div>
                <div className="relative rounded-lg overflow-hidden border border-fmv-carbon-light/30">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop" 
                    alt="Einstellungen wählen" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-right" className="lg:w-1/2 lg:pr-12">
              <div className="bg-gradient-to-br from-fmv-orange/5 to-fmv-orange/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Settings className="h-8 w-8 text-fmv-orange" />
                <div className="absolute -top-2 -left-2 w-8 h-8 flex items-center justify-center bg-fmv-orange text-white rounded-full text-sm font-medium">
                  2
                </div>
              </div>
              <h2 className="text-3xl font-light mb-6 text-fmv-silk">
                <span className="text-fmv-orange font-medium">Einstellungen personalisieren</span>
              </h2>
              <p className="text-fmv-silk/80 mb-6 font-light">
                Passe dein Video genau nach deinen Wünschen an. Wähle Formate, Dynamik, Musik und Text-Overlays, um ein perfekt auf dein Publikum zugeschnittenes Video zu erhalten.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-fmv-orange/10 rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-fmv-orange" />
                  </div>
                  <span className="text-gray-400">
                    Wunschformate (16:9, 9:16, 1:1)
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-fmv-orange/10 rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-fmv-orange" />
                  </div>
                  <span className="text-gray-400">
                    Dynamik & Stil wählen
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-fmv-orange/10 rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-fmv-orange" />
                  </div>
                  <span className="text-gray-400">
                    Musik oder Audio hinzufügen
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-fmv-orange/10 rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-fmv-orange" />
                  </div>
                  <span className="text-gray-400">
                    Text-Overlays anpassen
                  </span>
                </li>
              </ul>
            </AnimatedElement>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row items-center">
            <AnimatedElement animation="slide-right" className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-fmv-orange to-purple-600 rounded-lg blur-lg opacity-30"></div>
                <div className="relative rounded-lg overflow-hidden border border-fmv-carbon-light/30">
                  <img 
                    src="https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200&auto=format&fit=crop" 
                    alt="Video erhalten" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-left" className="lg:w-1/2 lg:pl-12">
              <div className="bg-gradient-to-br from-fmv-orange/5 to-fmv-orange/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Video className="h-8 w-8 text-fmv-orange" />
                <div className="absolute -top-2 -left-2 w-8 h-8 flex items-center justify-center bg-fmv-orange text-white rounded-full text-sm font-medium">
                  3
                </div>
              </div>
              <h2 className="text-3xl font-light mb-6 text-fmv-silk">
                <span className="text-fmv-orange font-medium">Video erhalten & einsetzen</span>
              </h2>
              <p className="text-fmv-silk/80 mb-6 font-light">
                Innerhalb von 24-48 Stunden erhältst du dein fertig produziertes Video in höchster Qualität, bereit für deinen Marketing-Erfolg.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-fmv-orange/10 rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-fmv-orange" />
                  </div>
                  <span className="text-gray-400">
                    Download in HD-Qualität
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-fmv-orange/10 rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-fmv-orange" />
                  </div>
                  <span className="text-gray-400">
                    Lieferung innerhalb von 24-48h
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-fmv-orange/10 rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-fmv-orange" />
                  </div>
                  <span className="text-gray-400">
                    Eine Korrekturschleife inklusive
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-fmv-orange/10 rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-fmv-orange" />
                  </div>
                  <span className="text-gray-400">
                    Sofort einsatzbereit für alle Plattformen
                  </span>
                </li>
              </ul>
            </AnimatedElement>
          </div>
        </div>
      </SectionWrapper>

      {/* FAQ Section */}
      <SectionWrapper className="bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker" withDecoration>
        <SectionTitle
          title="Häufig gestellte Fragen"
          subtitle="Antworten auf die wichtigsten Fragen zu unseren Video-Services"
        />
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <AnimatedElement animation="slide-up" delay={0.1}>
              <Card>
                <h3 className="text-xl font-medium mb-3 text-fmv-silk">Welche Bildformate werden unterstützt?</h3>
                <p className="text-gray-400">Wir unterstützen alle gängigen Bildformate wie JPG, PNG, und TIFF. Die Bilder sollten eine möglichst hohe Auflösung haben für beste Ergebnisse.</p>
              </Card>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.2}>
              <Card>
                <h3 className="text-xl font-medium mb-3 text-fmv-silk">Wie viele Bilder kann ich hochladen?</h3>
                <p className="text-gray-400">Je nach Paket kannst du zwischen 5-20 Bilder hochladen. Je mehr Bilder, desto vielfältiger kann das Video gestaltet werden.</p>
              </Card>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.3}>
              <Card>
                <h3 className="text-xl font-medium mb-3 text-fmv-silk">Kann ich meine eigene Musik verwenden?</h3>
                <p className="text-gray-400">Ja, du kannst eigene Musik hochladen. Bitte stelle sicher, dass du die Rechte an der Musik besitzt oder eine Lizenz zur Verwendung hast.</p>
              </Card>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.4}>
              <Card>
                <h3 className="text-xl font-medium mb-3 text-fmv-silk">In welchen Formaten erhalte ich mein Video?</h3>
                <p className="text-gray-400">Du erhältst dein Video in den von dir gewünschten Formaten (16:9, 9:16, 1:1) und als MP4-Datei.</p>
              </Card>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.5}>
              <Card>
                <h3 className="text-xl font-medium mb-3 text-fmv-silk">Wie lange dauert die Produktion?</h3>
                <p className="text-gray-400">In der Regel liefern wir innerhalb von 24-48 Stunden. Bei hohem Aufkommen kann es in Ausnahmefällen etwas länger dauern.</p>
              </Card>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.6}>
              <Card>
                <h3 className="text-xl font-medium mb-3 text-fmv-silk">Kann ich Änderungen am fertigen Video anfordern?</h3>
                <p className="text-gray-400">Ja, eine Korrekturschleife ist im Preis inbegriffen. Weitere Änderungen können gegen einen Aufpreis vorgenommen werden.</p>
              </Card>
            </AnimatedElement>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper 
        className="py-20 bg-gradient-to-br from-fmv-carbon to-fmv-carbon-darker"
        withDecoration
      >
        <div className="max-w-3xl mx-auto text-center">
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
          
          <AnimatedElement animation="fade">
            <h2 className="section-title">
              <span className="font-light">Bereit, dein </span>
              <span className="text-fmv-orange font-medium">Video</span>
              <span className="font-light"> zu erstellen?</span>
            </h2>
            <div className="section-divider"></div>
            <p className="text-xl mb-8 text-fmv-silk/80 font-light">
              Starte jetzt und verwandle deine Bilder in beeindruckende Videos!
            </p>
            <Link
              to="/bestellen"
              className="fmv-primary-btn px-8 py-4 text-lg inline-flex items-center"
            >
              Video erstellen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </AnimatedElement>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ProcessPage;