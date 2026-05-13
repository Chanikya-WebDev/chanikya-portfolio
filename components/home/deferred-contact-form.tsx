"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { textVariants } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const ContactForm = dynamic(
  () => import("@/components/contact/contact-form").then((mod) => mod.ContactForm),
  {
    loading: () => <ContactFormPlaceholder />,
  },
);

export function DeferredContactForm() {
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
      { rootMargin: "240px 0px" },
    );

    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return <div ref={rootRef}>{shouldLoad ? <ContactForm /> : <ContactFormPlaceholder />}</div>;
}

function ContactFormPlaceholder() {
  return (
    <section aria-hidden="true" className="rounded-2xl border border-zinc-800/80 bg-zinc-950/72 p-6 shadow-none sm:p-8">
      <div className={cn(textVariants({ role: "section-title" }), "text-zinc-50")}>Contact</div>
      <div className="mt-2 h-6 w-full max-w-sm rounded bg-zinc-800/90" />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="h-5 w-16 rounded bg-zinc-800" />
          <div className="h-11 rounded-md bg-zinc-950/80" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-16 rounded bg-zinc-800" />
          <div className="h-11 rounded-md bg-zinc-950/80" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <div className="h-5 w-20 rounded bg-zinc-800" />
          <div className="h-32 rounded-md bg-zinc-950/80" />
        </div>
        <div className="sm:col-span-2">
          <div className="h-10 w-32 rounded-md bg-zinc-800" />
        </div>
      </div>
    </section>
  );
}
