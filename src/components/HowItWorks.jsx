import { Link, Cpu, Download, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      icon: Link,
      title: 'Paste YouTube URL',
      description: 'Simply copy and paste any YouTube video URL into our input field. We support all YouTube video formats including shorts.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      number: '2',
      icon: Cpu,
      title: 'AI Processing',
      description: 'Our advanced AI analyzes the video, extracts existing captions, or generates new transcripts using state-of-the-art speech recognition.',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      number: '3',
      icon: Download,
      title: 'Download & Use',
      description: 'Get your formatted transcript instantly. Copy to clipboard, download as TXT, SRT, or VTT files for your projects.',
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full gradient-bg opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full gradient-bg opacity-5 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform any YouTube video into text in just three simple steps. 
            No registration required, completely free to use.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent transform -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Step Card */}
                  <div className="card-modern text-center group">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className={`w-8 h-8 rounded-full ${step.bgColor} ${step.color} flex items-center justify-center text-sm font-bold border-2 border-background`}>
                        {step.number}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-6 mt-4">
                      <div className={`w-20 h-20 rounded-2xl ${step.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`w-10 h-10 ${step.color}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow (Desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="glass-strong rounded-2xl p-8 max-w-xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Try It?
            </h3>
            <p className="text-muted-foreground mb-6">
              Start generating transcripts in seconds. No account needed.
            </p>
            <button 
              className="btn-primary"
              onClick={() => {
                const heroSection = document.querySelector('#home');
                if (heroSection) {
                  heroSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

