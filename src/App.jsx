import Header from './components/Header';
import Hero from './components/Hero';
import SEOContent from './components/SEOContent';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import UseCases from './components/UseCases';
import About from './components/About';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <SEOContent />
      <Features />
      <HowItWorks />
      <UseCases />
      <About />
      <Footer />
    </div>
  );
}

export default App;

