import React from 'react';
import PageHeader from '../components/PageHeader';
import SectionWrapper from '../components/SectionWrapper';
import Card from '../components/Card';
import AnimatedElement from '../components/AnimatedElement';

const ImprintPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Impressum"
        withGradient={false}
        size="normal"
      />

      <SectionWrapper className="bg-gradient-to-b from-fmv-carbon to-fmv-carbon-darker">
        <div className="max-w-3xl mx-auto">
          <AnimatedElement animation="fade">
            <Card>
              <h2 className="text-xl font-medium mb-6 text-fmv-silk">Angaben gemäß § 5 TMG</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-fmv-orange">Unternehmen</h3>
                  <p className="text-fmv-silk mb-1">fixmyvideo GmbH</p>
                  <p className="text-gray-400">Baarerstrasse 79</p>
                  <p className="text-gray-400">6300 Zug</p>
                  <p className="text-gray-400">Schweiz</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-fmv-orange">Kontakt</h3>
                  <p className="text-gray-400 mb-1">Telefon: <a href="tel:+41434443366" className="hover:text-fmv-orange transition-colors">+41 43 444 33 66</a></p>
                  <p className="text-gray-400">E-Mail: <a href="mailto:info@fixmyvideo.io" className="hover:text-fmv-orange transition-colors">info@fixmyvideo.io</a></p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-fmv-orange">Handelsregistereintrag</h3>
                  <p className="text-gray-400 mb-1">Handelsregister-Nummer: CH-170.4.020.554-7</p>
                  <p className="text-gray-400">Rechtssitz der Firma: Zug</p>
                  <p className="text-gray-400">Handelsregisteramt: ZG</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-fmv-orange">Umsatzsteuer-Identifikationsnummer</h3>
                  <p className="text-gray-400">CHE-236.044.160 MWST</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-fmv-orange">Verantwortlich für den Inhalt</h3>
                  <p className="text-fmv-silk mb-1">Geschäftsführung fixmyvideo GmbH</p>
                  <p className="text-gray-400">Baarerstrasse 79</p>
                  <p className="text-gray-400">6300 Zug</p>
                  <p className="text-gray-400">Schweiz</p>
                </div>
              </div>
            </Card>
          </AnimatedElement>
          
          <AnimatedElement animation="fade" delay={0.2} className="mt-8">
            <Card>
              <h2 className="text-xl font-medium mb-6 text-fmv-silk">Haftungsausschluss</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-fmv-orange">Haftung für Inhalte</h3>
                  <p className="text-gray-400 mb-4">
                    Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                  </p>
                  <p className="text-gray-400">
                    Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-fmv-orange">Haftung für Links</h3>
                  <p className="text-gray-400">
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-fmv-orange">Urheberrecht</h3>
                  <p className="text-gray-400">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem schweizerischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
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

export default ImprintPage;