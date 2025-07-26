import { 
  GraduationCap, 
  Briefcase, 
  Users, 
  Mic, 
  BookOpen, 
  Video,
  FileText,
  Globe
} from 'lucide-react';

const UseCases = () => {
  const useCases = [
    {
      icon: GraduationCap,
      title: 'Education & Learning',
      description: 'Students and educators use TranscriptFlow to create study materials, lecture notes, and accessible content from educational videos.',
      examples: ['Lecture transcripts', 'Study guides', 'Research notes', 'Accessibility compliance'],
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      icon: Briefcase,
      title: 'Business & Marketing',
      description: 'Professionals convert webinars, presentations, and marketing videos into searchable text content for better reach and SEO.',
      examples: ['Webinar transcripts', 'Meeting notes', 'Content marketing', 'SEO optimization'],
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      icon: Users,
      title: 'Content Creation',
      description: 'YouTubers, podcasters, and content creators generate transcripts for better accessibility and content repurposing.',
      examples: ['Video descriptions', 'Blog posts', 'Social media content', 'Subtitles'],
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      icon: Mic,
      title: 'Journalism & Media',
      description: 'Journalists and media professionals quickly transcribe interviews, press conferences, and news content.',
      examples: ['Interview transcripts', 'News articles', 'Quote extraction', 'Fact checking'],
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    {
      icon: BookOpen,
      title: 'Research & Academia',
      description: 'Researchers analyze video content, extract quotes, and create citations from academic and documentary videos.',
      examples: ['Research papers', 'Literature reviews', 'Data analysis', 'Citation creation'],
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    },
    {
      icon: Globe,
      title: 'Translation & Localization',
      description: 'Translators and localization teams use transcripts as the foundation for multilingual content adaptation.',
      examples: ['Translation base', 'Subtitle creation', 'Localization', 'Language learning'],
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10'
    }
  ];

  return (
    <section id="use-cases" className="py-20 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full gradient-bg opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full gradient-bg opacity-5 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Perfect for <span className="gradient-text">Every Use Case</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From education to business, content creation to research - TranscriptFlow 
            serves professionals across industries with accurate, fast transcription.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const IconComponent = useCase.icon;
            return (
              <div key={index} className="card-modern group">
                {/* Icon and Title */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className={`w-14 h-14 rounded-xl ${useCase.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-7 h-7 ${useCase.color}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {useCase.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {useCase.description}
                </p>

                {/* Examples */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    Common Uses:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {useCase.examples.map((example, exampleIndex) => (
                      <span
                        key={exampleIndex}
                        className="inline-flex items-center px-2.5 py-1 rounded-full glass text-xs font-medium text-muted-foreground"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className="glass-strong rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">
                Trusted by Professionals Worldwide
              </h3>
              <p className="text-muted-foreground">
                Join thousands of users who rely on TranscriptFlow for their daily workflow
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">1M+</div>
                <div className="text-sm text-muted-foreground">Transcripts Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">125+</div>
                <div className="text-sm text-muted-foreground">Languages Supported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">99.8%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Transform Your Workflow?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a student, professional, or content creator, TranscriptFlow 
            has the tools you need to convert video content into actionable text.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="btn-primary"
              onClick={() => {
                const heroSection = document.querySelector('#home');
                if (heroSection) {
                  heroSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Start Your First Transcript
            </button>
            <button 
              className="btn-secondary"
              onClick={() => {
                const featuresSection = document.querySelector('#features');
                if (featuresSection) {
                  featuresSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Explore Features
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;

