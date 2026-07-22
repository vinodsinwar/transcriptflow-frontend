import { Zap, Globe, Lock, FileText, GraduationCap, Megaphone, Search, Accessibility } from 'lucide-react';
import RatingWidget from './RatingWidget';

const benefits = [
  {
    icon: Zap,
    title: 'Fast Processing',
    description: 'Transcripts are fetched and formatted in seconds, so you can get straight to reading, quoting, or repurposing the content.'
  },
  {
    icon: Globe,
    title: '125+ Languages',
    description: 'Works with videos in any language that has captions, with automatic language detection for the best available transcript.'
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'No signup, no stored URLs, no saved transcripts. Every request is processed independently and nothing is retained.'
  },
  {
    icon: FileText,
    title: 'Multiple Formats',
    description: 'Copy the timestamped text or download as TXT, SRT, VTT, PDF, or Word files — ready for editors, players, and documents.'
  }
];

const useCaseHighlights = [
  {
    icon: GraduationCap,
    title: 'Learning & Research',
    description: 'Turn lectures, tutorials, and interviews into searchable notes you can skim, quote, and cite.'
  },
  {
    icon: Megaphone,
    title: 'Content Repurposing',
    description: 'Convert videos into blog posts, social snippets, show notes, and newsletters in minutes.'
  },
  {
    icon: Search,
    title: 'SEO for Video',
    description: 'Publish transcript text alongside your videos so search engines can index every word you say.'
  },
  {
    icon: Accessibility,
    title: 'Accessibility',
    description: 'Give deaf and hard-of-hearing audiences, and anyone in a sound-off environment, full access to your content.'
  }
];

const faqs = [
  {
    q: 'Is TranscriptFlow really free to use?',
    a: 'Yes. TranscriptFlow is free with no hidden costs, subscriptions, or usage caps. You can generate transcripts without creating an account or entering payment details.'
  },
  {
    q: 'How accurate are the generated transcripts?',
    a: 'Transcripts are based on the captions available for the video, including YouTube’s automatic captions. Accuracy is excellent for clear speech and may vary with audio quality, accents, and background noise.'
  },
  {
    q: 'What languages are supported?',
    a: 'Over 125 languages, including English, Spanish, French, German, Chinese, Japanese, Arabic, and Hindi. The video’s language is detected automatically.'
  },
  {
    q: 'How fast is the transcript generation?',
    a: 'Most transcripts are ready in a few seconds. Very long videos can take slightly longer while the full transcript is formatted.'
  },
  {
    q: 'Do you store my video URLs or transcripts?',
    a: 'No. TranscriptFlow doesn’t store video URLs, generated transcripts, or any personal information. Each request is processed independently without data retention.'
  },
  {
    q: 'Which videos can be transcribed?',
    a: 'Any public YouTube video that has captions or subtitles available. Private videos, or videos whose owners disabled captions, can’t be transcribed.'
  },
  {
    q: 'How do I copy a YouTube transcript?',
    a: 'Paste the video link, generate the transcript, then click Copy Text to copy the whole thing to your clipboard. You can also download it as TXT, SRT, VTT, PDF, or Word instead of copying.'
  },
  {
    q: 'How do I get a YouTube transcript without an extension?',
    a: 'TranscriptFlow runs in your browser — no Chrome extension or install needed. Paste the YouTube URL on the site and the transcript appears in seconds, on any device.'
  },
  {
    q: 'Does this work on a phone?',
    a: 'Yes. It works in any mobile browser on Android or iPhone. Copy the video’s Share link in the YouTube app, paste it here, and get the transcript — no app to install.'
  }
];

const steps = [
  {
    n: '1',
    title: 'Paste the YouTube link',
    text: 'Copy any YouTube URL — from the address bar, or the Share button in the mobile app — and paste it into the box above. Full links, youtu.be short links, and yt transcript lookups all work.'
  },
  {
    n: '2',
    title: 'Generate the transcript',
    text: 'Press the button and TranscriptFlow pulls the video’s captions and builds a clean, timestamped transcript in a few seconds — even for videos with only auto-generated captions.'
  },
  {
    n: '3',
    title: 'Copy, translate, or download',
    text: 'Copy the YouTube transcript to your clipboard, translate it into any language the video supports, or download it as TXT, SRT, VTT, PDF, or Word — named after the video.'
  }
];

const SEOContent = () => {
  return (
    <section className="relative py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            The Fast, Free <span className="gradient-text">YouTube Transcript Generator</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Paste any YouTube link and get a clean, timestamped transcript in seconds —
            free, unlimited, and with no signup required.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="glass rounded-xl p-6 border border-border/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-bg mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* How it works — "YouTube to transcript, step by step" */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            YouTube to Transcript in Three Steps
          </h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10">
            Turning a YouTube video into text takes seconds — no software, no Chrome extension,
            and no account. Here’s the whole process.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="glass rounded-xl p-6 border border-border/50">
                <div className="flex items-center justify-center w-8 h-8 rounded-full gradient-bg text-white font-bold mb-4">{s.n}</div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8 max-w-3xl mx-auto">
            Need something specific? {' '}
            <a href="/translate-youtube-transcript" className="text-primary hover:underline">Translate a transcript</a>,{' '}
            <a href="/download-youtube-subtitles" className="text-primary hover:underline">download subtitles as SRT/VTT</a>,{' '}
            grab a whole <a href="/youtube-playlist-transcript" className="text-primary hover:underline">playlist transcript</a>, or read the{' '}
            <a href="/blog/how-to-get-youtube-video-transcript" className="text-primary hover:underline">step-by-step guide</a>.
          </p>
        </div>

        {/* Use case highlights */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            What People Use Transcripts For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {useCaseHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start space-x-4 glass rounded-xl p-6 border border-border/50">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg gradient-bg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.q} className="glass rounded-xl p-6 border border-border/50">
                <h3 className="text-base font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <RatingWidget page="home" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOContent;
