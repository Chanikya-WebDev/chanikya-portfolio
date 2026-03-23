
import type { Metadata } from "next";
import { SiteNavbar } from "@/components/navigation/site-navbar";
import { ProjectsItemListJsonLd } from "@/components/projects/projects-itemlist-jsonld";
import { FaqPageJsonLd } from "@/components/seo/faq-page-json-ld";
import { PortfolioPageJsonLd } from "@/components/seo/portfolio-page-json-ld";
import { ProjectsSection } from "@/components/projects/projects-section";
import { ContactForm } from "@/components/contact/contact-form";
import { SectionShell } from "@/components/ui/section-shell";
import { getCachedProjects } from "@/lib/projects";
import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
  keywords: [
    ...siteConfig.keywords,
    "chanikya portfolio website",
    "jale chanikya website",
    "j chanikya website",
    "chanikya jale website",
    "chanikya next.js portfolio",
    "chanikya projects",
    "chanikya contact",
  ],
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const projects = await getCachedProjects();

  return (
    <>
      <SiteNavbar />
      <main id="home" className="relative min-h-screen overflow-hidden pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(51,65,85,0.32),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(15,23,42,0.35),transparent_35%)]" />

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">B.Tech Computer Science</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-6xl md:text-7xl">
            Engineering end-to-end systems — from modern web applications to AI-powered, production-grade solutions.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-300 sm:text-lg">
            I build products that scale — combining modern frontend engineering, robust backend systems, and AI-powered capabilities to deliver fast, reliable, and intelligent user experiences in production environments.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-300"
            >
              Explore Projects
            </a>
            <a
              href="#contact"
              className="rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-sm font-medium text-zinc-100 shadow-sm transition hover:bg-zinc-900"
            >
              Contact Me
            </a>
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl space-y-16 px-4 pb-20 sm:px-6">
          <SectionShell id="projects" className="scroll-mt-24">
            <ProjectsSection projects={projects} />
          </SectionShell>

          <SectionShell id="contact" className="scroll-mt-24">
            <ContactForm />
          </SectionShell>
        </div>
      </main>
      <FaqPageJsonLd />
      <PortfolioPageJsonLd />
      <ProjectsItemListJsonLd projects={projects} />
    </>
  );
}
