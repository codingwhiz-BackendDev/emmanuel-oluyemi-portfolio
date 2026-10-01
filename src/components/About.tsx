import { SplitText } from './SplitText';
import { FadeUp } from './FadeUp';
import { profile } from '@/data';
import { Code, Database, Cpu, Wrench } from 'lucide-react';

const asciiChars = '▓*,#=▚&·░@;▒+.%-▞$:';

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
            <h3 className="text-base font-semibold mb-6">Technical Skills</h3>
            {Object.entries(profile.skills).map(([category, skills]) => {
              const Icon = skillIcons[category];
              return (
                <div key={category} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 mb-2">
                    {Icon && <Icon className="size-4 text-muted-foreground" />}
                    <span className="uppercase tracking-wide text-muted-foreground text-sm font-medium">
                      {category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-6">
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
            <div className="mt-4 space-y-1">
              {profile.intro.skillsNote.map((note, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">{note.label}</span>{' '}
                  {note.value}
                </p>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* ASCII divider */}
        <div className="mt-10 overflow-hidden">
          <div className="font-mono text-sm text-muted-foreground select-none">
            {asciiChars.split('').map((char, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  opacity: 0.55,
                  transform: 'translateY(0.12em)',
                  transition: 'opacity 0.22s var(--ease-out), transform 0.22s var(--ease-out)',
                  transitionDelay: `${i * 20}ms`,
                }}
              >
                {char}
              </span>
            ))}
            {asciiChars.split('').map((char, i) => (
              <span
                key={`r-${i}`}
                className="inline-block"
                style={{
                  opacity: 0.55,
                  transform: 'translateY(0.12em)',
                  transition: 'opacity 0.22s var(--ease-out), transform 0.22s var(--ease-out)',
                  transitionDelay: `${(asciiChars.length + i) * 20}ms`,
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
