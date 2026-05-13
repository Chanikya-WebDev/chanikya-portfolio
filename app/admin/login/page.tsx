import type { Metadata } from "next";
import { Suspense } from "react";
import { textVariants } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to manage portfolio projects.",
  alternates: {
    canonical: "/admin/login",
  },
};

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <section className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-none backdrop-blur">
        <h1 className={cn(textVariants({ role: "section-title" }), "text-zinc-50")}>Admin Login</h1>
        <p className={cn(textVariants({ role: "body" }), "mt-2 text-zinc-400")}>
          Use your Supabase email/password credentials.
        </p>
        <div className="mt-6">
          <Suspense fallback={<div className={cn(textVariants({ role: "body" }), "text-zinc-400")}>Loading login form...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
