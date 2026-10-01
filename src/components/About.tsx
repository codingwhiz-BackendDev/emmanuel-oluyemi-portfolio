import { SplitText } from './SplitText';
import { FadeUp } from './FadeUp';
import { profile } from '@/data';
import { Code, Database, Cpu, Wrench, Zap } from 'lucide-react';

const skillIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Languages: Code,
  Frameworks: Cpu,
  Databases: Database,
  Tools: Wrench,
};

export function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="container mx-auto max-w-2xl px-4">

        {/* Currently building badge */}
        <FadeUp>
          <a
            href="https://classmillia.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/5 px-4 py-1.5 text-sm font-medium text-brand hover:bg-brand/10 hover:border-brand/40 transition-all duration-200 mb-8"
          >
            <span className="size-2 rounded-full bg-brand animate-pulse" />
            Currently building ClassMillia
            <Zap className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </FadeUp>

        <h2 className="text-3xl md:text-4xl font-display font-bold mb-12">
          <SplitText text="My Introduction" />
        </h2>

        <div className="space-y-6">
          <FadeUp>
            <p className="text-lg text-foreground font-semibold">
              {profile.intro.title}
            </p>
          </FadeUp>
          {profile.intro.paragraphs.map((p, i) => (
            <FadeUp key={i} delay={(i + 1) * 100}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {p}
              </p>
            </FadeUp>
          ))}
        </div>

        {/* Skills */}
        <FadeUp delay={400}>
          <div className="mt-10 pt-8 border-t border-border">
            <h3 className="text-base font-semibold mb-6 flex items-center gap-2">
              Technical Skills
              <span className="text-xs font-normal text-muted-foreground bg-muted/60 border border-border rounded-full px-2 py-0.5">
                {Object.values(profile.skills).flat().length} technologies
              </span>
            </h3>
            {Object.entries(profile.skills).map(([category, skills]) => {
              const Icon = skillIcons[category];
              return (
                <div key={category} className="mb-5 last:mb-0">
                  <div className="flex items-center gap-2 mb-2.5">
                    {Icon && (
                      <div className="size-6 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center">
                        <Icon className="size-3.5 text-brand" />
                      </div>
                    )}
                    <span className="uppercase tracking-widest text-muted-foreground text-xs font-semibold">
                      {category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-8">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-muted/50 border border-border rounded-full px-3 py-1 text-sm text-foreground hover:bg-brand/10 hover:border-brand/30 hover:text-brand hover:scale-105 transition-all duration-200 cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Skills notes */}
            <div className="mt-5 space-y-1.5 pl-8">
              {profile.intro.skillsNote.map((note, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">{note.label}</span>{' '}
                  {note.value}
                </p>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Gradient divider */}
        <div
          className="mt-12 h-px w-full"
          style={{
            background: 'linear-gradient(to right, transparent, hsl(var(--brand) / 0.4), transparent)',
          }}
        />
      </div>
    </section>
  );
}
