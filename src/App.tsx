import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Achievements } from "@/components/Achievements";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

function App() {
  const [motionPaused, setMotionPaused] = useState(false);

  return (
    <div className={motionPaused ? "portfolio motion-paused" : "portfolio"}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <div
          className="discipline-band"
          aria-label="Web development, backend engineering, mobile experiences, and creative problem solving"
        >
          <div className="discipline-track" aria-hidden="true">
            {[0, 1].map((copy) => (
              <div key={copy}>
                <span>WEB DEVELOPMENT</span>
                <b>✳</b>
                <span>BACKEND ENGINEERING</span>
                <b>✳</b>
                <span>MOBILE EXPERIENCES</span>
                <b>✳</b>
                <span>CREATIVE PROBLEM SOLVING</span>
                <b>✳</b>
              </div>
            ))}
          </div>
        </div>
        <About />
        <Projects />
        <Services />
        <Achievements />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <button
        type="button"
        onClick={() => setMotionPaused((paused) => !paused)}
        aria-pressed={motionPaused}
        aria-label="Pause decorative animations"
        className="motion-control"
      >
        {motionPaused ? (
          <Play size={13} aria-hidden="true" />
        ) : (
          <Pause size={13} aria-hidden="true" />
        )}
        <span>{motionPaused ? "Motion paused" : "Pause motion"}</span>
      </button>
    </div>
  );
}

export default App;
