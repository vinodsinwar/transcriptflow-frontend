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
      title: '99.8%',
      subtitle: 'Accuracy',
      description: 'Industry-leading accuracy with advanced AI processing and human-quality results.',
      color: 'text-green-400'
    },
    {
      icon: Timer,
      title: '<3s',
      subtitle: 'Processing',
      description: 'Lightning-fast processing with optimized algorithms and intelligent caching.',
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
      highlight: 'Sub-second processing'
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
      description: 'Download transcripts in TXT, SRT, or VTT formats for maximum compatibility.',
      highlight: '3 Export Formats'
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
      description: 'Precise timestamps for easy navigation and synchronization with video content.',
      highlight: 'Frame-perfect timing'
    },
    {
      icon: Brain,
      title: 'AI-Powered Fallback',
      description: 'Advanced speech-to-text AI for videos without existing captions or subtitles.',
      highlight: '99.8% Accuracy'
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
            Powerful Features for{' '}
            <span className="gradient-text">Every Need</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our advanced transcript generation platform offers everything you need to convert 
            YouTube videos into accurate, formatted text quickly and efficiently.
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
              Join thousands of users who trust TranscriptFlow for their video transcription needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Start Transcribing Now
              </button>
              <button className="btn-secondary">
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

