import { useState } from 'react';
import { ChevronDown, Briefcase, GraduationCap, Zap } from 'lucide-react';
import { SplitText } from './SplitText';
import { experiences } from '@/data';

export function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase mb-4">
          Experience
        </p>
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-10">
          <SplitText text="Where I've worked" />
        </h2>

        <div className="xp-list">
          {experiences.map((exp, i) => (
            <ExperienceRow key={i} exp={exp} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceRow({
  exp,
  defaultOpen = false,
}: {
  exp: (typeof experiences)[number];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  // Get icon based on role/company
  const getIcon = () => {
    if (exp.company === 'Orion Labs' || exp.company === 'Self-employed') return Briefcase;
    if (exp.company === 'SkillBoost Africa' || exp.company === 'Internship') return GraduationCap;
    if (exp.company === 'Self-taught') return Zap;
    return Briefcase;
  };

  const Icon = getIcon();

  return (
    <div className="xp-row border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-center gap-4 text-left group"
      >
        {/* Icon */}
        <div className="size-10 rounded-xl bg-accent/50 border border-border flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
          <Icon className="size-5 text-foreground" />
        </div>

        {/* Date (desktop) */}
        <span className="hidden md:block text-sm text-muted-foreground whitespace-nowrap w-[140px] shrink-0">
          {exp.period}
        </span>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-base md:text-lg font-semibold">{exp.role}</span>
            <span className="text-muted-foreground text-sm">at</span>
            <span className="bg-accent text-accent-foreground rounded-full px-3 py-0.5 text-sm font-medium hover:opacity-80 transition-opacity">
              {exp.company}
            </span>
          </div>
          {/* Date (mobile) */}
          <span className="md:hidden text-sm text-muted-foreground mt-1 block">
            {exp.period}
          </span>
        </div>

        {/* Chevron */}
        <span className="size-8 rounded-full border border-border flex items-center justify-center shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transitionTimingFunction: 'var(--ease-out)' }}
        >
          <ChevronDown className="size-4 text-muted-foreground" />
        </span>
      </button>

      {/* Expandable content */}
      <div
        className={`accordion-content ${open ? 'open' : ''}`}
      >
        <div className="accordion-inner">
          <div
            className="pb-5 md:pl-[240px] space-y-3"
            style={{
              opacity: open ? 1 : 0,
              transition: 'opacity 0.2s var(--ease-out) 0.15s',
            }}
          >
            <ul className="space-y-2">
              {exp.bullets.map((bullet, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                  <span className="text-muted-foreground mt-1.5 shrink-0">·</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Product pills */}
            {exp.products.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {exp.products.map((product) => (
                  <span
                    key={product}
                    className="bg-accent text-accent-foreground rounded-full px-2.5 py-0.5 text-xs font-medium"
                  >
                    {product}
                  </span>
                ))}
              </div>
            )}

            {/* Tech pills */}
            {exp.tech.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {exp.tech.map((tech) => (
                  <span
                    key={tech}
                    className="bg-muted/50 border border-border text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium hover:bg-muted hover:border-foreground/20 transition-all"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
