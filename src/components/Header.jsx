import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goToInput = () => {
    setIsMenuOpen(false);
    const input = document.querySelector('#youtube-url') || document.querySelector('input[type="url"]');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input.focus({ preventScroll: true });
    } else {
      window.location.href = '/';
    }
  };

  const navItems = [
    { name: 'Home', href: '/#home' },
    { name: 'Translate', href: '/translate-youtube-transcript' },
    { name: 'Subtitles', href: '/download-youtube-subtitles' },
    { name: 'Playlist', href: '/youtube-playlist-transcript' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/#contact' }
  ];

  const handleNavClick = (e, href) => {
    setIsMenuOpen(false);
    // Smooth-scroll for section anchors when already on the homepage
    if (href.startsWith('/#') && window.location.pathname === '/') {
      const element = document.querySelector(href.slice(1));
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-bold gradient-text">
              TranscriptFlow
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="nav-item"
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="btn-primary" onClick={goToInput}>
              Try Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg glass hover:bg-card/80 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="nav-item block"
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-2">
                <button className="btn-primary w-full" onClick={goToInput}>
                  Try Free
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

