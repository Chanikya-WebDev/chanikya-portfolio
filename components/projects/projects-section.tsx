"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Github, X } from "lucide-react";
import type { Project } from "@/lib/types";

type ProjectsSectionProps = {
  projects: Project[];
};

function useModalFocusTrap(isOpen: boolean, dialogRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!isOpen || !dialogRef.current) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const selectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");

    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(selectors));
    focusable[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const closeButton = dialog.querySelector<HTMLButtonElement>("[data-close-modal='true']");
        closeButton?.click();
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, dialogRef]);
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLElement>(null);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) || null,
    [activeProjectId, projects],
  );

  useModalFocusTrap(Boolean(activeProject), dialogRef);

  useEffect(() => {
    if (!activeProject) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProject]);

  return (
    <section aria-labelledby="projects-title" className="scroll-mt-24">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Build Portfolio</p>
          <h2 id="projects-title" className="mt-2 text-2xl font-semibold text-zinc-50 sm:text-3xl">
            Selected Projects
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.id}
            onClick={() => setActiveProjectId(project.id)}
            className={`group cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-none transition duration-200 hover:-translate-y-0.5 hover:border-zinc-600 hover:shadow-md ${
              activeProjectId === project.id ? "scale-[1.02] ring-2 ring-zinc-500" : ""
            }`}
          >
            <h3 className="text-lg font-semibold text-zinc-50">{project.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-zinc-300">{project.description}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {(project.tags ?? []).slice(0, 4).map((tag) => (
                <span
                  key={`${project.id}-${tag}`}
                  className="rounded-full border border-zinc-700 bg-transparent px-2 py-1 text-xs text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setActiveProjectId(project.id);
              }}
              className="mt-4 inline-flex items-center rounded-md bg-zinc-100 px-3 py-1.5 text-sm text-zinc-900 transition hover:bg-zinc-300"
            >
              View details
            </button>
          </article>
        ))}
      </div>

      {activeProject ? (
        <div
          role="presentation"
          onClick={() => setActiveProjectId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 transition-opacity duration-200"
        >
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-2xl transition duration-200"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Project Details</p>
                <h3 id="project-modal-title" className="mt-2 text-2xl font-semibold">
                  {activeProject.title}
                </h3>
              </div>
              <button
                type="button"
                data-close-modal="true"
                onClick={() => setActiveProjectId(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 transition hover:bg-zinc-800"
                aria-label="Close project details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-7 text-zinc-300">{activeProject.description}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {(activeProject.tags ?? []).map((tag) => (
                <span key={`modal-${activeProject.id}-${tag}`} className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {activeProject.github_url ? (
                <a
                  href={activeProject.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm transition hover:bg-zinc-900"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              ) : null}
              {activeProject.demo_url ? (
                <a
                  href={activeProject.demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
