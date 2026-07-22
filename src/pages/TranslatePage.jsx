import Header from '../components/Header';
import Footer from '../components/Footer';
import RatingWidget from '../components/RatingWidget';
import TranscriptForm from '../components/TranscriptForm';
import { Globe, Languages, MousePointerClick, Download } from 'lucide-react';

const steps = [
  { n: '1', title: 'Paste the video URL', text: 'Copy any YouTube video link and paste it into the box above.' },
  { n: '2', title: 'Get the transcript', text: 'We fetch the video’s captions and show the full timestamped transcript in seconds.' },
  { n: '3', title: 'Pick your language', text: 'Open the “Translate to…” menu and choose from the languages YouTube offers for that video.' },
  { n: '4', title: 'Copy or download', text: 'Copy the translated text, or download it as TXT, SRT, or VTT subtitle files.' },
];

const faqs = [
  {
    q: 'Which languages can a YouTube transcript be translated to?',
    a: 'It depends on the video. YouTube offers a per-video list of translation targets — commonly including Spanish, French, German, Hindi, Arabic, Portuguese, Japanese, Korean, and Chinese. After you fetch a transcript, the “Translate to…” menu shows exactly which languages are available for that specific video.'
  },
  {
    q: 'Why do some videos have no translation options?',
    a: 'Translation is only offered by YouTube when the video has a translatable caption track. Some videos — especially very old ones or those with disabled captions — offer no translation targets. In that case the menu will say so.'
  },
  {
    q: 'Is the translation done by AI?',
    a: 'Translations come from YouTube’s own caption translation system — the same translations you’d see if you enabled translated subtitles in the YouTube player. We fetch them directly, so the quality matches what YouTube shows.'
  },
  {
    q: 'Can I download the translated transcript as subtitles?',
    a: 'Yes. After translating, use the SRT or VTT buttons to download the translated transcript as a subtitle file with the original timing preserved, ready to use in video editors or players.'
  },
  {
    q: 'Is this free?',
    a: 'Yes — free, unlimited, and no account needed.'
  },
];

const TranslatePage = () => {
  return (
    <div className="App">
      <Header />
      <main className="pt-24 pb-20">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Translate YouTube <span className="gradient-text">Transcripts</span> Online
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Get the transcript of any YouTube video and translate it into the language you choose —
            free, instant, and no signup required.
          </p>
          <TranscriptForm mode="translate" />
          <div className="flex justify-center mt-8">
            <RatingWidget page="translate" />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">How to Translate a YouTube Transcript</h2>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Why Translate Video Transcripts?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4 glass rounded-xl p-6 border border-border/50">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg gradient-bg"><Globe className="w-5 h-5 text-white" /></div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Understand foreign-language videos</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Read lectures, tutorials, and interviews published in languages you don’t speak — as clean, readable text.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 glass rounded-xl p-6 border border-border/50">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg gradient-bg"><Languages className="w-5 h-5 text-white" /></div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Localize your own content</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Creators can export translated SRT/VTT subtitles of their own videos as a starting point for localization.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 glass rounded-xl p-6 border border-border/50">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg gradient-bg"><MousePointerClick className="w-5 h-5 text-white" /></div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Language learning</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Compare the original transcript with its translation side by side while following along with the video.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 glass rounded-xl p-6 border border-border/50">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg gradient-bg"><Download className="w-5 h-5 text-white" /></div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Translated subtitle files</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Download the translation as SRT or VTT with original timing — drop it straight into any video player or editor.</p>
              </div>
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
            Looking for plain transcripts? Use the{' '}
            <a href="/" className="text-primary hover:underline">YouTube Transcript Generator</a>{' '}
            or grab subtitle files with the{' '}
            <a href="/download-youtube-subtitles" className="text-primary hover:underline">Subtitle Downloader</a>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TranslatePage;
