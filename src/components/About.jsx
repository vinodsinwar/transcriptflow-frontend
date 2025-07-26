import { Users, Target, Zap, Shield } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-background/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            About <span className="gradient-text">TranscriptFlow</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing how people access and interact with video content through 
            cutting-edge AI transcription technology.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-8 h-8 text-blue-500" />
              <h3 className="text-2xl font-bold">Our Mission</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To make video content universally accessible by providing fast, accurate, and 
              free transcription services. We believe that language barriers and accessibility 
              challenges shouldn't limit anyone's ability to learn and engage with video content.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-8 h-8 text-purple-500" />
              <h3 className="text-2xl font-bold">Our Vision</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To become the world's most trusted platform for video transcription, empowering 
              educators, content creators, researchers, and professionals to unlock the full 
              potential of video content through intelligent text conversion.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-12">Our Core Values</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="text-lg font-semibold">Speed</h4>
              <p className="text-sm text-muted-foreground">
                Lightning-fast processing that delivers results in seconds, not minutes.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                <Target className="w-8 h-8 text-green-500" />
              </div>
              <h4 className="text-lg font-semibold">Accuracy</h4>
              <p className="text-sm text-muted-foreground">
                Industry-leading 99.8% accuracy powered by advanced AI technology.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
              <h4 className="text-lg font-semibold">Privacy</h4>
              <p className="text-sm text-muted-foreground">
                Your data is processed securely and never stored permanently.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <h4 className="text-lg font-semibold">Accessibility</h4>
              <p className="text-sm text-muted-foreground">
                Free service with no barriers, supporting 125+ languages worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Technology */}
        <div className="bg-card/50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Powered by Advanced AI</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our transcription engine combines multiple AI models and techniques to deliver 
              unparalleled accuracy and speed.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-blue-500">125+</div>
              <div className="text-sm text-muted-foreground">Languages Supported</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-green-500">99.8%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-purple-500">&lt;3s</div>
              <div className="text-sm text-muted-foreground">Average Processing Time</div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6">Built by Experts</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            TranscriptFlow is developed by a team of AI researchers, software engineers, and 
            accessibility advocates who are passionate about making video content universally 
            accessible. Our diverse team brings together expertise in machine learning, 
            natural language processing, and user experience design.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;

