"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { textVariants } from "@/components/ui/typography";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProjectPreview = Pick<Project, "id" | "title" | "description" | "github_url" | "demo_url" | "tags">;

type DeferredProjectsSectionProps = {
  projects: ProjectPreview[];
};

const ProjectsSection = dynamic(
  () => import("@/components/projects/projects-section").then((mod) => mod.ProjectsSection),
  {
    loading: () => <ProjectsSectionPlaceholder />,
  },
);

export function DeferredProjectsSection({ projects }: DeferredProjectsSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad || !rootRef.current) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return <div ref={rootRef}>{shouldLoad ? <ProjectsSection projects={projects} /> : <ProjectsSectionPlaceholder />}</div>;
}

function ProjectsSectionPlaceholder() {
  return (
    <section aria-hidden="true" className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/72 p-6">
            <div className="h-4 w-24 rounded bg-zinc-800" />
            <div className="h-8 w-4/5 rounded bg-zinc-800" />
            <div className="h-24 rounded-xl bg-zinc-950/70" />
            <div className="h-28 rounded-xl bg-zinc-950/70" />
            <div className="h-20 rounded-xl bg-zinc-950/70" />
          </div>
        ))}
      </div>
    </section>
  );
}
