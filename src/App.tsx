import { Atmosphere } from '@/components/Atmosphere';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Services } from '@/components/Services';
import { Achievements } from '@/components/Achievements';
import { Projects } from '@/components/Projects';
import { Experience } from '@/components/Experience';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

function App() {
  return (
    <>
      <Atmosphere />
      <Navbar />
      <main className="min-h-screen overflow-x-hidden w-full">
        <div className="lg:border-x border-border max-w-[1100px] mx-auto">
          <Hero />
          <About />
          <Services />
          <Achievements />
          <Projects />
          <Experience />
        </div>

        {/* Dark contact panel outside bordered column */}
        <Contact />

        {/* Footer back inside bordered column */}
        <div className="lg:border-x border-border max-w-[1100px] mx-auto">
          <Footer />
        </div>
      </main>
    </>
  );
}

export default App;
