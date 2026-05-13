"use client";

import { FormEvent, useState } from "react";
import { textVariants } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type ContactState = {
  isLoading: boolean;
  toast: { type: "success" | "error"; message: string } | null;
};

type ContactFormProps = {
  id?: string;
};

export function ContactForm({ id }: ContactFormProps) {
  const [state, setState] = useState<ContactState>({ isLoading: false, toast: null });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ isLoading: true, toast: null });

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name")?.toString().trim() ?? "",
      email: formData.get("email")?.toString().trim() ?? "",
      message: formData.get("message")?.toString().trim() ?? "",
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Failed to send your message.");
      }

      form.reset();
      setState({ isLoading: false, toast: { type: "success", message: "Message sent successfully." } });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      setState({ isLoading: false, toast: { type: "error", message } });
    }
  }

  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-zinc-800/80 bg-zinc-950/72 p-4 sm:p-6 md:p-8 shadow-none">
      <h2 className={cn(textVariants({ role: "section-title" }), "text-zinc-50 text-lg sm:text-2xl")}>Contact</h2>
      <p id="contact-description" className={cn(textVariants({ role: "body" }), "mt-2 max-w-2xl text-zinc-300 text-sm sm:text-base")}>
        Have an internship, collaboration, or project idea? Send a message.
      </p>

      <form onSubmit={onSubmit} aria-busy={state.isLoading} aria-describedby="contact-description" className="mt-4 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
        <label htmlFor="contact-name" className="space-y-1.5 sm:space-y-2 sm:col-span-1">
          <span className={cn(textVariants({ role: "label" }), "text-zinc-100 text-xs sm:text-sm")}>Name</span>
          <input
            id="contact-name"
            type="text"
            name="name"
            autoComplete="name"
            required
            className={cn(
              textVariants({ role: "body" }),
              "w-full rounded-md border border-zinc-700 bg-zinc-950/35 px-3 sm:px-4 py-2 sm:py-3 text-zinc-100 placeholder:text-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/15 text-sm sm:text-base",
            )}
          />
        </label>

        <label htmlFor="contact-email" className="space-y-1.5 sm:space-y-2 sm:col-span-1">
          <span className={cn(textVariants({ role: "label" }), "text-zinc-100 text-xs sm:text-sm")}>Email</span>
          <input
            id="contact-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            className={cn(
              textVariants({ role: "body" }),
              "w-full rounded-md border border-zinc-700 bg-zinc-950/35 px-3 sm:px-4 py-2 sm:py-3 text-zinc-100 placeholder:text-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/15 text-sm sm:text-base",
            )}
          />
        </label>

        <label htmlFor="contact-message" className="space-y-1.5 sm:space-y-2 sm:col-span-2">
          <span className={cn(textVariants({ role: "label" }), "text-zinc-100 text-xs sm:text-sm")}>Message</span>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={4}
            autoComplete="off"
            className={cn(
              textVariants({ role: "body" }),
              "min-h-28 sm:min-h-36 w-full rounded-md border border-zinc-700 bg-zinc-950/35 px-3 sm:px-4 py-2 sm:py-3 text-zinc-100 placeholder:text-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/15 text-sm sm:text-base",
            )}
          />
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={state.isLoading}
            className={cn(textVariants({ role: "label" }), "w-full sm:w-auto rounded-md bg-zinc-100 px-4 py-2 text-zinc-900 transition hover:bg-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-60 text-sm sm:text-base")}
          >
            {state.isLoading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>

      {state.toast ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            textVariants({ role: "label" }),
            `fixed inset-x-3 bottom-4 z-50 rounded-md px-3 sm:px-4 py-3 sm:py-4 shadow-lg text-xs sm:text-sm sm:inset-x-auto sm:right-4 sm:w-auto ${
              state.toast.type === "success"
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }`,
          )}
        >
          {state.toast.message}
        </div>
      ) : null}
    </section>
  );
}
