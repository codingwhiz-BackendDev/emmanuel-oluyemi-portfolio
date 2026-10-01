import { SplitText } from './SplitText';
import { FadeUp } from './FadeUp';
import { achievements } from '@/data';
import { Trophy, Star, Rocket, Award, Users, Package } from 'lucide-react';

const achievementIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Completed 20+ Projects': Package,
  'Python Developer Certification': Award,
  'Growing Online Community': Users,
  'Published PyPI Package': Rocket,
};

export function Achievements() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto max-w-4xl px-4">
        <p className="section-label">Milestones</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-12">
          <SplitText text="My Success Story" />
        </h2>

        {/* General Achievements */}
        <FadeUp>
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Star className="size-5 text-brand" />
            General Achievements
          </h3>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {achievements.general.map((item, i) => {
            const Icon = achievementIcons[item.title] || Trophy;
            return (
              <FadeUp key={item.title} delay={i * 80}>
                <div className="card-premium border border-border rounded-2xl p-6 hover:bg-muted/50 group h-full">
                  <div className="icon-gradient size-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Icon className="size-6" />
                  </div>
                  <h4 className="text-base font-semibold mb-2 group-hover:text-foreground transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </FadeUp>
            );
          })}
        </div>

        {/* Hackathon Achievements */}
        <FadeUp delay={100}>
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Trophy className="size-5 text-brand" />
            Hackathon Achievements
          </h3>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-4">
          {achievements.hackathon.map((item, i) => (
            <FadeUp key={item.title} delay={i * 100}>
              <div className="card-premium border border-border rounded-2xl overflow-hidden hover:bg-muted/40 group transition-colors duration-300">
                {/* Image */}
                <div className="aspect-[3/2] bg-muted overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'linear-gradient(to top, hsl(var(--brand) / 0.15), transparent 60%)',
                    }}
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-base font-semibold mb-2 group-hover:text-foreground transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
