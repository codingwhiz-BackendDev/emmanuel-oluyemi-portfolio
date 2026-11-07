import { ChevronDown } from "lucide-react";
import { experiences } from "@/data";
import { FadeUp } from "./FadeUp";

export function Experience() {
  return (
    <section
      id="experience"
      className="studio-section text-foreground"
      aria-labelledby="experience-title"
    >
      <FadeUp>
        <div className="section-kicker">
          <span>EXPERIENCE</span>
          <span>THE JOURNEY SO FAR</span>
        </div>
        <h2 id="experience-title" className="section-title max-w-3xl">
          Where I’ve worked.
          <br />
          <span className="text-brand">What I’ve built.</span>
        </h2>
      </FadeUp>

      <ol className="ml-2 mt-12 border-l border-foreground/20 md:ml-3 md:mt-16">
        {experiences.map((exp, i) => (
          <li
            key={`${exp.company}-${exp.role}`}
            className="relative pl-6 md:pl-10"
          >
            <FadeUp delay={i * 60}>
              <ExperienceRow exp={exp} defaultOpen={i === 0} />
            </FadeUp>
          </li>
        ))}
      </ol>
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
  return (
    <details
      open={defaultOpen}
      className="group border-b border-foreground/20 open:pb-8 md:open:pb-10"
    >
      <summary className="flex cursor-pointer list-none items-start gap-4 rounded-sm py-6 text-left outline-none transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-background md:gap-6 md:py-8 [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden="true"
          className="absolute -left-[31px] top-8 size-[13px] rounded-full border-2 border-background bg-brand ring-4 ring-background group-open:bg-[#d7fa77] group-open:ring-brand md:-left-[47px] md:top-10"
        />
        <span className="min-w-0 flex-1 md:grid md:grid-cols-[160px_minmax(0,1fr)] md:gap-6">
          <span className="mb-3 block text-xs font-medium tabular-nums tracking-wide text-muted-foreground md:mb-0 md:pt-1.5">
            {exp.period}
          </span>
          <span className="block">
            <span className="block text-xl font-semibold leading-tight tracking-tight md:text-2xl">
              {exp.role}
            </span>
            <span className="mt-2 block text-sm font-medium text-brand">
              {exp.company}
            </span>
          </span>
        </span>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/20 text-foreground transition-colors group-open:border-ink group-open:bg-ink group-open:text-[#d7fa77] group-hover:border-brand">
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform motion-reduce:transition-none group-open:rotate-180"
          />
        </span>
      </summary>

      <div className="md:ml-[184px]">
        <ul className="list-disc space-y-3 pl-4 marker:text-brand">
          {exp.bullets.map((bullet) => (
            <li
              key={bullet}
              className="pl-1 text-sm leading-7 text-muted-foreground"
            >
              {bullet}
            </li>
          ))}
        </ul>

        {exp.products.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em]">
              Products
            </h3>
            <ul className="flex flex-wrap gap-2">
              {exp.products.map((product) => (
                <li
                  key={product}
                  className="rounded-full bg-[#d7fa77] px-3 py-1.5 text-xs font-semibold text-ink"
                >
                  {product}
                </li>
              ))}
            </ul>
          </div>
        )}

        {exp.tech.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em]">
              Technologies
            </h3>
            <ul className="flex flex-wrap gap-2">
              {exp.tech.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-foreground/20 px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}
