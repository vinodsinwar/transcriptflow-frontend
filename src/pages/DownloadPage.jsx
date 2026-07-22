import Header from '../components/Header';
import Footer from '../components/Footer';
import RatingWidget from '../components/RatingWidget';
import TranscriptForm from '../components/TranscriptForm';
import { FileText, Clapperboard, Captions, FileDown } from 'lucide-react';

const formats = [
  {
    icon: FileText,
    name: 'TXT — plain text',
    text: 'The full timestamped transcript as a text file. Best for reading, quoting, note-taking, and pasting into documents or AI tools.'
  },
  {
    icon: Captions,
    name: 'SRT — SubRip subtitles',
    text: 'The most widely supported subtitle format. Works in VLC, YouTube uploads, Premiere Pro, DaVinci Resolve, CapCut, and almost every player or editor.'
  },
  {
    icon: Clapperboard,
    name: 'VTT — WebVTT subtitles',
    text: 'The web-native subtitle format used by HTML5 video players. Ideal for embedding captions on websites and web apps.'
  },
  {
    icon: FileText,
    name: 'Word — .docx document',
    text: 'A formatted Word document with the video title and bold timestamps — ready for editing, commenting, and sharing with your team.'
  },
  {
    icon: FileDown,
    name: 'PDF — print-ready file',
    text: 'A clean, paginated PDF of the full transcript. Great for archiving, printing, citations, and attaching to reports — supports translated transcripts too.'
  },
];

const faqs = [
  {
    q: 'How do I download subtitles from a YouTube video?',
    a: 'Paste the video URL above and click Get Transcript. Once the transcript appears, click the SRT or VTT button to download the subtitles with their original timing, or TXT for plain text.'
  },
  {
    q: 'What is the difference between SRT and VTT?',
    a: 'Both contain the same text and timing. SRT is older and supported almost everywhere (video editors, players, YouTube itself). VTT is the web standard used by HTML5 <track> elements and supports styling. If unsure, choose SRT.'
  },
  {
    q: 'Can I download subtitles in another language?',
    a: 'Yes — after fetching the transcript, use the “Translate to…” menu to switch languages first, then download. The subtitle file will contain the translated text with the original timing.'
  },
  {
    q: 'Do downloads work for auto-generated captions?',
    a: 'Yes. If a video only has YouTube’s automatic captions, we use those — so nearly every public video with speech can be exported.'
  },
  {
    q: 'Can I download a YouTube transcript as a PDF or Word document?',
    a: 'Yes. After fetching the transcript, use the Word or PDF buttons. Word gives you an editable .docx with bold timestamps; PDF gives you a clean, paginated document — both named after the video and both work for translated transcripts.'
  },
  {
    q: 'Is there a limit on video length or number of downloads?',
    a: 'No hard limits for normal use. Very long videos simply take a few extra seconds to process.'
  },
];

const DownloadPage = () => {
  return (
    <div className="App">
      <Header />
      <main className="pt-24 pb-20">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Download YouTube <span className="gradient-text">Subtitles & Transcripts</span> — SRT, VTT, TXT, PDF & Word
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Export the captions of any YouTube video as SRT or VTT subtitle files, plain text,
            or polished PDF and Word documents — free, instant, and no signup required.
          </p>
          <TranscriptForm mode="download" />
          <div className="flex justify-center mt-8">
            <RatingWidget page="download" />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Five Formats, Every Use Case</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {formats.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.name} className="glass rounded-xl p-6 border border-border/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-bg mb-4"><Icon className="w-5 h-5 text-white" /></div>
                  <h3 className="text-lg font-semibold mb-2">{f.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="glass-strong rounded-2xl p-8 border border-border/50">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg gradient-bg"><FileDown className="w-5 h-5 text-white" /></div>
              <div>
                <h2 className="text-xl font-bold mb-3">Who uses subtitle downloads?</h2>
                <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
                  <li><strong className="text-foreground">Video editors</strong> importing captions into Premiere Pro, Final Cut, DaVinci Resolve, or CapCut instead of retyping them.</li>
                  <li><strong className="text-foreground">Course creators and educators</strong> providing accessible caption files alongside embedded lessons.</li>
                  <li><strong className="text-foreground">Developers</strong> adding WebVTT tracks to HTML5 video players.</li>
                  <li><strong className="text-foreground">Researchers and students</strong> archiving exact quotes with timings for citation.</li>
                  <li><strong className="text-foreground">Translators</strong> using an exported SRT as the base file for localized subtitles.</li>
                </ul>
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
            Just need the text? Use the{' '}
            <a href="/" className="text-primary hover:underline">YouTube Transcript Generator</a>{' '}
            — or translate captions first with the{' '}
            <a href="/translate-youtube-transcript" className="text-primary hover:underline">Transcript Translator</a>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DownloadPage;
