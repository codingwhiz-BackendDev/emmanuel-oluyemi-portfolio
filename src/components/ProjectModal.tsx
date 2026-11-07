import { useEffect, useId, useRef } from "react";
import { ArrowUpRight, Check, X } from "lucide-react";
import { projects } from "@/data";

type Project = (typeof projects)[number];

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

function projectLink(project: Project) {
  try {
    const url = new URL(project.link);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

export function ProjectStatus({ project }: { project: Project }) {
  const link = projectLink(project);
  const statuses: Record<string, { label: string; className: string }> = {
    live: link
      ? {
          label: link.hostname === "pypi.org" ? "Published package" : "Live",
          className: "border-emerald-700/20 bg-emerald-50 text-emerald-800",
        }
      : {
          label: "No public link",
          className: "border-border bg-muted text-muted-foreground",
        },
    building: {
      label: "In progress",
      className: "border-amber-700/20 bg-amber-50 text-amber-800",
    },
    hackathon: {
      label: "Hackathon project",
      className: "border-brand/20 bg-brand/5 text-brand-dark",
    },
    client: {
      label: "Client work",
      className: "border-sky-700/20 bg-sky-50 text-sky-800",
    },
  };
  const status = statuses[project.status] ?? {
    label: "Status not listed",
    className: "border-border bg-muted text-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
    >
      {status.label}
    </span>
  );
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const backdropPressRef = useRef(false);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!project || !dialog) return;

    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const body = document.body;
    const root = document.documentElement;
    const savedStyles = [
      { element: body, property: "overflow" },
      { element: body, property: "padding-right" },
      { element: root, property: "overflow" },
    ].map(({ element, property }) => ({
      element,
      property,
      value: element.style.getPropertyValue(property),
      priority: element.style.getPropertyPriority(property),
    }));
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const bodyPadding =
      parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    dialog.showModal();
    body.style.setProperty("overflow", "hidden");
    root.style.setProperty("overflow", "hidden");
    if (scrollbarWidth > 0) {
      body.style.setProperty(
        "padding-right",
        `${bodyPadding + scrollbarWidth}px`,
      );
    }
    dialog.scrollTop = 0;
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      if (dialog.open) dialog.close();
      savedStyles.forEach(({ element, property, value, priority }) => {
        if (value) element.style.setProperty(property, value, priority);
        else element.style.removeProperty(property);
      });
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [project]);

  if (!project) return null;

  const link = projectLink(project);
  const isPackage = link?.hostname === "pypi.org";
  const isOutside = (clientX: number, clientY: number) => {
    const bounds = dialogRef.current?.getBoundingClientRect();
    return (
      !!bounds &&
      (clientX < bounds.left ||
        clientX > bounds.right ||
        clientY < bounds.top ||
        clientY > bounds.bottom)
    );
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onPointerDown={(event) => {
        backdropPressRef.current =
          event.target === event.currentTarget &&
          isOutside(event.clientX, event.clientY);
      }}
      onClick={(event) => {
        if (
          backdropPressRef.current &&
          event.target === event.currentTarget &&
          isOutside(event.clientX, event.clientY)
        )
          onClose();
        backdropPressRef.current = false;
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_1.5rem)] max-w-4xl overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-ink/70 backdrop:backdrop-blur-sm sm:max-h-[92dvh] sm:w-[calc(100%_-_3rem)] sm:rounded-3xl"
    >
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-background px-5 py-5 sm:px-8 sm:py-6">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark">
            {project.tag}{" "}
            <span aria-hidden="true" className="mx-1 text-muted-foreground">
              /
            </span>{" "}
            {project.year}
          </p>
          <h2
            id={titleId}
            className="break-words font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl"
          >
            {project.title}
          </h2>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </header>

      <div className="p-5 sm:p-8">
        <div className="overflow-hidden rounded-xl border border-border bg-muted p-2 sm:p-4">
          <img
            src={project.image}
            alt={`${project.title} project preview`}
            loading="lazy"
            decoding="async"
            width={1600}
            height={900}
            className="aspect-video w-full rounded-lg bg-background object-contain"
          />
        </div>

        <div className="mt-7 grid gap-8 sm:mt-8 md:grid-cols-[minmax(0,1fr)_13rem] md:gap-10">
          <div className="min-w-0 space-y-7">
            <section aria-labelledby={`${titleId}-overview`}>
              <h3
                id={`${titleId}-overview`}
                className="mb-3 font-display text-xl font-semibold"
              >
                About the project
              </h3>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                {project.longDescription}
              </p>
            </section>

            {project.features.length > 0 && (
              <section aria-labelledby={`${titleId}-features`}>
                <h3
                  id={`${titleId}-features`}
                  className="mb-4 font-display text-xl font-semibold"
                >
                  Key features
                </h3>
                <ul className="space-y-3">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-relaxed"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand-dark">
                        <Check aria-hidden="true" className="size-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside
            aria-label="Project metadata"
            className="min-w-0 border-t border-border pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0"
          >
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Project status
            </h3>
            <ProjectStatus project={project} />

            {project.tech.length > 0 && (
              <section aria-labelledby={`${titleId}-tech`} className="mt-7">
                <h3
                  id={`${titleId}-tech`}
                  className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                >
                  Built with
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {project.tech.map((technology) => (
                    <li
                      key={technology}
                      className="rounded-lg border border-border bg-muted/60 px-2.5 py-1.5 text-xs font-medium"
                    >
                      {technology}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>

        <footer className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {link
              ? "External link · opens in a new tab."
              : "No public project link provided."}
          </p>
          {link && (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-dark px-5 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {isPackage ? "View package" : "Open project link"}
              <span className="sr-only"> (opens in a new tab)</span>
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          )}
        </footer>
      </div>
    </dialog>
  );
}
