import { useMotion } from './hooks/useMotion';
import { useLenis } from './hooks/useLenis';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { Nav } from './components/layout/Nav';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { InkImpact } from './components/sections/InkImpact';
import { About } from './components/sections/About';
import { Work } from './components/sections/Work';
import { Skills } from './components/sections/Skills';
import { Connect } from './components/sections/Connect';
import { Contact } from './components/sections/Contact';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const { smoothScroll } = useMotion();
  useLenis(smoothScroll);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollProgress />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <InkImpact />
        <About />
        <Work />
        <Skills />
        <Connect />
        <Contact />
      </main>
      <Footer />
      <Analytics />
    </>
  );
}
