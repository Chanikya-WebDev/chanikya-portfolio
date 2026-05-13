"use client";

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import { useEffect, useState } from "react";
import { textVariants } from "@/components/ui/typography";
import { modalOverlay, modalPanel, motionStyle, revealItem, staggerContainer, subtleLift } from "@/lib/motion";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProjectsSectionProps = {
  projects: Array<Partial<Project> & { id: string; title: string }>;
};

function truncateText(value: string, limit: number) {
  if (!value) return "";
  if (value.length <= limit) return value;
  return `${value.slice(0, limit).trimEnd()}...`;
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProject = projects.find((p) => p.id === selectedId);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedId(null);
      }
    };

    if (selectedId) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }
  }, [selectedId]);

  return (
    <LazyMotion features={domAnimation}>
      <section className="scroll-mt-24">
        <m.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.18 }}
          variants={staggerContainer(0.08, 0.02)}
          className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <m.article
              key={project.id}
              variants={revealItem}
              whileHover={shouldReduceMotion ? undefined : subtleLift}
              style={motionStyle}
              onClick={() => setSelectedId(project.id)}
              className="group flex flex-col rounded-2xl border border-zinc-800/80 bg-zinc-950/72 p-4 sm:p-5 md:p-6 transition-colors duration-200 cursor-pointer hover:border-zinc-700 hover:bg-zinc-950/88"
            >
              <div className="flex flex-col gap-3 sm:gap-4">
                {project.image_url ? (
                  <div className="overflow-hidden rounded-md">
                    <img src={project.image_url} alt={`${project.title} screenshot`} className="h-32 sm:h-36 md:h-40 w-full object-cover" />
                  </div>
                ) : null}

                <div>
                  <h3 className={cn(textVariants({ role: "section-title" }), "mt-2 text-zinc-50 text-base sm:text-lg md:text-xl")}>
                    {project.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {(project.tags || []).slice(0, 6).map((tag) => (
                    <span key={tag} className="rounded-full border border-zinc-700 bg-transparent px-2 sm:px-3 py-0.5 sm:py-1 text-zinc-300 text-xs sm:text-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className={cn(textVariants({ role: "body" }), "mt-2 sm:mt-3 text-zinc-300 text-sm sm:text-base")}>
                  {truncateText(project.description || "", 140)}
                </p>

                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  {project.github_url ? (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={cn(textVariants({ role: "label" }), "inline-flex items-center gap-2 rounded-md border border-zinc-700 px-2 sm:px-3 py-1.5 sm:py-2 text-zinc-200 transition-colors hover:bg-zinc-900 text-xs sm:text-sm")}
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  ) : null}

                  {project.demo_url ? (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={cn(textVariants({ role: "label" }), "inline-flex items-center gap-2 rounded-md border border-zinc-700 px-2 sm:px-3 py-1.5 sm:py-2 text-zinc-200 transition-colors hover:bg-zinc-900 text-xs sm:text-sm")}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </a>
                  ) : null}
                </div>
              </div>
            </m.article>
          ))}
        </m.div>

        <AnimatePresence>
          {selectedProject ? (
            <ProjectModal 
              project={selectedProject} 
              shouldReduceMotion={shouldReduceMotion}
              onClose={() => setSelectedId(null)}
            />
          ) : null}
        </AnimatePresence>
      </section>
    </LazyMotion>
  );
}

type ProjectModalProps = {
  project: Partial<Project> & { id: string; title: string };
  shouldReduceMotion: boolean | null;
  onClose: () => void;
};

function ProjectModal({ project, shouldReduceMotion, onClose }: ProjectModalProps) {
  return (
    <m.div
      role="presentation"
      initial={shouldReduceMotion ? undefined : "hidden"}
      animate={shouldReduceMotion ? undefined : "visible"}
      exit={shouldReduceMotion ? undefined : "exit"}
      variants={modalOverlay}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/72 p-4 backdrop-blur-sm"
    >
      <m.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        variants={modalPanel}
        style={motionStyle}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 md:p-8 text-zinc-100 shadow-2xl max-w-2xl"
      >
        <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h2 id="project-modal-title" className={cn(textVariants({ role: "section-title" }), "text-zinc-50 text-lg sm:text-xl md:text-2xl")}>
              {project.title}
            </h2>
          </div>
          <m.button
            type="button"
            whileHover={shouldReduceMotion ? undefined : subtleLift}
            style={motionStyle}
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 flex-shrink-0"
            aria-label="Close project details"
          >
            <X className="h-5 w-5" />
          </m.button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {project.image_url ? (
            <div className="overflow-hidden rounded-xl">
              <img src={project.image_url} alt={project.title} className="w-full h-auto object-cover" />
            </div>
          ) : null}

          {project.description ? (
            <div>
              <h3 className={cn(textVariants({ role: "label" }), "uppercase tracking-[0.2em] text-zinc-500 mb-2 sm:mb-3 text-xs sm:text-sm")}>
                About
              </h3>
              <p className={cn(textVariants({ role: "body" }), "text-zinc-300 leading-relaxed text-sm sm:text-base")}>
                {project.description}
              </p>
            </div>
          ) : null}

          {project.tags && project.tags.length > 0 ? (
            <div>
              <h3 className={cn(textVariants({ role: "label" }), "uppercase tracking-[0.2em] text-zinc-500 mb-2 sm:mb-3 text-xs sm:text-sm")}>
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-zinc-700 bg-zinc-900/60 px-2 sm:px-3 py-1 sm:py-1.5 text-zinc-300 text-xs sm:text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-zinc-800">
            {project.github_url ? (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className={cn(textVariants({ role: "label" }), "inline-flex items-center justify-center gap-2 rounded-md border border-zinc-700 px-3 sm:px-4 py-2 text-zinc-200 transition-colors hover:bg-zinc-900 text-sm sm:text-base")}
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            ) : null}

            {project.demo_url ? (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noreferrer"
                className={cn(textVariants({ role: "label" }), "inline-flex items-center justify-center gap-2 rounded-md bg-zinc-100 px-3 sm:px-4 py-2 text-zinc-900 transition-colors hover:bg-zinc-300 text-sm sm:text-base")}
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            ) : null}
          </div>
        </div>
      </m.section>
    </m.div>
  );
}
