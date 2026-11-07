import {
  ArrowDown,
  ArrowUpRight,
  Github,
  Linkedin,
  Code2,
  Terminal,
  Sparkles,
} from "lucide-react";
import { profile } from "@/data";

export function Hero() {
  return (
    <section id="hero" className="hero-stage" aria-labelledby="hero-heading">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-topline">
        <span>
          <span className="status-dot" /> Open to projects & collaborations
        </span>
        <span>BASED IN NIGERIA · BUILDING EVERYWHERE</span>
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="eyebrow hero-enter">
            EMMANUEL OLUYEMI / SOFTWARE & MOBILE DEVELOPER
          </p>
          <h1 id="hero-heading" className="hero-title hero-enter">
            Big ideas.
            <br />
            Clean code.
            <br />
            <span className="hero-outline">Real impact.</span>
            <span className="hero-asterisk" aria-hidden="true">
              ✳
            </span>
          </h1>
          <p className="hero-description hero-enter">
            I turn ambitious ideas into thoughtful web and mobile products.
            Powerful behind the scenes. Effortless on the surface.
          </p>
          <div className="hero-actions hero-enter">
            <a href="#projects" className="action-button action-dark">
              Explore my work <ArrowUpRight size={20} aria-hidden="true" />
            </a>
            <a href="#contact" className="hero-text-link">
              Let’s build something{" "}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-socials hero-enter">
            <span>FIND ME ON</span>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <span className="hero-social-rule" />
          </div>
        </div>
        <div className="portrait-scene hero-enter">
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="portrait-backdrop" aria-hidden="true">
            <span>
              BUILD.
              <br />
              BREAK.
              <br />
              BETTER.
            </span>
          </div>
          <div className="portrait-frame">
            <img
              src="/images/hero.jpg"
              alt="Emmanuel Oluyemi"
              width={600}
              height={750}
              fetchPriority="high"
            />
            <div className="portrait-caption">
              <span>THE HUMAN BEHIND THE CODE</span>
              <strong>Emmanuel O.</strong>
            </div>
          </div>
          <div className="floating-label label-code">
            <Code2 size={21} />
            <span>Engineered with intention.</span>
          </div>
          <div className="floating-label label-terminal">
            <Terminal size={18} />
            <span>
              idea → production<span className="terminal-cursor">_</span>
            </span>
          </div>
          <div className="portrait-seal" aria-hidden="true">
            <Sparkles size={24} />
            <span>
              CURIOUS MIND.
              <br />
              BUILDER AT HEART.
            </span>
          </div>
          <span className="scene-coordinate" aria-hidden="true">
            01 / ALWAYS IN DEVELOPMENT
          </span>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#projects">
          <ArrowDown size={16} aria-hidden="true" /> SCROLL TO EXPLORE
        </a>
        <span>BACKEND LOGIC. FRONTEND FEEL. FULL-STACK THINKING.</span>
        <span className="hero-edition">
          PORTFOLIO / {new Date().getFullYear()}
        </span>
      </div>
    </section>
  );
}
