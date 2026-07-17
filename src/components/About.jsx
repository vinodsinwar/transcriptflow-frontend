import { Shield, Wrench, Globe2, ListVideo } from 'lucide-react';

const facts = [
  { value: '125+', label: 'Languages supported' },
  { value: '5', label: 'Export formats' },
  { value: '100', label: 'Videos per playlist (Pro)' },
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-background/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            About <span className="gradient-text">TranscriptFlow</span>
          </h2>
        </div>

        <div className="glass rounded-2xl p-8 sm:p-10 border border-border/50 space-y-5 text-muted-foreground leading-relaxed">
          <p>
            TranscriptFlow is an independently built and run tool with one job: get you the words
            of any YouTube video — fast, clean, and in the format you actually need. It fetches
            the captions that already exist for a video (including YouTube's auto-generated ones),
            formats them with timestamps, and hands them to you as text, subtitles, documents, or
            translations.
          </p>
          <p>
            <span className="text-foreground font-medium">No accounts, no stored data.</span>{' '}
            We don't keep your video URLs or transcripts — every request is processed and
            forgotten. Your "Recent" list lives only in your own browser. That's not a marketing
            line; it's how the system is built.
          </p>
          <p>
            <span className="text-foreground font-medium">How it stays free.</span>{' '}
            Single-video transcripts are free without limits, supported by ads and by{' '}
            <a href="/youtube-playlist-transcript" className="text-primary hover:underline">
              TranscriptFlow Pro
            </a>{' '}
            — bulk playlist exports for people who need transcripts at scale. No venture capital,
            no growth hacks, no dark patterns: if the tool is useful, it funds itself.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mt-10">
          {facts.map((f) => (
            <div key={f.label} className="text-center glass rounded-xl p-6 border border-border/50">
              <div className="text-3xl font-bold gradient-text mb-1">{f.value}</div>
              <div className="text-sm text-muted-foreground">{f.label}</div>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <div className="flex items-start space-x-3">
            <Wrench className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">Built and maintained by one developer who uses it daily</p>
          </div>
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">Nothing stored — requests are processed and forgotten</p>
          </div>
          <div className="flex items-start space-x-3">
            <Globe2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">Works with captions in any of 125+ languages</p>
          </div>
          <div className="flex items-start space-x-3">
            <ListVideo className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">Questions? <a href="mailto:support@transcriptflow.io" className="text-primary hover:underline">support@transcriptflow.io</a> — a human replies</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
