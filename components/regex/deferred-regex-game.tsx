"use client";

import dynamic from "next/dynamic";
import { textVariants } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const RegexGame = dynamic(
  () => import("@/components/regex/regex-game").then((mod) => mod.RegexGame),
  {
    loading: () => <RegexGamePlaceholder />,
  },
);

export function DeferredRegexGame() {
  return <RegexGame />;
}

function RegexGamePlaceholder() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col bg-slate-950 text-zinc-100">
      <div className="border-b border-slate-800 bg-slate-950/95 px-6 py-4 backdrop-blur">
        <div className="h-6 w-40 rounded bg-slate-800" />
        <div className="mt-3 h-5 w-52 rounded bg-slate-900" />
      </div>
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className={cn(textVariants({ role: "hero-title" }), "text-cyan-400")}>REGEX INVADERS</div>
          <div className="mx-auto mt-6 h-6 w-full max-w-sm rounded bg-slate-800" />
          <div className="mx-auto mt-3 h-6 w-4/5 rounded bg-slate-900" />
        </div>
      </div>
    </div>
  );
}
