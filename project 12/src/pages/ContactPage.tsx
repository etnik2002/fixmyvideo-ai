import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedElement from '../components/AnimatedElement';
import PageHeader from '../components/PageHeader';
import SectionWrapper from '../components/SectionWrapper';
import SectionTitle from '../components/SectionTitle';
import Card from '../components/Card';
import CalendlyWidget from '../components/CalendlyWidget';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsSubmitted(true);
    // In a real implementation, this would submit the form data to a backend
    
    // Reset after 5 seconds for demo purposes
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 5000);
  };

  const faqItems = [
    {
      question: "Wie schnell erhalte ich mein Video?",
      answer: "In der Regel liefern wir innerhalb von 24-48 Stunden nach Bestellungseingang. Bei hohem Aufkommen kann es in Ausnahmefällen etwas länger dauern."
    },
    {
      question: "Kann ich Änderungen am fertigen Video anfordern?",
      answer: "Ja, je nach gewähltem Paket ist eine bestimmte Anzahl an Korrekturschleifen inbegriffen. Weitere Änderungen können gegen einen Aufpreis vorgenommen werden."
    },
    {
      question: "Wie werden meine Daten und Bilder geschützt?",
      answer: "Als Schweizer Unternehmen unterliegen wir strengen Datenschutzrichtlinien. Deine Daten und Bilder werden ausschließlich für die Erstellung deiner Videos verwendet und niemals für andere Zwecke weitergegeben."
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Kontakt"
        subtitle="Hast du Fragen oder möchtest du mehr über unsere Dienstleistungen erfahren? Kontaktiere uns – wir sind für dich da."
      />

      {/* Contact Form & Info Section */}
      <SectionWrapper 
        className="bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker" 
        withPattern
        withDecoration
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <AnimatedElement animation="slide-right" className="lg:col-span-1">
            <Card className="h-full">
              <h2 className="text-2xl font-medium mb-8 text-fmv-orange">Kontaktinformationen</h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-fmv-orange/20 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="h-6 w-6 text-fmv-orange" />
                  </div>
                  <div>
                    <h3 className="text-fmv-silk font-medium mb-1">E-Mail</h3>
                    <a 
                      href="mailto:info@fixmyvideo.io" 
                      className="text-gray-400 hover:text-fmv-orange transition-colors inline-block"
                    >
                      info@fixmyvideo.io
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-fmv-orange/20 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="h-6 w-6 text-fmv-orange" />
                  </div>
                  <div>
                    <h3 className="text-fmv-silk font-medium mb-1">Telefon</h3>
                    <a 
                      href="tel:+41441234567" 
                      className="text-gray-400 hover:text-fmv-orange transition-colors inline-block"
                    >
                      +41 44 123 45 67
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-fmv-orange/20 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-fmv-orange" />
                  </div>
                  <div>
                    <h3 className="text-fmv-silk font-medium mb-1">Adresse</h3>
                    <address className="text-gray-400 not-italic">
                      Musterstrasse 123<br />
                      8000 Zürich<br />
                      Schweiz
                    </address>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-fmv-carbon-light/20">
                <h3 className="text-fmv-silk font-medium mb-4">Geschäftszeiten</h3>
                <ul className="text-gray-400 space-y-2">
                  <li className="flex justify-between">
                    <span>Montag - Freitag:</span>
                    <span>9:00 - 18:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Samstag:</span>
                    <span>Geschlossen</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sonntag:</span>
                    <span>Geschlossen</span>
                  </li>
                </ul>
              </div>
            </Card>
          </AnimatedElement>
          
          {/* Contact Form */}
          <AnimatedElement animation="slide-left" className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-medium mb-8 text-fmv-orange">Schreib uns</h2>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="inline-flex items-center justify-center bg-fmv-orange/20 rounded-full w-20 h-20 mb-6"
                  >
                    <CheckCircle className="h-10 w-10 text-fmv-orange" />
                  </motion.div>
                  <h3 className="text-2xl font-medium mb-4 text-fmv-silk">Nachricht gesendet!</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Vielen Dank für deine Nachricht. Wir werden uns in Kürze bei dir melden.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-fmv-silk/80 font-light mb-2">
                        Name <span className="text-fmv-orange">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full bg-fmv-carbon-darker border border-fmv-carbon-light/30 rounded-md px-4 py-3 text-fmv-silk placeholder-gray-500 focus:border-fmv-orange/50 focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
                        placeholder="Dein Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-fmv-silk/80 font-light mb-2">
                        E-Mail <span className="text-fmv-orange">*</span>
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full bg-fmv-carbon-darker border border-fmv-carbon-light/30 rounded-md px-4 py-3 text-fmv-silk placeholder-gray-500 focus:border-fmv-orange/50 focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
                        placeholder="deine.email@beispiel.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-fmv-silk/80 font-light mb-2">
                        Telefon (optional)
                      </label>
                      <input 
                        type="tel" 
                        id="phone" 
                        className="w-full bg-fmv-carbon-darker border border-fmv-carbon-light/30 rounded-md px-4 py-3 text-fmv-silk placeholder-gray-500 focus:border-fmv-orange/50 focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
                        placeholder="+41 XX XXX XX XX"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-fmv-silk/80 font-light mb-2">
                        Betreff <span className="text-fmv-orange">*</span>
                      </label>
                      <select 
                        id="subject" 
                        className="w-full bg-fmv-carbon-darker border border-fmv-carbon-light/30 rounded-md px-4 py-3 text-fmv-silk focus:border-fmv-orange/50 focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Bitte wählen...</option>
                        <option value="allgemein">Allgemeine Anfrage</option>
                        <option value="bestellung">Frage zu einer Bestellung</option>
                        <option value="support">Technischer Support</option>
                        <option value="geschaeftlich">Geschäftliche Kooperation</option>
                        <option value="presse">Presseanfrage</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-fmv-silk/80 font-light mb-2">
                      Nachricht <span className="text-fmv-orange">*</span>
                    </label>
                    <textarea 
                      id="message" 
                      className="w-full bg-fmv-carbon-darker border border-fmv-carbon-light/30 rounded-md px-4 py-3 text-fmv-silk placeholder-gray-500 focus:border-fmv-orange/50 focus:outline-none focus:ring-1 focus:ring-fmv-orange/50"
                      rows={6}
                      placeholder="Wie können wir dir helfen?"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="privacy" 
                      className="mr-3"
                      required
                    />
                    <label htmlFor="privacy" className="text-gray-400 text-sm">
                      Ich habe die <a href="/datenschutz" className="text-fmv-orange hover:underline">Datenschutzbestimmungen</a> gelesen und akzeptiert.
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="fmv-primary-btn px-8 py-3 font-medium"
                  >
                    Nachricht senden
                  </button>
                </form>
              )}
            </Card>
          </AnimatedElement>
        </div>
      </SectionWrapper>
      
      {/* Calendly Integration */}
      <SectionWrapper className="bg-gradient-to-b from-fmv-carbon-darker to-fmv-carbon" withPattern>
        <div className="max-w-3xl mx-auto">
          <AnimatedElement animation="fade">
            <CalendlyWidget 
              url="https://calendly.com/fixmyvideo/beratung"
              text="Buchen Sie einen kostenlosen Beratungstermin für größere Projekte (10+ Videos/Monat)"
              buttonText="Jetzt Termin buchen"
            />
          </AnimatedElement>
        </div>
      </SectionWrapper>

      {/* FAQ Preview Section */}
      <SectionWrapper 
        className="bg-gradient-to-b from-fmv-carbon-darker to-fmv-carbon" 
        withPattern
      >
        <SectionTitle title="Häufig gestellte Fragen" subtitle="Schnelle Antworten auf deine wichtigsten Fragen" />
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <AnimatedElement key={index} animation="slide-up" delay={index * 0.1}>
                <Card>
                  <h3 className="text-xl font-medium mb-3 text-fmv-silk">{item.question}</h3>
                  <p className="text-gray-400">{item.answer}</p>
                </Card>
              </AnimatedElement>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <AnimatedElement animation="fade" delay={0.4}>
              <Link 
                to="/prozess#faq" 
                className="inline-flex items-center text-fmv-orange hover:text-fmv-orange-light font-medium transition-colors group"
              >
                <span>Weitere häufig gestellte Fragen</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </AnimatedElement>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ContactPage;