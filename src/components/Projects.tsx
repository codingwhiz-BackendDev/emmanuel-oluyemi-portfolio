import { useState } from 'react';
import { SplitText } from './SplitText';
import { FadeUp } from './FadeUp';
import { projects } from '@/data';
import { Globe, Bot, Trophy, Rocket, Wrench, ExternalLink } from 'lucide-react';

export function Projects() {
  const [filter, setFilter] = useState('All');

  const tags = ['All', 'Web App', 'AI', 'Hackathon', 'SaaS', 'Tool'];
  const tagIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'Web App': Globe,
    'AI': Bot,
    'Hackathon': Trophy,
    'SaaS': Rocket,
    'Tool': Wrench,
  };

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.tag === filter);

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase mb-4">
          My Recent Work
        </p>
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          <SplitText text="Things I've built" />
        </h2>
        <FadeUp delay={100}>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
            A collection of projects ranging from AI-powered apps to automation tools.
          </p>
        </FadeUp>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1 mb-4 border-b border-border overflow-x-auto">
          {tags.map((tag) => {
            const Icon = tagIcons[tag];
            return (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`relative pb-3 pt-2 px-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                  filter === tag
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {Icon && <Icon className="size-4" />}
                {tag}
                {filter === tag && (
                  <span
                    className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-gradient rounded-full"
                    style={{ transition: 'all 0.3s var(--ease-out)' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Project list */}
        <div className="xp-list">
          {filtered.map((project, i) => (
            <ProjectRow key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  return (
    <div
      className="xp-row proj-row group border-b border-border py-5 transition-all duration-200"
      style={{
        opacity: 0,
        animation: `fadeIn 0.4s var(--ease-out) ${index * 50}ms forwards`,
      }}
    >
      <a href={project.link} target={project.link.startsWith('#') ? undefined : '_blank'} rel="noopener noreferrer" className="block">
        <div className="flex items-baseline justify-between gap-4 px-1">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="text-base md:text-lg font-semibold truncate group-hover:text-brand transition-colors duration-200">
                {project.title}
              </h3>
              <span className="shrink-0 rounded-full bg-brand/10 text-brand px-2.5 py-0.5 text-xs font-medium border border-brand/20">
                {project.tag}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2 max-w-xl md:max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm text-muted-foreground hidden md:block">
              #{String(index + 1).padStart(2, '0')}
            </span>
            <ExternalLink className="size-4 text-muted-foreground group-hover:text-brand group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-200" />
          </div>
        </div>

        {/* Desktop hover image */}
        <div className="proj-image-wrap mt-0 px-1">
          <div>
            <div className="aspect-video rounded-xl overflow-hidden border border-border bg-muted mt-3 mb-1 group-hover:border-brand/30 transition-colors">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Mobile image (always visible) */}
        <div className="md:hidden mt-3 px-1">
          <div className="aspect-video rounded-xl overflow-hidden border border-border bg-muted">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </a>
    </div>
  );
}
