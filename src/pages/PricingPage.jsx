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

const packFeatures = [
  '100 video credits — enough for a full course',
  'Valid 12 months, use anytime',
  'All export styles: ZIP, combined PDF/Word/TXT, one doc per video',
  'Playlists, channels & pasted video lists',
  'Bulk translation + playlist-wide search',
  'AI summaries (2 credits each)',
  'One payment, no subscription, no card on file',
];

const proFeatures = [
  'Everything in Free',
  'Full playlists & channels — up to 100 videos each, 1,000/month (200/day)',
  'Every export style: ZIP (TXT · SRT · MD · CSV), combined PDF/Word/TXT, or one document per video',
  'Bulk translation — export a whole playlist in another language',
  'AI summaries of videos and whole playlists (150/month)',
  'Search across every transcript in a playlist',
  'Developer API — your license key is the API key',
  'License key by email — no account; cancel anytime via customer portal',
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
    q: 'What exactly is a credit?',
    a: '1 credit = 1 video transcript, in any format you like. An AI summary costs 2 credits. That\u2019s the whole system — no separate "premium credits" or hidden multipliers.'
  },
  {
    q: 'Course Pack or Pro — which should I pick?',
    a: 'One course or project to download? The $4.99 Pack (100 credits, valid a year, no subscription). Working with videos every week, or need the API? Pro is dramatically cheaper per video (1,000/month for $6.99).'
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
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

            {/* Course Pack — one-time */}
            <div className="glass rounded-2xl p-8 border border-border/50 relative">
              <div className="absolute -top-3 right-6 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                One project? Start here
              </div>
              <h2 className="text-xl font-bold mb-1">Course Pack</h2>
              <p className="text-4xl font-bold mb-1">$4.99</p>
              <p className="text-sm text-muted-foreground mb-6">one-time — not a subscription</p>
              <ul className="space-y-3 mb-8">
                {packFeatures.map((f) => (
                  <li key={f} className="flex items-start space-x-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href="/youtube-playlist-transcript" className="btn-secondary w-full block text-center">
                Try 2 videos free first
              </a>
              <p className="text-center text-xs text-muted-foreground mt-3">
                1 credit = 1 video transcript
              </p>
            </div>

            {/* Pro */}
            <div className="glass-strong rounded-2xl p-8 border border-primary/40 relative">
              <div className="absolute -top-3 right-6 gradient-bg text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>For bulk work</span>
              </div>
              <h2 className="text-xl font-bold mb-1">Pro</h2>
              <p className="text-4xl font-bold mb-1">
                $6.99<span className="text-lg font-normal text-muted-foreground">/month</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">or $49/year — 5 months free</p>
              <p className="text-xs text-muted-foreground mb-6">Comparable tools charge $9.99+ for the same 1,000 videos — and cap video length. We don't.</p>
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
