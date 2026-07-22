import Header from '../components/Header';
import Footer from '../components/Footer';
import { Check, Sparkles } from 'lucide-react';

const freeFeatures = [
  'Unlimited single-video transcripts',
  'Clickable timestamps & in-transcript search',
  'Translate to any language the video supports',
  'TXT, SRT, VTT, PDF & Word downloads',
  'First 2 videos of any playlist',
  'No account, no stored data',
];

const proFeatures = [
  'Everything in Free',
  'Full playlist exports — up to 100 videos per playlist',
  '1,000 videos per month (200/day)',
  'Export as a ZIP of TXT + SRT files, or one combined PDF/Word document',
  'License key by email — still no account needed',
  'Cancel anytime; key management via customer portal',
];

const faqs = [
  {
    q: 'Why is the single-video tool free?',
    a: 'Because it should be. Single transcripts cost us very little to serve and are supported by ads. Pro exists for bulk work — playlists — which genuinely costs more to process.'
  },
  {
    q: 'Do I need to create an account to buy Pro?',
    a: 'No. Checkout takes a minute, your license key arrives by email, and you paste it once on the playlist page. Billing, cancellation, and lost-key recovery all happen through the customer portal with just your email.'
  },
  {
    q: 'What happens if I cancel?',
    a: 'Your key stays active until the end of the paid period, then deactivates automatically. No emails to write, no retention flows to fight through.'
  },
  {
    q: 'Is the monthly quota really 1,000 videos?',
    a: 'Yes — with a 200/day burst limit to keep the service fast for everyone. That is 10–20× more generous than comparable tools.'
  },
];

const PricingPage = () => {
  return (
    <div className="App">
      <Header />
      <main className="pt-24 pb-20">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Simple, honest <span className="gradient-text">pricing</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-14">
            The transcript tool is free and stays free. Pro is for people who need
            whole playlists at once.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Free */}
            <div className="glass rounded-2xl p-8 border border-border/50">
              <h2 className="text-xl font-bold mb-1">Free</h2>
              <p className="text-4xl font-bold mb-1">$0</p>
              <p className="text-sm text-muted-foreground mb-6">forever</p>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-start space-x-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href="/" className="btn-secondary w-full block text-center">
                Start transcribing
              </a>
            </div>

            {/* Pro */}
            <div className="glass-strong rounded-2xl p-8 border border-primary/40 relative">
              <div className="absolute -top-3 right-6 gradient-bg text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>For bulk work</span>
              </div>
              <h2 className="text-xl font-bold mb-1">Pro</h2>
              <p className="text-4xl font-bold mb-1">
                $4.99<span className="text-lg font-normal text-muted-foreground">/month</span>
              </p>
              <p className="text-sm text-muted-foreground mb-6">or $29/year — save 51%</p>
              <ul className="space-y-3 mb-8">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-start space-x-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href="/youtube-playlist-transcript" className="btn-primary w-full block text-center">
                Try it on my playlist — free
              </a>
              <p className="text-center text-xs text-muted-foreground mt-3">
                First 2 videos free · no signup · no card needed
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Pricing Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((f) => (
              <div key={f.q} className="glass rounded-xl p-6 border border-border/50">
                <h3 className="text-base font-semibold mb-2">{f.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
