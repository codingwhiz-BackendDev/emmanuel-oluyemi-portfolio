import { useCallback, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react";
import { projects } from "@/data";
import { ProjectModal, ProjectStatus } from "./ProjectModal";

type Project = (typeof projects)[number];

const INITIAL_COUNT = 6;
const categories = ["All", ...new Set(projects.map((project) => project.tag))];

export function Projects() {
  const [filter, setFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeProject = useCallback(() => setSelected(null), []);

  const filtered =
    filter === "All"
      ? projects
      : projects.filter((project) => project.tag === filter);
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

  return (
    <>
      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="border-y border-border bg-background bg-gradient-to-br from-amber-50/60 via-background to-muted/50 py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8 md:px-10">
          <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">
                <span aria-hidden="true" className="h-px w-8 bg-brand" />
                The project collection
              </p>
              <h2
                id="projects-heading"
                className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
              >
                Ideas turned
                <br />
                <span className="text-brand-dark">into interfaces.</span>
              </h2>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
              Web apps, AI experiments, and developer tools. Explore the work,
              the details, and the technology behind each project.
            </p>
          </header>

          <div
            role="group"
            aria-label="Filter projects by category"
            className="mb-6 flex flex-wrap gap-2 border-y border-border py-5"
          >
            {categories.map((category) => {
              const count =
                category === "All"
                  ? projects.length
                  : projects.filter((project) => project.tag === category)
                      .length;
              const active = filter === category;

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  aria-controls="project-gallery"
                  onClick={() => {
                    setFilter(category);
                    setShowAll(false);
                  }}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    active
                      ? "border-brand-dark bg-brand-dark text-brand-foreground"
                      : "border-border bg-background/70 text-muted-foreground hover:border-brand/40 hover:text-foreground"
                  }`}
                >
                  {category}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${active ? "bg-white/15" : "bg-muted text-muted-foreground"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="mb-6 text-xs font-medium tracking-wide text-muted-foreground"
          >
            Showing {visible.length} of {filtered.length} projects
            {filter !== "All" ? ` in ${filter}` : ""}
          </p>

          <ul
            id="project-gallery"
            className="grid list-none grid-cols-1 gap-x-6 gap-y-9 p-0 md:grid-cols-2 md:gap-y-12"
          >
            {visible.map((project) => (
              <li key={project.title} className="min-w-0">
                <ProjectCard
                  project={project}
                  onOpen={() => setSelected(project)}
                />
              </li>
            ))}
          </ul>

          {filtered.length > INITIAL_COUNT && (
            <div className="mt-10 flex justify-center border-t border-border pt-8">
              <button
                ref={toggleRef}
                type="button"
                aria-expanded={showAll}
                aria-controls="project-gallery"
                onClick={() => {
                  if (showAll) {
                    // Keep the focused control in view when the long gallery collapses.
                    toggleRef.current?.focus({ preventScroll: true });
                    requestAnimationFrame(() =>
                      toggleRef.current?.scrollIntoView({
                        block: "nearest",
                        behavior: "instant",
                      }),
                    );
                  }
                  setShowAll((expanded) => !expanded);
                }}
                className="inline-flex min-h-12 items-center gap-3 rounded-full border border-brand/30 bg-background px-6 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {showAll
                  ? "Show fewer projects"
                  : `Show ${filtered.length - INITIAL_COUNT} more projects`}
                {showAll ? (
                  <ArrowUp aria-hidden="true" className="size-4" />
                ) : (
                  <ArrowDown aria-hidden="true" className="size-4" />
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      <ProjectModal project={selected} onClose={closeProject} />
    </>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl">
      <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted p-3 transition-colors group-hover:border-brand/40 sm:p-5">
        <img
          src={project.image}
          alt={`${project.title} project preview`}
          loading="lazy"
          decoding="async"
          width={1200}
          height={900}
          className="h-full w-full rounded-lg border border-border/70 bg-background object-contain shadow-sm transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-5 right-5 flex size-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors group-hover:border-brand-dark group-hover:bg-brand-dark group-hover:text-brand-foreground sm:bottom-7 sm:right-7"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </span>

      <span className="mt-5 flex w-full flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-semibold uppercase tracking-[0.12em] text-brand-dark">
          {project.tag}{" "}
          <span className="mx-1 text-muted-foreground" aria-hidden="true">
            /
          </span>{" "}
          <span className="font-normal text-muted-foreground">
            {project.year}
          </span>
        </span>
        <ProjectStatus project={project} />
      </span>
      <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand-dark sm:text-3xl">
        <button
          type="button"
          onClick={(event) => {
            event.currentTarget.focus({ preventScroll: true });
            onOpen();
          }}
          aria-label={`View details for ${project.title}`}
          aria-haspopup="dialog"
          className="text-left after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand focus-visible:after:ring-offset-4 focus-visible:after:ring-offset-background"
        >
          {project.title}
        </button>
      </h3>
      <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </span>
      <span className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {project.tech.slice(0, 3).map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
        {project.tech.length > 3 && (
          <span>+{project.tech.length - 3} more</span>
        )}
      </span>
      <span
        aria-hidden="true"
        className="mt-5 text-sm font-medium text-brand-dark underline decoration-brand/30 underline-offset-4 group-hover:decoration-brand-dark"
      >
        View project details
      </span>
    </article>
  );
}
