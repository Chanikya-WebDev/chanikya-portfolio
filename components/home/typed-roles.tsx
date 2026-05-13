"use client";

import { useEffect, useState } from "react";
import { textVariants } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type Role = {
  title: string;
  description: string;
};

const ROLES: Role[] = [
  {
    title: "Full-Stack Developer",
    description: "Building end-to-end web applications with seamless interfaces and robust backends",
  },
  {
    title: "AI Engineer",
    description: "Crafting intelligent systems and automation workflows with production-grade AI",
  },
  {
    title: "Backend Architect",
    description: "Designing scalable service layers, data flows, and deployment infrastructure",
  },
  {
    title: "Frontend Engineer",
    description: "Creating polished, responsive user interfaces with strong performance and accessibility",
  },
  {
    title: "Product Designer",
    description: "Translating product vision into systems with clear architecture and exceptional UX",
  },
  {
    title: "Systems Engineer",
    description: "Building production-ready systems that scale, deliver, and maintain operational discipline",
  },
];
const TYPE_DELAY = 80;
const DELETE_DELAY = 42;
const HOLD_DELAY = 1400;

type TypedRolesProps = {
  large?: boolean;
};

export function TypedRoles({ large = false }: TypedRolesProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];

    if (!isDeleting && displayText === currentRole.title) {
      const timeout = window.setTimeout(() => setIsDeleting(true), HOLD_DELAY);
      return () => window.clearTimeout(timeout);
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setRoleIndex((value) => (value + 1) % ROLES.length);
      return;
    }

    const timeout = window.setTimeout(() => {
      setDisplayText((value) =>
        isDeleting
          ? currentRole.title.slice(0, Math.max(0, value.length - 1))
          : currentRole.title.slice(0, value.length + 1),
      );
    }, isDeleting ? DELETE_DELAY : TYPE_DELAY);

    return () => window.clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  if (large) {
    const currentRole = ROLES[roleIndex];
    return (
      <div>
        <h1 className="font-heading font-semibold leading-[1.05] tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-4 max-w-4xl text-balance text-zinc-50">
          <span className="font-mono text-zinc-500 mr-2 sm:mr-3">$</span>
          <span className="inline-block font-mono text-emerald-300">{displayText}</span>
          <span aria-hidden="true" className="inline-block h-5 sm:h-6 w-px animate-pulse bg-zinc-400 ml-2 align-middle" />
        </h1>
        <p className={cn(textVariants({ role: "body" }), "mt-4 sm:mt-6 max-w-3xl text-pretty text-zinc-300 text-sm sm:text-base")}>
          {currentRole.description}
        </p>
      </div>
    );
  }

  const currentRole = ROLES[roleIndex];
  return (
    <p className={cn(textVariants({ role: "label" }), "mt-6 flex min-h-6 items-center gap-2 text-zinc-300")}>
      <span className="font-mono text-zinc-500">$</span>
      <span className="font-mono text-emerald-300">{displayText}</span>
      <span aria-hidden="true" className="inline-block h-5 w-px animate-pulse bg-zinc-400" />
    </p>
  );
}
