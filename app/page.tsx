
import type { Metadata } from "next";
import { SiteNavbar } from "@/components/navigation/site-navbar";
import { DeferredContactForm } from "@/components/home/deferred-contact-form";
import { DeferredProjectsSection } from "@/components/home/deferred-projects-section";
import { ProjectsItemListJsonLd } from "@/components/projects/projects-itemlist-jsonld";
import { FaqPageJsonLd } from "@/components/seo/faq-page-json-ld";
import { PortfolioPageJsonLd } from "@/components/seo/portfolio-page-json-ld";
import { HeroSection } from "@/components/home/hero-section";
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
  const projectPreviews = projects.map(({ id, title, description, github_url, demo_url, tags }) => ({
    id,
    title,
    description,
    github_url,
    demo_url,
    tags,
  }));

  return (
    <>
      <SiteNavbar />
      <main id="home" className="relative min-h-screen overflow-hidden pt-16 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(51,65,85,0.22),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(59,130,246,0.1),transparent_24%),linear-gradient(180deg,rgba(9,9,11,0),rgba(9,9,11,0.22)_54%,rgba(9,9,11,0.46))]" />

        <HeroSection />

        <div className="mx-auto w-full max-w-6xl space-y-16 sm:space-y-24 md:space-y-28 px-4 pb-16 sm:pb-24 sm:px-6">
          <SectionShell id="projects" className="scroll-mt-24">
            <DeferredProjectsSection projects={projectPreviews} />
          </SectionShell>

          <SectionShell id="contact" className="scroll-mt-24">
            <DeferredContactForm />
          </SectionShell>
        </div>
      </main>
      <FaqPageJsonLd />
      <PortfolioPageJsonLd />
      <ProjectsItemListJsonLd projects={projects} />
    </>
  );
}
