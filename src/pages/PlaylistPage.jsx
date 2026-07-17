import Header from '../components/Header';
import Footer from '../components/Footer';
import PlaylistTool from '../components/PlaylistTool';
import { ListVideo, Archive, GraduationCap, Database } from 'lucide-react';

const steps = [
  { n: '1', title: 'Paste the playlist URL', text: 'Copy any YouTube playlist link (it contains "list=") and paste it above.' },
  { n: '2', title: 'See every video', text: 'We list the playlist’s videos with titles and durations in seconds.' },
  { n: '3', title: 'Pick your format', text: 'A ZIP of TXT + SRT files per video, or the whole playlist combined into one PDF or Word document.' },
  { n: '4', title: 'Download transcripts', text: 'Get the first 2 videos free in any format — or unlock the whole playlist with Pro.' },
];

const useCases = [
  {
    icon: GraduationCap,
    title: 'Courses & lecture series',
    text: 'Turn a whole course playlist into searchable study notes in one download instead of video by video.'
  },
  {
    icon: Database,
    title: 'Research datasets',
    text: 'Collect the text of interview series, podcasts, or conference talks for analysis, quoting, and citation.'
  },
  {
    icon: Archive,
    title: 'Channel archives',
    text: 'Creators can archive the transcripts of their own uploads as a backup or for repurposing into articles.'
  },
  {
    icon: ListVideo,
    title: 'Binge summaries',
    text: 'Feed a whole playlist’s combined transcript into your favorite AI tool and ask for a series summary.'
  },
];

const faqs = [
  {
    q: 'How many videos can I download for free?',
    a: 'The first 2 videos of any playlist are free, in any export format — ZIP of TXT + SRT files, or a combined PDF or Word document. TranscriptFlow Pro unlocks entire playlists (up to 100 videos each).'
  },
  {
    q: 'What does TranscriptFlow Pro cost?',
    a: '$4.99/month or $29/year. Pro lets you export up to 1,000 videos per month (max 200/day, 100 per playlist) — far more generous than comparable tools.'
  },
  {
    q: 'Do I need an account?',
    a: 'No. After purchase you receive a license key by email — paste it once on this page and your browser remembers it. Manage billing, cancel anytime, or retrieve lost keys at the Dodo customer portal using just your purchase email.'
  },
  {
    q: 'Which export formats are available?',
    a: 'Two styles: a ZIP with a numbered TXT and SRT file for every video (named after its title) plus a combined text file, or one single PDF or Word document with the whole playlist — a chapter per video. Videos without captions are skipped and listed so you know what was missed.'
  },
  {
    q: 'What about very large playlists?',
    a: 'We process the first 100 videos of a playlist. Some videos may have no captions at all — those are skipped and listed in your download so you know exactly what was missed.'
  },
];

const PlaylistPage = () => {
  return (
    <div className="App">
      <Header />
      <main className="pt-24 pb-20">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            YouTube <span className="gradient-text">Playlist Transcript</span> Downloader
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Download the transcripts of an entire YouTube playlist — as a ZIP of text and subtitle
            files, or one combined PDF or Word document. First 2 videos free — no signup required.
          </p>
          <PlaylistTool />
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="glass rounded-xl p-6 border border-border/50">
                <div className="flex items-center justify-center w-8 h-8 rounded-full gradient-bg text-white font-bold mb-4">{s.n}</div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Built for Bulk</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {useCases.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start space-x-4 glass rounded-xl p-6 border border-border/50">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg gradient-bg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-xl p-8 border border-border/50">
              <h3 className="text-xl font-bold mb-1">Free</h3>
              <p className="text-3xl font-bold mb-4">$0</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✓ Unlimited single-video transcripts</li>
                <li>✓ Translation, TXT, SRT, VTT, PDF & Word</li>
                <li>✓ First 2 videos of any playlist</li>
              </ul>
            </div>
            <div className="glass-strong rounded-xl p-8 border border-primary/40">
              <h3 className="text-xl font-bold mb-1">Pro</h3>
              <p className="text-3xl font-bold mb-1">$4.99<span className="text-base font-normal text-muted-foreground">/month</span></p>
              <p className="text-sm text-muted-foreground mb-4">or $29/year (save 51%)</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✓ Everything in Free</li>
                <li>✓ Full playlist exports (up to 100 videos each)</li>
                <li>✓ 1,000 videos per month</li>
                <li>✓ License key — no account needed</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((f) => (
              <div key={f.q} className="glass rounded-xl p-6 border border-border/50">
                <h3 className="text-base font-semibold mb-2">{f.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-10">
            Need a single video instead? Use the{' '}
            <a href="/" className="text-primary hover:underline">YouTube Transcript Generator</a>,{' '}
            <a href="/translate-youtube-transcript" className="text-primary hover:underline">translate a transcript</a>, or{' '}
            <a href="/download-youtube-subtitles" className="text-primary hover:underline">download subtitles</a>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PlaylistPage;
