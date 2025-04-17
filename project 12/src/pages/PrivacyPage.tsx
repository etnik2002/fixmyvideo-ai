import React from 'react';
import PageHeader from '../components/PageHeader';
import SectionWrapper from '../components/SectionWrapper';
import Card from '../components/Card';
import AnimatedElement from '../components/AnimatedElement';
import { Lock, Shield, Database } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Datenschutzerklärung"
        withGradient={false}
        size="normal"
      />

      <SectionWrapper className="bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-6 justify-center mb-10">
            <AnimatedElement animation="slide-up" delay={0.1}>
              <div className="flex flex-col items-center">
                <div className="bg-fmv-orange/20 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                  <Lock className="h-8 w-8 text-fmv-orange" />
                </div>
                <p className="text-fmv-silk font-medium">Hoher Datenschutz</p>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.2}>
              <div className="flex flex-col items-center">
                <div className="bg-fmv-orange/20 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                  <Shield className="h-8 w-8 text-fmv-orange" />
                </div>
                <p className="text-fmv-silk font-medium">SSL-Verschlüsselung</p>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="slide-up" delay={0.3}>
              <div className="flex flex-col items-center">
                <div className="bg-fmv-orange/20 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                  <Database className="h-8 w-8 text-fmv-orange" />
                </div>
                <p className="text-fmv-silk font-medium">Schweizer Serverstandort</p>
              </div>
            </AnimatedElement>
          </div>

          <AnimatedElement animation="fade">
            <Card>
              <h2 className="text-xl font-medium mb-6 text-fmv-silk">1. Datenschutz auf einen Blick</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-fmv-orange">Allgemeine Hinweise</h3>
                  <p className="text-gray-400">
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-fmv-orange">Datenerfassung auf unserer Website</h3>
                  <p className="text-fmv-silk/80 font-light mb-3">
                    <strong className="text-fmv-silk">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong>
                  </p>
                  <p className="text-gray-400 mb-3">
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                  </p>
                  
                  <p className="text-fmv-silk/80 font-light mb-3">
                    <strong className="text-fmv-silk">Wie erfassen wir Ihre Daten?</strong>
                  </p>
                  <p className="text-gray-400 mb-3">
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                  </p>
                  <p className="text-gray-400 mb-3">
                    Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie unsere Website betreten.
                  </p>
                  
                  <p className="text-fmv-silk/80 font-light mb-3">
                    <strong className="text-fmv-silk">Wofür nutzen wir Ihre Daten?</strong>
                  </p>
                  <p className="text-gray-400 mb-3">
                    Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
                  </p>
                  
                  <p className="text-fmv-silk/80 font-light mb-3">
                    <strong className="text-fmv-silk">Welche Rechte haben Sie bezüglich Ihrer Daten?</strong>
                  </p>
                  <p className="text-gray-400">
                    Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
                  </p>
                </div>
              </div>
            </Card>
          </AnimatedElement>
          
          <AnimatedElement animation="fade" delay={0.2} className="mt-10">
            <Card>
              <h2 className="text-xl font-medium mb-6 text-fmv-silk">2. Allgemeine Hinweise und Pflichtinformationen</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-fmv-orange">Datenschutz</h3>
                  <p className="text-gray-400 mb-3">
                    Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                  </p>
                  <p className="text-gray-400 mb-3">
                    Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.
                  </p>
                  <p className="text-gray-400">
                    Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-fmv-orange">Hinweis zur verantwortlichen Stelle</h3>
                  <p className="text-gray-400 mb-3">
                    Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
                  </p>
                  
                  <p className="text-fmv-silk mb-1">FixMyVideo GmbH</p>
                  <p className="text-gray-400 mb-1">Musterstrasse 123</p>
                  <p className="text-gray-400 mb-1">8000 Zürich</p>
                  <p className="text-gray-400 mb-1">Schweiz</p>
                  <p className="text-gray-400 mb-3">E-Mail: <a href="mailto:info@fixmyvideo.io" className="text-fmv-orange hover:underline">info@fixmyvideo.io</a></p>
                  
                  <p className="text-gray-400">
                    Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z.B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
                  </p>
                </div>
              </div>
            </Card>
          </AnimatedElement>
          
          <AnimatedElement animation="fade" delay={0.3} className="mt-10">
            <Card>
              <h2 className="text-xl font-medium mb-6 text-fmv-silk">3. Datenerfassung auf unserer Website</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-fmv-orange">Cookies</h3>
                  <p className="text-gray-400 mb-3">
                    Die Internetseiten verwenden teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert.
                  </p>
                  <p className="text-gray-400 mb-3">
                    Die meisten der von uns verwendeten Cookies sind so genannte "Session-Cookies". Sie werden nach Ende Ihres Besuchs automatisch gelöscht. Andere Cookies bleiben auf Ihrem Endgerät gespeichert bis Sie diese löschen. Diese Cookies ermöglichen es uns, Ihren Browser beim nächsten Besuch wiederzuerkennen.
                  </p>
                  <p className="text-gray-400">
                    Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browser aktivieren. Bei der Deaktivierung von Cookies kann die Funktionalität dieser Website eingeschränkt sein.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-fmv-orange">Server-Log-Dateien</h3>
                  <p className="text-gray-400 mb-3">
                    Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
                  </p>
                  
                  <ul className="list-disc list-inside text-gray-400 mb-3 pl-4 space-y-1">
                    <li>Browsertyp und Browserversion</li>
                    <li>Verwendetes Betriebssystem</li>
                    <li>Referrer URL</li>
                    <li>Hostname des zugreifenden Rechners</li>
                    <li>Uhrzeit der Serveranfrage</li>
                    <li>IP-Adresse</li>
                  </ul>
                  
                  <p className="text-gray-400">
                    Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
                  </p>
                </div>
              </div>
            </Card>
          </AnimatedElement>
          
          <AnimatedElement animation="fade" delay={0.4} className="mt-10">
            <Card>
              <h2 className="text-xl font-medium mb-6 text-fmv-silk">4. Datenverarbeitung für KI-Video-Erstellung</h2>
              
              <div className="space-y-6">
                <p className="text-gray-400 mb-3">
                  Für unseren Dienst zur KI-gestützten Videoerstellung benötigen wir Ihre Bilder und ggf. Audio-Dateien. Diese Inhalte werden ausschließlich für die Erstellung Ihrer angeforderten Videos verwendet und nicht für andere Zwecke genutzt oder an Dritte weitergegeben.
                </p>
                
                <div>
                  <p className="text-fmv-silk/80 font-medium mb-2">Speicherdauer:</p>
                  <p className="text-gray-400">
                    Ihre hochgeladenen Inhalte werden für 30 Tage nach Fertigstellung Ihres Videos gespeichert, um eventuelle Änderungswünsche oder Korrekturen zu ermöglichen. Nach Ablauf dieser Frist werden die Inhalte automatisch von unseren Servern gelöscht, es sei denn, eine längere Aufbewahrung ist aus rechtlichen Gründen erforderlich.
                  </p>
                </div>
                
                <div>
                  <p className="text-fmv-silk/80 font-medium mb-2">Nutzung der KI-Technologie:</p>
                  <p className="text-gray-400">
                    Für die Videoerstellung setzen wir Künstliche Intelligenz ein, die Ihre Bilder analysiert, um daraus ein qualitativ hochwertiges Video zu erstellen. Die KI-Modelle werden nicht mit Ihren Inhalten trainiert, sondern lediglich zur Transformation Ihrer Inhalte in Videos genutzt.
                  </p>
                </div>
                
                <div>
                  <p className="text-fmv-silk/80 font-medium mb-2">Rechtliche Grundlage:</p>
                  <p className="text-gray-400">
                    Die Verarbeitung Ihrer Inhalte erfolgt auf Basis der Vertragserfüllung gemäß Art. 6 Abs. 1 lit. b DSGVO, da die Verarbeitung für die Erbringung unserer Dienstleistung notwendig ist.
                  </p>
                </div>
              </div>
            </Card>
          </AnimatedElement>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default PrivacyPage;