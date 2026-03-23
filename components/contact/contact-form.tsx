"use client";

import { FormEvent, useState } from "react";

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
    <section id={id} className="scroll-mt-24 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-none">
      <h2 className="text-2xl font-semibold text-zinc-50">Contact</h2>
      <p className="mt-2 text-sm text-zinc-300">
        Have an internship, collaboration, or project idea? Send a message.
      </p>

      <form onSubmit={onSubmit} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-1 sm:col-span-1">
          <span className="text-sm font-medium text-zinc-100">Name</span>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/15"
          />
        </label>

        <label className="space-y-1 sm:col-span-1">
          <span className="text-sm font-medium text-zinc-100">Email</span>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/15"
          />
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm font-medium text-zinc-100">Message</span>
          <textarea
            name="message"
            required
            rows={5}
            className="w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/15"
          />
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={state.isLoading}
            className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.isLoading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>

      {state.toast ? (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-4 right-4 rounded-md px-4 py-3 text-sm shadow-lg ${
            state.toast.type === "success"
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {state.toast.message}
        </div>
      ) : null}
    </section>
  );
}
