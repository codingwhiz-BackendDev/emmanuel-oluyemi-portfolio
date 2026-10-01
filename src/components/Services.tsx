import { Code2, Server, Bot, Plug, Smartphone } from 'lucide-react';
import { SplitText } from './SplitText';
import { FadeUp } from './FadeUp';
import { services } from '@/data';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Server,
  Bot,
  Plug,
  Smartphone,
};

export function Services() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          <SplitText text="What I Offer" />
        </h2>
        <FadeUp delay={100}>
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            End-to-end backend solutions, APIs, and automation — built to scale.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-4">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? Code2;
            return (
              <FadeUp key={service.title} delay={i * 80}>
                <div className="border border-border rounded-2xl p-6 hover:bg-muted/50 hover:border-foreground/20 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 group h-full">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-accent to-accent/50 border border-border flex items-center justify-center mb-4 text-foreground group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm group-hover:shadow-md">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-base font-semibold mb-2 group-hover:text-foreground transition-colors">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
