import type { Project } from "@/lib/types";

const STACK_GROUPS = {
  interface: ["next", "react", "tailwind", "ui", "frontend", "typescript", "web"],
  services: ["node", "api", "backend", "server", "resend", "express"],
  data: ["supabase", "postgres", "database", "sql", "redis", "cache"],
  intelligence: ["ai", "llm", "rag", "vector", "ocr", "regex", "automation"],
  delivery: ["cloudflare", "docker", "ci", "cd", "vercel", "infra", "devops"],
} as const;

const GROUP_LABELS = {
  interface: "Interface Layer",
  services: "Service Layer",
  data: "Data Plane",
  intelligence: "Automation Layer",
  delivery: "Delivery Layer",
} as const;

const GROUP_SNIPPETS = {
  interface: "typed interface surfaces",
  services: "service orchestration",
  data: "stateful data boundaries",
  intelligence: "automation and inference loops",
  delivery: "deployment and runtime controls",
} as const;

type GroupKey = keyof typeof STACK_GROUPS;

function normalizeTags(project: Project) {
  return (project.tags ?? []).map((tag) => tag.toLowerCase());
}

function findGroups(project: Project) {
  const tags = normalizeTags(project);
  const groups = new Set<GroupKey>();

  (Object.keys(STACK_GROUPS) as GroupKey[]).forEach((group) => {
    if (STACK_GROUPS[group].some((token) => tags.some((tag) => tag.includes(token)))) {
      groups.add(group);
    }
  });

  if (project.demo_url) {
    groups.add("interface");
    groups.add("delivery");
  }

  if (project.github_url) {
    groups.add("services");
  }

  if (groups.size === 0) {
    groups.add("interface");
    groups.add("services");
  }

  return Array.from(groups);
}

function architectureSummary(groups: GroupKey[]) {
  return groups.map((group) => GROUP_LABELS[group]);
}

function architectureNarrative(groups: GroupKey[]) {
  const snippets = groups.map((group) => GROUP_SNIPPETS[group]);

  if (snippets.length === 1) {
    return `Centered on ${snippets[0]}.`;
  }

  if (snippets.length === 2) {
    return `Combines ${snippets[0]} with ${snippets[1]}.`;
  }

  return `Connects ${snippets.slice(0, -1).join(", ")} and ${snippets.at(-1)}.`;
}

function challengeNarrative(project: Project, groups: GroupKey[]) {
  const description = project.description.toLowerCase();

  if (groups.includes("intelligence") && groups.includes("data")) {
    return "Balancing automation accuracy with reliable data flow and production-safe interfaces.";
  }

  if (groups.includes("delivery") && groups.includes("services")) {
    return "Keeping service boundaries maintainable while shipping fast across runtime and deployment constraints.";
  }

  if (description.includes("production") || description.includes("scale")) {
    return "Maintaining production-readiness under scale, latency, and system-coupling pressure.";
  }

  if (groups.includes("interface") && groups.includes("services")) {
    return "Aligning product UX with clean service contracts and predictable system behavior.";
  }

  return "Turning a focused product requirement into a system with clear boundaries and operational discipline.";
}

function depthSignals(project: Project, groups: GroupKey[]) {
  const tags = project.tags ?? [];
  const signals = tags.slice(0, 5);

  if (project.github_url) {
    signals.push("Source Available");
  }

  if (project.demo_url) {
    signals.push("Live Runtime");
  }

  if (groups.includes("delivery")) {
    signals.push("Deployment Surface");
  }

  return Array.from(new Set(signals)).slice(0, 6);
}

function projectMetrics(project: Project, groups: GroupKey[]) {
  return [
    {
      label: "Layers",
      value: String(groups.length),
    },
    {
      label: "Signals",
      value: String((project.tags ?? []).length || groups.length),
    },
    {
      label: "Surfaces",
      value: `${project.github_url ? "SRC" : "INT"} / ${project.demo_url ? "LIVE" : "BUILD"}`,
    },
  ];
}

export function deriveProjectInsight(project: Project) {
  const groups = findGroups(project);

  return {
    problem: project.description,
    architectureLayers: architectureSummary(groups),
    architectureNarrative: architectureNarrative(groups),
    engineeringChallenge: challengeNarrative(project, groups),
    technicalDepth: depthSignals(project, groups),
    metrics: projectMetrics(project, groups),
  };
}
