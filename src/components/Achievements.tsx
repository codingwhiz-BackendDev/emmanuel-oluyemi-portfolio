import { Award, Package, Rocket, Trophy, Users } from "lucide-react";
import { achievements } from "@/data";
import { FadeUp } from "./FadeUp";

const achievementIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "Completed 20+ Projects": Package,
  "Python Developer Certification": Award,
  "Growing Online Community": Users,
  "Published PyPI Package": Rocket,
};

export function Achievements() {
  return (
    <section
      className="studio-section text-foreground"
      aria-labelledby="achievements-title"
    >
      <FadeUp>
        <div className="section-kicker">
          <span>RECOGNITION</span>
          <span>MILESTONES & ACHIEVEMENTS</span>
        </div>
        <h2 id="achievements-title" className="section-title max-w-[850px]">
          A little recognition.
          <br />
          <span className="text-brand">A lot of motivation.</span>
        </h2>
      </FadeUp>

      <div className="mt-12 md:mt-16">
        <FadeUp>
          <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.16em]">
            Hackathon achievements
          </h3>
        </FadeUp>
        <div className="grid items-start gap-10 md:grid-cols-12 md:gap-8">
          {achievements.hackathon.map((item, i) => (
            <FadeUp
              key={item.title}
              delay={i * 100}
              className={
                i % 2 === 0 ? "md:col-span-7" : "md:col-span-5 md:mt-24"
              }
            >
              <figure className="group">
                <div className="relative overflow-hidden rounded-2xl bg-ink">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className={`w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105 ${i % 2 === 0 ? "aspect-[4/3]" : "aspect-square"}`}
                  />
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-[#d7fa77] px-4 py-2 text-xs font-bold text-ink shadow-sm md:bottom-5 md:left-5">
                    <Trophy className="size-4" aria-hidden="true" />
                    Third place
                  </span>
                </div>
                <figcaption className="mt-5 border-t border-foreground/20 pt-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="text-xl font-semibold tracking-tight md:text-2xl">
                      {item.title}
                    </h4>
                    <span
                      className="text-xs tabular-nums text-brand"
                      aria-hidden="true"
                    >
                      0{i + 1}
                    </span>
                  </div>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      </div>

      <div className="mt-16 grid gap-6 border-t border-foreground/20 pt-8 md:mt-20 md:grid-cols-[1fr_2fr] md:gap-16">
        <FadeUp>
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
            General
            <br className="hidden md:block" /> achievements
          </h3>
        </FadeUp>
        <ul className="divide-y divide-foreground/15">
          {achievements.general.map((item, i) => {
            const Icon = achievementIcons[item.title] || Trophy;
            return (
              <li key={item.title} className="py-5 first:pt-0 last:pb-0">
                <FadeUp delay={i * 60} className="flex items-start gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h4 className="text-base font-semibold tracking-tight">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </FadeUp>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
