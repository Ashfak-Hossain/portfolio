import { useMotion } from './hooks/useMotion';
import { useLenis } from './hooks/useLenis';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { Nav } from './components/layout/Nav';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { InkImpact } from './components/sections/InkImpact';
import { About } from './components/sections/About';
import { Work } from './components/sections/Work';
import { OneCut } from './components/sections/OneCut';
import { Connect } from './components/sections/Connect';
import { Contact } from './components/sections/Contact';

export default function App() {
  const { smoothScroll } = useMotion();
  useLenis(smoothScroll);

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <InkImpact />
        <About />
        <Work />
        <OneCut />
        <Connect />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
