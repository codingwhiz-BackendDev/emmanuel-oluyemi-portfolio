import {
  ArrowUpRight,
  Bot,
  Code2,
  Plug,
  Server,
  Smartphone,
} from "lucide-react";
import { FadeUp } from "./FadeUp";
import { services } from "@/data";

const icons = { Code2, Server, Bot, Plug, Smartphone };

export function Services() {
  return (
    <section
      id="services"
      className="capabilities-section"
      aria-labelledby="services-heading"
    >
      <div className="studio-section">
        <FadeUp>
          <div className="section-kicker">
            <span>03 / WHAT I BRING</span>
            <span>FROM FIRST IDEA TO FINAL DEPLOY</span>
          </div>
          <div className="capabilities-intro">
            <h2 id="services-heading" className="section-title">
              Your vision.
              <br />
              <span>My execution.</span>
            </h2>
            <p>
              Good software is more than a good-looking interface. It’s the
              reliable system underneath, the thoughtful experience on top, and
              everything in between.
            </p>
          </div>
        </FadeUp>
        <div className="service-list">
          {services.map((service, i) => {
            const Icon = icons[service.icon as keyof typeof icons] ?? Code2;
            return (
              <FadeUp key={service.title} delay={i * 45}>
                <a href="#contact" className="service-line">
                  <span className="service-number">/ 0{i + 1}</span>
                  <Icon className="service-icon" size={27} aria-hidden="true" />
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <span className="service-arrow">
                    <ArrowUpRight size={23} aria-hidden="true" />
                  </span>
                </a>
              </FadeUp>
            );
          })}
        </div>
        <FadeUp>
          <div className="process-strip">
            <span className="process-label">HOW WE GET THERE</span>
            {["Discover", "Architect", "Build", "Refine & ship"].map(
              (step, i) => (
                <span key={step}>
                  <small>0{i + 1}</small>
                  {step}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              ),
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
