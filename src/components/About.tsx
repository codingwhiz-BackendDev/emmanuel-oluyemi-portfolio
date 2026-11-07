import { ArrowUpRight, Code2, Database, Layers, Terminal } from "lucide-react";
import { FadeUp } from "./FadeUp";
import { profile } from "@/data";

const icons = [Code2, Layers, Database, Terminal];

export function About() {
  return (
    <section
      id="about"
      className="studio-section about-section"
      aria-labelledby="about-heading"
    >
      <FadeUp>
        <div className="section-kicker">
          <span>01 / THE PERSON</span>
          <span>A LITTLE CONTEXT</span>
        </div>
      </FadeUp>
      <div className="about-layout">
        <FadeUp>
          <h2 id="about-heading" className="section-title">
            Not just code.
            <br />
            <span className="text-brand">
              A builder’s
              <br />
              mindset.
            </span>
          </h2>
          <div className="about-note">
            <span aria-hidden="true">↳</span>
            <p>
              Curiosity is the starting point.
              <br />
              Making it work is the good part.
            </p>
          </div>
        </FadeUp>
        <div>
          <FadeUp>
            <p className="about-lead">
              Hi, I’m Emmanuel. I connect the dots between complex systems and
              the people who use them.
            </p>
            <p className="about-body">{profile.intro.paragraphs[0]}</p>
            <p className="about-body">
              I’m studying Computer Science at Redeemer’s University, Ede
              (2023–2027), while building products at Orion Labs. From an API’s
              first endpoint to a mobile app’s final interaction, I care about
              the details that make software feel right.
            </p>
          </FadeUp>
          <FadeUp delay={100}>
            <div className="about-facts">
              <div>
                <strong>2021</strong>
                <span>THE JOURNEY BEGAN</span>
              </div>
              <div>
                <strong>20+</strong>
                <span>PROJECTS COMPLETED</span>
              </div>
              <div>
                <strong>Web + Mobile</strong>
                <span>ONE CONNECTED APPROACH</span>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={150}>
            <a
              href="https://classmillia.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="building-link"
            >
              <span className="status-dot" />
              <span>
                Currently building <strong>ClassMillia</strong>
              </span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </FadeUp>
        </div>
      </div>
      <FadeUp>
        <div className="stack-heading">
          <h3>My everyday toolkit.</h3>
          <span>THE RIGHT TOOLS. NOT JUST THE TRENDING ONES.</span>
        </div>
      </FadeUp>
      <div className="stack-grid">
        {Object.entries(profile.skills).map(([category, skills], i) => {
          const Icon = icons[i];
          return (
            <FadeUp key={category} delay={i * 60}>
              <div className="stack-card">
                <div className="stack-card-heading">
                  <Icon size={20} aria-hidden="true" />
                  <span>{category}</span>
                  <span className="stack-number">0{i + 1}</span>
                </div>
                <div className="stack-pills">
                  {skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            </FadeUp>
          );
        })}
      </div>
    </section>
  );
}
