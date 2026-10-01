import { useState } from 'react';
import { SplitText } from './SplitText';
import { FadeUp } from './FadeUp';
import { projects } from '@/data';
import { ProjectModal } from './ProjectModal';
import { Globe, Bot, Trophy, Rocket, Wrench, ArrowUpRight } from 'lucide-react';

type Project = (typeof projects)[number];

export function Projects() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<Project | null>(null);

  const tags = ['All', 'Web App', 'AI', 'Hackathon', 'SaaS', 'Tool'];
  const tagIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'Web App':  Globe,
    'AI':       Bot,
    'Hackathon':Trophy,
    'SaaS':     Rocket,
    'Tool':     Wrench,
  };

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.tag === filter);

  return (
    <>
      <section id="projects" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4">
            My Recent Work
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            <SplitText text="Things I've built" />
          </h2>
          <FadeUp delay={100}>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
              A collection of projects ranging from AI-powered apps to automation tools.
              Click any project to learn more.
            </p>
          </FadeUp>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-1 mb-6 border-b border-border overflow-x-auto">
            {tags.map((tag) => {
              const Icon = tagIcons[tag];
              const isActive = filter === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={`relative pb-3 pt-2 px-3 text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {Icon && <Icon className={`size-4 transition-colors ${isActive ? 'text-brand' : ''}`} />}
                  {tag}
                  {isActive && (
                    <span
                      className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-brand-gradient"
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
              <ProjectRow
                key={project.title}
                project={project}
                index={i}
                onClick={() => setSelected(project)}
              />
            ))}
          </div>
        </div>
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function ProjectRow({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  const hasLink = project.link !== '#';

  return (
    <div
      className="xp-row proj-row group border-b border-border py-5 cursor-pointer transition-all duration-200"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      style={{
        opacity: 0,
        animation: `fadeIn 0.4s var(--ease-out) ${index * 45}ms forwards`,
      }}
    >
      <div className="flex items-baseline justify-between gap-4 px-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-base md:text-lg font-semibold truncate group-hover:text-brand transition-colors duration-200">
              {project.title}
            </h3>
            <span className="shrink-0 rounded-full bg-brand/10 text-brand px-2.5 py-0.5 text-xs font-medium border border-brand/20">
              {project.tag}
            </span>
            {hasLink && (
              <span className="shrink-0 hidden md:inline-flex items-center gap-1 rounded-full bg-emerald-400/10 text-emerald-500 px-2.5 py-0.5 text-xs font-medium border border-emerald-400/20">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2 max-w-xl md:max-w-2xl leading-relaxed">
            {project.description}
          </p>
          {/* Tech pills */}
          {project.tech && (
            <div className="hidden md:flex flex-wrap gap-1.5 mt-2">
              {project.tech.slice(0, 4).map((t) => (
                <span key={t} className="text-[11px] bg-muted/60 border border-border rounded-full px-2 py-0.5 text-muted-foreground">
                  {t}
                </span>
              ))}
              {project.tech.length > 4 && (
                <span className="text-[11px] bg-muted/60 border border-border rounded-full px-2 py-0.5 text-muted-foreground">
                  +{project.tech.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm text-muted-foreground hidden md:block">
            #{String(index + 1).padStart(2, '0')}
          </span>
          <div className="size-8 rounded-full border border-border flex items-center justify-center group-hover:border-brand/40 group-hover:bg-brand/10 transition-all duration-200">
            <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
          </div>
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

      {/* Mobile image */}
      <div className="md:hidden mt-3 px-1">
        <div className="aspect-video rounded-xl overflow-hidden border border-border bg-muted">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
