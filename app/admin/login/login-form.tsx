"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { textVariants } from "@/components/ui/typography";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

type Status = {
  error: string | null;
  loading: boolean;
};

export function LoginForm() {
  const [status, setStatus] = useState<Status>({ error: null, loading: false });
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ error: null, loading: true });

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus({ error: error.message, loading: false });
      return;
    }

    const nextPath = searchParams.get("next") || "/admin";
    router.replace(nextPath);
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <label htmlFor="email" className={cn(textVariants({ role: "label" }), "text-zinc-100")}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={cn(textVariants({ role: "body" }), "w-full rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-100 outline-none ring-0 transition focus:border-sky-500")}
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className={cn(textVariants({ role: "label" }), "text-zinc-100")}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={cn(textVariants({ role: "body" }), "w-full rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-100 outline-none ring-0 transition focus:border-sky-500")}
          placeholder="Your password"
        />
      </div>

      {status.error ? (
        <p className={cn(textVariants({ role: "label" }), "rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-red-300")} role="alert">
          {status.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status.loading}
        className={cn(textVariants({ role: "label" }), "inline-flex w-full items-center justify-center rounded-md bg-zinc-100 px-4 py-2 text-zinc-900 transition hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-50")}
      >
        {status.loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
