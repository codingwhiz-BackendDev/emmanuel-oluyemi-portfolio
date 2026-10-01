import { useEffect, useRef } from 'react';
import { X, ExternalLink, CheckCircle2, Zap, Clock, Users } from 'lucide-react';
import { projects } from '@/data';

type Project = (typeof projects)[number];

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  live:      { label: 'Live',         color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25', icon: CheckCircle2 },
  building:  { label: 'In Progress',  color: 'text-amber-400  bg-amber-400/10  border-amber-400/25',   icon: Zap          },
  hackathon: { label: 'Hackathon',    color: 'text-brand      bg-brand/10      border-brand/25',       icon: Users        },
  client:    { label: 'Client Work',  color: 'text-sky-400    bg-sky-400/10    border-sky-400/25',     icon: Clock        },
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef    = useRef<HTMLDivElement>(null);

  /* lock body scroll */
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  /* close on ESC */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!project) return null;

  const hasLink  = project.link !== '#';
  const status   = statusConfig[project.status] ?? statusConfig.live;
  const StatusIcon = status.icon;

  return (
    /* Backdrop */
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
      style={{ background: 'hsl(var(--ink) / 0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full md:max-w-2xl max-h-[92dvh] bg-background border border-border rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl"
        style={{ animation: 'modalIn 0.38s var(--ease-spring) forwards' }}
      >
        {/* Hero image */}
        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          {/* Image gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 size-9 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background hover:scale-110 transition-all duration-200"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>

          {/* Status badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${status.color}`}>
              <StatusIcon className="size-3.5" />
              {status.label}
            </span>
          </div>

          {/* Year badge */}
          <div className="absolute bottom-4 right-4">
            <span className="text-xs font-medium text-white/70 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              {project.year}
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-1">{project.title}</h2>
                <span className="inline-block bg-brand/10 text-brand border border-brand/20 rounded-full px-3 py-0.5 text-xs font-medium">
                  {project.tag}
                </span>
              </div>
              {hasLink && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary shrink-0 rounded-full h-10 px-5 flex items-center gap-2 text-sm font-medium transition-all"
                >
                  <span className="relative z-10">Visit site</span>
                  <ExternalLink className="size-3.5 relative z-10" />
                </a>
              )}
            </div>

            {/* Long description */}
            <p className="text-muted-foreground leading-relaxed text-[15px]">
              {project.longDescription}
            </p>

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {project.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="mt-0.5 shrink-0 size-5 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                        <CheckCircle2 className="size-3 text-brand" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech stack */}
            {project.tech && project.tech.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="bg-muted/60 border border-border text-foreground rounded-full px-3 py-1 text-xs font-medium hover:border-brand/30 hover:bg-brand/5 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer CTA */}
            <div className="pt-2 border-t border-border flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {hasLink ? 'This project is publicly accessible.' : 'This project is private or in development.'}
              </p>
              {hasLink ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary rounded-full h-9 px-5 flex items-center gap-2 text-sm font-medium shrink-0"
                >
                  <span className="relative z-10">Open project</span>
                  <ExternalLink className="size-3.5 relative z-10" />
                </a>
              ) : (
                <span className="text-sm font-medium text-muted-foreground px-4 py-2 rounded-full border border-border bg-muted/40">
                  Coming soon
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
