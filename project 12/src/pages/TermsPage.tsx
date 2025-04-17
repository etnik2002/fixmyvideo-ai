import React from 'react';
import PageHeader from '../components/PageHeader';
import SectionWrapper from '../components/SectionWrapper';
import Card from '../components/Card';
import AnimatedElement from '../components/AnimatedElement';

const TermsPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Allgemeine Geschäftsbedingungen"
        withGradient={false}
        size="normal"
      />

      <SectionWrapper className="bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker">
        <div className="max-w-3xl mx-auto">
          <AnimatedElement animation="fade" delay={0.1}>
            <Card className="mb-8">
              <h2 className="text-xl font-medium mb-6 text-fmv-silk">1. Geltungsbereich</h2>
              
              <div className="space-y-4">
                <p className="text-gray-400">
                  1.1 Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") gelten für alle Verträge zwischen der FixMyVideo GmbH, Musterstrasse 123, 8000 Zürich, Schweiz (nachfolgend "Anbieter" oder "wir") und ihren Kunden (nachfolgend "Kunde" oder "Sie") über die Erstellung von KI-gestützten Videos aus Kundenbildern über die Website fixmyvideo.io.
                </p>
                
                <p className="text-gray-400">
                  1.2 Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.
                </p>
                
                <p className="text-gray-400">
                  1.3 Diese AGB gelten sowohl gegenüber Verbrauchern als auch gegenüber Unternehmern, es sei denn, in der jeweiligen Klausel wird eine Differenzierung vorgenommen.
                </p>
              </div>
            </Card>
          </AnimatedElement>
          
          <AnimatedElement animation="fade" delay={0.15} className="mb-8">
            <Card>
              <h2 className="text-xl font-medium mb-6 text-fmv-silk">2. Vertragsgegenstand und Leistungsbeschreibung</h2>
              
              <div className="space-y-4">
                <p className="text-gray-400">
                  2.1 Gegenstand des Vertrags ist die Erstellung von Videos aus vom Kunden bereitgestellten Bildern mittels KI-Technologie gemäß der auf der Website angegeben Leistungsbeschreibungen und Pakete.
                </p>
                
                <p className="text-gray-400">
                  2.2 Der Anbieter bietet verschiedene Videopakete an, die sich in Bezug auf Videolänge, Anzahl der verwendbaren Bilder, Anzahl der Korrekturschleifen und weitere Leistungen unterscheiden. Der genaue Leistungsumfang ergibt sich aus der Beschreibung des jeweiligen Pakets zum Zeitpunkt der Bestellung.
                </p>
                
                <p className="text-gray-400">
                  2.3 Die Lieferzeit beträgt in der Regel 24-48 Stunden ab Eingang aller erforderlichen Materialien und Zahlungsbestätigung, sofern nicht anders vereinbart. Bei hohem Auftragsvolumen kann es zu Verzögerungen kommen, über die der Kunde informiert wird.
                </p>
              </div>
            </Card>
          </AnimatedElement>
          
          <AnimatedElement animation="fade" delay={0.2} className="mb-8">
            <Card>
              <h2 className="text-xl font-medium mb-6 text-fmv-silk">3. Vertragsschluss</h2>
              
              <div className="space-y-4">
                <p className="text-gray-400">
                  3.1 Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern einen unverbindlichen Online-Katalog dar.
                </p>
                
                <p className="text-gray-400">
                  3.2 Der Kunde gibt durch Abschluss des Bestellvorgangs und Betätigung des Buttons "Jetzt bestellen" ein verbindliches Angebot zum Kauf des betreffenden Produkts ab.
                </p>
                
                <p className="text-gray-400">
                  3.3 Der Vertrag kommt zustande, wenn der Anbieter das Angebot des Kunden innerhalb von zwei Werktagen durch eine Auftragsbestätigung per E-Mail annimmt.
                </p>
              </div>
            </Card>
          </AnimatedElement>
          
          <AnimatedElement animation="fade" delay={0.25} className="mb-8">
            <Card>
              <h2 className="text-xl font-medium mb-6 text-fmv-silk">4. Preise und Zahlungsbedingungen</h2>
              
              <div className="space-y-4">
                <p className="text-gray-400">
                  4.1 Alle Preise verstehen sich in Euro zuzüglich der jeweils gültigen gesetzlichen Mehrwertsteuer.
                </p>
                
                <p className="text-gray-400">
                  4.2 Der Kunde kann die Zahlung per Kreditkarte, PayPal oder Banküberweisung vornehmen. Bei Auswahl der Zahlungsart Banküberweisung beginnt die Bearbeitung des Auftrags erst nach Zahlungseingang.
                </p>
                
                <p className="text-gray-400">
                  4.3 Die Vergütung ist ohne Abzug sofort nach Vertragsschluss fällig.
                </p>
              </div>
            </Card>
          </AnimatedElement>
          
          <AnimatedElement animation="fade" delay={0.3} className="mb-8">
            <Card>
              <h2 className="text-xl font-medium mb-6 text-fmv-silk">5. Mitwirkungspflichten des Kunden</h2>
              
              <div className="space-y-4">
                <p className="text-gray-400">
                  5.1 Der Kunde ist verpflichtet, dem Anbieter alle für die Erstellung des Videos erforderlichen Materialien (Bilder, ggf. Audiodateien, Textinformationen) in der benötigten Form und Qualität zur Verfügung zu stellen.
                </p>
                
                <p className="text-gray-400">
                  5.2 Der Kunde versichert, dass er über sämtliche Rechte an den von ihm zur Verfügung gestellten Materialien verfügt und diese keine Rechte Dritter verletzen. Der Kunde stellt den Anbieter von allen Ansprüchen Dritter frei, die aufgrund einer Verletzung dieser Pflicht entstehen können.
                </p>
                
                <p className="text-gray-400">
                  5.3 Bei Bereitstellung von Musik durch den Kunden versichert dieser, dass er über die entsprechenden Nutzungsrechte verfügt.
                </p>
              </div>
            </Card>
          </AnimatedElement>
          
          <AnimatedElement animation="fade" delay={0.35} className="mb-8">
            <Card>
              <h2 className="text-xl font-medium mb-6 text-fmv-silk">6. Lieferung und Abnahme</h2>
              
              <div className="space-y-4">
                <p className="text-gray-400">
                  6.1 Nach Fertigstellung wird das Video dem Kunden über einen Download-Link zur Verfügung gestellt.
                </p>
                
                <p className="text-gray-400">
                  6.2 Der Kunde ist verpflichtet, das gelieferte Video innerhalb von 7 Tagen nach Bereitstellung zu prüfen und abzunehmen. Die Abnahme gilt als erfolgt, wenn der Kunde innerhalb dieser Frist keine Mängel rügt oder das Video nutzt.
                </p>
                
                <p className="text-gray-400">
                  6.3 Änderungswünsche können im Rahmen der im jeweiligen Paket enthaltenen Korrekturschleifen berücksichtigt werden. Weitere Änderungen sind kostenpflichtig.
                </p>
              </div>
            </Card>
          </AnimatedElement>
          
          <AnimatedElement animation="fade" delay={0.4}>
            <Card>
              <h2 className="text-xl font-medium mb-6 text-fmv-silk">7. Nutzungsrechte</h2>
              
              <div className="space-y-4">
                <p className="text-gray-400">
                  7.1 Mit vollständiger Bezahlung der vereinbarten Vergütung erhält der Kunde ein einfaches, zeitlich und räumlich unbeschränktes Recht zur Nutzung des erstellten Videos für eigene geschäftliche oder private Zwecke.
                </p>
                
                <p className="text-gray-400">
                  7.2 Der Anbieter behält sich das Recht vor, das erstellte Video zu Referenzzwecken auf der eigenen Website oder in sozialen Medien zu verwenden, sofern der Kunde dem nicht ausdrücklich widerspricht.
                </p>
                
                <p className="text-gray-400">
                  7.3 Sämtliche Rechte an der verwendeten KI-Technologie und den zugrundeliegenden Algorithmen verbleiben beim Anbieter.
                </p>
              </div>
            </Card>
          </AnimatedElement>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default TermsPage;