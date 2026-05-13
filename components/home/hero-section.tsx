import { textVariants } from "@/components/ui/typography";
import { TypedRoles } from "@/components/home/typed-roles";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20 md:py-28 sm:px-6">
      <div className="max-w-5xl">
        <p className={cn(textVariants({ role: "metadata" }), "uppercase tracking-[0.35em] text-zinc-500 text-xs sm:text-sm")}>
          Computer Science Student
        </p>
        <TypedRoles large />
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <a
            href="#projects"
            className={cn(
              textVariants({ role: "label" }),
              "rounded-md bg-zinc-100 px-3 py-1.5 sm:px-4 sm:py-2 text-zinc-900 shadow-sm transition-colors hover:bg-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 text-sm sm:text-base text-center sm:text-left",
            )}
          >
            View Projects
          </a>
          <a
            href="#contact"
            className={cn(
              textVariants({ role: "label" }),
              "rounded-md border border-zinc-700 bg-zinc-950/30 px-3 py-1.5 sm:px-4 sm:py-2 text-zinc-100 shadow-sm transition-colors hover:border-zinc-600 hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 text-sm sm:text-base text-center sm:text-left",
            )}
          >
            Let&apos;s Build
          </a>
        </div>
      </div>
    </section>
  );
}
