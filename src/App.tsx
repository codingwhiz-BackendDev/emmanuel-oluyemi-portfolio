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
        <section className="discipline-band" aria-label="Areas of expertise">
          <p className="sr-only">
            Web development, backend engineering, mobile experiences, and
            creative problem solving.
          </p>
          <div className="discipline-caption" aria-hidden="true">
            <span>
              <i /> THE INTERSECTION OF LOGIC & IMAGINATION
            </span>
            <span>FOUR DISCIPLINES. ONE BUILDER.</span>
          </div>
          <div className="discipline-window" aria-hidden="true">
            <div className="discipline-track">
              {[0, 1].map((copy) => (
                <div className="discipline-group" key={copy}>
                  {[
                    { title: "WEB DEVELOPMENT", note: "IDEA → INTERFACE" },
                    { title: "BACKEND ENGINEERING", note: "LOGIC → SCALE" },
                    { title: "MOBILE EXPERIENCES", note: "TOUCH → CONNECTION" },
                    {
                      title: "CREATIVE PROBLEM SOLVING",
                      note: "WHAT IF → WHAT’S NEXT",
                    },
                  ].map(({ title, note }, index) => (
                    <div className="discipline-item" key={title}>
                      <div className="discipline-wordmark">
                        <span className="discipline-index">
                          0{index + 1} / {note}
                        </span>
                        <span
                          className={`discipline-name ${index % 2 ? "discipline-outline" : ""}`}
                        >
                          {title}
                        </span>
                      </div>
                      <span className="discipline-spark">✳</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="discipline-footnote" aria-hidden="true">
            <span>DIFFERENT DISCIPLINES. SAME ATTENTION TO DETAIL.</span>
            <span>BUILT TO MOVE YOU ↗</span>
          </div>
        </section>
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
