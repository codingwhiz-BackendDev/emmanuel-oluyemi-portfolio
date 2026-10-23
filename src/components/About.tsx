import { SplitText } from './SplitText';
import { FadeUp } from './FadeUp';
import { profile } from '@/data';
import { Terminal } from 'lucide-react';

const asciiChars = '▓*,#=▚&·░@;▒+.%-▞$:';

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
              I'm Emmanuel Oluyemi, a Backend Developer
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

        {/* Code snippet card */}
        <FadeUp delay={300}>
          <div className="mt-8 rounded-2xl border border-border bg-muted/40 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/60">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-red-400/70" />
                <span className="size-2.5 rounded-full bg-yellow-400/70" />
                <span className="size-2.5 rounded-full bg-green-400/70" />
              </div>
              <Terminal className="size-3.5 text-muted-foreground ml-1" />
              <span className="text-xs text-muted-foreground font-mono">developer.js</span>
            </div>
            <pre className="p-4 text-sm font-mono text-foreground overflow-x-auto leading-relaxed">
              <code>{profile.codeSnippet}</code>
            </pre>
          </div>
        </FadeUp>

        {/* Skills */}
        <FadeUp delay={400}>
          <div className="mt-10 pt-8 border-t border-border">
            <h3 className="text-base font-semibold mb-6">Technical Skills</h3>
            {Object.entries(profile.skills).map(([category, skills]) => (
              <p key={category} className="mb-3 last:mb-0">
                <span className="uppercase tracking-wide text-muted-foreground text-sm font-medium">
                  {category}{' '}
                </span>
                <span className="text-foreground">
                  {skills.map((skill, si) => (
                    <span key={skill}>
                      <span className="nav-nudge cursor-default">{skill}</span>
                      {si < skills.length - 1 && <span className="text-muted-foreground"> · </span>}
                    </span>
                  ))}
                </span>
              </p>
            ))}

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
