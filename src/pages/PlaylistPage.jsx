import Header from '../components/Header';
import Footer from '../components/Footer';
import RatingWidget from '../components/RatingWidget';
import PlaylistTool from '../components/PlaylistTool';
import { ListVideo, Archive, GraduationCap, Database, FolderArchive, FileText } from 'lucide-react';

const steps = [
  { n: '1', title: 'Paste a playlist or channel URL', text: 'Any YouTube playlist link (contains "list="), a channel URL (@name), or just paste a list of video links.' },
  { n: '2', title: 'See every video', text: 'We list the playlist’s videos with titles and durations in seconds.' },
  { n: '3', title: 'Pick your format', text: 'A ZIP of TXT + SRT files per video, or the whole playlist combined into one PDF or Word document.' },
  { n: '4', title: 'Download transcripts', text: 'Get the first 2 videos free in any format — or unlock the whole playlist with Pro.' },
];

const useCases = [
  {
    icon: GraduationCap,
    title: 'Courses & lecture series',
    text: 'Turn a whole course playlist into searchable study notes in one download instead of video by video. The combined PDF works like a course reader: one chapter per lecture, in order, with timestamps you can trace back to the exact moment in the video when something needs a second look.'
  },
  {
    icon: Database,
    title: 'Research datasets',
    text: 'Collect the text of interview series, podcasts, or conference talks for analysis, quoting, and citation. Every transcript keeps its video title and source link, so quotes stay attributable — and the numbered TXT files drop straight into qualitative analysis tools or a plain-text corpus.'
  },
  {
    icon: Archive,
    title: 'Channel archives',
    text: 'Creators can archive the transcripts of their own uploads as a backup or for repurposing into articles. A playlist of past uploads becomes a searchable text library — find every video where you mentioned a topic without scrubbing through hours of footage.'
  },
  {
    icon: ListVideo,
    title: 'AI summaries & chat',
    text: 'Feed a whole playlist’s combined transcript into ChatGPT, Claude, or Gemini and ask for a series summary, a study guide, or answers grounded in the actual words spoken. One combined file means one upload — no copy-pasting video by video.'
  },
];

const faqs = [
  {
    q: 'How many videos can I download for free?',
    a: 'The first 2 videos of any playlist are free, in any export format — ZIP of TXT + SRT files, or a combined PDF or Word document. TranscriptFlow Pro unlocks entire playlists (up to 100 videos each).'
  },
  {
    q: 'What does TranscriptFlow Pro cost?',
    a: 'Two options: a $4.99 one-time Course Pack (100 video credits, valid 12 months — perfect for a single course), or Pro at $6.99/month / $49/year for 1,000 videos every month plus AI summaries and API access. Comparable tools charge $9.99+ for less.'
  },
  {
    q: 'Do I need an account?',
    a: 'No. After purchase you receive a license key by email — paste it once on this page and your browser remembers it. Manage billing, cancel anytime, or retrieve lost keys at the Dodo customer portal using just your purchase email.'
  },
  {
    q: 'Which export formats are available?',
    a: 'For a single video: copy, TXT, SRT, VTT, PDF, or Word. For the whole playlist: a ZIP of numbered TXT + SRT files, one combined TXT, one combined PDF, or one combined Word document — the combined files put a chapter per video into a single file. Videos without captions are skipped and listed so you know what was missed.'
  },
  {
    q: 'Can I get an entire playlist as one PDF?',
    a: 'Yes — that is exactly what the "Combined PDF" option does. Pick it from the format selector and you get one document with a title page and a chapter per video, each with its title, language, word count, and source link. The Word version works the same way if you prefer an editable file.'
  },
  {
    q: 'Do auto-generated captions work?',
    a: 'Yes. We fetch whatever transcript YouTube has for each video — manually uploaded captions when they exist, auto-generated ones otherwise. Manual captions are usually cleaner; auto-captions vary with audio quality, accents, and topic jargon.'
  },
  {
    q: 'How long does a big playlist take?',
    a: 'Roughly 1–3 seconds per video on a first run, so a 50-video playlist typically finishes in a minute or two with a live progress bar. Videos we have served recently come from cache and are near-instant.'
  },
  {
    q: 'What about very large playlists?',
    a: 'We process the first 100 videos of a playlist. Some videos may have no captions at all — those are skipped and listed in your download so you know exactly what was missed.'
  },
  {
    q: 'Can I use the transcripts with ChatGPT or Claude?',
    a: 'Absolutely — it is one of the most popular uses. Upload the combined file and ask for a summary of the whole series, a study guide, or specific answers. Text is far cheaper and faster for AI tools to digest than video or audio.'
  },
  {
    q: 'Is this allowed? Whose content is it?',
    a: 'Transcripts come from YouTube’s own public caption system for videos that are publicly available. The content belongs to the original creators — quote and reuse it the same way you would cite any source, and check the video’s license for anything beyond personal use.'
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
            Download the transcripts of an entire YouTube playlist or channel — as a ZIP of files,
            one combined document, or one PDF/Word per video. First 2 videos free — no signup required.
          </p>
          <PlaylistTool />
          <div className="flex justify-center mt-8">
            <RatingWidget page="playlist" />
          </div>
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

        {/* Export styles — the differentiator */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Two Export Styles — Pick What Fits Your Work</h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10">
            Most bulk transcript tools hand you a folder of loose files and call it a day.
            We think the format should match what you're actually doing with the text.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-xl p-8 border border-border/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-bg">
                  <FolderArchive className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">ZIP of files — for tools & pipelines</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                One numbered TXT and SRT file per video, named after its title, plus a combined
                text file of the whole playlist. The right choice when the transcripts are headed
                somewhere else: a subtitle editor, a data pipeline, a notes app, or an archive folder.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                SRT files keep exact timing for every line, so they drop straight into video editors
                and subtitle workflows without conversion.
              </p>
            </div>
            <div className="glass-strong rounded-xl p-8 border border-primary/40">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-bg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">One combined PDF or Word doc — for reading</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                The whole playlist stitched into a single document: a title page, then a chapter per
                video with its title, language, word count, and source link. Like a course reader
                built from the playlist — read it on a tablet, print it, annotate it, or hand the
                one file to an AI assistant.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Few playlist tools offer this — it's the difference between "here are 60 files"
                and "here is the book of the course."
              </p>
            </div>
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

        {/* Why us — honest differentiators */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Why TranscriptFlow for Playlists?</h2>
          <div className="glass rounded-xl p-8 border border-border/50 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              A YouTube playlist transcript downloader saves you the tedium of opening 40 videos one
              by one, expanding each description, clicking "show transcript," and copy-pasting into a
              document. Paste one playlist link instead; we list every video, fetch every available
              transcript, and package the whole thing into a single download.
            </p>
            <p>
              <span className="text-foreground font-medium">You can try it before paying anything.</span>{' '}
              The first 2 videos of any playlist are free in every format — no signup, no card, no
              trial countdown. If the output isn't what you need, you've lost nothing. And Pro itself
              skips accounts entirely: buy once, get a license key by email, paste it here, done.
            </p>
            <p>
              <span className="text-foreground font-medium">The quota is honest and generous:</span>{' '}
              1,000 videos a month for $4.99 — where comparable tools sell credit packs that run out
              mid-playlist. And unlike tools that only produce loose subtitle files, the combined
              PDF/Word export turns a playlist into one readable document. Transcripts come from
              YouTube's own captions, so what you download is what the video actually says.
            </p>
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
              <p className="text-3xl font-bold mb-1">$6.99<span className="text-base font-normal text-muted-foreground">/month</span></p>
              <p className="text-sm text-muted-foreground mb-4">or $49/year — or a $4.99 one-time Course Pack (100 credits)</p>
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
