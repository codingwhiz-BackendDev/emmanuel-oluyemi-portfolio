import { useState } from 'react';
import { SplitText } from './SplitText';
import { projects } from '@/data';

export function Projects() {
  const [filter, setFilter] = useState('All');

  const tags = ['All', 'Web App', 'AI', 'Hackathon', 'SaaS', 'Tool'];
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.tag === filter);

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase mb-4">
          Selected Work
        </p>
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-10">
          <SplitText text="Things I've built" />
        </h2>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-4 border-b border-border">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`relative pb-3 pt-2 px-3 text-sm font-medium transition-colors ${
                filter === tag
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tag}
              {filter === tag && (
                <span
                  className="absolute -bottom-px left-0 right-0 h-0.5 bg-foreground"
                  style={{ transition: 'all 0.2s var(--ease-out)' }}
                />
              )}
            </button>
          ))}
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
    <a
      href="#projects"
      onClick={(e) => e.preventDefault()}
      className="xp-row group block border-b border-border py-5 transition-opacity duration-200"
      style={{
        opacity: 0,
        animation: `fadeIn 0.4s var(--ease-out) ${index * 50}ms forwards`,
      }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-base md:text-lg font-semibold truncate group-hover:text-foreground transition-colors">
              {project.title}
            </h3>
            <span className="shrink-0 rounded-full bg-accent text-accent-foreground px-2.5 py-0.5 text-xs font-medium">
              {project.tag}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2 max-w-xl md:max-w-2xl leading-relaxed">
            {project.description}
          </p>
        </div>
        <span className="shrink-0 text-sm text-muted-foreground hidden md:block">
          #{String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Mobile image */}
      <div className="md:hidden mt-3">
        <div className="aspect-video rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center text-muted-foreground text-sm">
          {project.title} preview
        </div>
      </div>
    </a>
  );
}
