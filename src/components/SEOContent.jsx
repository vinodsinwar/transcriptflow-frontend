import { Zap, Globe, Lock, FileText, GraduationCap, Megaphone, Search, Accessibility } from 'lucide-react';

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
    description: 'Copy the timestamped text or download as TXT and SRT subtitle files ready for editing tools and video players.'
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
        </div>
      </div>
    </section>
  );
};

export default SEOContent;
