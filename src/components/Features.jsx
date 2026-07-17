import { 
  Globe, 
  Zap, 
  Download, 
  Shield, 
  Clock, 
  Brain,
  Languages,
  FileText,
  Lock,
  Target,
  Timer,
  Cpu
} from 'lucide-react';

const Features = () => {
  const mainFeatures = [
    {
      icon: Languages,
      title: '125+',
      subtitle: 'Languages',
      description: 'Support for 125+ languages with automatic language detection and translation capabilities.',
      color: 'text-blue-400'
    },
    {
      icon: Target,
      title: '5',
      subtitle: 'Export Formats',
      description: 'TXT, SRT, VTT, PDF and Word — copy or download, named after the video.',
      color: 'text-green-400'
    },
    {
      icon: Timer,
      title: '100',
      subtitle: 'Videos per Playlist',
      description: 'Pro exports entire playlists as one ZIP of transcripts and subtitle files.',
      color: 'text-purple-400'
    },
    {
      icon: Shield,
      title: '100%',
      subtitle: 'Free',
      description: 'Completely free service with no hidden costs, limits, or subscription requirements.',
      color: 'text-yellow-400'
    }
  ];

  const detailedFeatures = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate transcripts in seconds with our optimized processing pipeline and intelligent caching system.',
      highlight: 'Cached repeats are instant'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Support for 125+ languages with automatic language detection and translation capabilities.',
      highlight: '125+ Languages'
    },
    {
      icon: Download,
      title: 'Multiple Formats',
      description: 'Copy timestamped text or download as TXT, SRT, VTT, PDF, or Word.',
      highlight: '5 formats'
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your data is processed securely and never stored permanently. Complete privacy protection.',
      highlight: 'Zero data retention'
    },
    {
      icon: Clock,
      title: 'Timestamp Accuracy',
      description: 'Every line is timestamped and clickable — jump straight to that moment in the video.',
      highlight: 'Clickable timestamps'
    },
    {
      icon: Brain,
      title: 'Auto-Caption Support',
      description: 'Works with YouTube auto-generated captions too, so most public videos can be transcribed.',
      highlight: 'Widest coverage'
    }
  ];

  return (
    <section id="features" className="py-20 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full gradient-bg opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full gradient-bg opacity-5 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Everything the Transcript{' '}
            <span className="gradient-text">Actually Needs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            No filler features — just the things people genuinely use transcripts for,
            done properly.
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {mainFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="card-modern text-center group">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className={`w-8 h-8 ${feature.color}`} />
                  </div>
                </div>
                <div className="mb-2">
                  <div className={`text-3xl font-bold ${feature.color} mb-1`}>
                    {feature.title}
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {feature.subtitle}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Detailed Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {detailedFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="card-modern group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl glass-strong flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      {feature.description}
                    </p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full glass text-xs font-medium text-primary">
                      {feature.highlight}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="glass-strong rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-muted-foreground mb-6">
              Paste a link, get the words. It really is that simple.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="btn-primary"
                onClick={() => {
                  const input = document.querySelector('#youtube-url');
                  if (input) {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    input.focus({ preventScroll: true });
                  }
                }}
              >
                Start Transcribing Now
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  const section = document.querySelector('#how-it-works');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                How It Works
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No signup required • Completely free • Instant results
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

