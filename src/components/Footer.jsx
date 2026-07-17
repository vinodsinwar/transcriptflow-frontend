import { Mail, Heart } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollTo = (hash) => {
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const footerLinks = {
    tools: [
      { name: 'Transcript Generator', href: '/' },
      { name: 'Translate Transcript', href: '/translate-youtube-transcript' },
      { name: 'Download Subtitles', href: '/download-youtube-subtitles' },
      { name: 'Playlist Transcripts', href: '/youtube-playlist-transcript' },
      { name: 'Pricing', href: '/pricing' }
    ],
    guides: [
      { name: 'Get a YouTube Transcript', href: '/blog/how-to-get-youtube-video-transcript' },
      { name: 'SRT vs VTT Formats', href: '/blog/download-youtube-subtitles-srt-vtt' },
      { name: 'Translate YouTube Subtitles', href: '/blog/translate-youtube-subtitles' },
      { name: 'Video to Blog Post', href: '/blog/youtube-video-to-blog-post' }
    ],
    support: [
      { name: 'Contact Us', href: '#contact' },
      { name: 'Report a Bug', href: 'mailto:support@transcriptflow.io?subject=Bug%20Report' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' }
    ]
  };

  const renderLink = (link) => (
    <li key={link.name}>
      <a
        href={link.href}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        onClick={(e) => {
          if (link.href.startsWith('#')) {
            e.preventDefault();
            scrollTo(link.href);
          }
        }}
      >
        {link.name}
      </a>
    </li>
  );

  return (
    <footer className="relative bg-card/30 border-t border-border/50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full gradient-bg opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full gradient-bg opacity-5 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Section */}
        <div id="contact" className="py-16 border-b border-border/50">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Get in Touch
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have questions, feedback, or need support? We'd love to hear from you.
            </p>
            <a
              href="mailto:support@transcriptflow.io"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>support@transcriptflow.io</span>
            </a>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Logo className="w-8 h-8" />
                <span className="text-xl font-bold gradient-text">
                  TranscriptFlow
                </span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                The fast, free way to convert YouTube videos into text.
                No signup, no limits — paste a link and get your transcript in seconds.
              </p>
            </div>

            {/* Tools */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Tools
              </h4>
              <ul className="space-y-3">
                {footerLinks.tools.map(renderLink)}
              </ul>
            </div>

            {/* Guides */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Guides
              </h4>
              <ul className="space-y-3">
                {footerLinks.guides.map(renderLink)}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Support
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map(renderLink)}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-border/50">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <span>© {currentYear} TranscriptFlow. Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span>for creators worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
