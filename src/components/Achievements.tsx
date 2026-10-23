import { SplitText } from './SplitText';
import { FadeUp } from './FadeUp';
import { achievements } from '@/data';
import { Trophy, Star } from 'lucide-react';

export function Achievements() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-12">
          <SplitText text="My Success Story" />
        </h2>

        {/* General Achievements */}
        <FadeUp>
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Star className="size-5 text-muted-foreground" />
            General Achievements
          </h3>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {achievements.general.map((item, i) => (
            <FadeUp key={item.title} delay={i * 80}>
              <div className="border border-border rounded-2xl p-6 hover:bg-muted/50 transition-colors duration-200 h-full">
                <h4 className="text-base font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Hackathon Achievements */}
        <FadeUp delay={100}>
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Trophy className="size-5 text-muted-foreground" />
            Hackathon Achievements
          </h3>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-4">
          {achievements.hackathon.map((item, i) => (
            <FadeUp key={item.title} delay={i * 100}>
              <div className="border border-border rounded-2xl overflow-hidden hover:bg-muted/50 transition-colors duration-200">
                {/* Image placeholder */}
                <div className="aspect-[3/2] bg-muted flex items-center justify-center text-muted-foreground text-sm">
                  {item.title} Certificate
                </div>
                <div className="p-6">
                  <h4 className="text-base font-semibold mb-2">{item.title}</h4>
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
