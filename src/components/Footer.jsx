import { Zap, Mail, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'How It Works', href: '#how-it-works' },
      { name: 'Use Cases', href: '#use-cases' },
      { name: 'API Documentation', href: '#' }
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'Status Page', href: '#' },
      { name: 'Bug Reports', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'GDPR Compliance', href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/transcriptflow' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/transcriptflow' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/transcriptflow' }
  ];

  return (
    <footer className="relative bg-card/30 border-t border-border/50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full gradient-bg opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full gradient-bg opacity-5 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-bg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">
                  TranscriptFlow
                </span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                The fastest and most accurate way to convert YouTube videos into text. 
                Free, secure, and trusted by over 50,000 users worldwide.
              </p>
              
              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Stay Updated
                </h4>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input-modern flex-1 py-2 px-3 text-sm"
                  />
                  <button className="btn-primary py-2 px-4 text-sm">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get notified about new features and updates. No spam, ever.
                </p>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => {
                        if (link.href.startsWith('#')) {
                          e.preventDefault();
                          const element = document.querySelector(link.href);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Support
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => {
                        if (link.href.startsWith('#')) {
                          e.preventDefault();
                          const element = document.querySelector(link.href);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© {currentYear} TranscriptFlow. Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>for creators worldwide.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="p-2 rounded-lg glass hover:bg-card/80 transition-colors group"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="py-16 border-t border-border/50">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Get in Touch
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have questions, feedback, or need support? We'd love to hear from you. 
              Our team typically responds within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@transcriptflow.com"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>support@transcriptflow.com</span>
              </a>
              <button className="btn-secondary">
                Live Chat Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

